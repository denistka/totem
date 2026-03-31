# 🎯 TOTEM Vision — Acceptance Tests

> **Purpose:** Validate that DAWW3 delivers on its core value proposition
> **Source:** totem/1-VISION.md, totem/2-ARCHITECTURE.md, totem/3-ECONOMY.md, totem/4-GAMIFICATION.md

---

## Agent Prompt for TOTEM Acceptance Testing

```
[[[[ #SETTINGS

    mode = agent - implement and run acceptance tests
    expertize = 'you are world class QA engineer specializing in product validation'
    target = validate DAWW3 against TOTEM vision documents
    test = true

    code style = [BDD, Gherkin-style scenarios]
    write docs = true
    deep thinking = true
    performance = track key metrics
    tech stack = ['Playwright', 'Vitest', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement acceptance tests that validate DAWW3 against TOTEM vision.
Each test must trace back to a specific TOTEM document claim.

{{{{ #CUSTOMER PROMT

Нужны acceptance tests для валидации:
1. Полный цикл: создание → распространение → монетизация
2. Dynamic Licensing (PAID → FREE → REVIVAL → ARCHIVE)
3. P2P экономия (популярность снижает нагрузку на seed)
4. Gamification (XP, badges, leaderboards влияют на earnings)
5. Hybrid DSP (мощные устройства = локально, слабые = cloud)

}}}}

<<<<<<#RECOMMENDED TASKS

TV-1. Complete Creation-to-Monetization Cycle
- Artist logs in with wallet
- Creates track in browser DAW
- Adds audio and applies WASM plugin effects
- Publishes track (mints NFT)
- Listener discovers and plays track via P2P
- Artist receives royalty payment
- Verify: Track created, NFT minted, payment received

TV-2. Dynamic Licensing State Machine
- Track starts in NEW state
- High engagement → transitions to PAID
- Low engagement over time → transitions to FREE
- Resurgence of interest → transitions to REVIVAL
- Extended low engagement → transitions to ARCHIVE
- Each transition triggers correct access rules

TV-3. P2P Cost Reduction Validation
- Seed node serves initial chunks
- As more listeners join, P2P ratio increases
- Popular track achieves >50% P2P distribution
- Seed bandwidth metrics decrease
- Verify via Prometheus metrics

TV-4. Gamification Economy
- User earns XP from actions (play, like, seed)
- Level progression unlocks features
- Badges awarded at thresholds
- Earning multipliers apply correctly
- Leaderboard positions update

TV-5. Hybrid DSP Performance
- Powerful device: WASM DSP runs locally < 2ms/block
- Weak device detection (mobile/old browser)
- Graceful degradation to simplified processing
- Cloud DSP fallback (if implemented)

TV-6. Artist vs Spotify Comparison Metrics
- Track artist payout per stream (~$0.30 target vs $0.003)
- Payment timing (instant vs 2-3 months)
- Listener participation rewards (tokens for seeding)

🏁 Definition of Done
- All TOTEM claims have corresponding test
- Pass rate > 95%
- Performance metrics within targets
- Documentation links tests to vision docs

>>>>>>

]]]]
```

---

## Test Scenarios

### TV-1: Complete Creation-to-Monetization Cycle

```gherkin
Feature: Artist to Listener to Payment Flow
  As defined in TOTEM 1: "Единая экосистема где создание → распространение → монетизация"

  Background:
    Given the DAWW3 platform is running
    And smart contracts are deployed

  Scenario: Artist creates and publishes track
    Given I am logged in as an artist with wallet "0xArtist..."
    When I open the DAW interface
    And I create a new track named "Test Song"
    And I import audio file "test-audio.wav"
    And I apply GainProcessor plugin with gain 0.8
    And I click "Publish"
    And I set price to 0.01 ETH
    And I confirm the blockchain transaction
    Then the track should be minted as NFT
    And the track should appear in the catalog
    And my wallet should own token ID 1

  Scenario: Listener streams and pays for track
    Given track "Test Song" exists with PAID status
    And I am logged in as a listener with wallet "0xListener..."
    When I search for "Test Song"
    And I click play
    Then audio should start playing within 3 seconds
    And chunks should download via P2P network
    When I complete listening (>80% duration)
    Then a play event should be recorded
    And the track rating should increase

  Scenario: Artist receives royalty payment
    Given track "Test Song" has 100 completed plays
    When royalty distribution is triggered
    Then artist "0xArtist..." should receive payment
    And payment amount should match royalty split
    And transaction should be verifiable on blockchain
```

### TV-2: Dynamic Licensing State Machine

```gherkin
Feature: Track Lifecycle State Transitions
  As defined in TOTEM 1: "Dynamic Licensing (POPULAR → UNPOPULAR → REVIVAL)"

  Scenario: NEW to PAID transition on high engagement
    Given a track is in NEW state
    And the track has rating score >= 40
    When the rating evaluation job runs
    Then the track should transition to PAID state
    And access should require payment

  Scenario: PAID to FREE on declining engagement
    Given a track is in PAID state
    And the track rating drops below 20
    When the rating evaluation job runs
    Then the track should transition to FREE state
    And access should be free for all users

  Scenario: FREE to REVIVAL on resurgence
    Given a track is in FREE state
    And the track rating rises above 35
    When the rating evaluation job runs
    Then the track should transition to REVIVAL state
    And the track should be monitored for sustained interest

  Scenario: FREE to ARCHIVE after 90 days
    Given a track is in FREE state
    And the track has been in FREE state for 90+ days
    And the track rating remains below threshold
    When the daily cleanup job runs
    Then the track should transition to ARCHIVE state
    And the track should have minimal storage allocation
```

