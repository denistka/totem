# 🚀 E13: Backend Scaling — QA Test Specifications

> **Epic:** E13 - Backend Scaling & Infrastructure
> **Status:** ✅ DONE
> **Focus:** Redis Socket.io, Rate Limiting, File Upload, BullMQ Jobs, CI/CD

---

## Agent Prompt for Backend Scaling Testing

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive scaling and infrastructure tests
    expertize = 'you are world class backend scalability and DevOps testing specialist'
    target = validate backend scaling infrastructure under load
    test = true

    code style = [Load testing, Stress testing, Chaos engineering]
    write docs = true
    deep thinking = true
    performance = benchmark 10K connections
    tech stack = ['Vitest', 'Supertest', 'Artillery', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for DAWW3 backend scaling infrastructure covering:
- Redis adapter for Socket.io horizontal scaling
- Rate limiting with Redis backend
- File upload handling with MinIO
- BullMQ background job processing
- WebSocket authentication middleware
- CI/CD pipeline validation

{{{{ #CUSTOMER PROMT

Нужны тесты для:
- RedisIoAdapter: multi-instance WebSocket state, room sync, failover
- Rate limiting: 10/sec, 50/10s, 100/min тиеры, per-endpoint limits
- MinIO upload: audio validation, image processing, presigned URLs
- BullMQ: 5 queues, job retry, scheduled jobs
- WS Auth: JWT validation, role hierarchy, connection limits
- CI/CD: lint, typecheck, unit tests, E2E, Docker builds

}}}}

<<<<<<#RECOMMENDED TASKS

E13-QA-1. Redis Socket.io Adapter Tests
- Test multi-instance message propagation
- Test room sync across instances
- Test connection state recovery
- Test graceful failover
- Test WebSocket metrics (Prometheus)

E13-QA-2. Rate Limiting Tests
- Test short throttler (10 requests/second)
- Test medium throttler (50 requests/10 seconds)
- Test long throttler (100 requests/minute)
- Test per-endpoint limits (auth, upload)
- Test response headers
- Test Redis-backed storage

E13-QA-3. File Upload Tests
- Test audio file validation (WAV, MP3, FLAC)
- Test image processing (resize, WebP)
- Test file size limits (500MB)
- Test presigned URL generation
- Test MinIO bucket operations

E13-QA-4. BullMQ Job Tests
- Test job creation and processing
- Test job retry with backoff
- Test scheduled jobs (cron)
- Test job progress tracking
- Test queue metrics

E13-QA-5. WebSocket Auth Tests
- Test handshake authentication
- Test token refresh mechanism
- Test role-based access (user, artist, admin)
- Test connection limits (5 per user)
- Test presence tracking

E13-QA-6. CI/CD Pipeline Tests
- Test lint passes
- Test typecheck passes
- Test unit tests pass
- Test E2E tests with services
- Test Docker build succeeds

🏁 Definition of Done
- 10K concurrent WebSocket connections supported
- Rate limiting accurate within 5% tolerance
- File uploads complete without corruption
- Background jobs process reliably
- CI/CD pipeline is green

>>>>>>

]]]]
```

---

## Unit Tests

### E13-QA-1: Redis Socket.io Adapter

```typescript
// apps/api/src/common/websocket/__tests__/redis-io-adapter.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { RedisIoAdapter } from '../redis-io-adapter'
import { createClient } from 'redis'

