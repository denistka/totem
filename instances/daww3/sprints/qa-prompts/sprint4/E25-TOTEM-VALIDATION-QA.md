# E25: TOTEM Validation — QA Prompt

> **Epic:** E25-TOTEM-VALIDATION  
> **Priority:** 🔴 P0 (VALIDATES CORE PRODUCT VALUE)  
> **Goal:** Run TV-1 through TV-6 acceptance tests → prove TOTEM vision  
> **Dependencies:** E23 (tests fixed), E24 (E8 integration complete)

---

## Agent Instructions

```python
[[[[ #SETTINGS
    mode = 'agent'
    expertise = 'senior QA engineer + product validation expert'
    target = 'validate DAWW3 against TOTEM vision claims'
    test = true
    e2e = true
    thorough = true
    
    tech_stack = ['Playwright', 'Vitest', 'Docker', 'Prisma', 'FFmpeg']
    write_docs = true
    deep_thinking = true
    metrics = true
]]]]

[[[[ #PROMPT

Run TOTEM acceptance tests (TV-1 through TV-6) to validate product claims:

1. TV-1: Creation → Distribution → Monetization (full artist journey)
2. TV-2: Dynamic Licensing (NEW→PAID→FREE→REVIVAL→ARCHIVE)
3. TV-3: P2P Cost Reduction (popularity reduces infrastructure cost)
4. TV-4: Gamification Economy (XP, badges, multipliers work)
5. TV-5: Hybrid DSP Performance (device-adaptive processing) - SKIP
6. TV-6: Spotify Comparison (100x artist payout, instant payment)

Follow TOTEM-VALIDATION-QUICKSTART.md for setup.
Document all results in TOTEM-VALIDATION-REPORT.md.

]]]]
```

---

## TOTEM Vision Claims

### Core Value Proposition

**DAWW3 is a decentralized DAW where:**
- Artists create, distribute, and monetize without intermediaries
- Popularity reduces costs (P2P), not increases them (CDN)
- Unpopular tracks become free (dynamic licensing)
- Gamification rewards quality content and community participation
- Artists earn 100x more than Spotify ($0.30 vs $0.003 per stream)

**These are bold claims. TV-1 through TV-6 must prove them.**

---

## Test Validation Matrix

| Test | TOTEM Claim | Status | Blocker | Priority |
|------|-------------|--------|---------|----------|
| TV-1 | "Complete artist journey" | ⚠️ BLOCKED | Test fixtures, API errors | 🔴 P0 |
| TV-2 | "Dynamic licensing works" | ⚠️ BLOCKED | E24 incomplete | 🔴 P0 |
| TV-3 | "P2P reduces costs" | ⚠️ BLOCKED | Missing metrics | 🟠 P1 |
| TV-4 | "Gamification economy" | ⚠️ BLOCKED | Missing tables | 🟠 P1 |
| TV-5 | "Hybrid DSP" | ⚠️ SKIP | Rust unavailable | 🟢 P2 |
| TV-6 | "100x Spotify payout" | ⚠️ BLOCKED | Payment infra | 🔴 P0 |

---

## TV-1: Creation → Distribution → Monetization

### Vision Claim
> "Единая экосистема где создание → распространение → монетизация происходит в одной платформе, без посредников"

**Translation:** "Unified ecosystem where creation → distribution → monetization happens in one platform, without intermediaries"

### Test Scenario

**Feature:** Complete Artist Journey  
**File:** `e2e/tests/totem/tv-1-creation-monetization.spec.ts`

```gherkin
Given the DAWW3 platform is running
And smart contracts are deployed
When I register as an artist
And I upload an audio file
And I apply WASM DSP effects
And I publish the track (mint NFT)
And a listener discovers and plays the track
And the listener completes >80% of playback
Then the play event should be recorded
And artist should receive royalty payment
And payment should be verifiable on blockchain
```

### Pre-requisites

**1. Generate Test Fixtures**
```bash
cd /Users/denistka/Projects/daww3

# Generate 5-second test audio (440Hz sine wave)
ffmpeg -f lavfi -i "sine=frequency=440:duration=5" \
  -ar 44100 -ac 2 e2e/fixtures/audio/test-audio.wav

# Generate cover art (500x500 blue square)
ffmpeg -f lavfi -i "color=c=blue:s=500x500:d=1" \
  -frames:v 1 e2e/fixtures/images/cover-art.jpg

# Verify files exist
ls -lh e2e/fixtures/audio/test-audio.wav    # ~1MB
ls -lh e2e/fixtures/images/cover-art.jpg   # ~100KB
```

