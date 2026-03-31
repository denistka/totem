# E25: TOTEM Validation — Agent Prompts

> **Goal:** Run and pass all TOTEM acceptance tests (TV-1 through TV-6)
> **Sprint:** 4
> **Owner:** QA / All
> **Priority:** 🔴 P0 CRITICAL (Validates product vision)

---

## Overview

TOTEM tests validate the core value proposition from `totem/1-VISION.md` through `totem/4-GAMIFICATION.md`. These are **acceptance tests** that prove DAWW3 delivers on its promises:

- TV-1: Creation → Distribution → Monetization cycle
- TV-2: Dynamic Licensing (PAID ↔ FREE ↔ REVIVAL ↔ ARCHIVE)
- TV-3: P2P Cost Reduction (popularity ↓ infrastructure costs)
- TV-4: Gamification Economy (XP, badges, earning multipliers)
- TV-5: Hybrid DSP (powerful devices = local, weak = graceful degradation)
- TV-6: Artist vs Spotify Comparison ($0.30 vs $0.003 per stream)

---

## E25-T1: TV-1 Creation→Monetization Flow

```
[[[[ #SETTINGS

    mode = agent - run E2E test, fix failures, iterate
    expertize = 'you are world class QA engineer'
    target = validate complete artist journey from creation to payment
    test = true

    code style = [E2E best practices, Playwright]
    write docs = true
    deep thinking = true
    performance = end-to-end flow <2 minutes
    tech stack = ['Playwright', 'Docker', 'Hardhat']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Run TV-1 test: Artist creates track → publishes → listener streams → artist receives payment.

{{{{ #CUSTOMER PROMT

TV-1 тест из e2e/tests/totem/tv-1-creation-monetization.spec.ts нужно запустить.
Тест проверяет полный цикл TOTEM vision:
1. Артист регистрируется
2. Создаёт трек в DAW
3. Публикует с NFT mint
4. Слушатель находит и играет
5. Артист получает роялти

Если тест падает — чини и повтори.

}}}}

<<<<<<#RECOMMENDED TASKS

TV1-1. Setup Test Environment
- Start all services: docker compose up -d
- Wait for healthy: postgres, redis, hardhat, api, web
- Verify ports: 3000 (web), 4000 (api), 8545 (hardhat)
- Check: curl http://localhost:4000/health → 200 OK

TV1-2. Run TV-1 Test
```bash
cd e2e
pnpm playwright test tests/totem/tv-1-creation-monetization.spec.ts --headed
```

TV1-3. Expected Flow
1. Artist registers with wallet mock
2. Opens DAW, uploads audio file
3. Adds gain plugin, previews audio
4. Publishes track (title, price, blockchain TX)
5. Track appears in explore page
6. Listener searches and finds track
7. Listener plays track via P2P
8. Play event recorded
9. Rating updates (async)
10. Royalty accrues to artist
11. Artist claims royalty

TV1-4. Common Failures & Fixes

**Failure:** "Wallet connection failed"
- Fix: Check wallet mock in fixtures/index.ts
- Ensure: window.ethereum injected
- Test: Mock account has testnet ETH

**Failure:** "Audio upload timeout"
- Fix: Increase timeout in DAW upload
- Check: MinIO service running
- Verify: Presigned URL generation works

**Failure:** "NFT mint transaction rejected"
- Fix: Check Hardhat local blockchain
- Ensure: Contracts deployed
- Test: Artist wallet has gas

**Failure:** "P2P connection timeout"
- Fix: Check seed node running (port 5001)
- Verify: WebRTC/TURN server accessible
- Test: Seed has track chunks

**Failure:** "Royalty not received"
- Fix: Check smart contract royalty split
- Verify: Payment queue processed
- Test: Blockchain event listener working

TV1-5. Debugging Steps
- Screenshot on failure (Playwright auto-saves)
- Check browser console logs
- Inspect network tab for failed requests
- Review API logs: docker compose logs api
- Check Hardhat transactions: docker compose logs hardhat

TV1-6. Success Criteria
- Test passes end-to-end
- No manual intervention needed
- Total time <2 minutes
- All assertions green
- Screenshots show happy path

🏁 Definition of Done
- TV-1 test passing consistently (3/3 runs)
- All steps complete (register → create → publish → stream → payout)
- TOTEM claim verified: "Единая экосистема где создание → распространение → монетизация"
- Metrics logged: time to publish, time to first play, payout amount

>>>>>>

]]]]
```

