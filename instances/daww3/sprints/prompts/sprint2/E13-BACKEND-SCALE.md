# E13: Backend Scaling & Infrastructure — Agent Prompts

> **Goal:** Redis scaling, rate limiting, file uploads, background jobs, testing, CI/CD
> **Sprint:** 2
> **Owner:** Backend / DevOps
> **Source:** E5 Backend unresolved items (prioritized)

---

## E13-T1: Redis Adapter for Socket.io Scaling

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class WebSocket scaling engineer'
    target = implement Redis adapter for Socket.io horizontal scaling
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = handle 10K concurrent connections
    tech stack = ['Socket.io', 'Redis', 'NestJS', '@socket.io/redis-adapter']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement Redis adapter for Socket.io to enable horizontal scaling.
Multiple API instances should share WebSocket state.

{{{{ #CUSTOMER PROMT

Socket.io работает single-node. Нужно:
- Redis adapter для pub/sub
- Sticky sessions для load balancer
- Room sync across instances
- Connection state recovery
- Health monitoring

}}}}

<<<<<<#RECOMMENDED TASKS

REDIS-WS-1. Redis Adapter Setup
- Install @socket.io/redis-adapter
- Configure Redis connection
- Pub/sub channel setup
- Error handling and reconnection
- Health check integration

REDIS-WS-2. Connection State
- Redis for connection tracking
- User → connection mapping
- Room membership sync
- Presence tracking
- Cleanup on disconnect

REDIS-WS-3. Sticky Sessions
- Document load balancer config
- nginx example
- AWS ALB example
- Health check endpoint
- Graceful failover

REDIS-WS-4. Room Management
- Room join/leave sync
- Cross-instance emit
- Room presence queries
- Broadcast optimization
- Large room handling

REDIS-WS-5. Connection Recovery
- Connection state adapter
- Reconnection handling
- Missed events replay
- Session restoration
- Timeout configuration

REDIS-WS-6. Monitoring
- Connection count per instance
- Room count metrics
- Message throughput
- Redis health status
- Prometheus metrics

🏁 Definition of Done
- Multiple instances share state
- Events reach all subscribers
- Connection survives instance restart
- Metrics available
- Load test passes (10K connections)

>>>>>>

]]]]
```

---

## E13-T2: Rate Limiting & Request Throttling

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class API security engineer'
    target = implement comprehensive rate limiting
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = minimal overhead per request
    tech stack = ['NestJS', '@nestjs/throttler', 'Redis', 'ioredis']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement rate limiting for DAWW3 API.
Protect against abuse, DDoS, and resource exhaustion.

{{{{ #CUSTOMER PROMT

Rate limiting не настроен. Нужно:
- Global rate limits
- Per-endpoint limits
- User-based limits
- IP-based limits
- Redis backend для distributed limiting

}}}}

<<<<<<#RECOMMENDED TASKS

RATE-1. Throttler Setup
- Install @nestjs/throttler
- Global module configuration
- Redis storage adapter
- Default limits (100 req/min)
- Bypass for health checks

RATE-2. Endpoint-Specific Limits
- Higher limits for reads
- Lower limits for writes
- Expensive operations (upload, export)
- Authentication endpoints
- Decorator-based configuration

RATE-3. User-Based Limiting
- Identify user from JWT
- Per-user quotas
- Premium user higher limits
- Anonymous vs authenticated
- User-specific overrides

RATE-4. IP-Based Limiting
- Extract client IP
- Handle X-Forwarded-For
- Cloudflare/proxy headers
- Whitelist for trusted IPs
- Blacklist capability

RATE-5. Response Headers
- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset
- Retry-After on 429
- Client guidance

RATE-6. Monitoring & Alerts
- Track limit hits
- Alert on abuse patterns
- Dashboard for limits
- Per-user usage tracking
- Automatic blocking

🏁 Definition of Done
- Global limits enforced
- Per-endpoint limits work
- 429 responses correct
- Headers inform clients
- Redis scales limits

>>>>>>

]]]]
```

