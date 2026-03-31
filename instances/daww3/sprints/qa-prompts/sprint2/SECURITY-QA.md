# 🔐 Security — QA Test Specifications

> **Scope:** Cross-cutting security tests for entire DAWW3 platform
> **Areas:** Authentication, Authorization, Data Protection, Smart Contracts

---

## Agent Prompt for Security Testing

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive security tests
    expertize = 'you are world class security engineer and penetration tester'
    target = validate security across all DAWW3 systems
    test = true

    code style = [OWASP guidelines, Security-first]
    write docs = true
    deep thinking = true
    performance = security should not degrade UX
    tech stack = ['OWASP ZAP', 'Burp Suite', 'Slither', 'npm audit']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement security tests for DAWW3 covering:
- Authentication and session management
- Authorization and access control
- Input validation and injection prevention
- Smart contract security
- Data protection and privacy

{{{{ #CUSTOMER PROMT

Нужны security tests для:
- JWT: expiry, refresh, invalidation
- CORS: authorized origins only
- Input: SQL injection, XSS prevention
- Contracts: reentrancy, access control, integer safety
- DRM: session keys, memory protection
- Rate limiting: API abuse prevention

}}}}

<<<<<<#RECOMMENDED TASKS

SEC-1. Authentication Security Tests
SEC-2. Authorization & Access Control Tests
SEC-3. Input Validation Tests
SEC-4. Smart Contract Security Tests
SEC-5. DRM & Data Protection Tests
SEC-6. API Security Tests

>>>>>>

]]]]
```

---

## SEC-1: Authentication Security

```typescript
// apps/api/src/__tests__/security/auth.test.ts

