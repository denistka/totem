# 🖥️ E5: Backend API — QA Test Specifications

> **Epic:** E5 - NestJS Backend Core
> **Status:** ✅ DONE
> **Focus:** REST API, WebSocket, Prisma, Authentication, Entities

---

## Test Areas

### E5-QA-1: REST API
```typescript
describe('REST API', () => {
  describe('Authentication', () => {
    it('registers user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@test.com', password: 'SecurePass123!' })
      
      expect(res.status).toBe(201)
      expect(res.body.token).toBeDefined()
    })

    it('logs in user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'SecurePass123!' })
      
      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
    })

    it('rejects invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' })
      
      expect(res.status).toBe(401)
    })
  })

  describe('Tracks CRUD', () => {
    let token: string

    beforeEach(async () => {
      token = await getAuthToken()
    })

    it('creates track', async () => {
      const res = await request(app)
        .post('/api/v1/tracks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Track' })
      
      expect(res.status).toBe(201)
      expect(res.body.id).toBeDefined()
    })

    it('lists tracks', async () => {
      const res = await request(app).get('/api/v1/tracks')
      
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('gets single track', async () => {
      const res = await request(app).get('/api/v1/tracks/track-1')
      
      expect(res.status).toBe(200)
      expect(res.body.title).toBeDefined()
    })

    it('updates track', async () => {
      const res = await request(app)
        .patch('/api/v1/tracks/track-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Title' })
      
      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Updated Title')
    })

    it('deletes track', async () => {
      const res = await request(app)
        .delete('/api/v1/tracks/track-1')
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.status).toBe(204)
    })
  })
})
```

### E5-QA-2: WebSocket Gateway
```typescript
describe('WebSocket Gateway', () => {
  let socket: Socket

  beforeEach((done) => {
    socket = io('http://localhost:4000', {
      auth: { token: testToken }
    })
    socket.on('connect', done)
  })

  afterEach(() => {
    socket.close()
  })

  it('authenticates on connect', () => {
    expect(socket.connected).toBe(true)
  })

  it('joins track room', (done) => {
    socket.emit('join-track', { trackId: 'track-1' })
    socket.on('joined-track', (data) => {
      expect(data.trackId).toBe('track-1')
      done()
    })
  })

  it('receives play events', (done) => {
    socket.emit('join-track', { trackId: 'track-1' })
    socket.on('track-play', (data) => {
      expect(data.listeners).toBeDefined()
      done()
    })
    
    // Trigger play from another socket
    triggerPlay('track-1')
  })
})
```

### E5-QA-3: Prisma Models
```typescript
describe('Prisma Models', () => {
  it('creates user with profile', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: 'hashed',
        profile: { create: { displayName: 'Test User' } }
      },
      include: { profile: true }
    })
    
    expect(user.profile.displayName).toBe('Test User')
  })

  it('creates track with relations', async () => {
    const track = await prisma.track.create({
      data: {
        title: 'Test',
        userId: 'user-1',
        plays: { create: [{ userId: 'listener-1' }] }
      },
      include: { _count: { select: { plays: true } } }
    })
    
    expect(track._count.plays).toBe(1)
  })
})
```

---

## API Documentation Test
```typescript
describe('OpenAPI Spec', () => {
  it('generates valid OpenAPI 3.0', async () => {
    const res = await request(app).get('/api/docs-json')
    const spec = res.body
    
    expect(spec.openapi).toMatch(/^3\./)
    expect(spec.paths['/api/v1/tracks']).toBeDefined()
  })
})
```

---

## Regression Tests

```typescript
describe('E5 Regression', () => {
  it.todo('Pagination cursor encoding')
  it.todo('Search with full-text index')
  it.todo('Rate limiting per user')
  it.todo('File upload handling')
  it.todo('WebSocket reconnection')
})
```

---

*E5 Backend QA — DAWW3 Project*
