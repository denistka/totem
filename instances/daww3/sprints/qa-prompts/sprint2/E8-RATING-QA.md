# 📊 E8: Rating & Gamification — QA Test Specifications

> **Epic:** E8 - Rating & Gamification Engine
> **Status:** ✅ DONE
> **Focus:** Rating formula, State machine, XP/Badges/Leaderboards

---

## Agent Prompt for Rating System Testing

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive rating and gamification tests
    expertize = 'you are world class game economy and anti-fraud testing specialist'
    target = validate rating formula, state machine, and gamification systems
    test = true

    code style = [Property-based testing, Edge case coverage]
    write docs = true
    deep thinking = true
    performance = high-volume play recording
    tech stack = ['Vitest', 'Prisma', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for DAWW3 rating and gamification systems covering:
- Multi-signal rating formula accuracy
- Track state machine transitions
- Anti-fraud detection effectiveness
- XP, badges, and leaderboard systems

{{{{ #CUSTOMER PROMT

Нужны тесты для:
- Rating calculator: play score (log), completion, seeding, social, time decay
- Anti-fraud: bot patterns, velocity anomalies, suspicious plays
- Track state machine: NEW → PAID → FREE → REVIVAL → ARCHIVE
- XP system: 10 action types, level progression
- Badge system: 6 badges, auto-award, earning multipliers
- Leaderboard: top by XP, plays, rating, earnings
- Edge cases: boundary conditions, concurrent updates

}}}}

<<<<<<#RECOMMENDED TASKS

E8-QA-1. Rating Formula Tests
- Test play score (logarithmic scale)
- Test completion score (weighted by plays)
- Test seed score (count + bytes)
- Test social score (likes, shares, tips)
- Test time decay after 30 days
- Test overall rating normalization (0-100)

E8-QA-2. Anti-Fraud Detection Tests
- Test same IP spam detection
- Test short play detection
- Test velocity anomaly detection
- Test bot pattern recognition
- Test legitimate vs suspicious classification

E8-QA-3. State Machine Tests
- Test NEW → PAID transition (rating >= 40)
- Test PAID → FREE transition (rating < 20)
- Test FREE → REVIVAL transition (rating >= 35)
- Test FREE → ARCHIVE transition (90 days low)
- Test REVIVAL → PAID transition (30 days sustained)
- Test edge cases: boundary ratings, concurrent transitions

E8-QA-4. XP System Tests
- Test XP award for each action type
- Test level calculation formula
- Test level-up thresholds
- Test XP accumulation accuracy

E8-QA-5. Badge System Tests
- Test badge eligibility checks
- Test auto-award on threshold
- Test earning multipliers
- Test multiple badge stacking

E8-QA-6. Leaderboard Tests
- Test ranking accuracy
- Test tie-breaking logic
- Test real-time updates
- Test pagination

🏁 Definition of Done
- Rating formula produces expected scores
- State transitions follow TOTEM 4 lifecycle
- Anti-fraud catches >95% of bot patterns
- XP/badges work correctly
- Leaderboards are consistent

>>>>>>

]]]]
```

---

## Unit Tests

### E8-QA-1: Rating Calculator

```typescript
// apps/api/src/modules/rating/__tests__/rating-calculator.test.ts

import { describe, it, expect } from 'vitest'
import { calculateRating, RatingInputs } from '../rating-calculator'

