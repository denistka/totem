# TOTEM Acceptance Tests — Detailed Specifications

> **Purpose:** Comprehensive validation of all TOTEM vision claims  
> **Source:** totem/1-VISION.md, totem/2-ARCHITECTURE.md, totem/3-ECONOMY.md, totem/4-GAMIFICATION.md  
> **Priority:** 🔴 P0 — Proves Product-Market Fit

---

## Overview

This document provides **detailed, executable test specifications** for all TOTEM validation tests. Each test traces back to specific vision claims and includes:

- **Gherkin scenarios** (Given/When/Then)
- **Test data requirements**
- **Expected results with metrics**
- **Verification queries** (SQL, API, Prometheus)
- **Pass/fail criteria**

---

## TV-1: Complete Creation-to-Monetization Cycle

### TOTEM Claim
> **Vision 1.2:** "Единая экосистема где создание → распространение → монетизация происходит в одной платформе, без посредников"

**English:** "Unified ecosystem where creation → distribution → monetization happens in one platform, without intermediaries"

### Why This Matters
This is the **core value proposition**. If TV-1 fails, the entire platform fails.

---

### Test Case 1.1: Artist Registration and Wallet Connection

```gherkin
Feature: Artist Onboarding
  As a music artist
  I want to register and connect my wallet
  So that I can publish tracks and receive payments

Scenario: Successful artist registration
  Given I navigate to /register
  When I fill in:
    | Field        | Value                |
    | Email        | artist@test.com      |
    | Password     | SecurePass123!       |
    | Display Name | Test Artist          |
    | Role         | artist               |
  And I click "Sign Up"
  Then I should see "Welcome, Test Artist"
  And my user account should exist in the database
  
Scenario: Wallet connection
  Given I am logged in as an artist
  When I click "Connect Wallet"
  And I approve the connection in MetaMask
  Then wallet address should be displayed
  And wallet should be linked to my account
```

**Verification:**
```sql
-- Check user created
SELECT id, email, displayName, role, walletAddress 
FROM "User" 
WHERE email = 'artist@test.com';

-- Verify wallet linked
SELECT walletAddress IS NOT NULL as wallet_connected
FROM "User"
WHERE email = 'artist@test.com';
```

**Expected:** User record exists, `wallet_connected = true`

---

### Test Case 1.2: Track Creation in DAW

```gherkin
Feature: Browser-Based DAW
  As an artist
  I want to create tracks in my browser
  So that I don't need desktop software

Scenario: Upload audio file
  Given I am on the DAW page
  When I click "Import Audio"
  And I select "test-audio.wav" (5-second, 44.1kHz stereo)
  Then audio waveform should appear on timeline
  And audio should be decoded to memory buffer
  
Scenario: Apply WASM DSP effect
  Given audio is loaded
  When I add "GainProcessor" plugin
  And I set gain parameter to 0.8
  Then plugin should load in AudioWorklet
  And gain should be applied to audio preview
  
Scenario: Preview playback
  Given audio and effects are ready
  When I click "Play"
  Then audio should start playing within 1 second
  And playback position should update in real-time
  When I click "Stop"
  Then audio should stop immediately
```

**Verification:**
```typescript
// Check AudioContext is running
const ctx = getAudioContextManager().context
expect(ctx.state).toBe('running')

// Check plugin loaded
const mixer = getMixer()
const track = mixer.getTrack('track-1')
expect(track.plugins.length).toBeGreaterThan(0)
```

**Expected:** Audio plays, effects process in real-time, <10ms latency

---

### Test Case 1.3: Track Publishing and NFT Minting

```gherkin
Feature: Publish to Blockchain
  As an artist
  I want to publish my track as an NFT
  So that I own the rights on-chain

Scenario: Fill track metadata
  Given I finished creating my track
  When I click "Publish"
  Then I should see a publish form
  When I fill in:
    | Field       | Value                     |
    | Title       | Test Song                 |
    | Description | A test track for TV-1     |
    | Genre       | Electronic                |
    | Price       | 0.01 ETH                  |
  And I upload cover art "cover-art.jpg"
  And I click "Confirm Publish"
  
Scenario: NFT minting transaction
  Given I submitted the publish form
  Then I should see "Confirm Transaction" modal
  When I confirm in MetaMask
  Then I should see "Publishing..." spinner
  And blockchain transaction should be submitted
  When transaction confirms (10-30 seconds)
  Then I should see "Track Published!"
  And NFT should be minted with token ID
  And I should own the NFT
```