---

## E25-T2: TV-2 Dynamic Licensing State Machine

```
[[[[ #SETTINGS

    mode = agent - validate state transitions
    expertize = 'you are world class QA engineer'
    target = test track lifecycle NEW → PAID → FREE → REVIVAL → ARCHIVE
    test = true

    code style = [state machine testing, exhaustive]
    write docs = true
    deep thinking = true
    performance = not critical
    tech stack = ['Playwright', 'Prisma', 'Vitest']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Run TV-2 test: Track state transitions based on engagement.

{{{{ #CUSTOMER PROMT

TV-2 проверяет Dynamic Licensing из totem/1-VISION.md:
- NEW track с высоким рейтингом → PAID
- PAID track с падающим рейтингом → FREE
- FREE track с возвращающимся интересом → REVIVAL
- FREE track 90+ дней без интереса → ARCHIVE

Нужен E8 integration (E24 complete) перед запуском.

}}}}

<<<<<<#RECOMMENDED TASKS

TV2-1. Prerequisites Check
- E24 complete: scheduled jobs running
- Database migrations applied
- Rating formula working
- State machine logic implemented

TV2-2. Test Scenario 1: NEW → PAID
```typescript
it('transitions NEW → PAID when rating >= 40', async () => {
  // Create track in NEW state
  const track = await createTrack({ state: 'NEW' })
  
  // Simulate high engagement
  await simulatePlays(track.id, 100, { completionRate: 0.9 })
  await simulateLikes(track.id, 50)
  
  // Wait for rating calculation
  await waitForRatingUpdate(track.id)
  
  // Trigger state evaluation (or wait for daily job)
  await triggerStateTransitionJob()
  
  // Assert
  const updated = await getTrack(track.id)
  expect(updated.state).toBe('PAID')
  expect(updated.rating.total).toBeGreaterThanOrEqual(40)
})
```

TV2-3. Test Scenario 2: PAID → FREE
```typescript
it('transitions PAID → FREE when rating < 20', async () => {
  // Create track in PAID state with declining engagement
  const track = await createTrack({
    state: 'PAID',
    rating: 25,
    createdAt: daysAgo(60)
  })
  
  // No new plays for 30 days = rating decays
  await advanceTime({ days: 30 })
  await triggerStateTransitionJob()
  
  // Assert
  const updated = await getTrack(track.id)
  expect(updated.state).toBe('FREE')
  expect(updated.rating.total).toBeLessThan(20)
})
```

TV2-4. Test Scenario 3: FREE → REVIVAL
```typescript
it('transitions FREE → REVIVAL when rating >= 35', async () => {
  const track = await createTrack({ state: 'FREE', rating: 10 })
  
  // Sudden spike in interest (viral moment)
  await simulatePlays(track.id, 500, { completionRate: 0.85 })
  await simulateShares(track.id, 100)
  
  await waitForRatingUpdate(track.id)
  await triggerStateTransitionJob()
  
  const updated = await getTrack(track.id)
  expect(updated.state).toBe('REVIVAL')
  expect(updated.rating.total).toBeGreaterThanOrEqual(35)
})
```

TV2-5. Test Scenario 4: FREE → ARCHIVE
```typescript
it('transitions FREE → ARCHIVE after 90 days with rating < 10', async () => {
  const track = await createTrack({
    state: 'FREE',
    rating: 5,
    stateEnteredAt: daysAgo(95)
  })
  
  await triggerStateTransitionJob()
  
  const updated = await getTrack(track.id)
  expect(updated.state).toBe('ARCHIVE')
})
```

TV2-6. Test Scenario 5: REVIVAL → PAID
```typescript
it('transitions REVIVAL → PAID after 30 days sustained high rating', async () => {
  const track = await createTrack({
    state: 'REVIVAL',
    rating: 50,
    stateEnteredAt: daysAgo(35)
  })
  
  // Rating stays high
  expect(track.rating.total).toBeGreaterThan(40)
  
  await triggerStateTransitionJob()
  
  const updated = await getTrack(track.id)
  expect(updated.state).toBe('PAID')
})
```

TV2-7. Verify Access Rules
- NEW: Preview only (30 seconds)
- PAID: Requires license purchase
- FREE: Full access, no payment
- REVIVAL: Full access, optional tip
- ARCHIVE: Low quality (compressed)

TV2-8. Success Metrics
- All 5 transitions work
- Access rules enforced correctly
- State changes logged in activity
- Artists notified of transitions

🏁 Definition of Done
- TV-2 test suite passing (10+ scenarios)
- All state transitions validated
- Edge cases tested (exact thresholds, concurrent changes)
- TOTEM claim verified: "Dynamic pricing — экономика адаптируется к спросу"

>>>>>>

]]]]
```

