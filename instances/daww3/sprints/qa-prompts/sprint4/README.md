# Sprint 4 QA Prompts — README

> **Sprint Goal:** Validate TOTEM vision, achieve 100% test pass rate, prepare for beta launch  
> **Status:** 🟡 IN PROGRESS  
> **Current Pass Rate:** 97.7% (717/734 tests)

---

## Quick Start

### For AI Agents

```python
[[[[ #QUICKSTART

Read these files in order:

1. 00-SPRINT4-QA-OVERVIEW.md - Get context on current status
2. E23-TEST-FIXES-QA.md - Fix failing tests FIRST (blocks everything)
3. E25-TOTEM-VALIDATION-QA.md - Run TOTEM tests (proves product value)
4. TOTEM-ACCEPTANCE-DETAILED.md - Detailed test specifications

Then execute:
- Fix 10 failing API tests → 100% pass rate
- Run TV-1 through TV-6 → validate TOTEM claims
- Generate validation report → document evidence

]]]]
```

### For Humans

**If you're here to validate DAWW3:**
1. Check current test status: `qa-results/sprint4/SUMMARY-CURRENT.md`
2. Read TOTEM vision: `totem/1-VISION.md`
3. Follow quick start: `docs/TOTEM-VALIDATION-QUICKSTART.md`
4. Run tests: `pnpm test` (API + Web)
5. Run E2E: `cd e2e && pnpm playwright test tests/totem/`

---

## File Structure

### Critical Path (Do in Order)

```
00-SPRINT4-QA-OVERVIEW.md       → Overview, status, metrics
   ↓
E23-TEST-FIXES-QA.md            → Fix 10 failing tests
   ↓
E25-TOTEM-VALIDATION-QA.md      → Run TV-1 to TV-6
   ↓
TOTEM-ACCEPTANCE-DETAILED.md    → Detailed test specs
```

### Additional Files

```
E24-E8-INTEGRATION-QA.md        → E8 scheduled jobs
E26-LOAD-TESTING-QA.md          → 1000 concurrent users
E27-SECURITY-QA.md              → Security audit
E28-BETA-LAUNCH-QA.md           → 10→100 users
E29-DOCUMENTATION-QA.md         → API docs, guides
```

---

## TOTEM Tests Overview

### TV-1: Creation → Monetization ✅ Core Value Prop

**Validates:** Complete artist journey in one platform

**Steps:**
1. Artist registers and connects wallet
2. Uploads audio to browser DAW
3. Applies WASM DSP effects
4. Publishes track (mints NFT)
5. Listener discovers and plays track
6. Artist receives instant payment

**Evidence:** E2E test, blockchain transaction, payment < 60 minutes

---

### TV-2: Dynamic Licensing ✅ Economic Model

**Validates:** Popularity-based pricing

**Steps:**
1. NEW track with 0 plays
2. Gains popularity → PAID (rating 40+)
3. Loses popularity → FREE (rating <20)
4. Resurgence → REVIVAL (rating 35+)
5. Sustained revival → back to PAID (30 days)
6. Long-term low interest → ARCHIVE (90 days)

**Evidence:** State machine tests, database queries

---

### TV-3: P2P Cost Reduction ✅ Infrastructure

**Validates:** Popularity reduces costs

**Steps:**
1. New track: 100% seed bandwidth
2. 10 listeners: ~30% P2P ratio
3. 100 listeners: ~60% P2P ratio
4. Calculate savings vs CDN

**Evidence:** Prometheus metrics, bandwidth analysis

---

### TV-4: Gamification Economy ✅ Community

**Validates:** XP, badges, and multipliers work

**Steps:**
1. User completes track → earns 2 XP
2. XP accumulates → level progression
3. Thresholds reached → badge awarded
4. Badge earned → multiplier applied
5. Multiplier → increased earnings

**Evidence:** Database queries, payment analysis

---

### TV-5: Hybrid DSP ⚠️ SKIP