**2. Fix API Compilation Errors**
```bash
cd apps/api

# Verify Prisma schema has required fields
cat prisma/schema.prisma | grep -A5 "model Track"
# Should include: state, stateEnteredAt, totalRating, popularityScore

# Generate Prisma client
pnpm prisma generate

# Build API
pnpm build
# Should complete with zero errors
```

**3. Start Services**
```bash
cd /Users/denistka/Projects/daww3

# Start all Docker services
docker compose up -d

# Wait for healthy status
sleep 10

# Verify services
docker compose ps
# Expected: postgres, redis, minio, hardhat, seed all "Up" or "Healthy"

# Test API health
curl http://localhost:4000/health
# Expected: {"status":"ok","timestamp":"..."}

# Test Web
curl http://localhost:3000
# Expected: HTML response
```

### Test Execution

**Run TV-1 Test**
```bash
cd e2e

# Install Playwright browsers (if not done)
pnpm playwright install chromium

# Run TV-1 test (headless)
pnpm playwright test tests/totem/tv-1-creation-monetization.spec.ts

# Or run with UI for debugging
pnpm playwright test tests/totem/tv-1-creation-monetization.spec.ts --headed --project=chromium

# Or run with debug mode
pnpm playwright test tests/totem/tv-1-creation-monetization.spec.ts --debug
```

### Expected Results

✅ **Pass Criteria:**
- Artist registers successfully
- Audio file uploads without errors
- WASM plugin loads and processes audio
- Track publishes and NFT mints
- Track appears in catalog/explore page
- Listener can play track
- P2P streaming delivers chunks
- Play event recorded in database
- Artist receives payment notification
- Payment verifiable on blockchain

⚠️ **Potential Failures:**
- Missing test fixtures → generate with FFmpeg
- API not running → check Docker services
- Contract not deployed → verify Hardhat
- P2P seed not working → check logs
- Payment processor not running → check BullMQ

### Verification Queries

**After test runs, verify data:**

```sql
-- Check track was created
SELECT id, title, state, userId, createdAt 
FROM "Track" 
WHERE title = 'Test Song' 
ORDER BY createdAt DESC LIMIT 1;

-- Check play events recorded
SELECT COUNT(*) as play_count 
FROM "PlayEvent" 
WHERE trackId = 'track-id-from-above';

-- Check artist earned XP
SELECT totalXP, level 
FROM "User" 
WHERE id = 'artist-user-id';

-- Check payment/earning record
SELECT * FROM "Earning" 
WHERE userId = 'artist-user-id' 
AND type = 'ROYALTY';
```

---

## TV-2: Dynamic Licensing State Machine

### Vision Claim
> "Dynamic Licensing: популярные треки стоят денег, непопулярные становятся бесплатными"

**Translation:** "Dynamic Licensing: popular tracks cost money, unpopular tracks become free"

### Test Scenario

**Feature:** Track State Transitions  
**File:** `e2e/tests/totem/tv-2-dynamic-licensing.spec.ts`

```gherkin
Scenario 1: NEW → PAID (high engagement)
  Given a track is in NEW state
  When rating reaches 40+ points
  Then track transitions to PAID state
  And access requires payment

Scenario 2: PAID → FREE (declining)
  Given a track is in PAID state
  When rating drops below 20
  Then track transitions to FREE state
  And access becomes free

Scenario 3: FREE → REVIVAL (resurgence)
  Given a track is in FREE state
  When rating rises above 35
  Then track transitions to REVIVAL state

Scenario 4: FREE → ARCHIVE (90 days low)
  Given a track in FREE state for 90+ days
  And rating remains < 10
  Then track transitions to ARCHIVE state

Scenario 5: REVIVAL → PAID (sustained)
  Given a track in REVIVAL for 30+ days
  And rating sustains > 40
  Then track transitions back to PAID
```

### Pre-requisites

**E24 Integration Must Be Complete:**

1. **Rating Calculator Job** (hourly)
```bash
# Verify job is registered
cd apps/api
grep -r "rating-calculation" src/modules/jobs/

# Check processor exists
ls -la src/modules/jobs/processors/rating.processor.ts
```

2. **State Transition Job** (daily)
```bash
# Check processor exists
ls -la src/modules/jobs/processors/state-transition.processor.ts

# Verify job module registration
grep "state-transition" src/modules/jobs/jobs.module.ts
```

3. **Play Event Processing**
```bash
# Verify event listeners
ls -la src/modules/rating/listeners/
```