---

## E25-T3: TV-3 P2P Cost Reduction

```
[[[[ #SETTINGS

    mode = agent - measure P2P economics
    expertize = 'you are world class performance engineer'
    target = prove P2P reduces infrastructure costs as popularity grows
    test = true

    code style = [metrics-driven, observable]
    write docs = true
    deep thinking = true
    performance = measure bandwidth savings
    tech stack = ['Prometheus', 'k6', 'WebTorrent']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Run TV-3 test: Popular tracks have >50% P2P distribution, reducing seed bandwidth.

{{{{ #CUSTOMER PROMT

TV-3 проверяет ключевую экономику TOTEM: "Популярность снижает издержки".
Seed node должен отдавать меньше bandwidth когда много peers.
Нужно измерить P2P ratio и seed bandwidth savings для популярного трека.

}}}}

<<<<<<#RECOMMENDED TASKS

TV3-1. Setup Metrics Collection
- Prometheus scraping seed node
- Metrics: seed_bytes_uploaded, peer_bytes_uploaded, p2p_ratio
- Grafana dashboard for visualization
- Test data export for assertions

TV3-2. Scenario: New Track (0 Listeners)
```typescript
it('new track has 0% P2P ratio (all from seed)', async () => {
  const track = await publishTrack()
  const listener = await createListener()
  
  // First listener downloads from seed only
  await listener.playTrack(track.id)
  
  // Measure
  const metrics = await getMetrics(track.id)
  expect(metrics.p2pRatio).toBe(0)
  expect(metrics.seedBytes).toBeGreaterThan(0)
  expect(metrics.peerBytes).toBe(0)
})
```

TV3-3. Scenario: Popular Track (100 Listeners)
```typescript
it('popular track has >50% P2P ratio', async () => {
  const track = await publishPopularTrack() // Pre-seeded with 50 listeners
  
  // Add 100 more listeners
  const listeners = await createListeners(100)
  await Promise.all(listeners.map(l => l.playTrack(track.id)))
  
  // Wait for P2P connections to establish
  await sleep(10000)
  
  // Measure
  const metrics = await getMetrics(track.id)
  expect(metrics.p2pRatio).toBeGreaterThan(0.5) // >50% from peers
  expect(metrics.seedBytes).toBeLessThan(metrics.totalBytes * 0.5)
  
  // Cost analysis
  const seedBandwidth = metrics.seedBytes
  const peerBandwidth = metrics.peerBytes
  const savings = (peerBandwidth / (seedBandwidth + peerBandwidth)) * 100
  expect(savings).toBeGreaterThan(50) // >50% savings
})
```

TV3-4. Measure Bandwidth Over Time
```typescript
it('P2P ratio increases as more listeners join', async () => {
  const track = await publishTrack()
  const measurements = []
  
  // Add listeners in batches
  for (let batch = 1; batch <= 10; batch++) {
    const listeners = await createListeners(10)
    await Promise.all(listeners.map(l => l.playTrack(track.id)))
    
    await sleep(5000)
    
    const metrics = await getMetrics(track.id)
    measurements.push({
      listenerCount: batch * 10,
      p2pRatio: metrics.p2pRatio,
      seedBandwidth: metrics.seedBytes
    })
  }
  
  // Assert: P2P ratio grows
  expect(measurements[0].p2pRatio).toBeLessThan(0.2)
  expect(measurements[9].p2pRatio).toBeGreaterThan(0.6)
  
  // Assert: Seed bandwidth plateaus
  const seedGrowthRate = 
    measurements[9].seedBandwidth / measurements[0].seedBandwidth
  expect(seedGrowthRate).toBeLessThan(5) // <5x despite 10x listeners
})
```

TV3-5. Cost Comparison vs Traditional CDN
```typescript
it('P2P is cheaper than CDN at scale', async () => {
  const track = await publishTrack()
  const listeners = await createListeners(1000)
  
  await Promise.all(listeners.map(l => l.playTrack(track.id)))
  
  const metrics = await getMetrics(track.id)
  
  // Calculate costs (example prices)
  const cdnCost = metrics.totalBytes * 0.085 / 1e9 // $0.085/GB
  const p2pCost = metrics.seedBytes * 0.085 / 1e9 // Only pay for seed
  const savings = cdnCost - p2pCost
  const savingsPercent = (savings / cdnCost) * 100
  
  console.log({
    cdnCost: `$${cdnCost.toFixed(2)}`,
    p2pCost: `$${p2pCost.toFixed(2)}`,
    savings: `$${savings.toFixed(2)} (${savingsPercent.toFixed(1)}%)`
  })
  
  expect(savingsPercent).toBeGreaterThan(50)
})
```

TV3-6. Prometheus Queries
```promql
# P2P ratio
sum(peer_bytes_uploaded) / 
  (sum(seed_bytes_uploaded) + sum(peer_bytes_uploaded))