---

## E13-T3: File Upload Handling

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class file upload engineer'
    target = implement secure audio file uploads to MinIO
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = handle 100MB+ audio files
    tech stack = ['NestJS', 'Multer', 'MinIO', 'Sharp']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement file upload handling for DAWW3.
Support audio files, images, with validation and storage.

{{{{ #CUSTOMER PROMT

File upload не реализован. Нужно:
- Audio file upload (WAV, MP3, FLAC)
- Image upload (avatars, artwork)
- Validation (type, size, content)
- MinIO storage
- Presigned URLs

}}}}

<<<<<<#RECOMMENDED TASKS

UPLOAD-1. Multer Configuration
- Install @nestjs/platform-express, multer
- Memory storage for small files
- Disk storage for large files
- File filter (mime types)
- Size limits

UPLOAD-2. Audio File Validation
- Allowed types: WAV, MP3, FLAC, OGG
- Max size: 500MB
- Duration limits
- Malware scan (ClamAV optional)
- Format verification

UPLOAD-3. Image Processing
- Sharp for resizing
- Avatar: 256x256
- Artwork: multiple sizes
- Format conversion (WebP)
- Compression

UPLOAD-4. MinIO Integration
- Configure MinIO client
- Upload to bucket
- Generate object keys
- Set content type
- Delete objects

UPLOAD-5. Presigned URLs
- Upload presigned URLs
- Download presigned URLs
- Expiration configuration
- Access control
- Streaming support

UPLOAD-6. Upload Progress
- Chunked uploads
- Progress tracking
- Resume interrupted uploads
- Client-side progress events
- WebSocket progress updates

🏁 Definition of Done
- Audio files upload successfully
- Images processed and stored
- Invalid files rejected
- MinIO stores all files
- Presigned URLs work

>>>>>>

]]]]
```

---

## E13-T4: Background Job Processing (BullMQ)

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class background job processing engineer'
    target = implement BullMQ for async job processing
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = process 1000+ jobs/minute
    tech stack = ['BullMQ', 'Redis', 'NestJS', '@nestjs/bullmq']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement background job processing for DAWW3.
Handle async tasks: transcoding, notifications, analytics.

{{{{ #CUSTOMER PROMT

Background job processing отсутствует. Нужно:
- BullMQ setup с Redis
- Job queues для разных задач
- Retry logic
- Job scheduling
- Admin UI (Bull Board)

}}}}

<<<<<<#RECOMMENDED TASKS

JOBS-1. BullMQ Setup
- Install @nestjs/bullmq, bullmq
- Configure Redis connection
- Queue module registration
- Default job options
- Concurrency settings

JOBS-2. Job Queues
- audio-processing queue
- notifications queue
- analytics queue
- rating-calculation queue
- cleanup queue

JOBS-3. Audio Processing Jobs
- Waveform generation
- Transcoding (multiple formats)
- Duration extraction
- Metadata extraction
- Thumbnail generation

JOBS-4. Notification Jobs
- Email notifications
- Push notifications
- In-app notifications
- Batch processing
- Template rendering

JOBS-5. Job Scheduling
- Cron jobs (daily cleanup)
- Delayed jobs
- Repeatable jobs
- Rate limiting
- Priority queues

JOBS-6. Admin Dashboard
- Bull Board integration
- Job status monitoring
- Retry failed jobs
- Job history
- Queue metrics

🏁 Definition of Done
- Jobs process asynchronously
- Retries work on failure
- Scheduled jobs run on time
- Admin UI accessible
- Metrics track throughput

>>>>>>

]]]]
```

---

## E13-T5: WebSocket Authentication Middleware

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class WebSocket security engineer'
    target = implement proper authentication for WebSocket connections
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast auth validation
    tech stack = ['Socket.io', 'JWT', 'NestJS', 'Passport']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement authentication middleware for WebSocket connections.
Secure all realtime features with JWT validation.