### TV-3: P2P Cost Reduction

```gherkin
Feature: P2P Distribution Economics
  As defined in TOTEM 1: "Популярность снижает издержки, а не увеличивает их"

  Scenario: Seed-only distribution for new track
    Given a newly published track with 0 listeners
    When the first listener plays the track
    Then 100% of chunks should come from seed node
    And seed_bytes_uploaded metric should increase

  Scenario: P2P takeover for popular track
    Given a track with 100+ active listeners
    When a new listener joins
    Then >50% of chunks should come from P2P peers
    And seed bandwidth should be lower than total bandwidth
    And p2p_ratio metric should exceed 0.5

  Scenario: Seed bandwidth savings measurement
    Given track "Popular Song" with 1000 daily plays
    When I query Prometheus metrics
    Then seed_bytes_uploaded should be < 50% of total_bytes_served
    And peer_upload_contribution should be > 50%
```

### TV-4: Gamification Economy

```gherkin
Feature: XP, Levels, Badges, and Multipliers
  As defined in TOTEM 4: "Gamification of Music Ratings"

  Scenario: User earns XP from listening
    Given I am a registered user with 0 XP
    When I complete listening to a track
    Then I should earn 2 XP (COMPLETE_TRACK action)
    And my total XP should be 2

  Scenario: Level progression
    Given I have 99 XP (Level 1)
    When I earn 1 more XP
    Then my level should become 2
    And I should receive a level-up notification

  Scenario: Badge award on threshold
    Given I have 1499 likes on my tracks
    When I receive 1 more like
    Then I should be awarded "Fan Favorite" badge
    And my earning multiplier should increase by 10%

  Scenario: Earning multiplier application
    Given I have "Viral Hit" badge (+10% multiplier)
    And I have "Super Seeder" badge (+5% multiplier)
    When I receive a royalty payment of $10
    Then my actual payment should be $11.50 (10 * 1.15)

  Scenario: Leaderboard position
    Given I am ranked #5 on XP leaderboard
    When I earn more XP than user ranked #4
    Then my rank should become #4
    And the leaderboard should update in real-time
```

### TV-5: Hybrid DSP Performance

```gherkin
Feature: Device-Adaptive DSP Processing
  As defined in TOTEM 2: "Powerful PC = 100% local, Weak Device = Cloud Assist"

  Scenario: Powerful device local processing
    Given I am using Chrome on a powerful desktop
    And crossOriginIsolated is true (SharedArrayBuffer available)
    When I load a WASM DSP plugin
    Then processing should happen locally in AudioWorklet
    And process() time should be < 2ms per 128-sample block
    And no cloud DSP requests should be made

  Scenario: Weak device detection
    Given I am using Safari on an old iPhone
    When the DAW initializes
    Then device capability should be detected as "low"
    And latency preset should default to "eco" (46ms)
    And complex plugins should show warning

  Scenario: Graceful degradation
    Given I am on a weak device
    When I try to load 10 plugins simultaneously
    Then system should warn about performance
    And suggest reducing plugin count
    And provide option for server-side rendering (future)
```

---

## Metrics Collection

### Key Performance Indicators (from TOTEM 3)

| Metric | Target | Source |
|--------|--------|--------|
| Artist payout per stream | ~$0.30 | Payment events |
| Time to payment | < 1 hour | Blockchain confirmation |
| P2P ratio (popular tracks) | > 50% | Prometheus |
| XP per active user/day | > 10 | Gamification DB |
| Badge conversion rate | > 5% | User stats |

### Automated Metric Tests

```typescript
// tests/totem/metrics.test.ts
describe('TOTEM Metrics Validation', () => {
  it('artist payout exceeds Spotify average', async () => {
    const avgPayout = await getAverageArtistPayout()
    expect(avgPayout).toBeGreaterThan(0.10) // 10x Spotify minimum
  })

  it('payment settles within 1 hour', async () => {
    const payment = await simulateRoyaltyPayment()
    const settlementTime = payment.confirmedAt - payment.initiatedAt
    expect(settlementTime).toBeLessThan(60 * 60 * 1000) // 1 hour in ms
  })

  it('popular track has >50% P2P distribution', async () => {
    const metrics = await getTrackDistributionMetrics('popular-track-id')
    expect(metrics.p2pRatio).toBeGreaterThan(0.5)
  })
})
```

---

## Test Data Requirements

### Fixtures
- Artist wallet with test ETH/MATIC
- Listener wallet with test ETH/MATIC
- Sample audio files (various lengths)
- Pre-seeded tracks in different states
- Users at various XP/level thresholds

### Mock Services
- Blockchain (Hardhat local node)
- P2P network (mocked peers)
- Payment processor (fake payments in dev)

---

## Traceability Matrix

| TOTEM Claim | Test ID | Verified |
|-------------|---------|----------|
| "Нет посредников — артист → слушатель напрямую" | TV-1.3 | ⬜ |
| "P2P снижает инфраструктурные расходы" | TV-3.2, TV-3.3 | ⬜ |
| "NFT = ownership — артист владеет" | TV-1.1 | ⬜ |
| "Dynamic pricing — экономика адаптируется" | TV-2.* | ⬜ |
| "Popularity = Reward" | TV-4.3, TV-4.4 | ⬜ |
| "Unpopularity = Freedom" | TV-2.2, TV-2.4 | ⬜ |
| "< 10ms latency possible" | TV-5.1 | ⬜ |

---

*TOTEM Acceptance Tests — DAWW3 QA*