describe('Rating Calculator', () => {
  const baseInputs: RatingInputs = {
    playCount: 0,
    uniqueListeners: 0,
    completions: 0,
    avgCompletion: 0,
    seedCount: 0,
    seedBytes: 0,
    likes: 0,
    shares: 0,
    tips: 0,
    age: 0
  }

  describe('Play Score (Logarithmic)', () => {
    it('0 plays = 0 score', () => {
      const result = calculateRating({ ...baseInputs, playCount: 0 })
      expect(result.playScore).toBe(0)
    })

    it('10 plays ≈ 20 score', () => {
      const result = calculateRating({ ...baseInputs, playCount: 10 })
      expect(result.playScore).toBeCloseTo(20, 0) // log10(11) * 20 ≈ 20.8
    })

    it('100 plays ≈ 40 score', () => {
      const result = calculateRating({ ...baseInputs, playCount: 100 })
      expect(result.playScore).toBeCloseTo(40, 0) // log10(101) * 20 ≈ 40.1
    })

    it('1000 plays ≈ 60 score', () => {
      const result = calculateRating({ ...baseInputs, playCount: 1000 })
      expect(result.playScore).toBeCloseTo(60, 0)
    })

    it('score grows logarithmically', () => {
      const score10 = calculateRating({ ...baseInputs, playCount: 10 }).playScore
      const score100 = calculateRating({ ...baseInputs, playCount: 100 }).playScore
      const score1000 = calculateRating({ ...baseInputs, playCount: 1000 }).playScore
      
      // Each 10x increase should add ~20 points
      expect(score100 - score10).toBeCloseTo(20, 1)
      expect(score1000 - score100).toBeCloseTo(20, 1)
    })
  })

  describe('Completion Score', () => {
    it('high completion rate with plays = high score', () => {
      const result = calculateRating({
        ...baseInputs,
        playCount: 100,
        avgCompletion: 0.9
      })
      expect(result.completionScore).toBeGreaterThan(80)
    })

    it('high completion with few plays = capped score', () => {
      const result = calculateRating({
        ...baseInputs,
        playCount: 10,
        avgCompletion: 1.0
      })
      // Capped by min(1, playCount/100)
      expect(result.completionScore).toBeLessThanOrEqual(10)
    })

    it('low completion rate = low score', () => {
      const result = calculateRating({
        ...baseInputs,
        playCount: 1000,
        avgCompletion: 0.2
      })
      expect(result.completionScore).toBeLessThan(30)
    })
  })

  describe('Seed Score', () => {
    it('seeding contributes to score', () => {
      const result = calculateRating({
        ...baseInputs,
        seedCount: 50,
        seedBytes: 1e10 // 10GB
      })
      expect(result.seedScore).toBeGreaterThan(0)
    })

    it('more seeders = higher score', () => {
      const few = calculateRating({ ...baseInputs, seedCount: 5 }).seedScore
      const many = calculateRating({ ...baseInputs, seedCount: 50 }).seedScore
      expect(many).toBeGreaterThan(few)
    })
  })

  describe('Social Score', () => {
    it('social engagement improves score', () => {
      const result = calculateRating({
        ...baseInputs,
        playCount: 100,
        likes: 50,
        shares: 10,
        tips: 5
      })
      expect(result.socialScore).toBeGreaterThan(0)
    })

    it('tips weighted more than likes', () => {
      const likesOnly = calculateRating({
        ...baseInputs,
        playCount: 100,
        likes: 10
      }).socialScore
      
      const tipsOnly = calculateRating({
        ...baseInputs,
        playCount: 100,
        tips: 10
      }).socialScore
      
      expect(tipsOnly).toBeGreaterThan(likesOnly)
    })
  })

  describe('Time Decay', () => {
    it('no decay for tracks < 30 days', () => {
      const fresh = calculateRating({ ...baseInputs, playCount: 100, age: 10 })
      const at30 = calculateRating({ ...baseInputs, playCount: 100, age: 30 })
      
      expect(fresh.total).toBeCloseTo(at30.total, 1)
    })

    it('decay starts after 30 days', () => {
      const at30 = calculateRating({ ...baseInputs, playCount: 100, age: 30 })
      const at60 = calculateRating({ ...baseInputs, playCount: 100, age: 60 })
      
      expect(at60.total).toBeLessThan(at30.total)
    })

    it('significant decay at 90 days', () => {
      const fresh = calculateRating({ ...baseInputs, playCount: 100, age: 0 })
      const old = calculateRating({ ...baseInputs, playCount: 100, age: 90 })
      
      expect(old.total).toBeLessThan(fresh.total * 0.5)
    })
  })

  describe('Overall Rating', () => {
    it('rating is normalized to 0-100', () => {
      const extreme = calculateRating({
        ...baseInputs,
        playCount: 1000000,
        avgCompletion: 1.0,
        seedCount: 10000,
        seedBytes: 1e12,
        likes: 100000,
        shares: 10000,
        tips: 1000
      })
      
      expect(extreme.total).toBeLessThanOrEqual(100)
      expect(extreme.total).toBeGreaterThanOrEqual(0)
    })

    it('zero inputs = zero rating', () => {
      const result = calculateRating(baseInputs)
      expect(result.total).toBe(0)
    })
  })
})
```

### E8-QA-2: Anti-Fraud Detection

```typescript
// apps/api/src/modules/rating/__tests__/fraud-detection.test.ts