**Verification:**
```sql
-- Check track created
SELECT id, title, userId, state, nftTokenId 
FROM "Track" 
WHERE title = 'Test Song';

-- Verify NFT metadata
SELECT nftTokenId, nftContractAddress 
FROM "Track" 
WHERE title = 'Test Song';
```

```javascript
// Check NFT on blockchain
const contract = new ethers.Contract(nftContractAddress, TrackNFT.abi, provider)
const owner = await contract.ownerOf(tokenId)
expect(owner).toBe(artistWalletAddress)

const tokenURI = await contract.tokenURI(tokenId)
const metadata = await fetch(tokenURI).then(r => r.json())
expect(metadata.name).toBe('Test Song')
```

**Expected:** Track in DB, NFT minted, artist is owner

---

### Test Case 1.4: Track Discovery and Playback

```gherkin
Feature: Listener Experience
  As a listener
  I want to discover and play tracks
  So that I can enjoy music

Scenario: Search for track
  Given I am on /explore page
  When I type "Test Song" in search box
  Then I should see "Test Song" in results
  And track card should show artist name
  And track card should show cover art
  
Scenario: Play track via P2P
  Given I click on "Test Song"
  When track page loads
  And I click "Play" button
  Then P2P connection should establish (within 3 seconds)
  And audio chunks should start downloading
  And audio should start playing (within 5 seconds)
  And play position slider should update
  
Scenario: Complete playback
  Given track is playing
  When playback reaches 80%+ of track duration
  Then play event should be recorded
  And track rating should increase
  And artist should earn XP
```

**Verification:**
```sql
-- Check play event
SELECT id, trackId, userId, completionRate, createdAt
FROM "PlayEvent"
WHERE trackId = 'track-id'
ORDER BY createdAt DESC
LIMIT 1;

-- Expected: completionRate >= 0.80

-- Check artist XP increased
SELECT totalXP FROM "User" WHERE id = 'artist-id';
-- Expected: totalXP increased by 2 (COMPLETE_TRACK action)
```

**P2P Metrics:**
```bash
# Check P2P delivered chunks
curl http://localhost:5001/metrics | grep daww3_p2p_ratio
# Expected: daww3_p2p_ratio{trackId="..."} 0.0 (first play, no peers yet)
```

**Expected:** Track plays, event recorded, P2P working

---

### Test Case 1.5: Royalty Payment

```gherkin
Feature: Artist Payment
  As an artist
  I want to receive instant payments
  So that I don't wait months like Spotify

Scenario: Play triggers royalty
  Given my track has 1 completed play
  When royalty calculation job runs (hourly)
  Then I should have 1 pending earning
  And earning amount should be ~$0.30
  
Scenario: Payment distribution
  Given I have pending earnings
  When payment distribution job runs
  Then blockchain transaction should execute
  And my earning status should become "PAID"
  And I should receive funds in my wallet
  
Scenario: Verify payment timing
  Given play event at time T
  When payment settles at time T+X
  Then X should be < 60 minutes
  (vs Spotify 60-90 days)
```

**Verification:**
```sql
-- Check earning created
SELECT id, userId, trackId, type, amount, status, createdAt
FROM "Earning"
WHERE trackId = 'track-id'
AND type = 'ROYALTY';

-- Expected: status = 'PENDING', amount ~= 0.30

-- Check payment settled
SELECT id, status, paidAt, 
  EXTRACT(EPOCH FROM (paidAt - createdAt))/60 as settlement_minutes
FROM "Earning"
WHERE id = 'earning-id';

-- Expected: status = 'PAID', settlement_minutes < 60
```

```javascript
// Check wallet balance increased
const balanceBefore = await provider.getBalance(artistWallet)
// ... payment happens ...
const balanceAfter = await provider.getBalance(artistWallet)
expect(balanceAfter).toBeGreaterThan(balanceBefore)
```

**Expected:** Payment within 1 hour, artist receives funds

---

### TV-1 Summary

**✅ Pass Criteria:**
- All 5 sub-tests pass
- Artist journey <10 minutes end-to-end
- Payment timing <60 minutes
- Zero manual steps (fully automated)

**📊 Key Metrics:**
- Time to publish: <5 minutes
- Time to first play: <10 seconds
- P2P connection: <3 seconds
- Payment timing: <60 minutes

---

## TV-2: Dynamic Licensing State Machine

### TOTEM Claim
> **Vision 1.3:** "Dynamic Licensing: популярные треки стоят денег, непопулярные становятся бесплатными"

**English:** "Dynamic Licensing: popular tracks cost money, unpopular tracks become free"

