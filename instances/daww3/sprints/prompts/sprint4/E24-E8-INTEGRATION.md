# E24: E8 Integration Complete — Agent Prompts

> **Goal:** Complete rating/gamification with scheduled jobs & event listeners
> **Sprint:** 4
> **Owner:** Backend
> **Priority:** 🔴 P0 CRITICAL (Blocks TOTEM TV-2, TV-4)

---

## E24-T1: Apply Prisma Migrations

```
[[[[ #SETTINGS

    mode = agent - apply database migrations
    expertize = 'you are world class database engineer'
    target = apply Prisma migrations for gamification/rating tables
    test = true

    code style = [migration best practices, rollback safe]
    write docs = true
    deep thinking = false
    performance = not critical
    tech stack = ['Prisma', 'PostgreSQL', 'Docker']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Apply Prisma migrations for rating/gamification tables to dev/test databases.

{{{{ #CUSTOMER PROMT

E8 (Rating & Gamification) код написан, но migrations не applied.
База данных не содержит нужные таблицы: TrackRating, UserXP, Badge, Leaderboard.
Нужно применить миграции и проверить что всё работает.

}}}}

<<<<<<#RECOMMENDED TASKS

MIGRATE-1. Check Current Database State
- docker compose ps | grep postgres
- docker compose exec postgres psql -U daww3 -c "\dt"
- List existing tables
- Check if gamification tables exist

MIGRATE-2. Generate Prisma Client
- cd apps/api
- pnpm prisma generate
- Verify: node_modules/.prisma/client updated
- Check: Types include UserXP, Badge, etc.

MIGRATE-3. Apply Pending Migrations
- pnpm prisma migrate deploy # Production-safe
- Or: pnpm prisma migrate dev # Development (with reset option)
- Watch output for errors
- Verify: "All migrations have been applied"

MIGRATE-4. Verify Tables Created
- docker compose exec postgres psql -U daww3
- \dt
- Check tables: user_xp, badges, user_badges, track_ratings, leaderboards
- \d user_xp # Check schema
- Verify: Indexes, constraints correct

MIGRATE-5. Seed Test Data (Optional)
- Create seed script: apps/api/prisma/seed-gamification.ts
- Add test users with XP/badges
- Add test tracks with ratings
- Run: pnpm prisma db seed

MIGRATE-6. Run Tests Against Real DB
- Start Docker: docker compose up -d postgres redis
- Set: DATABASE_URL=postgresql://...
- Run: pnpm vitest rating gamification
- Verify: Tests pass with real database

🏁 Definition of Done
- Migrations applied successfully
- All gamification tables exist
- Prisma client regenerated
- Tests pass with real DB
- Rollback tested (if needed)

>>>>>>

]]]]
```

---

## E24-T2: Event Listeners (Play→Rating Update)

```
[[[[ #SETTINGS

    mode = agent - implement event-driven architecture
    expertize = 'you are world class backend architect specializing in event sourcing'
    target = auto-update track ratings on play events
    test = true

    code style = [event-driven, decoupled, testable]
    write docs = true
    deep thinking = true
    performance = async processing, non-blocking
    tech stack = ['NestJS', 'EventEmitter2', 'BullMQ', 'Prisma']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Implement event listeners to automatically trigger rating recalculation on play events.

{{{{ #CUSTOMER PROMT

Когда пользователь играет трек, нужно:
1. Зафиксировать play event
2. Обновить метрики (playCount, completion rate)
3. Пересчитать rating трека
4. Обновить leaderboards
5. Проверить state transition (NEW→PAID, PAID→FREE)

Сейчас это всё ручное. Нужна автоматизация через events.

}}}}

<<<<<<#RECOMMENDED TASKS

EVENT-1. Design Event Flow
```
PlayEvent → PlayEventListener
           ├─→ Update Track Metrics
           ├─→ Queue Rating Recalculation Job
           └─→ Queue State Transition Check
           
RatingUpdated → LeaderboardUpdateListener
              └─→ Update Leaderboards
