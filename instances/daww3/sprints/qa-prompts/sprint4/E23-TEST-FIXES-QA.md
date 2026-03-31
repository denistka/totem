# E23: Test Fixes — QA Prompt

> **Epic:** E23-TEST-FIXES  
> **Priority:** 🔴 P0 (CRITICAL - BLOCKS ALL OTHER QA)  
> **Goal:** Fix 10 failing API tests → achieve 100% pass rate  
> **Current Status:** 97.7% (717/734 passing)

---

## Agent Instructions

```python
[[[[ #SETTINGS
    mode = 'agent'
    expertise = 'senior QA engineer + NestJS/Vitest expert'
    target = 'fix all failing tests in apps/api'
    test = true
    fix_code = true
    
    tech_stack = ['NestJS', 'Vitest', 'BullMQ', 'Fastify', 'Prisma']
    deep_thinking = true
    thorough = true
]]]]

[[[[ #PROMPT

Fix all failing API tests to achieve 100% pass rate.

Current failures:
1. Jobs Service tests (10 failures) - missing BullQueue_state-transition provider
2. Express import errors (2 test suites) - wrong type imports

Requirements:
- Fix without breaking existing functionality
- Add proper mocks for BullMQ queues
- Replace Express types with Fastify types
- Run full test suite after fixes
- Document what was changed and why

]]]]
```

---

## Test Failure Analysis

### 1. Jobs Service Tests (10 Failures) 🔴

**File:** `apps/api/src/modules/jobs/jobs.service.spec.ts`

**Error:**
```
Error: Nest can't resolve dependencies of the JobsService
(...BullQueue_audio-processing, BullQueue_notifications, BullQueue_analytics, 
 BullQueue_cleanup, BullQueue_rating-calculation, ?, BullQueue_leaderboard, 
 BullQueue_xp-levelup)

Missing: BullQueue_state-transition at index [5]
```

**Root Cause:**
- `JobsService` constructor now has 8 BullMQ queue dependencies
- Test module only provides 7 mocks (missing `state-transition` queue)
- Added in E24-E8-INTEGRATION but test not updated

**Failed Tests:**
```typescript
✗ should add audio processing job to queue
✗ should set higher priority for transcode jobs
✗ should create waveform generation job
✗ should create email notification job
✗ should create push notification job
✗ should create analytics event job
✗ should create rating recalculation job
✗ should return queue statistics
✗ should throw for unknown queue
✗ should return stats for all queues
```

**Fix Steps:**

1. **Update test imports** to include state-transition queue:
```typescript
// apps/api/src/modules/jobs/jobs.service.spec.ts

import { getQueueToken } from '@nestjs/bullmq'

describe('JobsService', () => {
  let service: JobsService
  let audioQueue: any
  let notificationsQueue: any
  let analyticsQueue: any
  let cleanupQueue: any
  let ratingQueue: any
  let stateTransitionQueue: any  // ADD THIS
  let leaderboardQueue: any
  let xpLevelupQueue: any

  beforeEach(async () => {
    // Create mocks
    const createMockQueue = () => ({
      add: vi.fn().mockResolvedValue({ id: 'test-job-id' }),
      getJobCounts: vi.fn().mockResolvedValue({
        active: 1,
        completed: 10,
        failed: 0,
        delayed: 0,
        waiting: 2,
      }),
    })

    audioQueue = createMockQueue()
    notificationsQueue = createMockQueue()
    analyticsQueue = createMockQueue()
    cleanupQueue = createMockQueue()
    ratingQueue = createMockQueue()
    stateTransitionQueue = createMockQueue()  // ADD THIS
    leaderboardQueue = createMockQueue()
    xpLevelupQueue = createMockQueue()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getQueueToken('audio-processing'),
          useValue: audioQueue,
        },
        {
          provide: getQueueToken('notifications'),
          useValue: notificationsQueue,
        },
        {
          provide: getQueueToken('analytics'),
          useValue: analyticsQueue,
        },
        {
          provide: getQueueToken('cleanup'),
          useValue: cleanupQueue,
        },
        {
          provide: getQueueToken('rating-calculation'),
          useValue: ratingQueue,
        },
        {
          provide: getQueueToken('state-transition'),  // ADD THIS
          useValue: stateTransitionQueue,
        },
        {
          provide: getQueueToken('leaderboard'),
          useValue: leaderboardQueue,
        },
        {
          provide: getQueueToken('xp-levelup'),
          useValue: xpLevelupQueue,
        },
      ],
    }).compile()

    service = module.get<JobsService>(JobsService)
  })

  // ... rest of tests
})
```