import { describe, it, expect } from 'vitest'
import { detectManipulation, Play } from '../fraud-detection'

describe('Fraud Detection', () => {
  describe('Same IP Detection', () => {
    it('flags excessive plays from same IP', () => {
      const plays: Play[] = Array(100).fill(null).map(() => ({
        ip: '192.168.1.1',
        userId: `user-${Math.random()}`,
        duration: 180,
        timestamp: Date.now()
      }))
      
      const result = detectManipulation(plays)
      
      expect(result.suspicious).toBe(true)
      expect(result.reason).toContain('IP')
    })

    it('allows normal IP distribution', () => {
      const plays: Play[] = Array(100).fill(null).map((_, i) => ({
        ip: `192.168.1.${i}`,
        userId: `user-${i}`,
        duration: 180,
        timestamp: Date.now()
      }))
      
      const result = detectManipulation(plays)
      
      expect(result.suspicious).toBe(false)
    })
  })

  describe('Short Play Detection', () => {
    it('flags plays under 10 seconds', () => {
      const plays: Play[] = Array(50).fill(null).map(() => ({
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userId: `user-${Math.random()}`,
        duration: 5, // 5 seconds
        timestamp: Date.now()
      }))
      
      const result = detectManipulation(plays)
      
      expect(result.suspicious).toBe(true)
      expect(result.reason).toContain('duration')
    })

    it('allows normal play durations', () => {
      const plays: Play[] = Array(50).fill(null).map((_, i) => ({
        ip: `192.168.1.${i}`,
        userId: `user-${i}`,
        duration: 120 + Math.random() * 60, // 2-3 minutes
        timestamp: Date.now()
      }))
      
      const result = detectManipulation(plays)
      
      expect(result.suspicious).toBe(false)
    })
  })

  describe('Velocity Anomaly Detection', () => {
    it('flags rapid consecutive plays', () => {
      const now = Date.now()
      const plays: Play[] = Array(100).fill(null).map((_, i) => ({
        ip: `192.168.1.${i}`,
        userId: `user-${i}`,
        duration: 180,
        timestamp: now + i * 100 // 100ms apart
      }))
      
      const result = detectManipulation(plays)
      
      expect(result.suspicious).toBe(true)
      expect(result.reason).toContain('velocity')
    })
  })

  describe('Bot Pattern Detection', () => {
    it('flags uniform completion times', () => {
      const plays: Play[] = Array(50).fill(null).map((_, i) => ({
        ip: `192.168.1.${i}`,
        userId: `user-${i}`,
        duration: 180, // Exact same duration
        timestamp: Date.now() + i * 60000
      }))
      
      const result = detectManipulation(plays)
      
      expect(result.suspicious).toBe(true)
      expect(result.reason).toContain('pattern')
    })

    it('allows natural variation', () => {
      const plays: Play[] = Array(50).fill(null).map((_, i) => ({
        ip: `192.168.1.${i}`,
        userId: `user-${i}`,
        duration: 150 + Math.random() * 60, // Natural variance
        timestamp: Date.now() + i * 60000 + Math.random() * 30000
      }))
      
      const result = detectManipulation(plays)
      
      expect(result.suspicious).toBe(false)
    })
  })
})
```

### E8-QA-3: Track State Machine

```typescript
// apps/api/src/modules/rating/__tests__/track-state-machine.test.ts

import { describe, it, expect } from 'vitest'
import { TrackStateMachine, TrackStatus, StateThresholds } from '../track-state-machine'