# Seed bandwidth savings
1 - (sum(seed_bytes_uploaded) / sum(total_bytes_served))

# Cost per 1000 plays
(sum(seed_bytes_uploaded) * 0.085 / 1e9) / sum(play_count) * 1000
```

🏁 Definition of Done
- P2P ratio >50% for popular tracks proven
- Seed bandwidth savings measured (>50%)
- Cost comparison vs CDN documented
- TOTEM claim verified: "P2P снижает инфраструктурные расходы"
- Graphs exported to docs/

>>>>>>

]]]]
```

---

## E25-T4: TV-4 Gamification Economy

```
[[[[ #SETTINGS

    mode = agent - validate gamification mechanics
    expertize = 'you are world class game economy designer'
    target = verify XP, badges, and earning multipliers work correctly
    test = true

    code style = [game balance testing]
    write docs = true
    deep thinking = true
    performance = not critical
    tech stack = ['Vitest', 'Prisma', 'Playwright']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Run TV-4 test: Gamification drives engagement and affects earnings.

{{{{ #CUSTOMER PROMT

TV-4 проверяет gamification из totem/4-GAMIFICATION.md:
- XP начисляется за actions
- Level up при достижении порогов
- Badges выдаются автоматически
- Earning multipliers увеличивают payouts
- Leaderboards стимулируют competition

}}}}

<<<<<<#RECOMMENDED TASKS

TV4-1. Test: XP Accumulation
```typescript
it('user earns XP for actions', async () => {
  const user = await createUser()
  
  // Actions with XP values
  await user.playTrack() // +1 XP
  await user.completeTrack() // +2 XP
  await user.likeTrack() // +1 XP
  await user.uploadTrack() // +10 XP
  
  const xp = await getUser(user.id).xp
  expect(xp.total).toBe(14) // 1+2+1+10
})
```

TV4-2. Test: Level Progression
```typescript
it('levels up at XP thresholds', async () => {
  const user = await createUser({ totalXP: 95 })
  
  // Earn 10 XP → crosses Level 2 threshold (100 XP)
  await user.uploadTrack()
  
  const updated = await getUserXP(user.id)
  expect(updated.level).toBe(2)
  expect(updated.total).toBe(105)
  
  // Check notification sent
  const notifications = await getUserNotifications(user.id)
  expect(notifications.some(n => n.type === 'LEVEL_UP')).toBe(true)
})
```

TV4-3. Test: Badge Auto-Award
```typescript
it('awards badge when threshold reached', async () => {
  const user = await createUser()
  const track = await user.uploadTrack()
  
  // Simulate 10K plays → "Viral Hit" badge
  await simulatePlays(track.id, 10000)
  
  // Check badge awarded
  const badges = await getUserBadges(user.id)
  expect(badges.find(b => b.badgeId === 'VIRAL_HIT')).toBeDefined()
  expect(badges.find(b => b.badgeId === 'VIRAL_HIT').awardedAt).toBeDefined()
})
```

TV4-4. Test: Earning Multipliers
```typescript
it('earning multiplier increases payouts', async () => {
  const user = await createUser()
  
  // Award badges with multipliers
  await awardBadge(user.id, 'VIRAL_HIT') // +10%
  await awardBadge(user.id, 'SUPER_SEEDER') // +5%
  
  // Calculate multiplier
  const multiplier = await getEarningMultiplier(user.id)
  expect(multiplier).toBe(1.15) // 1.0 + 0.10 + 0.05
  
  // Test payout
  const basePayout = 10 // $10
  const actualPayout = basePayout * multiplier
  expect(actualPayout).toBe(11.50)
})
```

TV4-5. Test: Leaderboard Ranking
```typescript
it('leaderboard ranks users by XP', async () => {
  // Create users with different XP
  const users = await Promise.all([
    createUser({ totalXP: 500 }),
    createUser({ totalXP: 1000 }),
    createUser({ totalXP: 250 })
  ])
  
  const leaderboard = await getLeaderboard('xp', { limit: 10 })
  
  expect(leaderboard[0].userId).toBe(users[1].id) // 1000 XP
  expect(leaderboard[1].userId).toBe(users[0].id) // 500 XP
  expect(leaderboard[2].userId).toBe(users[2].id) // 250 XP
})
```

TV4-6. Test: Self-Filtering Content
```typescript
it('high engagement → PAID, low engagement → FREE', async () => {
  // This is TV-2, but shows gamification incentives work
  const popularTrack = await createTrack({
    plays: 1000,
    likes: 500,
    completionRate: 0.9
  })
  
  const unpopularTrack = await createTrack({
    plays: 10,
    likes: 1,
    completionRate: 0.3
  })
  
  await triggerStateTransitionJob()
  
  expect((await getTrack(popularTrack.id)).state).toBe('PAID')
  expect((await getTrack(unpopularTrack.id)).state).toBe('FREE')
})
```

🏁 Definition of Done
- All gamification mechanics working
- XP, levels, badges, multipliers validated
- Leaderboards accurate
- TOTEM claim verified: "Popularity = Reward, Unpopularity = Freedom"

>>>>>>

]]]]
```