**Validates:** Device-adaptive processing

**Status:** Rust toolchain not available in CI

**Alternative:** Manual testing on local machine

---

### TV-6: Spotify Comparison ✅ Market Position

**Validates:** 100x better artist payout

**Metrics:**
- Artist payout: $0.30/stream vs Spotify $0.003
- Payment timing: <1 hour vs Spotify 60-90 days
- Listener rewards: >$0 vs Spotify $0

**Evidence:** SQL queries, payment analysis

---

## Current Issues

### 🔴 Critical (Blocks Launch)

1. **10 Failing API Tests**
   - Jobs Service tests (missing `state-transition` queue mock)
   - Express import errors (should use Fastify types)
   - **Fix:** See `E23-TEST-FIXES-QA.md`

2. **TOTEM Tests Blocked**
   - Missing test fixtures (audio + images)
   - API compilation errors
   - E24 integration incomplete
   - **Fix:** See `E25-TOTEM-VALIDATION-QA.md`

### 🟡 Medium (Launch Week)

3. **Web Test Warnings**
   - `performance.now` unhandled errors (6 warnings)
   - Tests still pass, but cleanup needed
   - **Fix:** Add mock in test setup

---

## Success Metrics

### Sprint 4 Definition of Done

#### Must Have (Launch Blockers)
- [ ] **100% Test Pass Rate** (717/734 → 734/734)
- [ ] **TV-1** ✅ Complete artist journey works
- [ ] **TV-2** ✅ State transitions work
- [ ] **TV-3** ✅ P2P ratio >50% for popular tracks
- [ ] **TV-4** ✅ Gamification works
- [ ] **TV-6** ✅ Artist payout >10x Spotify

#### Should Have (Launch Week)
- [ ] Load tests pass (1000 users, <200ms p95)
- [ ] Security audit complete (zero critical issues)
- [ ] 10-user beta successful
- [ ] Documentation published

#### Nice to Have (Post-Launch)
- [ ] TV-5 passing (Hybrid DSP)
- [ ] 100-user beta feedback
- [ ] Bug bounty program

---

## Timeline

### Week 1: Fix Tests + Start E24
- **Day 1-2:** E23 - Fix 10 failing tests → 100% pass rate
- **Day 3-5:** E24 - Rating calc, state transitions

### Week 2: TOTEM Validation
- **Day 1-2:** Fix infrastructure (fixtures, API, migrations)
- **Day 3-4:** Run TV-1, TV-2, TV-6 (critical path)
- **Day 5:** Run TV-3, TV-4 (nice to have)

### Week 3: Load & Security
- **Day 1-3:** E26 - Load testing, bottleneck analysis
- **Day 4-5:** E27 - Security audit kick-off

### Week 4: Beta Launch
- **Day 1-3:** E28 - 10-user beta
- **Day 4-5:** Monitoring, hotfixes

### Week 5: Scale & Iterate
- **Day 1-5:** Scale to 100 users, iterate on feedback

### Week 6: Documentation
- **Day 1-5:** E29 - API docs, guides, tutorials

---

## Tools & Commands

### Run Unit Tests

```bash
# API tests
cd apps/api && pnpm test

# Web tests
cd apps/web && pnpm test

# Combined
cd /Users/denistka/Projects/daww3 && pnpm test
```

### Run E2E Tests

```bash
# All TOTEM tests
cd e2e
pnpm playwright test tests/totem/

# Specific test
pnpm playwright test tests/totem/tv-1-creation-monetization.spec.ts

# With UI
pnpm playwright test --headed --project=chromium

# Generate report
pnpm playwright show-report
```

### Generate Test Fixtures

```bash
# Audio (5-second sine wave)
ffmpeg -f lavfi -i "sine=frequency=440:duration=5" \
  -ar 44100 -ac 2 e2e/fixtures/audio/test-audio.wav

# Image (500x500 blue square)
ffmpeg -f lavfi -i "color=c=blue:s=500x500:d=1" \
  -frames:v 1 e2e/fixtures/images/cover-art.jpg
```