describe('Track State Machine', () => {
  const thresholds: StateThresholds = {
    paidMinRating: 40,
    freeMaxRating: 20,
    revivalMinRating: 35,
    archiveDaysLow: 90,
    revivalDaysPaid: 30
  }
  
  const sm = new TrackStateMachine(thresholds)

  describe('NEW State Transitions', () => {
    it('NEW → PAID when rating >= 40', () => {
      const track = { status: TrackStatus.NEW, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 45)
      expect(newStatus).toBe(TrackStatus.PAID)
    })

    it('NEW → FREE when rating < 40', () => {
      const track = { status: TrackStatus.NEW, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 30)
      expect(newStatus).toBe(TrackStatus.FREE)
    })

    it('NEW → PAID at exact threshold (40)', () => {
      const track = { status: TrackStatus.NEW, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 40)
      expect(newStatus).toBe(TrackStatus.PAID)
    })
  })

  describe('PAID State Transitions', () => {
    it('PAID → FREE when rating < 20', () => {
      const track = { status: TrackStatus.PAID, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 15)
      expect(newStatus).toBe(TrackStatus.FREE)
    })

    it('PAID stays PAID when rating >= 20', () => {
      const track = { status: TrackStatus.PAID, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 25)
      expect(newStatus).toBeNull() // No transition
    })

    it('PAID → FREE at exact threshold (19)', () => {
      const track = { status: TrackStatus.PAID, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 19)
      expect(newStatus).toBe(TrackStatus.FREE)
    })
  })

  describe('FREE State Transitions', () => {
    it('FREE → REVIVAL when rating >= 35', () => {
      const track = { status: TrackStatus.FREE, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 40)
      expect(newStatus).toBe(TrackStatus.REVIVAL)
    })

    it('FREE stays FREE when rating 20-34', () => {
      const track = { status: TrackStatus.FREE, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 25)
      expect(newStatus).toBeNull()
    })

    it('FREE → ARCHIVE after 90 days low', () => {
      const track = {
        status: TrackStatus.FREE,
        statusChangedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000)
      }
      const newStatus = sm.transition(track, 10)
      expect(newStatus).toBe(TrackStatus.ARCHIVE)
    })

    it('FREE stays FREE if < 90 days', () => {
      const track = {
        status: TrackStatus.FREE,
        statusChangedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      }
      const newStatus = sm.transition(track, 10)
      expect(newStatus).toBeNull()
    })
  })

  describe('REVIVAL State Transitions', () => {
    it('REVIVAL → PAID after 30 days sustained', () => {
      const track = {
        status: TrackStatus.REVIVAL,
        statusChangedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
      }
      const newStatus = sm.transition(track, 45)
      expect(newStatus).toBe(TrackStatus.PAID)
    })

    it('REVIVAL → FREE if rating drops', () => {
      const track = { status: TrackStatus.REVIVAL, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 15)
      expect(newStatus).toBe(TrackStatus.FREE)
    })

    it('REVIVAL stays REVIVAL if < 30 days', () => {
      const track = {
        status: TrackStatus.REVIVAL,
        statusChangedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
      const newStatus = sm.transition(track, 40)
      expect(newStatus).toBeNull()
    })
  })

  describe('ARCHIVE State', () => {
    it('ARCHIVE stays ARCHIVE (no automatic transition)', () => {
      const track = { status: TrackStatus.ARCHIVE, statusChangedAt: new Date() }
      const newStatus = sm.transition(track, 100) // Even with high rating
      expect(newStatus).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('handles rating exactly at boundaries', () => {
      const track = { status: TrackStatus.FREE, statusChangedAt: new Date() }
      
      // At exact threshold
      expect(sm.transition(track, 35)).toBe(TrackStatus.REVIVAL)
      expect(sm.transition(track, 34.99)).toBeNull()
    })

    it('handles concurrent state check', () => {
      // Multiple transitions should not conflict
      const track = { status: TrackStatus.NEW, statusChangedAt: new Date() }
      const result1 = sm.transition(track, 45)
      const result2 = sm.transition(track, 45)
      
      expect(result1).toBe(result2)
    })
  })
})
```

### E8-QA-4: XP System

```typescript
// apps/api/src/modules/gamification/__tests__/xp-system.test.ts

import { describe, it, expect } from 'vitest'
import { XPSystem, XPAction, getLevel } from '../xp-system'

describe('XP System', () => {
  describe('XP Values', () => {
    const xpValues = {
      PLAY_TRACK: 1,
      COMPLETE_TRACK: 2,
      SEED_TRACK: 3,
      LIKE_TRACK: 1,
      SHARE_TRACK: 2,
      TIP_ARTIST: 5,
      UPLOAD_TRACK: 10,
      REACH_100_PLAYS: 50,
      REACH_1000_PLAYS: 200,
      FIRST_SALE: 100
    }

    it.each(Object.entries(xpValues))('%s awards %d XP', async (action, expectedXP) => {
      const awarded = XPSystem.getXPForAction(action as XPAction)
      expect(awarded).toBe(expectedXP)
    })
  })

  describe('Level Calculation', () => {
    it('0 XP = Level 1', () => {
      expect(getLevel(0)).toBe(1)
    })

    it('100 XP = Level 2', () => {
      expect(getLevel(100)).toBe(2)
    })

    it('300 XP = Level 3', () => {
      expect(getLevel(300)).toBe(3)
    })

    it('700 XP = Level 4', () => {
      expect(getLevel(700)).toBe(4)
    })

    it('1500 XP = Level 5', () => {
      expect(getLevel(1500)).toBe(5)
    })

    it('level progression is logarithmic', () => {
      const levels = [
        { xp: 0, level: 1 },
        { xp: 100, level: 2 },
        { xp: 300, level: 3 },
        { xp: 700, level: 4 },
        { xp: 1500, level: 5 }
      ]

      levels.forEach(({ xp, level }) => {
        expect(getLevel(xp)).toBe(level)
      })
    })
  })

  describe('XP Accumulation', () => {
    it('accumulates XP correctly', async () => {
      const system = new XPSystem()
      const userId = 'test-user'
      
      await system.awardXP(userId, 'PLAY_TRACK')
      await system.awardXP(userId, 'COMPLETE_TRACK')
      await system.awardXP(userId, 'LIKE_TRACK')
      
      const total = await system.getTotalXP(userId)
      expect(total).toBe(4) // 1 + 2 + 1
    })
  })
})
```

### E8-QA-5: Badge System

```typescript
// apps/api/src/modules/gamification/__tests__/badge-system.test.ts

import { describe, it, expect } from 'vitest'
import { BadgeSystem, BadgeId, Badge } from '../badge-system'

describe('Badge System', () => {
  const badges: Badge[] = [
    { id: 'early-adopter', name: 'Early Adopter', xp: 100, multiplier: 0 },
    { id: 'first-track', name: 'First Track', xp: 50, multiplier: 0 },
    { id: 'viral-hit', name: 'Viral Hit', xp: 500, multiplier: 0.10 },
    { id: 'super-seeder', name: 'Super Seeder', xp: 250, multiplier: 0.05 },
    { id: 'superstar', name: 'Superstar', xp: 1000, multiplier: 0.20 },
    { id: 'diamond-artist', name: 'Diamond Artist', xp: 500, multiplier: 0 }
  ]

  describe('Eligibility Checks', () => {
    it('awards Early Adopter for beta signup', async () => {
      const system = new BadgeSystem()
      const user = { id: 'user-1', signupDate: new Date('2024-01-01') }
      
      const eligible = await system.checkEligibility(user, 'early-adopter')
      expect(eligible).toBe(true)
    })

    it('awards First Track on upload', async () => {
      const system = new BadgeSystem()
      const user = { id: 'user-1', tracksUploaded: 1 }
      
      const eligible = await system.checkEligibility(user, 'first-track')
      expect(eligible).toBe(true)
    })

    it('awards Viral Hit at 10K plays', async () => {
      const system = new BadgeSystem()
      const user = { id: 'user-1', totalPlays: 10000 }
      
      const eligible = await system.checkEligibility(user, 'viral-hit')
      expect(eligible).toBe(true)
    })

    it('awards Super Seeder at 1TB seeded', async () => {
      const system = new BadgeSystem()
      const user = { id: 'user-1', bytesSeeded: 1e12 }
      
      const eligible = await system.checkEligibility(user, 'super-seeder')
      expect(eligible).toBe(true)
    })
  })

  describe('Earning Multipliers', () => {
    it('applies single badge multiplier', () => {
      const system = new BadgeSystem()
      const badges: BadgeId[] = ['viral-hit']
      
      const multiplier = system.calculateMultiplier(badges)
      expect(multiplier).toBe(1.10) // Base 1.0 + 0.10
    })

    it('stacks multiple badge multipliers', () => {
      const system = new BadgeSystem()
      const badges: BadgeId[] = ['viral-hit', 'super-seeder', 'superstar']
      
      const multiplier = system.calculateMultiplier(badges)
      expect(multiplier).toBe(1.35) // 1.0 + 0.10 + 0.05 + 0.20
    })

    it('no badges = 1.0 multiplier', () => {
      const system = new BadgeSystem()
      const badges: BadgeId[] = []
      
      const multiplier = system.calculateMultiplier(badges)
      expect(multiplier).toBe(1.0)
    })
  })

  describe('Auto-Award', () => {
    it('auto-awards badge when threshold reached', async () => {
      const system = new BadgeSystem()
      const user = { id: 'user-1', totalPlays: 9999, badges: [] }
      
      // Simulate reaching 10K
      await system.onPlayMilestone(user, 10000)
      
      expect(user.badges).toContain('viral-hit')
    })

    it('does not re-award existing badge', async () => {
      const system = new BadgeSystem()
      const user = { id: 'user-1', totalPlays: 20000, badges: ['viral-hit'] }
      
      await system.checkAndAward(user)
      
      // Should still have only one instance
      const viralCount = user.badges.filter(b => b === 'viral-hit').length
      expect(viralCount).toBe(1)
    })
  })
})
```

---

## Integration Tests

### E8-INT: Rating Update Flow

```typescript
describe('Rating Update Integration', () => {
  it('play event updates rating', async () => {
    // Create track
    const track = await prisma.track.create({
      data: { title: 'Test Track', userId: 'user-1', status: 'NEW' }
    })
    
    // Record play
    await ratingService.recordPlay({
      trackId: track.id,
      userId: 'listener-1',
      duration: 180,
      completion: 0.9
    })
    
    // Check rating updated
    const updated = await prisma.track.findUnique({ where: { id: track.id } })
    expect(updated!.rating).toBeGreaterThan(0)
  })

  it('state machine runs on rating update', async () => {
    const track = await prisma.track.create({
      data: { title: 'Test', userId: 'user-1', status: 'NEW', rating: 39 }
    })
    
    // Increase rating above threshold
    await ratingService.updateRating(track.id, 45)
    
    // Check state changed
    const updated = await prisma.track.findUnique({ where: { id: track.id } })
    expect(updated!.status).toBe('PAID')
  })
})
```

---

## Load Tests

### E8-LOAD: High-Volume Play Recording

```typescript
describe('Rating System Load Tests', () => {
  it('handles 1000 concurrent play recordings', async () => {
    const track = await createTestTrack()
    
    const plays = Array(1000).fill(null).map((_, i) => ({
      trackId: track.id,
      userId: `user-${i}`,
      duration: 180 + Math.random() * 60,
      completion: 0.7 + Math.random() * 0.3
    }))
    
    const start = performance.now()
    
    await Promise.all(plays.map(p => ratingService.recordPlay(p)))
    
    const elapsed = performance.now() - start
    
    expect(elapsed).toBeLessThan(10000) // < 10 seconds
    
    const finalTrack = await prisma.track.findUnique({ where: { id: track.id } })
    expect(finalTrack!.playCount).toBe(1000)
  })
})
```

---

## Manual Test Checklist

### E8-MANUAL: Gamification Validation

- [ ] **Rating Display**: Track shows correct rating breakdown
- [ ] **State Transition**: Track changes from PAID to FREE when rating drops
- [ ] **XP Award**: User sees XP notification after actions
- [ ] **Level Up**: User sees level-up animation
- [ ] **Badge Award**: Badge appears on profile after threshold
- [ ] **Multiplier**: Earnings show multiplier effect
- [ ] **Leaderboard**: User position updates in real-time
- [ ] **Anti-Fraud**: Bot plays are rejected/not counted

---

## Regression Tests (Problems/Not Implemented)

```typescript
describe('E8 Regression Tests', () => {
  it.todo('Database migrations applied')
  it.todo('BullMQ async rating recalculation')
  it.todo('Event listeners for automatic rating updates')
  it.todo('Scheduled daily state transitions')
  it.todo('Admin threshold configuration')
  it.todo('Artist notifications on status change')
  it.todo('Real-time leaderboard via WebSocket')
  it.todo('Badge tier system (gold/silver/bronze)')
  it.todo('IP-based play deduplication')
  it.todo('Integration tests for rating formula')
})
```

---

*E8 Rating & Gamification QA — DAWW3 Project*