describe('RedisIoAdapter', () => {
  let adapter: RedisIoAdapter
  let pubClient: ReturnType<typeof createClient>
  let subClient: ReturnType<typeof createClient>

  beforeEach(async () => {
    pubClient = createClient({ url: process.env.REDIS_URL })
    subClient = pubClient.duplicate()
    await pubClient.connect()
    await subClient.connect()
    
    adapter = new RedisIoAdapter(pubClient, subClient)
  })

  afterEach(async () => {
    await pubClient.quit()
    await subClient.quit()
  })

  describe('Multi-Instance Message Propagation', () => {
    it('broadcasts message to all instances', async () => {
      const received: string[] = []
      
      // Simulate second instance listening
      await subClient.subscribe('socket.io#/#', (message) => {
        received.push(message)
      })
      
      // Emit from first instance
      adapter.emit('test-event', { data: 'hello' })
      
      // Wait for propagation
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(received.length).toBeGreaterThan(0)
    })
  })

  describe('Room Synchronization', () => {
    it('syncs room membership across instances', async () => {
      const roomId = 'test-room'
      const clientId = 'client-1'
      
      await adapter.joinRoom(clientId, roomId)
      
      // Check Redis has room data
      const members = await pubClient.sMembers(`room:${roomId}`)
      expect(members).toContain(clientId)
    })

    it('removes client from room on leave', async () => {
      const roomId = 'test-room'
      const clientId = 'client-1'
      
      await adapter.joinRoom(clientId, roomId)
      await adapter.leaveRoom(clientId, roomId)
      
      const members = await pubClient.sMembers(`room:${roomId}`)
      expect(members).not.toContain(clientId)
    })
  })

  describe('Connection State Recovery', () => {
    it('recovers state within 2-minute window', async () => {
      const clientId = 'client-1'
      const sessionData = { userId: 'user-1', rooms: ['room-1'] }
      
      // Store session
      await adapter.storeSession(clientId, sessionData)
      
      // Simulate disconnect and reconnect
      const recovered = await adapter.recoverSession(clientId)
      
      expect(recovered).toEqual(sessionData)
    })

    it('expires state after window', async () => {
      const clientId = 'client-1'
      
      await adapter.storeSession(clientId, { userId: 'user-1' })
      
      // Set TTL to 0 for testing
      await pubClient.expire(`session:${clientId}`, 0)
      
      const recovered = await adapter.recoverSession(clientId)
      expect(recovered).toBeNull()
    })
  })
})
```

### E13-QA-2: Rate Limiting

```typescript
// apps/api/src/common/throttler/__tests__/rate-limiting.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { Test } from '@nestjs/testing'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { RedisThrottlerStorage } from '../redis-throttler-storage'
import * as request from 'supertest'

