# E5: Backend Metadata & Coordination — Agent Prompts

---

## E5-T1: Backend Bootstrap

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class NestJS architect'
    target = initialize NestJS application with Fastify adapter
    test = true

    code style = [DRY, Best practice, NestJS patterns]
    write docs = true
    deep thinking = true
    performance = fast API responses
    tech stack = ['nestjs@10.3', 'fastify@4.28', 'typescript@5.5']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Initialize NestJS backend for DAWW3 with Fastify adapter.
JWT auth, health checks, CORS, structured logging.

{{{{ #CUSTOMER PROMT

Нужен backend:
- NestJS с Fastify
- JWT аутентификация (dev mode)
- Health check endpoint
- CORS настроен
- Логирование

}}}}

<<<<<<#RECOMMENDED TASKS

API-1. NestJS Project Setup
File: apps/api/

- main.ts with Fastify adapter
- app.module.ts root module
- proper folder structure

API-2. Fastify Adapter Configuration
- FastifyAdapter with logger
- Helmet for security headers
- CORS configuration
- Compression

API-3. Environment Configuration
File: apps/api/src/config/

- ConfigModule setup
- Zod validation
- Type-safe config

API-4. JWT Authentication
- JwtModule from @nestjs/jwt
- JwtStrategy for Passport
- JwtAuthGuard
- Dev mode bypass option

API-5. Health Check Endpoint
GET /health

Response:
{
  "status": "ok",
  "version": "0.0.1",
  "timestamp": "ISO8601",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}

API-6. Global Exception Filter
- Catch all exceptions
- Format error response
- Log errors
- Don't expose internals in prod

API-7. Request Validation Pipe
- ValidationPipe global
- Transform enabled
- Whitelist extra properties

API-8. Logging
- Pino logger
- Correlation ID middleware
- Request/response logging

API-9. API Versioning
- Prefix /api/v1
- Version in response headers

🏁 Definition of Done
- NestJS starts with Fastify
- /health returns OK
- JWT auth works
- Logs are structured JSON

>>>>>>

]]]]
```

---

## E5-T2: Core Entities

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class database architect'
    target = Prisma schema and core domain entities
    test = true

    code style = [DRY, Best practice, Prisma patterns]
    write docs = true
    deep thinking = true
    performance = optimized queries
    tech stack = ['prisma@5.18', 'postgresql@16', 'nestjs']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create Prisma schema and NestJS modules for core entities.
User, Project, Track with full CRUD.

{{{{ #CUSTOMER PROMT

Нужны сущности:
- User (wallet, email, profile)
- Project (name, bpm, sampleRate)
- Track (title, status, rating)
- ProjectVersion (snapshots)

}}}}

<<<<<<#RECOMMENDED TASKS

ENT-1. Prisma Schema
File: apps/api/prisma/schema.prisma

Models:
- User (id, walletAddress, email, displayName, avatar, level, xp)
- Project (id, userId, name, bpm, sampleRate, isPublic)
- Track (id, projectId, userId, title, status, duration, rating)
- ProjectVersion (id, projectId, version, data, createdAt)

Enums:
- TrackStatus (NEW, PAID, FREE, REVIVAL, ARCHIVE)

ENT-2. UsersModule
Files: apps/api/src/modules/users/

- users.module.ts
- users.controller.ts
- users.service.ts
- dto/create-user.dto.ts
- dto/update-user.dto.ts

Endpoints:
- GET /users/me
- PATCH /users/me
- GET /users/:id

ENT-3. ProjectsModule
Files: apps/api/src/modules/projects/

Endpoints:
- GET /projects (my projects)
- POST /projects
- GET /projects/:id
- PATCH /projects/:id
- DELETE /projects/:id
- POST /projects/:id/versions
- GET /projects/:id/versions

ENT-4. TracksModule
Files: apps/api/src/modules/tracks/

Endpoints:
- GET /tracks (public browse)
- POST /tracks (publish)
- GET /tracks/:id
- PATCH /tracks/:id
- DELETE /tracks/:id

ENT-5. DTOs with Validation
- class-validator decorators
- class-transformer for transformation
- Swagger decorators

ENT-6. Repository Pattern
- PrismaService injected
- Transaction support
- Soft delete option

ENT-7. Seed Script
File: apps/api/prisma/seed.ts

- Create test users
- Create sample projects/tracks

ENT-8. Swagger Documentation
- @nestjs/swagger
- Auto-generated from DTOs
- Available at /docs

🏁 Definition of Done
- Prisma migrations run
- All CRUD endpoints work
- Swagger docs at /docs
- Seed creates test data

>>>>>>

]]]]
```

---

## E5-T3: Realtime API

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class realtime systems architect'
    target = WebSocket server with Socket.io for realtime events
    test = true

    code style = [DRY, Best practice, NestJS patterns]
    write docs = true
    deep thinking = true
    performance = low latency events, 1000+ connections
    tech stack = ['nestjs@10.3', 'socket.io@4.7', 'redis']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement WebSocket server for DAWW3 realtime features.
Track rooms, presence tracking, event broadcasting.

{{{{ #CUSTOMER PROMT

Нужен realtime API:
- Socket.io gateway
- JWT аутентификация
- Rooms для треков
- Broadcast событий

}}}}

<<<<<<#RECOMMENDED TASKS

RT-1. TracksGateway
File: apps/api/src/modules/tracks/tracks.gateway.ts

@WebSocketGateway({
  namespace: 'tracks',
  cors: { origin: '*' }
})

Events:
- join-track: { trackId }
- leave-track: { trackId }
- play-progress: { trackId, position }

RT-2. Socket Authentication
- JWT validation on connection
- Attach user to socket
- Reject invalid tokens

RT-3. Room Management
- socket.join(`track:${trackId}`)
- socket.leave(`track:${trackId}`)
- Track room membership

RT-4. Presence Tracking
Redis keys:
- track:{id}:listeners (SET)
- track:{id}:count (INT)

Methods:
- joinTrack(trackId, userId)
- leaveTrack(trackId, userId)
- getListenerCount(trackId)

RT-5. Event Broadcasting
Server → Client events:
- track-updated: { trackId, data }
- rating-changed: { trackId, rating }
- listener-count: { trackId, count }

RT-6. SignalingGateway
File: apps/api/src/modules/streaming/signaling.gateway.ts

@WebSocketGateway({ namespace: 'signaling' })

Events:
- signal: { targetPeerId, signal }
- join-swarm: { trackId }
- leave-swarm

RT-7. Connection Logging
- Log connects/disconnects
- Track connection count
- Error logging

RT-8. Redis Adapter
- @socket.io/redis-adapter
- Scale across instances
- Pub/sub for events

🏁 Definition of Done
- WebSocket connects with JWT
- Room subscriptions work
- Events broadcast to room
- Presence count accurate
- Works with Redis adapter

>>>>>>

]]]]
```