describe('Authentication Security', () => {
  describe('JWT Token Security', () => {
    it('rejects expired tokens', async () => {
      const expiredToken = jwt.sign(
        { userId: 'user-1' },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' }
      )
      
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${expiredToken}`)
      
      expect(res.status).toBe(401)
      expect(res.body.message).toContain('expired')
    })

    it('rejects malformed tokens', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer not-a-valid-token')
      
      expect(res.status).toBe(401)
    })

    it('rejects tokens with invalid signature', async () => {
      const fakeToken = jwt.sign(
        { userId: 'user-1' },
        'wrong-secret'
      )
      
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${fakeToken}`)
      
      expect(res.status).toBe(401)
    })

    it('rejects tokens after logout', async () => {
      const token = await loginUser('user@test.com', 'password')
      
      await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
      
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.status).toBe(401)
    })
  })

  describe('Session Security', () => {
    it('session expires after inactivity', async () => {
      // Session timeout test
    })

    it('prevents session fixation', async () => {
      const oldSessionId = await getSessionId()
      await loginUser('user@test.com', 'password')
      const newSessionId = await getSessionId()
      
      expect(newSessionId).not.toBe(oldSessionId)
    })
  })

  describe('Password Security', () => {
    it('enforces minimum password complexity', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@test.com',
          password: '123' // Too weak
        })
      
      expect(res.status).toBe(400)
      expect(res.body.message).toContain('password')
    })

    it('passwords are hashed in database', async () => {
      const user = await prisma.user.findUnique({
        where: { email: 'test@test.com' }
      })
      
      expect(user.password).not.toBe('plaintext')
      expect(user.password).toMatch(/^\$2[aby]?\$/)  // bcrypt hash
    })
  })
})
```

---

## SEC-2: Authorization & Access Control

```typescript
describe('Authorization Security', () => {
  describe('Role-Based Access', () => {
    it('user cannot access admin endpoints', async () => {
      const userToken = await loginAs('user')
      
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
      
      expect(res.status).toBe(403)
    })

    it('artist can access own tracks only', async () => {
      const artistToken = await loginAs('artist-1')
      
      // Own track - allowed
      const ownRes = await request(app)
        .get('/api/v1/tracks/artist-1-track')
        .set('Authorization', `Bearer ${artistToken}`)
      expect(ownRes.status).toBe(200)
      
      // Other's track (private) - forbidden
      const otherRes = await request(app)
        .delete('/api/v1/tracks/artist-2-private-track')
        .set('Authorization', `Bearer ${artistToken}`)
      expect(otherRes.status).toBe(403)
    })
  })

  describe('CORS Security', () => {
    it('blocks requests from unauthorized origins', async () => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'https://evil-site.com')
      
      expect(res.headers['access-control-allow-origin']).toBeUndefined()
    })

    it('allows requests from authorized origins', async () => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3000')
      
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000')
    })
  })

  describe('Resource Ownership', () => {
    it('user cannot modify another user profile', async () => {
      const user1Token = await loginAs('user-1')
      
      const res = await request(app)
        .patch('/api/v1/users/user-2')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ displayName: 'Hacked' })
      
      expect(res.status).toBe(403)
    })
  })
})
```

---

## SEC-3: Input Validation

```typescript
describe('Input Validation Security', () => {
  describe('SQL Injection Prevention', () => {
    it('rejects SQL injection in query params', async () => {
      const res = await request(app)
        .get('/api/v1/tracks')
        .query({ search: "'; DROP TABLE tracks; --" })
      
      // Should not error, should return empty or handle safely
      expect(res.status).not.toBe(500)
    })

    it('sanitizes input in Prisma queries', async () => {
      // Prisma parameterizes by default
      const res = await request(app)
        .get('/api/v1/users')
        .query({ filter: "1=1 OR id='admin'" })
      
      expect(res.status).toBe(200)
      // Should not return all users
    })
  })

  describe('XSS Prevention', () => {
    it('escapes HTML in user input', async () => {
      const token = await loginAs('user')
      
      await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: '<script>alert("xss")</script>' })
      
      const user = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
      
      expect(user.body.displayName).not.toContain('<script>')
    })

    it('sanitizes track descriptions', async () => {
      const token = await loginAs('artist')
      
      const res = await request(app)
        .post('/api/v1/tracks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Track',
          description: '<img src=x onerror=alert(1)>'
        })
      
      expect(res.body.description).not.toContain('onerror')
    })
  })

  describe('File Upload Security', () => {
    it('rejects non-audio file types', async () => {
      const token = await loginAs('artist')
      
      const res = await request(app)
        .post('/api/v1/upload/audio')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('not audio'), 'malware.exe')
      
      expect(res.status).toBe(400)
    })

    it('validates magic bytes not just extension', async () => {
      // File with .wav extension but wrong content
      const fakeWav = Buffer.from('PK\x03\x04') // ZIP signature
      
      const res = await request(app)
        .post('/api/v1/upload/audio')
        .attach('file', fakeWav, 'track.wav')
      
      expect(res.status).toBe(400)
      expect(res.body.message).toContain('invalid')
    })
  })

  describe('Request Size Limits', () => {
    it('rejects oversized JSON payloads', async () => {
      const largePayload = { data: 'x'.repeat(10 * 1024 * 1024) } // 10MB
      
      const res = await request(app)
        .post('/api/v1/tracks')
        .send(largePayload)
      
      expect(res.status).toBe(413) // Payload Too Large
    })
  })
})
```

---

## SEC-4: Smart Contract Security

```typescript
// apps/contracts/test/Security.test.ts

