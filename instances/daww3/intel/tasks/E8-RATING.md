# 📊 E8: Rating & Gamification Engine

> **Goal:** Automatic economy driven by engagement  
> **Sprint:** 2  
> **Owner:** Backend

---

## E8-T1: Rating Formula

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E5-T2

### Description
Calculate track rating from multiple signals.

### Acceptance Criteria
- [ ] Rating updates on play
- [ ] Completion rate tracked
- [ ] Seed contribution counted
- [ ] Rating normalized 0-100
- [ ] Anti-manipulation measures

### Rating Formula

```typescript
// Rating = weighted sum of signals
rating = (
  playScore * 0.30 +          // Play count contribution
  completionScore * 0.35 +    // How many finish the track
  seedScore * 0.20 +          // P2P seeding contribution  
  socialScore * 0.15          // Likes, shares, tips
) * decayFactor * trustMultiplier
```

### Technical Requirements

```typescript
// apps/api/src/modules/rating/formulas/rating-calculator.ts
export interface RatingInputs {
  playCount: number
  uniqueListeners: number
  completions: number
  avgCompletion: number      // 0-1
  seedCount: number
  seedBytes: number
  likes: number
  shares: number
  tips: number
  age: number                // Days since publish
}

export interface RatingOutput {
  total: number              // 0-100
  playScore: number
  completionScore: number
  seedScore: number
  socialScore: number
  rank: number               // Global position
}

export function calculateRating(inputs: RatingInputs): RatingOutput {
  // Play score: logarithmic scale
  const playScore = Math.log10(inputs.playCount + 1) * 20
  
  // Completion score: weighted by plays
  const completionScore = inputs.avgCompletion * 100 * 
    Math.min(1, inputs.playCount / 100)
  
  // Seed score: reward seeders
  const seedScore = Math.log10(inputs.seedCount + 1) * 15 +
    Math.log10(inputs.seedBytes / 1e9 + 1) * 10
  
  // Social score
  const socialScore = (
    inputs.likes * 1 +
    inputs.shares * 3 +
    inputs.tips * 5
  ) / Math.max(inputs.playCount, 1) * 100
  
  // Time decay: gradual decline after 30 days
  const decayFactor = inputs.age <= 30 ? 1 : Math.exp(-(inputs.age - 30) / 60)
  
  // Combine
  const raw = (
    playScore * 0.30 +
    completionScore * 0.35 +
    seedScore * 0.20 +
    socialScore * 0.15
  ) * decayFactor
  
  return {
    total: Math.min(100, Math.max(0, raw)),
    playScore,
    completionScore,
    seedScore,
    socialScore,
    rank: 0  // Calculated separately
  }
}
```

### Subtasks
- [ ] Create `rating-calculator.ts`
- [ ] Implement play score (log scale)
- [ ] Implement completion score
- [ ] Implement seed score
- [ ] Implement social score
- [ ] Add time decay
- [ ] Create BullMQ job for recalculation
- [ ] Add anti-bot measures
- [ ] Create ranking job

### Anti-Manipulation
```typescript
// Detect suspicious patterns
function detectManipulation(plays: Play[]): boolean {
  // Same IP too many times
  // Plays too short
  // No completion variance
  // Bot-like patterns
}
```

### Definition of Done
- Rating updates within 1 minute of play
- Formula produces sensible rankings
- Bots detected and excluded

---

## E8-T2: Track State Machine

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E8-T1

### Description
Implement track lifecycle: NEW → PAID → FREE → REVIVAL → ARCHIVE

### Acceptance Criteria
- [ ] States transition correctly
- [ ] Thresholds configurable
- [ ] State changes logged
- [ ] Notifications on change
- [ ] Manual override possible

### State Machine

```
                    ┌──────────────────────────────────────┐
                    │                                      │
    ┌───────┐   publish    ┌───────┐   rating drops   ┌───────┐
    │  NEW  │ ────────────▶│ PAID  │ ────────────────▶│ FREE  │
    └───────┘              └───────┘                  └───────┘
                               ▲                          │
                               │ rating rises             │ rating rises
                               │                          ▼
                           ┌───────────┐            ┌──────────┐
                           │  REVIVAL  │◀───────────│ (check)  │
                           └───────────┘            └──────────┘
                               │                          │
                               │ 30 days paid             │ 90 days low
                               ▼                          ▼
                           ┌───────┐                ┌──────────┐
                           │ PAID  │                │ ARCHIVE  │
                           └───────┘                └──────────┘
```

### Technical Requirements