### State Diagram

```
     NEW (rating 0)
      ↓ plays >= 40 rating
     PAID ($$$ access)
      ↓ rating < 20
     FREE (open access)
      ↓ rating >= 35
   REVIVAL (monitoring)
      ↓ sustained 30d
     PAID (back to paid)
     
     FREE (90d + rating < 10)
      ↓
   ARCHIVE (minimal storage)
```

---

### Test Case 2.1: NEW → PAID Transition

```gherkin
Feature: Track Becomes Paid on Popularity
  As the system
  I want to transition NEW tracks to PAID
  So that popular content generates revenue

Scenario: High engagement triggers PAID
  Given a track in NEW state with rating 39
  When 5 more users complete playback (2 points each)
  Then track rating should become 49
  When hourly rating job runs
  And daily state transition job runs
  Then track should transition to PAID state
  And track.state should be "PAID"
  And track.stateEnteredAt should be now
  
Scenario: PAID tracks require payment
  Given a track in PAID state
  When a listener without payment tries to play
  Then play should be blocked
  And "Payment Required" message should show
```

**Verification:**
```sql
-- Simulate rating increase
UPDATE "Track" 
SET totalRating = 49 
WHERE id = 'track-id';

-- Trigger state transition (or wait for cron)
-- Call API: POST /admin/jobs/state-transition

-- Verify state changed
SELECT state, stateEnteredAt, totalRating
FROM "Track"
WHERE id = 'track-id';

-- Expected: state = 'PAID', stateEnteredAt = recent timestamp
```

**Expected:** Track transitions to PAID at rating 40+

---

### Test Case 2.2: PAID → FREE Transition

```gherkin
Feature: Unpopular Tracks Become Free
  As the system
  I want to transition PAID tracks to FREE
  So that declining content remains accessible

Scenario: Low engagement triggers FREE
  Given a track in PAID state with rating 25
  When engagement declines and rating drops to 18
  Then state transition job should detect rating < 20
  And track should transition to FREE state
  
Scenario: FREE tracks are accessible to all
  Given a track in FREE state
  When any listener clicks play
  Then playback should start immediately
  And no payment should be required
```

**Verification:**
```sql
-- Simulate rating decline
UPDATE "Track" 
SET totalRating = 18 
WHERE id = 'track-id' 
AND state = 'PAID';

-- Trigger state transition
-- Call API: POST /admin/jobs/state-transition

-- Verify state changed
SELECT state, totalRating
FROM "Track"
WHERE id = 'track-id';

-- Expected: state = 'FREE'
```

**Expected:** Track transitions to FREE at rating <20

---

### Test Case 2.3: FREE → REVIVAL Transition

```gherkin
Feature: Track Revival on Resurgence
  As the system
  I want to detect reviving interest
  So that tracks can return to PAID status

Scenario: Resurgence triggers REVIVAL
  Given a track in FREE state with rating 30
  When track gains sudden popularity
  And rating rises to 37
  Then state transition should detect rating >= 35
  And track should transition to REVIVAL state
  And track should be monitored for sustained interest
```

**Verification:**
```sql
-- Simulate resurgence
UPDATE "Track" 
SET totalRating = 37 
WHERE id = 'track-id' 
AND state = 'FREE';

-- Trigger state transition

-- Verify state changed
SELECT state, totalRating, stateEnteredAt
FROM "Track"
WHERE id = 'track-id';

-- Expected: state = 'REVIVAL'
```

**Expected:** Track transitions to REVIVAL at rating 35+

---

### Test Case 2.4: FREE → ARCHIVE Transition

```gherkin
Feature: Archive Old Unpopular Tracks
  As the system
  I want to archive tracks with sustained low interest
  So that storage costs are minimized

Scenario: 90 days of low engagement
  Given a track in FREE state for 91 days
  And rating remains at 8
  Then state transition should check:
    - state = FREE
    - stateEnteredAt <= now() - 90 days
    - totalRating < 10
  And track should transition to ARCHIVE
  And track should have minimal storage allocation
```

**Verification:**
```sql
-- Simulate 90+ days old
UPDATE "Track" 
SET 
  state = 'FREE',
  stateEnteredAt = NOW() - INTERVAL '91 days',
  totalRating = 8
WHERE id = 'track-id';

-- Trigger state transition

-- Verify archived
SELECT state, 
  EXTRACT(DAYS FROM (NOW() - stateEnteredAt)) as days_in_free,
  totalRating
FROM "Track"
WHERE id = 'track-id';

-- Expected: state = 'ARCHIVE'
```