2. **Verify JobsModule imports** include the queue:
```typescript
// apps/api/src/modules/jobs/jobs.module.ts

@Module({
  imports: [
    BullModule.registerQueue({ name: 'audio-processing' }),
    BullModule.registerQueue({ name: 'notifications' }),
    BullModule.registerQueue({ name: 'analytics' }),
    BullModule.registerQueue({ name: 'cleanup' }),
    BullModule.registerQueue({ name: 'rating-calculation' }),
    BullModule.registerQueue({ name: 'state-transition' }),  // Verify this exists
    BullModule.registerQueue({ name: 'leaderboard' }),
    BullModule.registerQueue({ name: 'xp-levelup' }),
  ],
  // ...
})
```

3. **Run tests to verify fix:**
```bash
cd apps/api
pnpm test jobs.service.spec.ts
```

**Expected Result:** All 10 tests pass ✅

---

### 2. Express Import Errors (2 Test Suites) 🔴

**Files:**
- `test/rating-integration.spec.ts`
- `src/common/tests/security.test.ts`

**Error:**
```
Error: Cannot find package 'express' imported from 
'/Users/denistka/Projects/daww3/apps/api/src/modules/streaming/http-fallback/http-fallback.controller.ts:13'
```

**Root Cause:**
- HTTP fallback controller imports `Response` from 'express'
- Project uses Fastify, not Express
- `@types/express` not in devDependencies

**Affected Code:**
```typescript
// apps/api/src/modules/streaming/http-fallback/http-fallback.controller.ts:13

import { Response } from 'express'  // ❌ WRONG - project uses Fastify

@Controller('stream/fallback')
export class HttpFallbackController {
  @Get(':trackId/:chunkId')
  async serveChunk(
    @Param('trackId') trackId: string,
    @Param('chunkId') chunkId: string,
    @Res() res: Response,  // ❌ Express Response type
  ) {
    // ...
  }
}
```

**Fix Options:**

**Option A: Use Fastify Types (RECOMMENDED)**
```typescript
// apps/api/src/modules/streaming/http-fallback/http-fallback.controller.ts

import { FastifyReply } from 'fastify'  // ✅ Correct for Fastify

@Controller('stream/fallback')
export class HttpFallbackController {
  @Get(':trackId/:chunkId')
  async serveChunk(
    @Param('trackId') trackId: string,
    @Param('chunkId') chunkId: string,
    @Res() res: FastifyReply,  // ✅ Fastify type
  ) {
    // Stream chunk
    res.header('Content-Type', 'audio/mpeg')
    res.header('Accept-Ranges', 'bytes')
    return res.send(chunkBuffer)
  }
}
```

**Option B: Add @types/express (NOT RECOMMENDED)**
```bash
cd apps/api
pnpm add -D @types/express

# But this adds unnecessary dependency - use Option A instead
```

**Fix Steps:**

1. **Update import in http-fallback controller:**
```bash
cd apps/api/src/modules/streaming/http-fallback
# Replace 'express' with 'fastify' in imports
```

2. **Update response type:**
```typescript
// Before
@Res() res: Response

// After
@Res() res: FastifyReply
```

3. **Verify test files load:**
```bash
cd apps/api
pnpm vitest run test/rating-integration.spec.ts
pnpm vitest run src/common/tests/security.test.ts
```

**Expected Result:** Both test suites load without errors ✅

---

### 3. Web Test Environment Warnings (6 Unhandled Errors) 🟡

**File:** `apps/web/src/core/debug/__tests__/metrics-collector.test.ts`

**Error:**
```
TypeError: performance.now is not a function
❯ Timeout._onTimeout src/core/debug/__tests__/metrics-collector.test.ts:51:46
```

**Root Cause:**
- happy-dom test environment doesn't implement `performance.now()`
- Test code calls `performance.now()` in `requestAnimationFrame` callback

**Impact:**
- Tests still PASS ✅
- But produces 6 unhandled error warnings
- Not blocking, but poor practice

**Fix:**

```typescript
// apps/web/src/core/debug/__tests__/metrics-collector.test.ts

import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import type { FrameRequestCallback } from '@/types'

describe('MetricsCollector', () => {
  beforeEach(() => {
    // Mock performance.now for happy-dom
    vi.stubGlobal('performance', {
      now: vi.fn(() => Date.now()),  // ✅ Add this mock
    })
    
    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16)  // Now works!
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ... tests
})
```

**Verification:**
```bash
cd apps/web
pnpm test metrics-collector.test.ts
# Should see zero "Unhandled Errors" section
```

**Expected Result:** No unhandled error warnings ✅

---

## Test Execution Plan

### Step 1: Run Baseline
```bash
# Get current state
cd /Users/denistka/Projects/daww3

# API tests
cd apps/api && pnpm test 2>&1 | tee ~/api-tests-before.txt

# Web tests
cd ../web && pnpm test 2>&1 | tee ~/web-tests-before.txt
```