```

EVENT-2. Create PlayEvent DTO
- File: apps/api/src/modules/streaming/events/play.event.ts
```typescript
export class PlayEvent {
  trackId: string
  userId: string
  completionRate: number // 0-1
  duration: number // seconds
  source: 'p2p' | 'seed'
  seedBytes?: number
  timestamp: Date
}
```

EVENT-3. Emit Events from Streaming Service
- File: apps/api/src/modules/streaming/streaming.service.ts
- On play completion:
```typescript
this.eventEmitter.emit('track.played', new PlayEvent({
  trackId,
  userId,
  completionRate: played / total,
  duration,
  source: 'p2p',
  timestamp: new Date()
}))
```

EVENT-4. Create Rating Update Listener
- File: apps/api/src/modules/rating/listeners/play-event.listener.ts
```typescript
@Injectable()
export class PlayEventListener implements OnEvent<PlayEvent> {
  @OnEvent('track.played', { async: true })
  async handlePlayEvent(event: PlayEvent) {
    // Update track metrics
    await this.prisma.track.update({
      where: { id: event.trackId },
      data: {
        playCount: { increment: 1 },
        totalCompletion: { increment: event.completionRate }
      }
    })
    
    // Queue rating recalculation
    await this.jobsService.recalculateTrackRating(event.trackId)
    
    // Check state transition
    await this.stateService.evaluateTransition(event.trackId)
  }
}
```

EVENT-5. Queue-based Rating Recalculation
- Rating calculation is expensive, use BullMQ
- Debounce: multiple plays within 1 minute = 1 job
- Priority: popular tracks = higher priority
```typescript
await this.ratingQueue.add('recalculate', {
  trackId,
  priority: track.playCount > 1000 ? 10 : 5
}, {
  jobId: `rating-${trackId}`, // Deduplicate
  removeOnComplete: true,
  attempts: 3
})
```

EVENT-6. Leaderboard Update on Rating Change
- Emit 'rating.updated' event after recalculation
- Listener updates Redis-cached leaderboards
- WebSocket broadcasts change to connected clients

EVENT-7. Integration Tests
- Test: Play event triggers rating update
- Test: Multiple plays debounced correctly
- Test: State transition happens automatically
- Test: Leaderboard reflects new rating
- Mock: Queue jobs to avoid delays

🏁 Definition of Done
- PlayEvent emitted on every track play
- Rating recalculates automatically (via queue)
- State transitions automated
- Leaderboards update in real-time
- Tests verify complete flow
- Performance: <50ms to emit event, async processing

>>>>>>

]]]]
```

---

## E24-T3: BullMQ Scheduled Jobs (State Transitions)