---

## E25-T5: TV-5 Hybrid DSP Performance

```
[[[[ #SETTINGS

    mode = agent - test device-adaptive DSP
    expertize = 'you are world class audio performance engineer'
    target = validate DSP performs well on powerful devices, degrades gracefully on weak
    test = true

    code style = [performance testing]
    write docs = true
    deep thinking = true
    performance = <2ms/block on powerful, graceful on weak
    tech stack = ['Playwright', 'Web Audio API', 'WASM']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Run TV-5 test: Powerful devices process locally <2ms, weak devices degrade gracefully.

{{{{ #CUSTOMER PROMT

TV-5 проверяет Hybrid DSP из totem/2-ARCHITECTURE.md.
Powerful PC должен обрабатывать audio локально с latency <10ms.
Weak device должен показать warning или упрощённую обработку.

⚠️ BLOCKED: Rust toolchain not available in CI, WASM DSP tests skipped.
Можно запустить manual тест или skip до Rust setup.

}}}}

<<<<<<#RECOMMENDED TASKS

TV5-1. Test: Powerful Device Local Processing
```typescript
it('processes audio locally with low latency', async ({ page }) => {
  // Mock powerful device (desktop Chrome)
  await page.emulate({ ...desktop, features: ['SharedArrayBuffer'] })
  
  await page.goto('/daw')
  
  // Load WASM plugin
  await page.click('[data-testid="add-plugin"]')
  await page.selectOption('[data-testid="plugin-select"]', 'gain')
  
  // Measure processing time
  const latency = await page.evaluate(async () => {
    const worklet = window.audioContext.audioWorklet
    const startTime = performance.now()
    
    // Process 128 samples
    worklet.process(new Float32Array(128))
    
    return performance.now() - startTime
  })
  
  expect(latency).toBeLessThan(2) // <2ms per 128-sample block
})
```

TV5-2. Test: Weak Device Detection
```typescript
it('detects weak device and shows warning', async ({ page }) => {
  // Mock weak device (old iPhone)
  await page.emulate({ ...iPhone6, features: [] }) // No SharedArrayBuffer
  
  await page.goto('/daw')
  
  // Check device capability detected
  const capability = await page.evaluate(() => 
    window.deviceCapability
  )
  
  expect(capability).toBe('low')
  
  // Check latency preset defaulted to 'eco'
  const preset = await page.evaluate(() => 
    window.latencyManager.currentPreset
  )
  
  expect(preset).toBe('eco') // 46ms buffer
})
```

TV5-3. Test: Plugin Count Warning
```typescript
it('warns when loading too many plugins on weak device', async ({ page }) => {
  await page.emulate(weakDevice)
  await page.goto('/daw')
  
  // Try to load 10 plugins
  for (let i = 0; i < 10; i++) {
    await page.click('[data-testid="add-plugin"]')
  }
  
  // Should show warning after 5
  const warning = await page.locator('[data-testid="performance-warning"]')
  await expect(warning).toBeVisible()
  expect(await warning.textContent()).toContain('performance')
})
```

TV5-4. Test: Graceful Degradation
```typescript
it('disables complex features on weak devices', async ({ page }) => {
  await page.emulate(weakDevice)
  await page.goto('/daw')
  
  // Check: Spectrum analyzer disabled
  const spectrum = await page.locator('[data-testid="spectrum-analyzer"]')
  expect(await spectrum.isDisabled()).toBe(true)
  
  // Check: Max 3 tracks
  const addTrackBtn = await page.locator('[data-testid="add-track"]')
  await addTrackBtn.click()
  await addTrackBtn.click()
  await addTrackBtn.click()
  expect(await addTrackBtn.isDisabled()).toBe(true)
})
```

TV5-5. Manual Test (If Rust Available)
- Build WASM DSP: cd packages/dsp && ./build.sh
- Load in browser DAW
- Measure: AudioWorklet process() time
- Verify: <2ms on desktop, warning on mobile

🏁 Definition of Done
- Powerful device: <2ms DSP latency proven
- Weak device: Detection working, warnings shown
- Graceful degradation tested
- TOTEM claim verified (when Rust available)
- ⚠️ SKIP if Rust not installed

>>>>>>

]]]]
```