```typescript
// apps/api/src/modules/rating/track-state-machine.ts
export enum TrackStatus {
  NEW = 'NEW',
  PAID = 'PAID',
  FREE = 'FREE',
  REVIVAL = 'REVIVAL',
  ARCHIVE = 'ARCHIVE'
}

export interface StateThresholds {
  paidMinRating: number        // 40 - min rating for PAID
  freeMaxRating: number        // 20 - max rating for FREE
  revivalMinRating: number     // 35 - min rating for REVIVAL
  archiveDaysLow: number       // 90 - days in FREE before ARCHIVE
  revivalDaysPaid: number      // 30 - days in REVIVAL before PAID
}

export class TrackStateMachine {
  constructor(private thresholds: StateThresholds) {}
  
  transition(track: Track, newRating: number): TrackStatus | null {
    switch (track.status) {
      case TrackStatus.NEW:
        // Publish → PAID (if good) or FREE (if not)
        if (newRating >= this.thresholds.paidMinRating) {
          return TrackStatus.PAID
        }
        return TrackStatus.FREE
        
      case TrackStatus.PAID:
        // Drop to FREE if rating too low
        if (newRating < this.thresholds.freeMaxRating) {
          return TrackStatus.FREE
        }
        return null
        
      case TrackStatus.FREE:
        // Rise to REVIVAL if rating good again
        if (newRating >= this.thresholds.revivalMinRating) {
          return TrackStatus.REVIVAL
        }
        // Archive if too long in FREE
        if (this.daysSinceStatusChange(track) > this.thresholds.archiveDaysLow) {
          return TrackStatus.ARCHIVE
        }
        return null
        
      case TrackStatus.REVIVAL:
        // Back to PAID after 30 days
        if (this.daysSinceStatusChange(track) > this.thresholds.revivalDaysPaid) {
          return TrackStatus.PAID
        }
        // Back to FREE if rating drops
        if (newRating < this.thresholds.freeMaxRating) {
          return TrackStatus.FREE
        }
        return null
        
      case TrackStatus.ARCHIVE:
        // Can be manually restored
        return null
    }
  }
}
```

### Subtasks
- [ ] Create `TrackStateMachine` class
- [ ] Implement all transitions
- [ ] Add configurable thresholds
- [ ] Create transition history table
- [ ] Add event notifications
- [ ] Create BullMQ job for daily check
- [ ] Add manual override API
- [ ] Create admin dashboard view

### Definition of Done
- Tracks move between states automatically
- Artist notified of changes
- History tracked for analytics

---

## E8-T3: Gamification Entities

**Priority:** 🟡 P2 MEDIUM  
**Points:** 5  
**Depends on:** E8-T2

### Description
Levels, badges, and multipliers for engagement.

### Acceptance Criteria
- [ ] XP system works
- [ ] Levels unlock features
- [ ] Badges awarded automatically
- [ ] Multipliers apply to earnings
- [ ] Leaderboards work

### XP System

```typescript
// XP actions
const XP_VALUES = {
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

// Level thresholds (exponential)
function getLevel(xp: number): number {
  return Math.floor(Math.log2(xp / 100 + 1)) + 1
}

// Level 1: 0 XP
// Level 2: 100 XP
// Level 3: 300 XP
// Level 4: 700 XP
// Level 5: 1500 XP
// ...
```

### Badges

| Badge | Requirement | XP | Effect |
|-------|-------------|----|---------| 
| 🌟 Early Adopter | Beta signup | 100 | — |
| 🎵 First Track | 1 upload | 50 | — |
| 🔥 Viral Hit | 10K plays | 500 | +10% earnings |
| 🌱 Super Seeder | 1TB seeded | 250 | +5% earnings |
| 👑 Superstar | Top 1% | 1000 | +20% earnings |
| 💎 Diamond Artist | $10K earned | 500 | Badge on profile |

### Subtasks
- [ ] Create XP transaction system
- [ ] Implement level calculation
- [ ] Create badge definitions
- [ ] Implement badge award logic
- [ ] Add multiplier to earnings
- [ ] Create leaderboard queries
- [ ] Add achievement notifications
- [ ] Create profile badges display

### Definition of Done
- Users gain XP from actions
- Levels unlock visible
- Badges display on profile
- Multipliers affect payouts

---

## Dependencies Graph

```
E5-T2 (Core Entities)
    │
    ▼
E8-T1 (Rating Formula)
    │
    ▼
E8-T2 (State Machine)
    │
    ▼
E8-T3 (Gamification)
    │
    ▼
E9-T1 (Monetization)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rating manipulation | High | Anti-bot, rate limits |
| Unfair rankings | High | Transparent formula |
| Badge inflation | Medium | Careful thresholds |
| Complex transitions | Medium | Thorough testing |