```
[[[[ #SETTINGS

    mode = agent - implement cron jobs with BullMQ
    expertize = 'you are world class distributed systems engineer'
    target = scheduled jobs for daily state checks and cleanup
    test = true

    code style = [reliable, idempotent, observable]
    write docs = true
    deep thinking = true
    performance = batch processing, efficient queries
    tech stack = ['BullMQ', 'Redis', 'Prisma', 'NestJS']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Implement BullMQ scheduled jobs for automated track state transitions and cleanup.

{{{{ #CUSTOMER PROMT

Track state machine (NEW→PAID→FREE→REVIVAL→ARCHIVE) работает,
но transitions нужно запускать вручную.
Нужны cron jobs:
1. Ежедневно: проверка всех треков на state transition
2. Ежечасно: обновление leaderboards
3. Еженедельно: cleanup старых ARCHIVE треков
4. Каждые 5 минут: XP level-up checks

}}}}

<<<<<<#RECOMMENDED TASKS

JOB-1. Daily State Transition Check
```typescript
// apps/api/src/modules/jobs/processors/state-transition.processor.ts
@Processor('state-transition')
export class StateTransitionProcessor {
  @Process({ name: 'daily-check', concurrency: 1 })
  async processDailyCheck(job: Job) {
    const tracks = await this.prisma.track.findMany({
      where: { state: { not: 'ARCHIVE' } },
      include: { rating: true }
    })
    
    let transitioned = 0
    for (const track of tracks) {
      const newState = this.stateService.evaluateState(
        track.state,
        track.rating.total,
        track.createdAt
      )
      
      if (newState !== track.state) {
        await this.stateService.transitionTo(track.id, newState)
        transitioned++
      }
      
      job.updateProgress((transitioned / tracks.length) * 100)
    }
    
    return { processed: tracks.length, transitioned }
  }
}
```

JOB-2. Schedule Daily Job
```typescript
// apps/api/src/modules/jobs/jobs.service.ts
async onModuleInit() {
  // Daily at 3 AM UTC
  await this.stateQueue.add('daily-check', {}, {
    repeat: {
      pattern: '0 3 * * *' // Cron: every day at 3 AM
    },
    jobId: 'daily-state-transition'
  })
}
```

JOB-3. Hourly Leaderboard Refresh
```typescript
@Process({ name: 'refresh-leaderboards', concurrency: 1 })
async refreshLeaderboards(job: Job) {
  // Top 100 by XP
  const topXP = await this.prisma.user.findMany({
    orderBy: { totalXP: 'desc' },
    take: 100,
    select: { id: true, displayName: true, totalXP: true }
  })
  
  await this.redis.set(
    'leaderboard:xp',
    JSON.stringify(topXP),
    'EX',
    3600 // Expire in 1 hour
  )
  
  // Similar for plays, earnings, rating
  // ...
  
  return { updated: ['xp', 'plays', 'earnings', 'rating'] }
}
```

JOB-4. Weekly Archive Cleanup
```typescript
@Process({ name: 'archive-cleanup', concurrency: 1 })
async cleanupArchive(job: Job) {
  // Delete tracks in ARCHIVE for >6 months with rating <5
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 6)
  
  const deleted = await this.prisma.track.deleteMany({
    where: {
      state: 'ARCHIVE',
      updatedAt: { lt: cutoff },
      rating: { total: { lt: 5 } }
    }
  })
  
  return { deleted: deleted.count }
}
```

JOB-5. XP Level-Up Checks
```typescript
@Process({ name: 'level-up-check', concurrency: 5 })
async checkLevelUps(job: Job<{ userIds: string[] }>) {
  const users = await this.prisma.user.findMany({
    where: { id: { in: job.data.userIds } },
    include: { xp: true }
  })
  
  for (const user of users) {
    const newLevel = this.xpService.calculateLevel(user.xp.total)
    if (newLevel > user.xp.level) {
      await this.xpService.levelUp(user.id, newLevel)
      await this.notificationService.sendLevelUp(user.id, newLevel)
    }
  }
}
```

JOB-6. Job Monitoring & Alerts
- Add job event listeners:
  - 'completed' → log success
  - 'failed' → alert via Slack/email
  - 'stalled' → retry or alert
- Track metrics in Prometheus:
  - `job_duration_seconds{job="daily-state-transition"}`
  - `job_processed_total{job="daily-state-transition"}`
- Grafana dashboard for job health

JOB-7. Admin Endpoints for Manual Trigger
```typescript
@Post('admin/jobs/trigger/:jobName')
@UseGuards(AdminGuard)
async triggerJob(@Param('jobName') jobName: string) {
  switch (jobName) {
    case 'state-transition':
      await this.stateQueue.add('daily-check', {})
      break
    // ...
  }
  return { triggered: true }
}
```

🏁 Definition of Done
- 4 scheduled jobs running (daily, hourly, weekly, 5min)
- Jobs are idempotent (safe to run multiple times)
- Progress tracking for long jobs
- Monitoring in Grafana
- Manual trigger endpoints for testing
- Alerts configured for failures

>>>>>>

]]]]
```

---

## E24-T4: Real-time Leaderboard WebSocket

```
[[[[ #SETTINGS

    mode = agent - implement WebSocket broadcasting
    expertize = 'you are world class real-time systems engineer'
    target = real-time leaderboard updates via WebSocket
    test = true

    code style = [efficient, scalable, resilient]
    write docs = true
    deep thinking = true
    performance = <100ms latency, 1000+ concurrent connections
    tech stack = ['Socket.io', 'Redis', 'NestJS']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Broadcast leaderboard updates to connected clients in real-time.

{{{{ #CUSTOMER PROMT

Leaderboards обновляются каждый час через cron job.
Нужно показывать изменения в real-time для пользователей онлайн.
WebSocket room 'leaderboard' должна транслировать:
- User поднялся/опустился в рейтинге
- New top 10 entry
- Badge unlocked (affects multipliers)

}}}}

<<<<<<#RECOMMENDED TASKS

WS-1. Leaderboard Gateway
```typescript
// apps/api/src/modules/gamification/leaderboard.gateway.ts
@WebSocketGateway({ namespace: '/leaderboard' })
export class LeaderboardGateway {
  @WebSocketServer()
  server: Server
  
  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { type: string }) {
    // Join room: 'xp', 'plays', 'earnings', 'rating'
    client.join(`leaderboard:${data.type}`)
    
    // Send current leaderboard
    const cached = await this.redis.get(`leaderboard:${data.type}`)
    client.emit('leaderboard:snapshot', JSON.parse(cached))
  }
  
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { type: string }) {
    client.leave(`leaderboard:${data.type}`)
  }
}
```

WS-2. Broadcast on Rating Update
```typescript
// In rating update listener
async handleRatingUpdated(event: RatingUpdatedEvent) {
  // Check if user rank changed
  const oldRank = await this.getRank(event.userId, 'rating')
  const newRank = await this.recalculateRank(event.userId, 'rating')
  
  if (oldRank !== newRank) {
    this.leaderboardGateway.server
      .to('leaderboard:rating')
      .emit('leaderboard:update', {
        userId: event.userId,
        oldRank,
        newRank,
        newRating: event.newRating
      })
  }
}
```

WS-3. Efficient Rank Calculation (Redis Sorted Set)
```typescript
// Use Redis ZADD for O(log N) rank updates
async updateRank(userId: string, type: 'xp' | 'plays' | 'earnings' | 'rating', score: number) {
  await this.redis.zadd(`leaderboard:${type}`, score, userId)
}