---

## E25-T6: TV-6 Spotify Comparison Metrics

```
[[[[ #SETTINGS

    mode = agent - collect comparative metrics
    expertize = 'you are world class data analyst'
    target = prove DAWW3 pays artists 100x more than Spotify
    test = true

    code style = [data-driven, observable]
    write docs = true
    deep thinking = true
    performance = not critical
    tech stack = ['Prisma', 'Prometheus', 'SQL']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Run TV-6 test: Measure artist payout/stream, payment timing, listener rewards.

{{{{ #CUSTOMER PROMT

TV-6 проверяет business case из totem/3-ECONOMY.md:
- Artist payout: ~$0.30/stream (vs Spotify $0.003)
- Payment timing: <1 hour (vs 2-3 months)
- Listener rewards: P2P earnings (vs Spotify $0)

Собрать реальные метрики и сравнить.

}}}}

<<<<<<#RECOMMENDED TASKS

TV6-1. Measure: Artist Payout Per Stream
```sql
-- Query average payout per stream
SELECT 
  AVG(royalty_amount / play_count) as payout_per_stream,
  COUNT(DISTINCT artist_id) as artist_count,
  SUM(play_count) as total_plays,
  SUM(royalty_amount) as total_royalties
FROM track_earnings
WHERE created_at > NOW() - INTERVAL '30 days'
```

Expected: ~$0.30 per stream (100x Spotify's $0.003)

TV6-2. Measure: Payment Timing
```typescript
it('artist receives payment within 1 hour', async () => {
  const artist = await createArtist()
  const track = await artist.publishTrack()
  
  // Simulate 100 plays
  const playTime = new Date()
  await simulatePlays(track.id, 100)
  
  // Wait for royalty distribution
  await sleep(60000) // 1 minute
  
  // Check payment received
  const payments = await getArtistPayments(artist.id)
  const recentPayment = payments.find(p => 
    p.createdAt > playTime
  )
  
  expect(recentPayment).toBeDefined()
  
  const paymentDelay = 
    recentPayment.createdAt - playTime
  
  expect(paymentDelay).toBeLessThan(3600000) // <1 hour
})
```

TV6-3. Measure: Listener Rewards (P2P Seeding)
```typescript
it('listener earns tokens for seeding', async () => {
  const listener = await createListener()
  
  // Listen to track and seed
  await listener.playTrack(trackId)
  await listener.seedTrack(trackId, { duration: 3600 }) // 1 hour
  
  // Check rewards
  const earnings = await getListenerEarnings(listener.id)
  const seedingReward = earnings.find(e => e.type === 'P2P_SEEDING')
  
  expect(seedingReward).toBeDefined()
  expect(seedingReward.amount).toBeGreaterThan(0)
})
```

TV6-4. Comparison Table
```typescript
const comparison = {
  'Payout per stream': {
    spotify: '$0.003',
    daww3: await calculateAvgPayout(), // ~$0.30
    improvement: '100x'
  },
  'Time to payment': {
    spotify: '2-3 months',
    daww3: await calculateAvgPaymentTime(), // <1 hour
    improvement: '1440x faster'
  },
  'Listener rewards': {
    spotify: '$0',
    daww3: await calculateAvgListenerEarnings(), // $0.05/hour seeding
    improvement: '∞'
  },
  'Infrastructure cost (1M plays)': {
    spotify: '$255 (CDN)',
    daww3: await calculateP2PCost(), // ~$100 (seed only)
    improvement: '60% savings'
  }
}