### Test Execution

**Manual State Transition Trigger (for testing):**

```bash
# Trigger rating recalculation immediately (don't wait for cron)
curl -X POST http://localhost:4000/api/v1/admin/jobs/rating-calculate \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Trigger state transitions immediately
curl -X POST http://localhost:4000/api/v1/admin/jobs/state-transition \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Run TV-2 Test:**
```bash
cd e2e
pnpm playwright test tests/totem/tv-2-dynamic-licensing.spec.ts
```

### Verification Queries

```sql
-- Check state transition history
SELECT t.id, t.title, t.state, t.stateEnteredAt, t.totalRating
FROM "Track" t
WHERE t.title LIKE '%Test%'
ORDER BY t.stateEnteredAt DESC;

-- Verify rating calculation
SELECT trackId, plays, completions, seeders, likes, rating
FROM "TrackRating"
WHERE trackId = 'track-id';

-- Check state transition logs (if implemented)
SELECT * FROM "StateTransitionLog"
WHERE trackId = 'track-id'
ORDER BY transitionedAt DESC;
```

---

## TV-3: P2P Cost Reduction

### Vision Claim
> "P2P Architecture: популярность снижает издержки, а не увеличивает их"

**Translation:** "P2P Architecture: popularity reduces costs, not increases them"

### Test Scenario

**Feature:** P2P Distribution Economics  
**File:** `e2e/tests/totem/tv-3-p2p-economics.spec.ts`

```gherkin
Scenario: Seed-only for new track
  Given a newly published track with 0 listeners
  When the first listener plays the track
  Then 100% of chunks should come from seed node
  And seed_bytes_uploaded metric should increase

Scenario: P2P takeover for popular track
  Given a track with 100+ active listeners
  When a new listener joins
  Then >50% of chunks should come from P2P peers
  And seed bandwidth should be < 50% of total
  
Scenario: Infrastructure savings
  Given track "Popular Song" with 1000 daily plays
  When I query Prometheus metrics
  Then peer_upload_contribution should be > 50%
  And infrastructure_cost_savings should be > $X
```

### Pre-requisites

**Prometheus Metrics Must Be Implemented:**

```bash
# Verify seed node exposes metrics
curl http://localhost:5001/metrics

# Expected output should include:
# daww3_seed_bytes_uploaded{trackId="..."}
# daww3_peer_bytes_uploaded{trackId="..."}
# daww3_p2p_ratio{trackId="..."}
```

**If metrics missing, add to seed node:**

```typescript
// apps/seed/src/metrics.ts

import { register, Counter, Gauge } from 'prom-client'

export const seedBytesUploaded = new Counter({
  name: 'daww3_seed_bytes_uploaded',
  help: 'Total bytes uploaded by seed node',
  labelNames: ['trackId'],
})

export const peerBytesUploaded = new Counter({
  name: 'daww3_peer_bytes_uploaded',
  help: 'Total bytes uploaded by peers',
  labelNames: ['trackId'],
})

export const p2pRatio = new Gauge({
  name: 'daww3_p2p_ratio',
  help: 'Ratio of P2P vs seed bandwidth',
  labelNames: ['trackId'],
})

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})
```

### Test Execution

```bash
cd e2e
pnpm playwright test tests/totem/tv-3-p2p-economics.spec.ts
```

### Verification

**Query Prometheus:**
```bash
# P2P ratio for track
curl -s "http://localhost:9090/api/v1/query?query=daww3_p2p_ratio{trackId=\"track-123\"}"

# Seed bytes uploaded
curl -s "http://localhost:9090/api/v1/query?query=daww3_seed_bytes_uploaded{trackId=\"track-123\"}"

# Peer bytes uploaded
curl -s "http://localhost:9090/api/v1/query?query=daww3_peer_bytes_uploaded{trackId=\"track-123\"}"
```

**Expected Metrics:**
- New track (0-10 listeners): P2P ratio = 0-20%
- Growing track (10-100 listeners): P2P ratio = 20-50%
- Popular track (100+ listeners): P2P ratio = 50-80%

---

## TV-4: Gamification Economy

### Vision Claim
> "Gamification: XP, badges, and leaderboards influence earnings"

### Test Scenario

**Feature:** Gamification System  
**File:** `e2e/tests/totem/tv-4-gamification.spec.ts`

```gherkin
Scenario: User earns XP from actions
  Given I am a registered user with 0 XP
  When I complete listening to a track (2 XP)
  And I like a track (1 XP)
  And I seed a track for 1 hour (5 XP)
  Then my total XP should be 8
  