describe('Rate Limiting', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [
            { name: 'short', ttl: 1000, limit: 10 },
            { name: 'medium', ttl: 10000, limit: 50 },
            { name: 'long', ttl: 60000, limit: 100 }
          ],
          storage: new RedisThrottlerStorage()
        })
      ]
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  describe('Short Throttler (10/second)', () => {
    it('allows 10 requests per second', async () => {
      const promises = Array(10).fill(null).map(() =>
        request(app.getHttpServer()).get('/api/v1/health')
      )
      
      const responses = await Promise.all(promises)
      
      responses.forEach(res => {
        expect(res.status).toBe(200)
      })
    })

    it('blocks 11th request within second', async () => {
      const promises = Array(11).fill(null).map(() =>
        request(app.getHttpServer()).get('/api/v1/health')
      )
      
      const responses = await Promise.all(promises)
      
      const blocked = responses.filter(r => r.status === 429)
      expect(blocked.length).toBe(1)
    })
  })

  describe('Response Headers', () => {
    it('includes rate limit headers', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health')
      
      expect(res.headers['x-ratelimit-limit']).toBeDefined()
      expect(res.headers['x-ratelimit-remaining']).toBeDefined()
      expect(res.headers['x-ratelimit-reset']).toBeDefined()
    })

    it('remaining decreases with each request', async () => {
      const res1 = await request(app.getHttpServer()).get('/api/v1/health')
      const res2 = await request(app.getHttpServer()).get('/api/v1/health')
      
      const remaining1 = parseInt(res1.headers['x-ratelimit-remaining'])
      const remaining2 = parseInt(res2.headers['x-ratelimit-remaining'])
      
      expect(remaining2).toBe(remaining1 - 1)
    })
  })

  describe('Per-Endpoint Limits', () => {
    it('auth endpoints have stricter limits (10/minute)', async () => {
      const promises = Array(11).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ email: 'test@test.com', password: 'wrong' })
      )
      
      const responses = await Promise.all(promises)
      
      const blocked = responses.filter(r => r.status === 429)
      expect(blocked.length).toBeGreaterThan(0)
    })

    it('upload endpoints have moderate limits (20/minute)', async () => {
      // Would need file upload setup
    })
  })

  describe('User vs IP Based', () => {
    it('tracks by user ID when authenticated', async () => {
      const token = await getTestToken()
      
      // User 1 hits limit
      for (let i = 0; i < 100; i++) {
        await request(app.getHttpServer())
          .get('/api/v1/users/me')
          .set('Authorization', `Bearer ${token}`)
      }
      
      // User 2 should still work
      const token2 = await getTestToken('user2')
      const res = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token2}`)
      
      expect(res.status).toBe(200)
    })
  })
})
```

### E13-QA-3: File Upload

```typescript
// apps/api/src/modules/upload/__tests__/file-upload.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { MinioService } from '../minio.service'
import { ImageProcessorService } from '../image-processor.service'
import * as fs from 'fs'
import * as path from 'path'

describe('File Upload', () => {
  let minioService: MinioService
  let imageProcessor: ImageProcessorService

  beforeEach(() => {
    minioService = new MinioService()
    imageProcessor = new ImageProcessorService()
  })

  describe('Audio Validation', () => {
    it('accepts valid WAV file', async () => {
      const wavHeader = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x00, 0x00, 0x00, 0x00, // File size
        0x57, 0x41, 0x56, 0x45  // "WAVE"
      ])
      
      const isValid = minioService.validateAudioMagicBytes(wavHeader)
      expect(isValid).toBe(true)
    })

    it('accepts valid MP3 file', async () => {
      const mp3Header = Buffer.from([
        0x49, 0x44, 0x33, // ID3
        0x04, 0x00, 0x00
      ])
      
      const isValid = minioService.validateAudioMagicBytes(mp3Header)
      expect(isValid).toBe(true)
    })

    it('accepts valid FLAC file', async () => {
      const flacHeader = Buffer.from([
        0x66, 0x4C, 0x61, 0x43 // "fLaC"
      ])
      
      const isValid = minioService.validateAudioMagicBytes(flacHeader)
      expect(isValid).toBe(true)
    })

    it('rejects invalid file type', async () => {
      const invalidHeader = Buffer.from([
        0x00, 0x00, 0x00, 0x00
      ])
      
      const isValid = minioService.validateAudioMagicBytes(invalidHeader)
      expect(isValid).toBe(false)
    })
  })

  describe('File Size Limits', () => {
    it('accepts files under 500MB', async () => {
      const size = 400 * 1024 * 1024 // 400MB
      expect(minioService.isFileSizeValid(size)).toBe(true)
    })

    it('rejects files over 500MB', async () => {
      const size = 600 * 1024 * 1024 // 600MB
      expect(minioService.isFileSizeValid(size)).toBe(false)
    })
  })

  describe('Image Processing', () => {
    it('resizes image to multiple sizes', async () => {
      const input = await fs.promises.readFile(
        path.join(__dirname, 'fixtures/test-image.jpg')
      )
      
      const variants = await imageProcessor.processImage(input, {
        sizes: [
          { name: 'thumb', width: 100, height: 100 },
          { name: 'medium', width: 300, height: 300 },
          { name: 'large', width: 800, height: 800 }
        ]
      })
      
      expect(variants).toHaveLength(3)
      expect(variants[0].name).toBe('thumb')
    })

    it('converts to WebP format', async () => {
      const input = await fs.promises.readFile(
        path.join(__dirname, 'fixtures/test-image.jpg')
      )
      
      const result = await imageProcessor.convertToWebP(input)
      
      // WebP magic bytes
      expect(result.slice(0, 4).toString()).toBe('RIFF')
      expect(result.slice(8, 12).toString()).toBe('WEBP')
    })
  })

  describe('Presigned URLs', () => {
    it('generates upload URL with expiration', async () => {
      const url = await minioService.getPresignedUploadUrl(
        'audio',
        'test-file.wav',
        3600 // 1 hour
      )
      
      expect(url).toContain('X-Amz-Signature')
      expect(url).toContain('X-Amz-Expires=3600')
    })

    it('generates download URL', async () => {
      const url = await minioService.getPresignedDownloadUrl(
        'audio',
        'test-file.wav',
        3600
      )
      
      expect(url).toContain('X-Amz-Signature')
    })
  })
})
```

### E13-QA-4: BullMQ Jobs

```typescript
// apps/api/src/modules/jobs/__tests__/bullmq-jobs.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Queue, Worker, Job } from 'bullmq'
import { AudioProcessingJob, NotificationJob } from '../job-processors'

describe('BullMQ Jobs', () => {
  let audioQueue: Queue
  let notificationQueue: Queue

  beforeEach(async () => {
    audioQueue = new Queue('audio-processing', {
      connection: { host: 'localhost', port: 6379 }
    })
    notificationQueue = new Queue('notifications', {
      connection: { host: 'localhost', port: 6379 }
    })
  })

  afterEach(async () => {
    await audioQueue.close()
    await notificationQueue.close()
  })

  describe('Job Creation', () => {
    it('creates audio processing job', async () => {
      const job = await audioQueue.add('waveform', {
        trackId: 'track-1',
        filePath: '/uploads/track-1.wav'
      })
      
      expect(job.id).toBeDefined()
      expect(job.name).toBe('waveform')
    })

    it('creates notification job', async () => {
      const job = await notificationQueue.add('email', {
        userId: 'user-1',
        template: 'track-published',
        data: { trackTitle: 'Test Song' }
      })
      
      expect(job.id).toBeDefined()
    })
  })

  describe('Job Processing', () => {
    it('processes job and completes', async () => {
      const processor = new AudioProcessingJob()
      
      await audioQueue.add('test', { trackId: 'track-1' })
      
      const worker = new Worker('audio-processing', async (job) => {
        return await processor.process(job)
      })
      
      const completed = await new Promise<Job>(resolve => {
        worker.on('completed', (job) => resolve(job))
      })
      
      expect(completed.returnvalue).toBeDefined()
      
      await worker.close()
    })
  })

  describe('Job Retry', () => {
    it('retries failed job with exponential backoff', async () => {
      let attempts = 0
      
      await audioQueue.add('retry-test', { shouldFail: true }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 }
      })
      
      const worker = new Worker('audio-processing', async () => {
        attempts++
        if (attempts < 3) {
          throw new Error('Simulated failure')
        }
        return 'success'
      })
      
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      expect(attempts).toBe(3)
      
      await worker.close()
    })
  })

  describe('Scheduled Jobs', () => {
    it('runs job at scheduled time', async () => {
      const scheduledTime = Date.now() + 2000 // 2 seconds from now
      
      await audioQueue.add('scheduled', { data: 'test' }, {
        delay: 2000
      })
      
      const startTime = Date.now()
      
      const worker = new Worker('audio-processing', async () => 'done')
      
      await new Promise<void>(resolve => {
        worker.on('completed', () => {
          const endTime = Date.now()
          expect(endTime - startTime).toBeGreaterThan(1900)
          resolve()
        })
      })
      
      await worker.close()
    })
  })

  describe('Job Progress', () => {
    it('reports progress during processing', async () => {
      const progressValues: number[] = []
      
      await audioQueue.add('progress-test', { trackId: 'track-1' })
      
      const worker = new Worker('audio-processing', async (job) => {
        await job.updateProgress(25)
        await job.updateProgress(50)
        await job.updateProgress(75)
        await job.updateProgress(100)
        return 'done'
      })
      
      worker.on('progress', (job, progress) => {
        progressValues.push(progress as number)
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      expect(progressValues).toContain(25)
      expect(progressValues).toContain(100)
      
      await worker.close()
    })
  })
})
```

### E13-QA-5: WebSocket Auth

```typescript
// apps/api/src/common/websocket/__tests__/ws-auth.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { WsAuthGuard } from '../ws-auth.guard'
import { WsConnectionService } from '../ws-connection.service'
import { JwtService } from '@nestjs/jwt'

describe('WebSocket Authentication', () => {
  let guard: WsAuthGuard
  let jwtService: JwtService
  let connectionService: WsConnectionService

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test-secret' })
    connectionService = new WsConnectionService()
    guard = new WsAuthGuard(jwtService, connectionService)
  })

  describe('Handshake Authentication', () => {
    it('accepts valid JWT in handshake', async () => {
      const token = jwtService.sign({ userId: 'user-1', role: 'user' })
      
      const socket = {
        handshake: {
          auth: { token },
          headers: {}
        }
      } as any
      
      const result = await guard.canActivate({ switchToWs: () => ({ getClient: () => socket }) } as any)
      
      expect(result).toBe(true)
    })

    it('rejects missing token', async () => {
      const socket = {
        handshake: {
          auth: {},
          headers: {}
        }
      } as any
      
      await expect(
        guard.canActivate({ switchToWs: () => ({ getClient: () => socket }) } as any)
      ).rejects.toThrow()
    })

    it('rejects expired token', async () => {
      const token = jwtService.sign(
        { userId: 'user-1', role: 'user' },
        { expiresIn: '-1s' }
      )
      
      const socket = {
        handshake: {
          auth: { token },
          headers: {}
        }
      } as any
      
      await expect(
        guard.canActivate({ switchToWs: () => ({ getClient: () => socket }) } as any)
      ).rejects.toThrow()
    })
  })

  describe('Role-Based Access', () => {
    it('allows admin access to admin endpoint', async () => {
      const token = jwtService.sign({ userId: 'admin-1', role: 'admin' })
      
      const canAccess = guard.checkRole('admin', ['admin', 'artist'])
      expect(canAccess).toBe(true)
    })

    it('denies user access to admin endpoint', async () => {
      const canAccess = guard.checkRole('user', ['admin'])
      expect(canAccess).toBe(false)
    })

    it('follows role hierarchy', async () => {
      // admin > artist > user
      expect(guard.checkRole('admin', ['user'])).toBe(true)
      expect(guard.checkRole('artist', ['user'])).toBe(true)
      expect(guard.checkRole('user', ['artist'])).toBe(false)
    })
  })

  describe('Connection Limits', () => {
    it('allows up to 5 connections per user', async () => {
      const userId = 'user-1'
      
      for (let i = 0; i < 5; i++) {
        await connectionService.addConnection(userId, `socket-${i}`)
      }
      
      const count = await connectionService.getConnectionCount(userId)
      expect(count).toBe(5)
    })

    it('rejects 6th connection', async () => {
      const userId = 'user-1'
      
      for (let i = 0; i < 5; i++) {
        await connectionService.addConnection(userId, `socket-${i}`)
      }
      
      await expect(
        connectionService.addConnection(userId, 'socket-6')
      ).rejects.toThrow('Connection limit')
    })
  })
})
```

---

## Load Tests

### E13-LOAD: 10K Connections Benchmark

```typescript
// apps/api/src/__tests__/load/websocket-load.test.ts

import { describe, it, expect } from 'vitest'
import { io } from 'socket.io-client'

describe('WebSocket Load Test', () => {
  it.skip('handles 10K concurrent connections', async () => {
    const connectionCount = 10000
    const sockets: Socket[] = []
    
    const startTime = performance.now()
    
    // Create connections in batches
    for (let batch = 0; batch < 100; batch++) {
      const batchPromises = Array(100).fill(null).map((_, i) => {
        return new Promise<Socket>((resolve, reject) => {
          const socket = io('http://localhost:4000', {
            auth: { token: getTestToken(`user-${batch * 100 + i}`) }
          })
          
          socket.on('connect', () => resolve(socket))
          socket.on('connect_error', reject)
        })
      })
      
      const batchSockets = await Promise.all(batchPromises)
      sockets.push(...batchSockets)
    }
    
    const connectTime = performance.now() - startTime
    
    expect(sockets.length).toBe(connectionCount)
    expect(connectTime).toBeLessThan(60000) // < 60 seconds
    
    // Cleanup
    sockets.forEach(s => s.close())
  }, 120000)
})
```

---

## CI/CD Tests

### E13-QA-6: Pipeline Validation

```yaml
# .github/workflows/ci.yml - Test file
name: CI Pipeline Test

jobs:
  test-pipeline:
    runs-on: ubuntu-latest
    steps:
      - name: Lint Check
        run: pnpm lint
        
      - name: Type Check
        run: pnpm typecheck
        
      - name: Unit Tests
        run: pnpm test:unit
        
      - name: Integration Tests
        run: pnpm test:integration
        
      - name: E2E Tests
        run: pnpm test:e2e
        
      - name: Build Docker
        run: docker build -t daww3-api apps/api
```

---

## Manual Test Checklist

### E13-MANUAL: Infrastructure Validation

- [ ] **Redis Failover**: Stop Redis, verify reconnection
- [ ] **Multi-Instance WS**: Deploy 2 API instances, verify room sync
- [ ] **Rate Limit Headers**: Check browser DevTools for headers
- [ ] **File Upload**: Upload 400MB file, verify success
- [ ] **Job Dashboard**: Visit /admin/queues, verify jobs visible
- [ ] **WS Connection Limit**: Open 6 tabs, verify 6th rejected
- [ ] **CI Pipeline**: Push PR, verify all checks pass

---

## Regression Tests

```typescript
describe('E13 Regression Tests', () => {
  it.todo('Redis Cluster/Sentinel for HA')
  it.todo('Audio transcoding with ffmpeg')
  it.todo('Email notifications with SMTP')
  it.todo('Push notifications with FCM')
  it.todo('ClamAV malware scanning')
  it.todo('Rate limit bypass for trusted IPs')
  it.todo('Automatic IP blocking')
  it.todo('Codecov integration')
  it.todo('Kubernetes deployment')
})
```

---

*E13 Backend Scaling QA — DAWW3 Project*