async getRank(userId: string, type: string): Promise<number | null> {
  return await this.redis.zrevrank(`leaderboard:${type}`, userId)
}

async getTopN(type: string, n: number) {
  return await this.redis.zrevrange(`leaderboard:${type}`, 0, n - 1, 'WITHSCORES')
}
```

WS-4. Throttle Updates (Debounce)
- Don't broadcast every tiny change
- Batch updates every 10 seconds
- Or: only broadcast if rank change >5 positions

WS-5. Frontend Integration Example
```typescript
// apps/web/src/composables/useLeaderboard.ts
export function useLeaderboard(type: 'xp' | 'plays' | 'earnings' | 'rating') {
  const leaderboard = ref<LeaderboardEntry[]>([])
  const socket = io('/leaderboard')
  
  socket.emit('subscribe', { type })
  
  socket.on('leaderboard:snapshot', (data) => {
    leaderboard.value = data
  })
  
  socket.on('leaderboard:update', ({ userId, oldRank, newRank }) => {
    // Animate rank change in UI
    animateRankChange(userId, oldRank, newRank)
  })
  
  onUnmounted(() => {
    socket.emit('unsubscribe', { type })
    socket.disconnect()
  })
  
  return { leaderboard }
}
```

WS-6. Load Testing
- Simulate 1000 concurrent WebSocket connections
- Measure: latency, memory usage
- Ensure: <100ms latency for broadcasts
- Test: Redis pub/sub scales horizontally

🏁 Definition of Done
- Real-time leaderboard updates working
- <100ms latency for rank changes
- Scales to 1000+ concurrent connections
- Efficient (Redis sorted sets)
- Frontend example implemented
- Load tested

>>>>>>

]]]]
```

---

## E24-T5: Integration Tests for Rating System

```
[[[[ #SETTINGS

    mode = agent - write comprehensive integration tests
    expertize = 'you are world class QA engineer specializing in integration testing'
    target = end-to-end tests for rating/gamification flows
    test = true

    code style = [BDD, clear test names, isolated]
    write docs = true
    deep thinking = false
    performance = fast test execution
    tech stack = ['Vitest', 'Supertest', 'Prisma', 'Docker']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Write integration tests that verify complete rating/gamification flows.

{{{{ #CUSTOMER PROMT

Unit tests для rating/gamification passing, но integration tests нет.
Нужно проверить:
- Play event → rating update → state transition
- XP accumulation → level up → badge award → multiplier
- Leaderboard update после rating change
- Scheduled jobs выполняются корректно

}}}}

<<<<<<#RECOMMENDED TASKS

TEST-1. Setup Test Environment
```typescript
// apps/api/test/rating-integration.spec.ts
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