Scenario: Level progression
  Given I have 99 XP (Level 1)
  When I earn 1 more XP
  Then my level should become 2
  And I should see a level-up notification

Scenario: Badge award
  Given I have 1499 likes on my tracks
  When I receive 1 more like
  Then I should be awarded "Fan Favorite" badge
  And my earning multiplier should increase by 10%

Scenario: Earning multiplier
  Given I have "Viral Hit" badge (+10%)
  And I have "Super Seeder" badge (+5%)
  When I receive a $10 royalty payment
  Then my actual payment should be $11.50
```

### Pre-requisites

**Database Tables Must Exist:**

```sql
-- Verify Badge table
SELECT * FROM "Badge" LIMIT 5;

-- Verify UserBadge table
SELECT * FROM "UserBadge" LIMIT 5;

-- Verify User XP fields
SELECT id, displayName, totalXP, level 
FROM "User" 
LIMIT 5;
```

**If tables missing, apply migration:**
```bash
cd apps/api
pnpm prisma migrate dev --name add_gamification
```

### Test Execution

```bash
cd e2e
pnpm playwright test tests/totem/tv-4-gamification.spec.ts
```

### Verification Queries

```sql
-- Check user XP and level
SELECT id, displayName, totalXP, level 
FROM "User" 
WHERE id = 'test-user-id';

-- Check awarded badges
SELECT u.displayName, b.name, b.multiplier, ub.awardedAt
FROM "UserBadge" ub
JOIN "User" u ON ub.userId = u.id
JOIN "Badge" b ON ub.badgeId = b.id
WHERE u.id = 'test-user-id';

-- Check earning with multiplier
SELECT e.amount, e.finalAmount, e.multiplierApplied
FROM "Earning" e
WHERE e.userId = 'test-user-id'
ORDER BY e.createdAt DESC
LIMIT 5;
```

---

## TV-5: Hybrid DSP Performance (SKIP)

### Vision Claim
> "Hybrid DSP: powerful devices = 100% local, weak devices = cloud assist"

### Status: ⚠️ **SKIP RECOMMENDED**

**Reason:** Rust toolchain not available in CI environment

**Alternative:** Manual testing on local machine after Rust setup

**If you want to test manually:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Build WASM DSP
cd packages/dsp
./build.sh

# Run test
cd ../../e2e
pnpm playwright test tests/totem/tv-5-hybrid-dsp.spec.ts --headed
```

**Expected:**
- Powerful device (Chrome desktop): Local WASM processing, <2ms/block
- Weak device (Safari old iPhone): Degraded processing, warning shown

---

## TV-6: Spotify Comparison Metrics

### Vision Claim
> "DAWW3 pays artists 100x more than Spotify ($0.30 vs $0.003 per stream)"

### Test Scenario

**Feature:** Artist Payout Comparison  
**File:** `e2e/tests/totem/tv-6-spotify-comparison.spec.ts`

```gherkin
Scenario: Track artist payout per stream
  Given a track has 1000 completed plays
  When I calculate total artist earnings
  Then average payout per stream should be ~$0.30
  And this should be 100x Spotify rate ($0.003)

Scenario: Payment timing
  Given a play event was recorded
  When royalty distribution runs
  Then payment should settle in < 1 hour
  (vs Spotify 2-3 months)

Scenario: Listener participation rewards
  Given a listener seeded a track for 10 hours
  Then listener should earn > $0 in rewards
  (vs Spotify $0 for listeners)
```

### Pre-requisites

**Payment Infrastructure Must Exist:**

1. **Royalty Distribution Queue**
```bash
# Verify queue processor
ls -la apps/api/src/modules/jobs/processors/royalty-distribution.processor.ts
```

2. **Earnings Table**
```sql
SELECT * FROM "Earning" LIMIT 5;
```

3. **Smart Contract Integration**
```bash
# Verify TrackNFT contract has royalty functions
cd apps/contracts
grep -A10 "function distributeRoyalties" contracts/TrackNFT.sol
```

### Test Execution

```bash
cd e2e
pnpm playwright test tests/totem/tv-6-spotify-comparison.spec.ts
```

### Verification Queries

