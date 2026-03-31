# 🖥️ E5: Backend Metadata & Coordination

> **Goal:** System brain (no audio processing)  
> **Sprint:** 1  
> **Owner:** Backend

---

## E5-T1: Backend Bootstrap

**Priority:** 🔴 P0 CRITICAL  
**Points:** 3  
**Depends on:** E1-T2

### Description
Initialize NestJS application with Fastify adapter.

### Acceptance Criteria
- [ ] NestJS app starts
- [ ] Fastify adapter configured
- [ ] JWT authentication (dev mode)
- [ ] Health check endpoint
- [ ] CORS configured
- [ ] Request logging

### Technical Requirements

```typescript
// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  )
  
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
  
  await app.listen(process.env.PORT || 4000, '0.0.0.0')
}
```

### Subtasks
- [ ] Initialize NestJS project
- [ ] Configure Fastify adapter
- [ ] Setup environment configuration
- [ ] Add global exception filter
- [ ] Add request validation pipe
- [ ] Configure CORS
- [ ] Add `/health` endpoint
- [ ] Add `/api/v1` prefix
- [ ] Setup request logging
- [ ] Configure JWT module

### Health Check Response
```json
{
  "status": "ok",
  "version": "0.0.1",
  "timestamp": "2026-01-27T16:00:00Z",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

### Definition of Done
```bash
curl http://localhost:4000/health
# → 200 OK with health JSON
```

---

## E5-T2: Core Entities

**Priority:** 🔴 P0 CRITICAL  
**Points:** 5  
**Depends on:** E5-T1

### Description
Prisma schema and core domain entities.

### Acceptance Criteria
- [ ] Prisma schema created
- [ ] Migrations work
- [ ] CRUD for User
- [ ] CRUD for Project
- [ ] CRUD for Track
- [ ] Version history for projects

### Entities

```
User
├── id
├── walletAddress
├── email
├── displayName
├── avatar
├── level
├── xp
└── timestamps

Project
├── id
├── userId
├── name
├── bpm
├── sampleRate
├── isPublic
└── timestamps

Track
├── id
├── projectId
├── userId
├── title
├── status (NEW|PAID|FREE|REVIVAL|ARCHIVE)
├── duration
├── rating metrics
├── monetization info
└── timestamps

ProjectVersion
├── id
├── projectId
├── version
├── data (JSON)
└── createdAt
```

### Subtasks
- [ ] Create Prisma schema
- [ ] Generate initial migration
- [ ] Create `UsersModule`
- [ ] Create `ProjectsModule`
- [ ] Create `TracksModule`
- [ ] Implement repository pattern
- [ ] Add DTOs with validation
- [ ] Add Swagger documentation
- [ ] Create seed script

### API Endpoints

```
# Users
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/:id

# Projects
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
POST   /api/v1/projects/:id/versions
GET    /api/v1/projects/:id/versions

# Tracks
GET    /api/v1/tracks
POST   /api/v1/tracks
GET    /api/v1/tracks/:id
PATCH  /api/v1/tracks/:id
DELETE /api/v1/tracks/:id
```

### Definition of Done
- All CRUD operations work
- Swagger docs accessible at `/docs`
- Migrations apply cleanly

---

## E5-T3: Realtime API

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E5-T2

### Description
WebSocket server for real-time events.

### Acceptance Criteria
- [ ] Socket.io gateway works
- [ ] Authentication on connect
- [ ] Room-based subscriptions
- [ ] Track events broadcast
- [ ] Presence tracking

### Technical Requirements

```typescript
// apps/api/src/modules/tracks/tracks.gateway.ts
@WebSocketGateway({
  namespace: 'tracks',
  cors: { origin: '*' }
})
export class TracksGateway {
  @WebSocketServer()
  server: Server
  
  @SubscribeMessage('join-track')
  handleJoinTrack(
    @MessageBody() data: { trackId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(`track:${data.trackId}`)
    this.server.to(`track:${data.trackId}`).emit('listener-joined', {
      count: this.getListenerCount(data.trackId)
    })
  }
  
  @SubscribeMessage('leave-track')
  handleLeaveTrack(
    @MessageBody() data: { trackId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(`track:${data.trackId}`)
  }
  
  broadcastTrackUpdate(trackId: string, data: any) {
    this.server.to(`track:${trackId}`).emit('track-updated', data)
  }
}
```

### Events Schema

```typescript
// Client → Server
interface ClientEvents {
  'join-track': { trackId: string }
  'leave-track': { trackId: string }
  'play-progress': { trackId: string, position: number }
}

// Server → Client
interface ServerEvents {
  'track-updated': { trackId: string, data: Partial<Track> }
  'rating-changed': { trackId: string, rating: number }
  'listener-count': { trackId: string, count: number }
  'listener-joined': { count: number }
  'listener-left': { count: number }
}
```

### Subtasks
- [ ] Create `TracksGateway`
- [ ] Add JWT authentication middleware
- [ ] Implement room joining/leaving
- [ ] Add listener count tracking (Redis)
- [ ] Broadcast track updates
- [ ] Create `/signaling` namespace for P2P
- [ ] Add connection/disconnection logging
- [ ] Test with multiple clients

### Redis Presence Tracking
```typescript
// On join
await redis.sadd(`track:${trackId}:listeners`, clientId)
await redis.incr(`track:${trackId}:count`)

// On leave
await redis.srem(`track:${trackId}:listeners`, clientId)
await redis.decr(`track:${trackId}:count`)

// Get count
const count = await redis.get(`track:${trackId}:count`)
```

### Definition of Done
- WebSocket connects with auth
- Room subscriptions work
- Events broadcast to room members
- Presence count accurate

---

## Dependencies Graph

```
E1-T2 (Docker)
    │
    ▼
E5-T1 (Bootstrap)
    │
    ▼
E5-T2 (Core Entities)
    │
    ├─────────────────────┐
    ▼                     ▼
E5-T3 (Realtime)    E6-T1 (P2P Seed)
                          │
                          ▼
                    E6-T2 (Streaming)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebSocket scaling | Medium | Redis adapter |
| Connection storms | Medium | Rate limiting |
| Memory leaks (sockets) | Medium | Proper cleanup |
| Auth token expiry | Low | Refresh on reconnect |

---

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| API response time | < 50ms | < 200ms |
| WebSocket latency | < 20ms | < 100ms |
| Concurrent connections | 1000 | 500 |
| Events/second | 10000 | 5000 |