describe('Rating & Gamification Integration', () => {
  let app: INestApplication
  let prisma: PrismaService
  
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    
    app = module.createNestApplication()
    await app.init()
    
    prisma = app.get(PrismaService)
    await prisma.cleanDatabase() // Custom helper
  })
})
```

TEST-2. Test: Play Event Triggers Rating Update
```typescript
it('should update track rating when play event occurs', async () => {
  // Arrange
  const track = await prisma.track.create({
    data: { title: 'Test Track', state: 'NEW' }
  })
  
  // Act: Simulate play
  await request(app.getHttpServer())
    .post(`/api/v1/tracks/${track.id}/play`)
    .send({ completionRate: 0.9 })
  
  // Wait for async processing
  await sleep(1000)
  
  // Assert
  const updated = await prisma.track.findUnique({
    where: { id: track.id },
    include: { rating: true }
  })
  
  expect(updated.playCount).toBe(1)
  expect(updated.rating.total).toBeGreaterThan(0)
})
```

TEST-3. Test: State Transition on Rating Change
```typescript
it('should transition NEW → PAID when rating >= 40', async () => {
  // Arrange: Track with high engagement
  const track = await createTrackWithPlays({
    plays: 100,
    completionRate: 0.9,
    likes: 50
  })
  
  // Act: Trigger state evaluation
  await request(app.getHttpServer())
    .post('/api/v1/admin/jobs/trigger/state-transition')
  
  await sleep(2000)
  
  // Assert
  const updated = await prisma.track.findUnique({ where: { id: track.id } })
  expect(updated.state).toBe('PAID')
})
```

TEST-4. Test: XP → Level Up → Badge
```typescript
it('should award badge when leveling up to threshold', async () => {
  // Arrange
  const user = await prisma.user.create({
    data: { email: 'test@test.com', totalXP: 90 }
  })
  
  // Act: Earn 10 XP (crosses level 2 threshold at 100 XP)
  await request(app.getHttpServer())
    .post('/api/v1/gamification/xp/earn')
    .send({ userId: user.id, action: 'UPLOAD_TRACK' }) // +10 XP
  
  await sleep(1000)
  
  // Assert
  const updated = await prisma.user.findUnique({
    where: { id: user.id },
    include: { badges: true, xp: true }
  })
  
  expect(updated.xp.level).toBe(2)
  expect(updated.badges.some(b => b.badgeId === 'FIRST_TRACK')).toBe(true)
})
```

TEST-5. Test: Leaderboard Updates
```typescript
it('should update leaderboard after rating change', async () => {
  // Arrange: 10 tracks with varying ratings
  const tracks = await Promise.all(
    Array.from({ length: 10 }, (_, i) => 
      createTrackWithRating({ rating: 10 + i * 5 })
    )
  )
  
  // Act: Boost top track's rating significantly
  await addPlaysToTrack(tracks[9].id, 1000)
  await triggerRatingRecalculation(tracks[9].id)
  
  // Assert: Check leaderboard order
  const leaderboard = await request(app.getHttpServer())
    .get('/api/v1/leaderboard/rating')
  
  expect(leaderboard.body[0].trackId).toBe(tracks[9].id)
})
```

TEST-6. Test: Scheduled Job Execution
```typescript
it('should process daily state transition job', async () => {
  // Arrange: Mix of tracks in different states
  await createMultipleTracks([
    { state: 'NEW', rating: 45 }, // Should → PAID
    { state: 'PAID', rating: 15 }, // Should → FREE
    { state: 'FREE', rating: 40, daysInState: 35 } // Should → REVIVAL
  ])
  
  // Act: Manually trigger job (don't wait for cron)
  const job = await queueService.add('daily-check', {})
  await job.finished()
  
  // Assert: Check state transitions occurred
  const tracks = await prisma.track.findMany()
  expect(tracks[0].state).toBe('PAID')
  expect(tracks[1].state).toBe('FREE')
  expect(tracks[2].state).toBe('REVIVAL')
})
```

TEST-7. Performance Test: 1000 Plays
```typescript
it('should handle 1000 concurrent plays without errors', async () => {
  const track = await createTrack()
  
  // Act: Simulate 1000 concurrent plays
  const plays = Array.from({ length: 1000 }, () =>
    request(app.getHttpServer())
      .post(`/api/v1/tracks/${track.id}/play`)
      .send({ completionRate: 0.8 })
  )
  
  await Promise.all(plays)
  await sleep(5000) // Allow async processing
  
  // Assert: All plays recorded, rating calculated
  const updated = await prisma.track.findUnique({
    where: { id: track.id },
    include: { rating: true }
  })
  
  expect(updated.playCount).toBe(1000)
  expect(updated.rating.total).toBeGreaterThan(50)
})
```

🏁 Definition of Done
- 10+ integration tests covering main flows
- Tests use real database (Docker)
- All tests pass consistently
- Test execution time <30 seconds
- Coverage: event flow, state transitions, jobs, leaderboards

>>>>>>

]]]]
```

---

## E24 Verification

After completing all E24 tasks, verify:

```bash
# 1. Migrations applied
cd apps/api
pnpm prisma migrate status

# 2. Run integration tests
pnpm vitest test/rating-integration.spec.ts

# 3. Check scheduled jobs
curl http://localhost:4000/api/v1/admin/jobs/stats

# 4. Test WebSocket
wscat -c ws://localhost:4000/leaderboard
> {"event": "subscribe", "data": {"type": "xp"}}

# 5. Monitor metrics
open http://localhost:3001/dashboards # Grafana
```

**Success Criteria:**
- ✅ All gamification tables exist in database
- ✅ Play events trigger rating updates automatically
- ✅ State transitions happen daily via cron
- ✅ Leaderboards update in real-time
- ✅ Integration tests passing
- ✅ Metrics visible in Grafana

---

*E24 E8 Integration — DAWW3 Sprint 4*