### Step 2: Apply Fixes

**Fix 1: Jobs Service (Critical)**
```bash
# Edit test file
cd apps/api/src/modules/jobs
# Add state-transition queue mock (see above)

# Verify fix
pnpm test jobs.service.spec.ts
```

**Fix 2: Express Imports (Critical)**
```bash
# Update controller
cd apps/api/src/modules/streaming/http-fallback
# Replace Express with Fastify types (see above)

# Verify fix
cd apps/api
pnpm test test/rating-integration.spec.ts
pnpm test src/common/tests/security.test.ts
```

**Fix 3: Performance Mock (Low Priority)**
```bash
# Update test file
cd apps/web/src/core/debug/__tests__
# Add performance.now mock (see above)

# Verify fix
cd apps/web
pnpm test metrics-collector.test.ts
```

### Step 3: Full Test Suite
```bash
cd /Users/denistka/Projects/daww3

# Run all API tests
cd apps/api && pnpm test 2>&1 | tee ~/api-tests-after.txt

# Run all web tests
cd ../web && pnpm test 2>&1 | tee ~/web-tests-after.txt
```

### Step 4: Compare Results
```bash
# Compare before/after
diff ~/api-tests-before.txt ~/api-tests-after.txt
diff ~/web-tests-before.txt ~/web-tests-after.txt

# Expected changes:
# - Jobs service tests: 10 failures → 0 failures
# - Rating integration: Failed to load → Passes
# - Security tests: Failed to load → Passes
# - Metrics collector: 6 warnings → 0 warnings
```

---

## Success Criteria

### Must Have ✅

- [ ] All 10 Jobs Service tests passing
- [ ] `test/rating-integration.spec.ts` loads without errors
- [ ] `src/common/tests/security.test.ts` loads without errors
- [ ] Test pass rate: **100%** (734/734)
- [ ] No TypeScript compilation errors
- [ ] No test suite load failures

### Should Have ✅

- [ ] Zero unhandled error warnings
- [ ] Test execution time < 15 seconds (API + Web combined)
- [ ] No new test failures introduced
- [ ] All mocks properly typed (no `any`)

### Nice to Have ✅

- [ ] Test coverage maintained or improved
- [ ] Documentation updated with fix notes
- [ ] CI pipeline passes with new changes

---

## Verification Checklist

```bash
# ✅ Jobs Service Tests
cd apps/api
pnpm test jobs.service.spec.ts
# Expected: 10/10 tests passing

# ✅ Express Import Fix
pnpm test test/rating-integration.spec.ts
# Expected: Suite loads successfully

pnpm test src/common/tests/security.test.ts
# Expected: Suite loads successfully

# ✅ Full API Suite
pnpm test
# Expected: 217/217 tests passing (up from 200/217)

# ✅ Web Tests (with warning fix)
cd ../web
pnpm test
# Expected: 517/517 tests passing, zero unhandled errors

# ✅ Combined Results
cd ..
pnpm test
# Expected: 734/734 tests passing (100% pass rate)
```

---

## Documentation Requirements

### Update QA Summary

After fixes, update `/qa-results/sprint4/SUMMARY-CURRENT.md`:

```markdown
## Sprint 4 Test Results Summary
**Date:** 2026-01-28
**Run:** Post E23 Fixes

## Overall Results

| Suite | Total | Passed | Failed | Pass Rate |
|-------|-------|--------|--------|-----------|
| Web Unit Tests | 517 | 517 | 0 | 100% ✅ |
| API Unit Tests | 217 | 217 | 0 | 100% ✅ |
| **Total** | **734** | **734** | **0** | **100%** ✅ |

## Changes Since Last Run

### ✅ Fixed Issues (E23)
1. **Jobs Service Tests** (10 tests) - Added missing `state-transition` queue mock
2. **Express Import Errors** (2 test suites) - Replaced with Fastify types
3. **Performance Mock** (6 warnings) - Added `performance.now` stub

### Test Execution
- API Duration: 6.5s
- Web Duration: 2.8s
- Total Duration: 9.3s

## Status
🎉 **100% PASS RATE ACHIEVED** - Ready for E24 (TOTEM validation)
```

---

## Related Documents

- **Epic:** `promts/sprint4/E23-TEST-FIXES.md` - Original epic spec
- **Backlog:** `tasks/00-BACKLOG.md` - Task E23 details
- **Current Results:** `qa-results/sprint3/2026-01-28/SUMMARY-CURRENT.md`

---

**Priority:** 🔴 P0 CRITICAL  
**Blocking:** E24, E25, E26 (all other QA)  
**Estimated Time:** 1-2 hours  
**Last Updated:** 2026-01-28
