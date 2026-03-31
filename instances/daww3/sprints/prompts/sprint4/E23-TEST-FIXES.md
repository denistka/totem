# E23: Test Fixes & Quality — Agent Prompts

> **Goal:** Fix 18 failing tests, achieve 100% pass rate
> **Sprint:** 4
> **Owner:** All
> **Priority:** 🔴 P0 CRITICAL

---

## E23-T1: Fix Collaboration Service Tests

```
[[[[ #SETTINGS

    mode = agent - fix tests until all pass
    expertize = 'you are world class test engineer specializing in Vitest'
    target = fix Jest→Vitest syntax errors in collaboration tests
    test = true

    code style = [Vitest best practices, clean test code]
    write docs = false
    deep thinking = false
    performance = not critical
    tech stack = ['Vitest', 'TypeScript', 'NestJS']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Fix 15 failing collaboration service tests by replacing Jest syntax with Vitest equivalents.

{{{{ #CUSTOMER PROMT

15 тестов в collaboration.service.test.ts падают с ошибкой "jest is not defined".
Проект использует Vitest, но тесты написаны с Jest синтаксисом.
Нужно заменить все jest.* на vi.* и добавить правильные импорты.

}}}}

<<<<<<#RECOMMENDED TASKS

FIX-1. Import Vitest Functions
- Open: apps/api/src/modules/collaboration/__tests__/collaboration.service.test.ts
- Add: import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
- Remove: any Jest-specific imports

FIX-2. Replace Mock Functions
- Find/Replace: jest.fn() → vi.fn()
- Find/Replace: jest.spyOn() → vi.spyOn()
- Find/Replace: jest.mock() → vi.mock()
- Find/Replace: jest.resetAllMocks() → vi.resetAllMocks()
- Find/Replace: jest.clearAllMocks() → vi.clearAllMocks()

FIX-3. Update Mock Implementations
- jest.fn().mockReturnValue(x) → vi.fn().mockReturnValue(x)
- jest.fn().mockResolvedValue(x) → vi.fn().mockResolvedValue(x)
- jest.fn().mockRejectedValue(x) → vi.fn().mockRejectedValue(x)

FIX-4. Fix Spy Assertions
- Ensure spy assertions use Vitest matchers
- toHaveBeenCalledWith should work same as Jest
- Check for any Jest-specific matchers

FIX-5. Run Tests and Verify
- cd apps/api
- pnpm vitest collaboration.service.test --reporter=verbose
- Verify: All 15 tests passing
- Check: No "jest is not defined" errors

🏁 Definition of Done
- All 15 collaboration tests pass
- Zero Jest references remain
- Tests run successfully in Vitest
- CI passes

>>>>>>

]]]]
```

**Expected Diff:**
```diff
- import { describe, it, expect } from 'vitest'
+ import { describe, it, expect, vi, beforeEach } from 'vitest'

- const mockPrisma = jest.fn()
+ const mockPrisma = vi.fn()

- jest.spyOn(service, 'getPermissions')
+ vi.spyOn(service, 'getPermissions')
```

---

## E23-T2: Fix Jobs Service Test

```
[[[[ #SETTINGS

    mode = agent - fix failing test
    expertize = 'you are world class test engineer'
    target = fix spy assertion mismatch in jobs service
    test = true

    code style = [correct test assertions]
    write docs = false
    deep thinking = true
    performance = not critical
    tech stack = ['Vitest', 'TypeScript', 'BullMQ']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Fix "should create analytics event job" test that fails due to constructor side-effect.

{{{{ #CUSTOMER PROMT

Тест в jobs.service.spec.ts падает потому что в конструкторе сервиса
добавляется scheduled job ('hourly-aggregate'), и это мешает spy assertion.
Spy ожидает первый вызов с 'event', но получает 'hourly-aggregate'.

}}}}

<<<<<<#RECOMMENDED TASKS

FIX-1. Analyze the Problem
- Open: apps/api/src/modules/jobs/jobs.service.spec.ts
- Find: test "should create analytics event job" (line ~141)
- Current: expect(queue.add).toHaveBeenCalledWith('event', ...)
- Issue: Constructor calls queue.add('hourly-aggregate', ...) first

FIX-2. Choose Fix Strategy

Option A: Check 2nd call instead of 1st
```typescript
expect(queue.add).toHaveBeenNthCalledWith(2, 'event', 
  expect.objectContaining({
    type: 'event',
    event: 'track.played',
    userId: 'user-1'
  }),
  undefined
)
```

Option B: Mock setupScheduledJobs
```typescript
beforeEach(() => {
  vi.spyOn(service as any, 'setupScheduledJobs').mockImplementation(() => {})
  // ... rest of setup
})
```

Option C: Clear mocks after constructor
```typescript
beforeEach(() => {
  service = new JobsService(...)
  vi.clearAllMocks() // Clear constructor calls
})
```

FIX-3. Implement Fix
- Choose Option A (simplest, tests actual behavior)
- Update assertion to check 2nd call
- Verify other tests still pass

FIX-4. Test Edge Cases
- Ensure scheduled job is still added (test it separately)
- Verify constructor behavior is intentional
- Check if other tests affected

FIX-5. Run Tests
- pnpm vitest jobs.service.spec --reporter=verbose
- Verify: "should create analytics event job" passes
- Verify: All other jobs tests still pass (9 total)

🏁 Definition of Done
- Test passes consistently
- No flaky behavior
- Constructor logic validated
- All 10 jobs service tests pass

>>>>>>

]]]]
```