### Start Services

```bash
# Start all Docker services
docker compose up -d

# Check health
curl http://localhost:4000/health
curl http://localhost:3000

# View logs
docker compose logs api --tail=50
docker compose logs seed --tail=50
```

### Check Metrics

```bash
# Seed node metrics
curl http://localhost:5001/metrics

# Prometheus P2P ratio
curl -s "http://localhost:9090/api/v1/query?query=daww3_p2p_ratio"
```

---

## Related Documents

### TOTEM Vision & Architecture
- `totem/1-VISION.md` - Core product claims
- `totem/2-ARCHITECTURE.md` - Technical implementation
- `totem/3-ECONOMY.md` - Economic model
- `totem/4-GAMIFICATION.md` - XP, badges, leaderboards

### Quick Start & Reports
- `docs/TOTEM-VALIDATION-QUICKSTART.md` - Setup guide (15-21 hours)
- `docs/TOTEM-VALIDATION-REPORT.md` - Current validation status
- `docs/E27-COMPLETION-SUMMARY.md` - Security audit results

### Test Results
- `qa-results/sprint4/SUMMARY-CURRENT.md` - Latest test run
- `qa-results/sprint3/2026-01-28/SUMMARY.md` - Previous run
- `e2e/playwright-report/` - E2E test reports

### Backlog & Planning
- `tasks/00-BACKLOG.md` - Full product backlog
- `promts/sprint4/00-SPRINT4-BACKLOG.md` - Sprint 4 epics
- `promts/sprint4/README.md` - Epic index

---

## Agent Settings

### Recommended Configuration

```python
[[[[ #SETTINGS
    mode = 'qa_agent'
    expertise = 'world-class QA engineer + product validation expert'
    focus = 'test execution, validation, and reporting'
    
    test = true
    thorough = true
    automate = true
    write_docs = true
    deep_thinking = true
    
    tech_stack = ['Vitest', 'Playwright', 'k6', 'Prometheus', 'Docker']
    code_style = ['BDD', 'Gherkin', 'Page Objects']
    
    performance = true
    security = true
    metrics = true
]]]]
```

### Task Order

1. **E23** - Fix failing tests (1-2 hours) → BLOCKS ALL
2. **E24** - E8 integration (3-4 hours) → BLOCKS TV-2
3. **E25** - TOTEM validation (13-20 hours) → PROVES VALUE
4. **E26** - Load testing (4-6 hours) → PROVES SCALE
5. **E27** - Security audit (2-3 weeks) → PROVES SAFETY
6. **E28** - Beta launch (1-2 weeks) → PROVES MARKET FIT
7. **E29** - Documentation (2-3 days) → ENABLES ADOPTION

---

## FAQ

### Q: Why is E23 blocking everything?
**A:** Can't run E2E tests if unit tests fail. Fix foundation first.

### Q: Can we skip TV-5 (Hybrid DSP)?
**A:** Yes, Rust toolchain not available. Test manually later.

### Q: What's the minimum to launch?
**A:** TV-1, TV-2, TV-6 passing. Load tests passing. Security audit clean.

### Q: How long to complete Sprint 4?
**A:** 4-6 weeks realistically. 15-21 hours for TOTEM validation alone.

### Q: What if TOTEM tests fail?
**A:** Product value not proven. Don't launch until they pass.

---

## Support

### Issues & Questions
- GitHub Issues: https://github.com/daww3/daww3/issues
- Discord: (TBD)
- Email: qa@daww3.io

### Documentation
- API Docs: http://localhost:4000/api/docs
- User Guide: `docs/USER-GUIDE.md`
- Deployment: `docs/DEPLOYMENT-LOCAL.md`

---

**Last Updated:** 2026-01-28  
**Sprint:** 4  
**QA Owner:** DAWW3 QA Team  
**Status:** 🟡 IN PROGRESS (97.7% pass rate)