**Expected:** Track archives after 90 days with rating <10

---

### Test Case 2.5: REVIVAL → PAID Transition

```gherkin
Feature: Sustained Revival Returns to Paid
  As the system
  I want to return REVIVAL tracks to PAID
  So that consistently popular content monetizes

Scenario: Sustained popularity for 30 days
  Given a track in REVIVAL state for 31 days
  And rating is sustained at 45
  Then state transition should check:
    - state = REVIVAL
    - stateEnteredAt <= now() - 30 days
    - totalRating > 40
  And track should transition back to PAID
```

**Verification:**
```sql
-- Simulate 30+ days sustained
UPDATE "Track" 
SET 
  state = 'REVIVAL',
  stateEnteredAt = NOW() - INTERVAL '31 days',
  totalRating = 45
WHERE id = 'track-id';

-- Trigger state transition

-- Verify back to PAID
SELECT state, totalRating
FROM "Track"
WHERE id = 'track-id';

-- Expected: state = 'PAID'
```

**Expected:** Track returns to PAID after 30 days at rating 40+

---

### TV-2 Summary

**✅ Pass Criteria:**
- All 5 state transitions work correctly
- State machine respects thresholds (40, 20, 35, 10)
- Time-based transitions work (90 days, 30 days)
- Access control matches state (PAID blocked, FREE open)

**📊 Key Metrics:**
- NEW→PAID threshold: 40 rating points
- PAID→FREE threshold: 20 rating points
- FREE→REVIVAL threshold: 35 rating points
- FREE→ARCHIVE: 90 days + <10 rating
- REVIVAL→PAID: 30 days + >40 rating

---

## TV-3: P2P Cost Reduction

### TOTEM Claim
> **Architecture 2.1:** "P2P Architecture: популярность снижает издержки, а не увеличивает их"

**English:** "P2P Architecture: popularity reduces costs, not increases them"

### Economics Model

```
Traditional CDN:
  Cost = $0.10 per GB * Total GB served
  1000 plays * 5MB = 5000 MB = 5 GB
  Cost = $0.50

P2P with 50% ratio:
  Seed serves: 2.5 GB * $0.10 = $0.25
  Peers serve: 2.5 GB * $0.00 = $0.00
  Cost = $0.25 (50% savings)

P2P with 80% ratio:
  Seed serves: 1 GB * $0.10 = $0.10
  Peers serve: 4 GB * $0.00 = $0.00
  Cost = $0.10 (80% savings)
```

---

### Test Case 3.1: Seed-Only Distribution (New Track)

```gherkin
Feature: Initial Distribution via Seed Node
  As the system
  I want seed node to serve new tracks
  So that first listeners can play

Scenario: First listener connects to seed
  Given a newly published track with 0 listeners
  When the first listener clicks play
  Then P2P manager should request chunks from seed
  And 100% of chunks should come from seed node
  And daww3_seed_bytes_uploaded metric should increase
  And daww3_p2p_ratio should be 0.0
```

**Verification:**
```bash
# Before play
curl http://localhost:5001/metrics | grep 'daww3_seed_bytes_uploaded{trackId="track-123"}'
# Expected: 0

# After play
curl http://localhost:5001/metrics | grep 'daww3_seed_bytes_uploaded{trackId="track-123"}'
# Expected: ~5000000 (5MB track)

# P2P ratio
curl http://localhost:5001/metrics | grep 'daww3_p2p_ratio{trackId="track-123"}'
# Expected: 0.0 (no peers yet)
```

**Expected:** 100% seed bandwidth for first play

---

### Test Case 3.2: P2P Takeover (Popular Track)

```gherkin
Feature: Peer Distribution Reduces Seed Load
  As the system
  I want peers to serve chunks to each other
  So that seed bandwidth decreases with popularity

Scenario: Simulate 10 concurrent listeners
  Given a track with 10 active peer connections
  When listener #11 joins
  Then P2P manager should discover 10 peers
  And chunks should be requested from peers
  And >30% of chunks should come from peers
  And daww3_peer_bytes_uploaded should increase
  
Scenario: Simulate 100 concurrent listeners
  Given a track with 100 active peer connections
  When listener #101 joins
  Then >50% of chunks should come from peers
  And daww3_p2p_ratio should be >= 0.5
```

**Verification:**
```bash
# Prometheus query for P2P ratio
curl -s "http://localhost:9090/api/v1/query?query=daww3_p2p_ratio{trackId=\"track-123\"}"

# Expected results by listener count:
# 1-5 listeners: 0-20% P2P
# 10-50 listeners: 20-50% P2P
# 100+ listeners: 50-80% P2P
```