---

## E23-T3: Fix Rating Calculator Precision

```
[[[[ #SETTINGS

    mode = agent - relax test precision
    expertize = 'you are world class QA engineer'
    target = fix overly strict floating point assertions
    test = true

    code style = [reasonable test precision]
    write docs = false
    deep thinking = false
    performance = not critical
    tech stack = ['Vitest', 'TypeScript']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Relax precision thresholds in rating calculator tests.

{{{{ #CUSTOMER PROMT

2 теста в rating-calculator.test.ts падают из-за слишком строгой точности.
Формула правильная, но ожидаемые значения "≈ 20" с tolerance 0.5 слишком жесткие.
Actual: 20.83, Expected: 20±0.5 → fails.
Нужно ослабить tolerance до ±1.

}}}}

<<<<<<#RECOMMENDED TASKS

FIX-1. Update "10 plays ≈ 20 score" Test
- Open: apps/api/src/modules/rating/__tests__/rating-calculator.test.ts
- Find: Line ~110
- Current: `expect(score).toBeCloseTo(20, 0.5)`
- Change to: `expect(score).toBeCloseTo(20, 1)` // Allow ±1 difference
- Or: `expect(score).toBeCloseTo(20.83, 0.5)` // Match actual output

FIX-2. Update "logarithmic growth" Test
- Find: Line ~128
- Current: `expect(diff).toBeCloseTo(20, 0.05)`
- Change to: `expect(diff).toBeCloseTo(20, 1)` // Allow ±1 difference
- Or: `expect(diff).toBeCloseTo(19.26, 0.5)` // Match actual

FIX-3. Verify Formula is Correct
- The formula: `Math.log10(plays + 1) * 20`
- For 10 plays: log10(11) * 20 = 20.83 ✓
- For 100 plays: log10(101) * 20 = 40.04 ✓
- Formula is correct, tests were too strict

FIX-4. Run Rating Tests
- pnpm vitest rating-calculator.test --reporter=verbose
- Verify: Both precision tests pass
- Verify: All other 23 rating tests still pass

FIX-5. Document Why ≈
- Tests use "≈" to indicate approximation
- Logarithmic functions don't produce exact integers
- Tolerance of ±1 is reasonable for rating 0-100 scale

🏁 Definition of Done
- Both precision tests pass
- All 25 rating calculator tests pass
- Formula unchanged (only test assertions)
- Comments explain precision choice

>>>>>>

]]]]
```

**Expected Changes:**
```diff
- expect(playScore).toBeCloseTo(20, 0.5)
+ expect(playScore).toBeCloseTo(20, 1) // ±1 is reasonable

- expect(scoreDiff).toBeCloseTo(20, 0.05)
+ expect(scoreDiff).toBeCloseTo(20, 1) // logarithmic growth ≈ +20 per 10x
```

---

## Verification Checklist

After completing all E23 tasks:

```bash
# Run all API tests
cd apps/api
pnpm vitest run --reporter=verbose

# Expected output:
# Test Files: 120 passed (120)
# Tests: 217 passed (217)
# Duration: ~30s
```

**Success Criteria:**
- ✅ 217/217 API tests passing (was 199/217)
- ✅ Zero "jest is not defined" errors
- ✅ CI pipeline green
- ✅ No flaky tests

---

*E23 Test Fixes — DAWW3 Sprint 4*