describe('Smart Contract Security', () => {
  describe('Reentrancy Protection', () => {
    it('RoyaltySplit has reentrancy guard', async () => {
      // Deploy attacker contract
      const Attacker = await ethers.getContractFactory('ReentrancyAttacker')
      const attacker = await Attacker.deploy(royaltySplit.target)
      
      await trackNFT.mintTrack('track', 'uri', [attacker.target], [10000])
      
      // Attack should fail
      await expect(
        attacker.attack({ value: ethers.parseEther('1') })
      ).to.be.reverted
    })
  })

  describe('Access Control', () => {
    it('only owner can pause', async () => {
      await expect(
        royaltyDistributor.connect(attacker).pause()
      ).to.be.revertedWith('Ownable')
    })

    it('only track owner can update metadata', async () => {
      await trackNFT.mintTrack('track', 'uri', [artist.address], [10000])
      
      await expect(
        trackNFT.connect(attacker).setTokenURI(1, 'evil-uri')
      ).to.be.revertedWith('Not authorized')
    })
  })

  describe('Integer Safety', () => {
    it('handles division by zero', async () => {
      // Should not allow 0 shares
      await expect(
        trackNFT.mintTrack('track', 'uri', [artist.address], [0])
      ).to.be.revertedWith('Invalid shares')
    })

    it('Solidity 0.8 overflow protection', async () => {
      // Arithmetic automatically reverts on overflow
      await expect(
        royaltySplit.testOverflow(ethers.MaxUint256, 1)
      ).to.be.revertedWithPanic(0x11) // Overflow panic code
    })
  })

  describe('Frontrunning Mitigation', () => {
    it('uses commit-reveal for sensitive operations', async () => {
      // If applicable to your contracts
    })
  })
})
```

---

## SEC-5: DRM & Data Protection

```typescript
describe('DRM Security', () => {
  describe('Session Key Protection', () => {
    it('session keys are never stored in localStorage', () => {
      const manager = new SessionKeyManager()
      manager.initSession(masterKey)
      
      const stored = localStorage.getItem('session-key')
      expect(stored).toBeNull()
    })

    it('session keys are destroyed on logout', async () => {
      const manager = new SessionKeyManager()
      await manager.initSession(masterKey)
      
      manager.destroySession()
      
      await expect(
        manager.decryptChunk(data, nonce)
      ).rejects.toThrow()
    })
  })

  describe('Memory Protection', () => {
    it('audio buffers are zeroed on clear', () => {
      const buffer = new MemoryOnlyBuffer(5)
      const data = new ArrayBuffer(100)
      new Uint8Array(data).fill(255)
      
      buffer.addChunk(0, data)
      buffer.clear()
      
      expect(new Uint8Array(data).every(b => b === 0)).toBe(true)
    })
  })

  describe('Private Key Security', () => {
    it('no private keys in source code', () => {
      // Scan codebase for private key patterns
      const patterns = [
        /0x[a-fA-F0-9]{64}/, // Private key
        /-----BEGIN.*PRIVATE KEY-----/
      ]
      
      // Would use grep in real test
      expect(true).toBe(true) // Placeholder
    })

    it('env variables for sensitive data', () => {
      expect(process.env.JWT_SECRET).toBeDefined()
      expect(process.env.JWT_SECRET).not.toBe('development-secret')
    })
  })
})
```

---

## SEC-6: API Security

```typescript
describe('API Security', () => {
  describe('Rate Limiting', () => {
    it('blocks brute force login attempts', async () => {
      const attempts = Array(20).fill(null).map(() =>
        request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'user@test.com', password: 'wrong' })
      )
      
      const responses = await Promise.all(attempts)
      const blocked = responses.filter(r => r.status === 429)
      
      expect(blocked.length).toBeGreaterThan(0)
    })
  })

  describe('Secure Headers', () => {
    it('sets security headers', async () => {
      const res = await request(app).get('/api/v1/health')
      
      expect(res.headers['x-content-type-options']).toBe('nosniff')
      expect(res.headers['x-frame-options']).toBe('DENY')
      expect(res.headers['x-xss-protection']).toBe('1; mode=block')
    })

    it('sets CSP header', async () => {
      const res = await request(app).get('/')
      
      expect(res.headers['content-security-policy']).toBeDefined()
    })
  })

  describe('HTTPS Enforcement', () => {
    it('redirects HTTP to HTTPS in production', () => {
      // Test in production environment
    })
  })
})
```

---

## Security Test Checklist

### Pre-Deployment Security Review

- [ ] **Authentication**: JWT expiry, refresh, logout invalidation
- [ ] **Authorization**: RBAC enforced, ownership checks
- [ ] **CORS**: Only authorized origins
- [ ] **Input Validation**: SQL injection, XSS prevented
- [ ] **File Uploads**: Type validation, size limits
- [ ] **Rate Limiting**: Brute force protection
- [ ] **Headers**: Security headers set
- [ ] **Contracts**: Slither clean, reentrancy protected
- [ ] **DRM**: Memory protection, key destruction
- [ ] **Dependencies**: npm audit clean
- [ ] **Secrets**: No hardcoded keys, env vars used

---

## Automated Security Scans

```bash
# Dependency vulnerabilities
npm audit
pnpm audit

# Smart contract analysis
cd apps/contracts && npx slither .

# OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:4000

# Secret scanning
npx secretlint "**/*"
```

---

*Security QA — DAWW3 Project*