**Expected:** P2P ratio increases with popularity

---

### Test Case 3.3: Infrastructure Savings

```gherkin
Feature: Calculate Cost Savings
  As the business
  I want to prove P2P saves money
  So that the model is sustainable

Scenario: Calculate bandwidth costs
  Given track "Popular Song" with 1000 plays/day
  And average track size 5 MB
  And CDN cost $0.10 per GB
  When I calculate:
    - Total bandwidth = 1000 * 5 MB = 5 GB/day
    - CDN cost = 5 GB * $0.10 = $0.50/day
    - Seed served = 1 GB (20%)
    - Peers served = 4 GB (80%)
    - Actual cost = 1 GB * $0.10 = $0.10/day
  Then savings = $0.40/day (80%)
  And monthly savings = $12/track
```

**Verification:**
```sql
-- Query bandwidth stats
SELECT 
  t.title,
  COUNT(pe.id) as total_plays,
  AVG(pe.bytesDownloaded) as avg_bytes,
  (COUNT(pe.id) * AVG(pe.bytesDownloaded)) / 1073741824.0 as total_gb
FROM "Track" t
JOIN "PlayEvent" pe ON pe.trackId = t.id
WHERE t.id = 'track-id'
AND pe.createdAt >= NOW() - INTERVAL '1 day'
GROUP BY t.id, t.title;
```

```bash
# Prometheus cost calculation
curl -s "http://localhost:9090/api/v1/query?query=
  (daww3_seed_bytes_uploaded{trackId='track-123'} / 1073741824) * 0.10
" | jq '.data.result[0].value[1]'
# Returns seed cost in USD

curl -s "http://localhost:9090/api/v1/query?query=
  ((daww3_seed_bytes_uploaded + daww3_peer_bytes_uploaded) / 1073741824) * 0.10
" | jq '.data.result[0].value[1]'
# Returns CDN cost if no P2P

# Savings = CDN cost - Seed cost
```

**Expected:** 50-80% cost savings for popular tracks

---

### TV-3 Summary

**✅ Pass Criteria:**
- New tracks: 100% seed bandwidth
- 10 listeners: >20% P2P ratio
- 100 listeners: >50% P2P ratio
- Cost savings: >50% vs CDN

**📊 Key Metrics:**
- P2P ratio target: >50% for popular tracks
- Infrastructure savings: >50% for popular tracks
- Seed bandwidth: decreases with popularity
- Peer upload contribution: increases with swarm size

---

## Traceability Matrix

| TOTEM Claim | Test ID | Evidence | Status |
|-------------|---------|----------|--------|
| "Complete ecosystem" | TV-1.1-1.5 | E2E test, DB records, blockchain | ⬜ |
| "No intermediaries" | TV-1.5 | Direct wallet payment | ⬜ |
| "Dynamic licensing" | TV-2.1-2.5 | State machine tests | ⬜ |
| "Popularity = PAID" | TV-2.1 | Rating → PAID transition | ⬜ |
| "Unpopularity = FREE" | TV-2.2 | Rating → FREE transition | ⬜ |
| "P2P reduces costs" | TV-3.1-3.3 | Prometheus metrics | ⬜ |
| "100x Spotify payout" | TV-6 | Payment analysis | ⬜ |
| "Instant payment" | TV-1.5 | <60min settlement | ⬜ |
| "Gamification works" | TV-4 | XP, badges, multipliers | ⬜ |

---

## Execution Checklist

### Pre-Flight

- [ ] All Docker services running
- [ ] API healthy (`/health` returns 200)
- [ ] Web app accessible (http://localhost:3000)
- [ ] Test fixtures generated (audio + image)
- [ ] Playwright browsers installed
- [ ] Database migrations applied

### Test Execution

- [ ] TV-1: Complete artist journey
- [ ] TV-2: Dynamic licensing state machine
- [ ] TV-3: P2P cost reduction
- [ ] TV-4: Gamification economy
- [ ] TV-5: Hybrid DSP (skip if Rust N/A)
- [ ] TV-6: Spotify comparison

### Post-Flight

- [ ] All tests passing (green)
- [ ] Playwright HTML report generated
- [ ] TOTEM-VALIDATION-REPORT.md updated
- [ ] Metrics collected and analyzed
- [ ] Evidence documented (screenshots, videos, logs)

---

**Last Updated:** 2026-01-28  
**Maintainer:** DAWW3 QA Team  
**Priority:** 🔴 P0 CRITICAL