console.table(comparison)
```

TV6-5. Generate Report
- Export metrics to CSV
- Create graphs (payout distribution, payment timing)
- Write summary: docs/TOTEM-VALIDATION-REPORT.md
- Include: sample size, date range, caveats

TV6-6. Success Criteria
- Average payout >$0.10 per stream (33x Spotify minimum)
- 95% of payments within 24 hours
- Listener earnings measurable (>$0)
- P2P cost savings >30%

🏁 Definition of Done
- All 6 TOTEM tests passing
- Metrics collected and analyzed
- Comparison report generated
- TOTEM vision validated with data
- docs/TOTEM-VALIDATION-REPORT.md published

>>>>>>

]]]]
```

---

## E25 Final Report

After all TOTEM tests complete, generate:

**File:** `docs/TOTEM-VALIDATION-REPORT.md`

```markdown
# TOTEM Validation Report

**Date:** 2026-01-XX
**Sprint:** 4
**Status:** ✅ PASSED / ❌ FAILED

## Summary

| Test | Status | Claim Validated |
|------|--------|-----------------|
| TV-1 | ✅ PASS | Creation → Distribution → Monetization |
| TV-2 | ✅ PASS | Dynamic Licensing |
| TV-3 | ✅ PASS | P2P Cost Reduction |
| TV-4 | ✅ PASS | Gamification Economy |
| TV-5 | ⚠️ SKIP | Hybrid DSP (Rust N/A) |
| TV-6 | ✅ PASS | Spotify Comparison |

## Key Metrics

- **Artist payout:** $0.28/stream (93x Spotify)
- **Payment timing:** 45 minutes average
- **P2P ratio:** 62% for popular tracks
- **Infrastructure savings:** 58%

## Conclusion

DAWW3 delivers on its TOTEM vision...
```

---

*E25 TOTEM Validation — DAWW3 Sprint 4*