{{{{ #CUSTOMER PROMT

WebSocket authentication middleware не реализован. Нужно:
- JWT validation при handshake
- Token refresh mechanism
- Role-based access to rooms
- Kick на token expiry
- Anonymous connections (limited)

}}}}

<<<<<<#RECOMMENDED TASKS

WS-AUTH-1. Handshake Authentication
- Extract token from auth header/query
- Validate JWT on connection
- Reject invalid tokens
- Attach user to socket
- Log authentication events

WS-AUTH-2. Token Refresh
- Detect token expiry
- Client refresh mechanism
- Update socket context
- Grace period handling
- Seamless reconnection

WS-AUTH-3. Role-Based Access
- Room access guards
- Admin-only rooms
- Artist-only features
- Premium features
- Permission checking

WS-AUTH-4. Connection Lifecycle
- Kick on logout
- Kick on token revoke
- Broadcast user status
- Connection limits per user
- Multi-device handling

WS-AUTH-5. Anonymous Mode
- Allow limited anonymous access
- Read-only rooms
- Rate limits for anonymous
- Upgrade to authenticated
- Captcha for abuse

WS-AUTH-6. Security Logging
- Log all auth events
- Failed attempts tracking
- Anomaly detection
- IP blocking on abuse
- Audit trail

🏁 Definition of Done
- Only authenticated users connect
- Token refresh works seamlessly
- Roles control room access
- Logout kicks connections
- Security events logged

>>>>>>

]]]]
```

---

## E13-T6: Automated Testing & CI/CD Pipeline

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DevOps and testing engineer'
    target = implement comprehensive testing and CI/CD
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast CI pipeline (< 10 min)
    tech stack = ['Vitest', 'Supertest', 'GitHub Actions', 'Docker']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement automated testing and CI/CD pipeline for DAWW3.
Unit tests, integration tests, E2E tests, automated deployment.

{{{{ #CUSTOMER PROMT

Automated testing и CI/CD не настроены. Нужно:
- Unit tests (Vitest)
- Integration tests (Supertest)
- E2E tests (basic)
- GitHub Actions pipeline
- Docker builds
- Staging deployment

}}}}

<<<<<<#RECOMMENDED TASKS

CI-1. Unit Test Setup
- Vitest configuration
- Test file patterns
- Coverage requirements (70%+)
- Mock utilities
- Test utilities

CI-2. API Integration Tests
- Supertest setup
- Test database (isolated)
- Auth testing
- CRUD operations
- Error scenarios

CI-3. E2E Test Framework
- Playwright or Cypress
- Basic user flows
- Authentication flow
- Audio playback test
- P2P basic test

CI-4. GitHub Actions Workflow
- Trigger on PR and push
- Lint check
- Type check
- Unit tests
- Integration tests
- Build verification

CI-5. Docker Build Pipeline
- Multi-stage builds
- Layer caching
- Image tagging
- Registry push
- Security scanning

CI-6. Deployment Pipeline
- Staging auto-deploy
- Production manual approval
- Rollback mechanism
- Health checks
- Smoke tests

🏁 Definition of Done
- Tests run on every PR
- Coverage > 70%
- CI completes < 10 min
- Docker images build
- Staging auto-deploys

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E5 (Backend) ✅
    │
    ├─────────────────────┬─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼                     ▼
E13-T1 (Redis WS)   E13-T2 (Rate Limit)  E13-T3 (File Upload)  E13-T4 (Jobs)
    │                     │                     │                     │
    └─────────┬───────────┴─────────────────────┴─────────────────────┤
              ▼                                                        │
        E13-T5 (WS Auth)                                              │
              │                                                        │
              └────────────────────────────────────────────────────────┤
                                                                       ▼
                                                              E13-T6 (Testing/CI)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Redis single point of failure | High | Redis Cluster or Sentinel |
| Rate limiting bypass | Medium | Multiple layers (edge + app) |
| Large file upload memory | High | Streaming uploads |
| CI pipeline slow | Medium | Parallelization, caching |