```sql
-- Average payout per play
SELECT 
  t.title,
  COUNT(DISTINCT pe.id) as total_plays,
  COALESCE(SUM(e.amount), 0) as total_earnings,
  CASE 
    WHEN COUNT(DISTINCT pe.id) > 0 
    THEN COALESCE(SUM(e.amount), 0) / COUNT(DISTINCT pe.id)
    ELSE 0 
  END as payout_per_stream
FROM "Track" t
LEFT JOIN "PlayEvent" pe ON pe.trackId = t.id
LEFT JOIN "Earning" e ON e.trackId = t.id AND e.type = 'ROYALTY'
WHERE t.title = 'Test Song'
GROUP BY t.id, t.title;

-- Payment timing
SELECT 
  e.createdAt as earning_created,
  e.paidAt as payment_settled,
  EXTRACT(EPOCH FROM (e.paidAt - e.createdAt))/60 as settlement_minutes
FROM "Earning" e
WHERE e.status = 'PAID'
ORDER BY e.createdAt DESC
LIMIT 10;

-- Listener rewards
SELECT 
  u.displayName,
  SUM(e.amount) as total_earned
FROM "Earning" e
JOIN "User" u ON e.userId = u.id
WHERE e.type = 'P2P_SEEDING'
GROUP BY u.id, u.displayName
ORDER BY total_earned DESC;
```

**Expected Results:**
- **Artist payout:** $0.10 - $0.50 per stream (target: $0.30)
- **Spotify comparison:** 30x - 100x higher
- **Payment timing:** < 60 minutes (vs Spotify 60-90 days)
- **Listener rewards:** > $0 (vs Spotify $0)

---

## Success Criteria

### Must Pass (Launch Blockers)

- [ ] **TV-1** ✅ Complete artist journey works end-to-end
- [ ] **TV-2** ✅ State transitions work (NEW→PAID→FREE→REVIVAL→ARCHIVE)
- [ ] **TV-6** ✅ Artist payout > 10x Spotify minimum

### Should Pass (Launch Week)

- [ ] **TV-3** ✅ P2P ratio > 50% for popular tracks
- [ ] **TV-4** ✅ Gamification system functional (XP, badges, multipliers)

### Nice to Have (Post-Launch)

- [ ] **TV-5** ✅ Hybrid DSP works on both powerful and weak devices

---

## Reporting

### Update TOTEM Validation Report

After running tests, update `docs/TOTEM-VALIDATION-REPORT.md`:

```markdown
## Summary

| Test | Status | Claim Validated | Evidence |
|------|--------|-----------------|----------|
| TV-1 | ✅ PASS | Creation → Monetization | [Playwright Report](link) |
| TV-2 | ✅ PASS | Dynamic Licensing | [Database Queries](link) |
| TV-3 | ✅ PASS | P2P Cost Reduction | [Prometheus Metrics](link) |
| TV-4 | ✅ PASS | Gamification Economy | [Database Queries](link) |
| TV-5 | ⚠️ SKIP | Hybrid DSP | Rust N/A |
| TV-6 | ✅ PASS | Spotify Comparison | [Payment Analysis](link) |

## Key Metrics

- **Artist payout:** $0.32/stream (107x Spotify)
- **Payment timing:** 18 minutes average
- **P2P ratio:** 64% for popular tracks
- **Infrastructure savings:** 58%

## Conclusion

✅ **TOTEM vision validated.** All core claims proven through automated tests.
```

### Generate Playwright HTML Report

```bash
cd e2e
pnpm playwright show-report
```

---

## Timeline

**Day 1:** Fix infrastructure (fixtures, API errors, migrations) - 4-6 hours  
**Day 2:** Complete E24 integration (rating, state transitions) - 3-4 hours  
**Day 3:** Run TV-1, TV-2, TV-6 (critical path) - 2-3 hours  
**Day 4:** Run TV-3, TV-4 (nice to have) - 2-3 hours  
**Day 5:** Bug fixes and retests - 2-4 hours

**Total:** 13-20 hours

---

## Related Documents

- **Quick Start:** `docs/TOTEM-VALIDATION-QUICKSTART.md`
- **Current Status:** `docs/TOTEM-VALIDATION-REPORT.md`
- **Vision:** `totem/1-VISION.md`
- **Architecture:** `totem/2-ARCHITECTURE.md`
- **Economy:** `totem/3-ECONOMY.md`
- **Gamification:** `totem/4-GAMIFICATION.md`
- **E2E Tests:** `e2e/tests/totem/tv-*.spec.ts`

---

**Priority:** 🔴 P0 CRITICAL  
**Dependencies:** E23 (tests), E24 (E8 integration)  
**Estimated Time:** 13-20 hours  
**Last Updated:** 2026-01-28
