# E8: Rating & Gamification Engine — Agent Prompts

---

## E8-T1: Rating Formula

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class recommendation systems engineer'
    target = multi-signal rating calculation for tracks
    test = true

    code style = [DRY, Best practice, testable functions]
    write docs = true
    deep thinking = true
    performance = efficient batch calculation
    tech stack = ['nestjs', 'prisma', 'bullmq', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement track rating formula based on multiple engagement signals.
Plays, completion, seeding, social actions with anti-manipulation.

{{{{ #CUSTOMER PROMT

Нужна формула рейтинга:
- Количество прослушиваний
- Процент дослушивания
- Вклад в P2P сидинг
- Социальные действия
- Защита от накрутки

}}}}

<<<<<<#RECOMMENDED TASKS

RAT-1. Rating Calculator
File: apps/api/src/modules/rating/formulas/rating-calculator.ts

interface RatingInputs {
  playCount: number
  uniqueListeners: number
  completions: number
  avgCompletion: number       // 0-1
  seedCount: number
  seedBytes: number
  likes: number
  shares: number
  tips: number
  age: number                 // Days since publish
}

interface RatingOutput {
  total: number               // 0-100
  playScore: number
  completionScore: number
  seedScore: number
  socialScore: number
  rank: number
}

function calculateRating(inputs: RatingInputs): RatingOutput

RAT-2. Score Components
- playScore: log10(plays + 1) * 20
- completionScore: avgCompletion * 100 * min(1, plays/100)
- seedScore: log10(seeders + 1) * 15 + log10(bytes/1GB + 1) * 10
- socialScore: (likes + shares*3 + tips*5) / plays * 100

RAT-3. Time Decay
- No decay for first 30 days
- Exponential decay after
- decay = exp(-(age - 30) / 60)

RAT-4. Weight Configuration
Configurable weights:
- playWeight: 0.30
- completionWeight: 0.35
- seedWeight: 0.20
- socialWeight: 0.15

RAT-5. Anti-Manipulation
File: apps/api/src/modules/rating/anti-fraud.ts

Detect:
- Same IP too many times
- Plays too short (<10%)
- Bot-like patterns
- Suspicious velocity

RAT-6. BullMQ Job
File: apps/api/src/modules/rating/rating.processor.ts

- Recalculate rating on events
- Batch processing
- Debounce updates

RAT-7. Ranking Job
- Calculate global rank
- Update periodically
- Store in track record

RAT-8. Rating Service
File: apps/api/src/modules/rating/rating.service.ts

- recordPlay(trackId, userId, data)
- recalculateRating(trackId)
- getRanking(limit, offset)

🏁 Definition of Done
- Rating updates on play events
- Formula produces sensible values
- Anti-manipulation detects bots
- Rankings accurate

>>>>>>

]]]]
```

---

## E8-T2: Track State Machine

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class state machine designer'
    target = track lifecycle state machine (NEW → PAID → FREE → etc)
    test = true

    code style = [DRY, Best practice, state machine patterns]
    write docs = true
    deep thinking = true
    performance = efficient state checks
    tech stack = ['nestjs', 'prisma', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement track lifecycle state machine for DAWW3.
Automatic transitions based on rating with configurable thresholds.

{{{{ #CUSTOMER PROMT

Нужен state machine для треков:
- NEW → PAID (если рейтинг высокий)
- PAID → FREE (если рейтинг падает)
- FREE → REVIVAL (если возвращается)
- REVIVAL → PAID (после 30 дней)
- FREE → ARCHIVE (если долго низкий)

}}}}

<<<<<<#RECOMMENDED TASKS

STM-1. State Machine Class
File: apps/api/src/modules/rating/track-state-machine.ts

enum TrackStatus {
  NEW = 'NEW',
  PAID = 'PAID',
  FREE = 'FREE',
  REVIVAL = 'REVIVAL',
  ARCHIVE = 'ARCHIVE'
}

interface StateThresholds {
  paidMinRating: number        // 40
  freeMaxRating: number        // 20
  revivalMinRating: number     // 35
  archiveDaysLow: number       // 90
  revivalDaysPaid: number      // 30
}

class TrackStateMachine {
  constructor(thresholds: StateThresholds)
  transition(track: Track, newRating: number): TrackStatus | null
}

STM-2. Transition Rules
- NEW → PAID: rating >= paidMinRating
- NEW → FREE: rating < paidMinRating
- PAID → FREE: rating < freeMaxRating
- FREE → REVIVAL: rating >= revivalMinRating
- FREE → ARCHIVE: daysInFree > archiveDaysLow
- REVIVAL → PAID: daysInRevival > revivalDaysPaid
- REVIVAL → FREE: rating < freeMaxRating

STM-3. Transition History
Model: TrackStatusHistory
- trackId
- fromStatus
- toStatus
- reason
- timestamp

STM-4. Configurable Thresholds
- Load from config
- Overridable per artist tier
- Admin can adjust

STM-5. Daily Check Job
File: apps/api/src/modules/rating/state-check.processor.ts

- Run daily
- Check all tracks
- Apply transitions
- Log changes

STM-6. Event Notifications
On transition:
- Notify artist (email/push)
- Log to analytics
- Update UI in realtime

STM-7. Manual Override
- Admin can force state
- Artist can request archive
- Audit trail

STM-8. State Machine Service
File: apps/api/src/modules/rating/state-machine.service.ts

- checkAndTransition(trackId)
- getTransitionHistory(trackId)
- forceState(trackId, status, reason)

🏁 Definition of Done
- States transition automatically
- Thresholds configurable
- History tracked
- Notifications sent

>>>>>>

]]]]
```

---

## E8-T3: Gamification Entities

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class gamification systems designer'
    target = XP, levels, badges, multipliers
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = efficient XP calculations
    tech stack = ['nestjs', 'prisma', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement gamification system for DAWW3.
XP from actions, levels, badges, earning multipliers.

{{{{ #CUSTOMER PROMT

Нужна геймификация:
- XP за действия
- Уровни с разблокировками
- Бейджи за достижения
- Мультипликаторы заработка

}}}}

<<<<<<#RECOMMENDED TASKS

GAM-1. XP System
File: apps/api/src/modules/gamification/xp.service.ts

XP_VALUES = {
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

Methods:
- awardXP(userId, action, context)
- getXP(userId): number
- getXPHistory(userId): XPTransaction[]

GAM-2. Level System
function getLevel(xp: number): number {
  return Math.floor(Math.log2(xp / 100 + 1)) + 1
}

// Level 1: 0 XP
// Level 2: 100 XP
// Level 3: 300 XP
// Level 4: 700 XP
// Level 5: 1500 XP

GAM-3. Badge Definitions
Model: Badge
- id, name, description, icon
- requirement (JSON: { type, value })
- xpReward
- multiplierBonus

Badges:
- Early Adopter (beta signup)
- First Track (1 upload)
- Viral Hit (10K plays)
- Super Seeder (1TB seeded)
- Superstar (top 1%)
- Diamond Artist ($10K earned)

GAM-4. Badge Award Logic
File: apps/api/src/modules/gamification/badge.service.ts

- checkBadgeEligibility(userId): Badge[]
- awardBadge(userId, badgeId): void
- getUserBadges(userId): UserBadge[]

GAM-5. Earning Multipliers
Based on badges:
- Viral Hit: +10%
- Super Seeder: +5%
- Superstar: +20%

Calculate:
- getMultiplier(userId): number
- applyMultiplier(baseAmount, userId): number

GAM-6. Leaderboards
File: apps/api/src/modules/gamification/leaderboard.service.ts

- getTopByXP(limit)
- getTopByEarnings(limit)
- getTopByPlays(limit)
- getUserRank(userId)

GAM-7. Achievement Notifications
On badge earned:
- In-app notification
- Email (optional)
- Push (optional)

GAM-8. Profile Display
API: GET /users/:id/achievements

Response:
{
  level: 5,
  xp: 1500,
  badges: [...],
  multiplier: 1.15,
  rank: 42
}

🏁 Definition of Done
- XP awards on actions
- Levels calculate correctly
- Badges awarded automatically
- Multipliers affect earnings
- Leaderboards work

>>>>>>

]]]]
```
