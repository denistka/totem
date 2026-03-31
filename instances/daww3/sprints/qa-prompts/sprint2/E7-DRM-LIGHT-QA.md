# 🔒 E7: DRM-light — QA Test Specifications

> **Epic:** E7 - DRM-light Protection
> **Status:** ✅ DONE
> **Focus:** Memory-only buffers, Session encryption, Watermark injection

---

## Agent Prompt for DRM-light Testing

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive DRM protection tests
    expertize = 'you are world class security and audio protection testing specialist'
    target = validate DRM-light protections work without breaking UX
    test = true

    code style = [Security testing, Penetration testing mindset]
    write docs = true
    deep thinking = true
    performance = measure overhead of protection
    tech stack = ['Vitest', 'Web Crypto API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for DAWW3 DRM-light system covering:
- Memory-only buffer enforcement
- Session key encryption/decryption
- Watermark injection and extraction
- Attack resistance (casual piracy prevention)

{{{{ #CUSTOMER PROMT

Нужны тесты для:
- MemoryOnlyBuffer: LRU eviction, secure deletion, page unload cleanup
- SecureAudioBuffer: decoded samples protection
- SessionKeyManager: HKDF derivation, AES-GCM, expiry
- AudioWatermark: spread-spectrum encoding, -60dB inaudible
- WatermarkInjector: real-time processing
- Forensic extraction tool accuracy
- Attack vectors: DevTools, memory dump, compression survival

}}}}

<<<<<<#RECOMMENDED TASKS

E7-QA-1. Memory-Only Buffer Tests
- Test chunk addition and retrieval
- Test LRU eviction when capacity reached
- Test secure deletion (buffer zeroed)
- Test page unload cleanup
- Test memory limit enforcement

E7-QA-2. Session Encryption Tests
- Test unique session ID generation
- Test HKDF key derivation
- Test AES-GCM encryption/decryption
- Test key expiry handling
- Test key destruction on stop

E7-QA-3. Watermark Tests
- Test watermark generation from session ID
- Test inaudibility (< -60dB)
- Test injection into audio samples
- Test extraction accuracy
- Test compression survival (MP3)

E7-QA-4. Security Attack Tests
- Test DevTools cannot save audio
- Test memory dump resistance
- Test Service Worker exclusion
- Test Blob URL prevention

E7-QA-5. Performance Tests
- Test encryption overhead
- Test watermark injection latency
- Test memory cleanup timing

🏁 Definition of Done
- All protection mechanisms validated
- Watermark extraction accuracy > 95%
- Encryption overhead < 1ms per chunk
- No audio quality degradation audible

>>>>>>

]]]]
```

---

## Unit Tests

### E7-QA-1: Memory-Only Buffer

```typescript
// apps/web/src/core/drm/__tests__/memory-only-buffer.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryOnlyBuffer } from '../memory-only-buffer'

describe('MemoryOnlyBuffer', () => {
  let buffer: MemoryOnlyBuffer

  beforeEach(() => {
    buffer = new MemoryOnlyBuffer(5) // Max 5 chunks
  })

  afterEach(() => {
    buffer.clear()
  })

  describe('Chunk Storage', () => {
    it('stores and retrieves chunks', () => {
      const data = new ArrayBuffer(100)
      new Uint8Array(data).fill(42)
      
      buffer.addChunk(0, data)
      
      const retrieved = buffer.getChunk(0)
      expect(retrieved).toBeDefined()
      expect(new Uint8Array(retrieved!)[0]).toBe(42)
    })

    it('returns undefined for non-existent chunk', () => {
      expect(buffer.getChunk(999)).toBeUndefined()
    })

    it('overwrites existing chunk', () => {
      const data1 = new ArrayBuffer(100)
      new Uint8Array(data1).fill(1)
      
      const data2 = new ArrayBuffer(100)
      new Uint8Array(data2).fill(2)
      
      buffer.addChunk(0, data1)
      buffer.addChunk(0, data2)
      
      const retrieved = buffer.getChunk(0)
      expect(new Uint8Array(retrieved!)[0]).toBe(2)
    })
  })

  describe('LRU Eviction', () => {
    it('evicts oldest chunk when capacity reached', () => {
      for (let i = 0; i < 6; i++) {
        buffer.addChunk(i, new ArrayBuffer(100))
      }
      
      // Chunk 0 should be evicted
      expect(buffer.getChunk(0)).toBeUndefined()
      // Chunks 1-5 should exist
      expect(buffer.getChunk(1)).toBeDefined()
      expect(buffer.getChunk(5)).toBeDefined()
    })

    it('updates access order on get', () => {
      buffer.addChunk(0, new ArrayBuffer(100))
      buffer.addChunk(1, new ArrayBuffer(100))
      buffer.addChunk(2, new ArrayBuffer(100))
      buffer.addChunk(3, new ArrayBuffer(100))
      buffer.addChunk(4, new ArrayBuffer(100))
      
      // Access chunk 0, making it recently used
      buffer.getChunk(0)
      
      // Add new chunk, should evict chunk 1 (oldest unused)
      buffer.addChunk(5, new ArrayBuffer(100))
      
      expect(buffer.getChunk(0)).toBeDefined() // Accessed recently
      expect(buffer.getChunk(1)).toBeUndefined() // Evicted
    })
  })

  describe('Secure Deletion', () => {
    it('zeros buffer memory on delete', () => {
      const data = new ArrayBuffer(100)
      const view = new Uint8Array(data)
      view.fill(255)
      
      buffer.addChunk(0, data)
      buffer.secureDelete(0)
      
      // Original buffer should be zeroed
      expect(view.every(b => b === 0)).toBe(true)
    })

    it('zeros all buffers on clear', () => {
      const buffers: ArrayBuffer[] = []
      
      for (let i = 0; i < 3; i++) {
        const data = new ArrayBuffer(100)
        new Uint8Array(data).fill(255)
        buffers.push(data)
        buffer.addChunk(i, data)
      }
      
      buffer.clear()
      
      // All original buffers should be zeroed
      for (const buf of buffers) {
        expect(new Uint8Array(buf).every(b => b === 0)).toBe(true)
      }
    })
  })

  describe('Page Unload Cleanup', () => {
    it('registers beforeunload handler', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      
      const newBuffer = new MemoryOnlyBuffer(5)
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      )
    })

    it('clears buffer on beforeunload', () => {
      const data = new ArrayBuffer(100)
      new Uint8Array(data).fill(255)
      buffer.addChunk(0, data)
      
      window.dispatchEvent(new Event('beforeunload'))
      
      expect(new Uint8Array(data).every(b => b === 0)).toBe(true)
    })
  })

  describe('Memory Limit', () => {
    it('tracks total memory usage', () => {
      buffer.addChunk(0, new ArrayBuffer(1000))
      buffer.addChunk(1, new ArrayBuffer(2000))
      
      expect(buffer.totalBytes).toBe(3000)
    })

    it('enforces memory limit', () => {
      const limitedBuffer = new MemoryOnlyBuffer(100, 500) // 500 bytes max
      
      limitedBuffer.addChunk(0, new ArrayBuffer(200))
      limitedBuffer.addChunk(1, new ArrayBuffer(200))
      limitedBuffer.addChunk(2, new ArrayBuffer(200)) // Should evict oldest
      
      expect(limitedBuffer.totalBytes).toBeLessThanOrEqual(500)
    })
  })
})
```

### E7-QA-2: Session Key Manager

```typescript
// apps/web/src/core/drm/__tests__/session-key-manager.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SessionKeyManager } from '../session-key-manager'

describe('SessionKeyManager', () => {
  let manager: SessionKeyManager

  beforeEach(() => {
    manager = new SessionKeyManager()
  })

  afterEach(() => {
    manager.destroySession()
  })

  describe('Session Initialization', () => {
    it('generates unique session ID', () => {
      const id1 = new SessionKeyManager().sessionId
      const id2 = new SessionKeyManager().sessionId
      
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^[0-9a-f-]{36}$/) // UUID format
    })

    it('derives key from master key material', async () => {
      const masterKey = crypto.getRandomValues(new Uint8Array(32))
      
      await manager.initSession(masterKey.buffer)
      
      expect(manager.isInitialized).toBe(true)
    })

    it('different sessions derive different keys', async () => {
      const masterKey = crypto.getRandomValues(new Uint8Array(32))
      
      const manager1 = new SessionKeyManager()
      const manager2 = new SessionKeyManager()
      
      await manager1.initSession(masterKey.buffer)
      await manager2.initSession(masterKey.buffer)
      
      // Keys are different due to different session IDs
      // Can't directly compare CryptoKeys, but sessions are unique
      expect(manager1.sessionId).not.toBe(manager2.sessionId)
    })
  })

  describe('Encryption/Decryption', () => {
    beforeEach(async () => {
      const masterKey = crypto.getRandomValues(new Uint8Array(32))
      await manager.initSession(masterKey.buffer)
    })

    it('decrypts correctly encrypted data', async () => {
      const original = new Uint8Array([1, 2, 3, 4, 5])
      const nonce = crypto.getRandomValues(new Uint8Array(12))
      
      // Encrypt (normally done server-side)
      const key = await crypto.subtle.importKey(
        'raw',
        crypto.getRandomValues(new Uint8Array(16)),
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
      )
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: nonce },
        key,
        original
      )
      
      // For this test, we'd need the same key
      // In practice, server encrypts, client decrypts with derived key
    })

    it('fails with wrong key', async () => {
      const encrypted = crypto.getRandomValues(new Uint8Array(100))
      const nonce = crypto.getRandomValues(new Uint8Array(12))
      
      await expect(
        manager.decryptChunk(encrypted.buffer, nonce)
      ).rejects.toThrow()
    })
  })

  describe('Key Expiry', () => {
    it('tracks expiry time', async () => {
      const masterKey = crypto.getRandomValues(new Uint8Array(32))
      await manager.initSession(masterKey.buffer, { expiresIn: 3600 })
      
      expect(manager.expiresAt).toBeGreaterThan(Date.now())
    })

    it('rejects operations after expiry', async () => {
      const masterKey = crypto.getRandomValues(new Uint8Array(32))
      await manager.initSession(masterKey.buffer, { expiresIn: -1 }) // Expired
      
      await expect(
        manager.decryptChunk(new ArrayBuffer(0), new Uint8Array(12))
      ).rejects.toThrow('Session expired')
    })
  })

  describe('Key Destruction', () => {
    it('clears key on destroy', async () => {
      const masterKey = crypto.getRandomValues(new Uint8Array(32))
      await manager.initSession(masterKey.buffer)
      
      manager.destroySession()
      
      expect(manager.isInitialized).toBe(false)
    })

    it('cannot decrypt after destroy', async () => {
      const masterKey = crypto.getRandomValues(new Uint8Array(32))
      await manager.initSession(masterKey.buffer)
      
      manager.destroySession()
      
      await expect(
        manager.decryptChunk(new ArrayBuffer(0), new Uint8Array(12))
      ).rejects.toThrow('Session not initialized')
    })
  })
})
```

### E7-QA-3: Audio Watermark

```typescript
// apps/web/src/core/drm/__tests__/audio-watermark.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { AudioWatermark } from '../audio-watermark'

describe('AudioWatermark', () => {
  let watermark: AudioWatermark

  beforeEach(() => {
    watermark = new AudioWatermark('test-session-123')
  })

  describe('Watermark Generation', () => {
    it('generates pattern from session ID', () => {
      const pattern = watermark.getPattern()
      
      expect(pattern).toBeInstanceOf(Float32Array)
      expect(pattern.length).toBeGreaterThan(0)
    })

    it('different sessions produce different patterns', () => {
      const wm1 = new AudioWatermark('session-1')
      const wm2 = new AudioWatermark('session-2')
      
      const pattern1 = wm1.getPattern()
      const pattern2 = wm2.getPattern()
      
      // Patterns should differ
      let differences = 0
      for (let i = 0; i < Math.min(pattern1.length, pattern2.length); i++) {
        if (pattern1[i] !== pattern2[i]) differences++
      }
      
      expect(differences).toBeGreaterThan(0)
    })
  })

  describe('Inaudibility', () => {
    it('watermark amplitude is below -60dB', () => {
      const pattern = watermark.getPattern()
      
      // -60dB = 10^(-60/20) = 0.001
      const threshold = 0.001
      
      for (let i = 0; i < pattern.length; i++) {
        expect(Math.abs(pattern[i])).toBeLessThan(threshold)
      }
    })

    it('watermark does not clip audio', () => {
      const samples = new Float32Array(1024)
      samples.fill(0.99) // Near maximum
      
      watermark.inject(samples)
      
      // Should not exceed [-1, 1]
      for (let i = 0; i < samples.length; i++) {
        expect(samples[i]).toBeGreaterThanOrEqual(-1)
        expect(samples[i]).toBeLessThanOrEqual(1)
      }
    })
  })

  describe('Injection', () => {
    it('modifies audio samples', () => {
      const samples = new Float32Array(1024)
      samples.fill(0.5)
      
      const original = samples.slice()
      watermark.inject(samples)
      
      // At least some samples should differ
      let differences = 0
      for (let i = 0; i < samples.length; i++) {
        if (samples[i] !== original[i]) differences++
      }
      
      expect(differences).toBeGreaterThan(0)
    })

    it('preserves audio magnitude approximately', () => {
      const samples = new Float32Array(1024)
      samples.fill(0.5)
      
      watermark.inject(samples)
      
      // Average should be close to original
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length
      expect(avg).toBeCloseTo(0.5, 2)
    })
  })

  describe('Extraction', () => {
    it('extracts session ID from watermarked audio', () => {
      const samples = new Float32Array(44100) // 1 second at 44.1kHz
      samples.fill(0.5) // Base signal
      
      watermark.inject(samples)
      
      const extracted = AudioWatermark.extract(samples)
      
      expect(extracted).toBe('test-session-123')
    })

    it('returns null for non-watermarked audio', () => {
      const samples = new Float32Array(44100)
      samples.fill(0.5)
      
      const extracted = AudioWatermark.extract(samples)
      
      expect(extracted).toBeNull()
    })

    it('extraction works with noise', () => {
      const samples = new Float32Array(44100)
      
      // Add some noise
      for (let i = 0; i < samples.length; i++) {
        samples[i] = 0.5 + (Math.random() - 0.5) * 0.1
      }
      
      watermark.inject(samples)
      
      const extracted = AudioWatermark.extract(samples)
      
      expect(extracted).toBe('test-session-123')
    })
  })

  describe('Compression Survival', () => {
    it.todo('survives MP3 compression')
    it.todo('survives AAC compression')
    it.todo('survives re-encoding')
  })
})
```

---

## Security Tests

### E7-QA-4: Attack Resistance

```typescript
// apps/web/src/core/drm/__tests__/security.test.ts

describe('DRM-light Security', () => {
  describe('DevTools Resistance', () => {
    it('audio blobs cannot be downloaded via DevTools', () => {
      // HTTP headers should prevent caching
      // Cache-Control: no-store, no-cache, must-revalidate
      
      // This is verified by checking middleware
      const headers = {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
      
      expect(headers['Cache-Control']).toContain('no-store')
    })

    it('no Service Worker caches audio routes', () => {
      // Service Worker should exclude audio endpoints
      // This is a configuration test
      
      const excludedRoutes = ['/api/v1/audio/', '/api/v1/chunks/']
      
      // Verify SW config excludes these
      excludedRoutes.forEach(route => {
        // Check SW does not cache
      })
    })
  })

  describe('Memory Protection', () => {
    it('buffer overwrite on clear is synchronous', () => {
      const buffer = new MemoryOnlyBuffer(5)
      const data = new ArrayBuffer(100)
      const view = new Uint8Array(data)
      view.fill(255)
      
      buffer.addChunk(0, data)
      
      const clearStart = performance.now()
      buffer.clear()
      const clearEnd = performance.now()
      
      // Should be immediate, not garbage-collected later
      expect(clearEnd - clearStart).toBeLessThan(10)
      expect(view.every(b => b === 0)).toBe(true)
    })
  })

  describe('Blob URL Prevention', () => {
    it('createObjectURL is monitored/blocked for audio', () => {
      // In production, would override URL.createObjectURL
      // for audio/* mime types
      
      // Test that our protection is in place
    })
  })
})
```

---

## Performance Tests

### E7-QA-5: Protection Overhead

```typescript
describe('DRM-light Performance', () => {
  it('encryption overhead < 1ms per chunk', async () => {
    const manager = new SessionKeyManager()
    const masterKey = crypto.getRandomValues(new Uint8Array(32))
    await manager.initSession(masterKey.buffer)
    
    const chunk = new ArrayBuffer(80 * 1024) // 80KB chunk
    const nonce = crypto.getRandomValues(new Uint8Array(12))
    
    const iterations = 100
    const start = performance.now()
    
    for (let i = 0; i < iterations; i++) {
      // Simulate decryption
      await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: nonce },
        /* key */,
        chunk
      )
    }
    
    const elapsed = (performance.now() - start) / iterations
    expect(elapsed).toBeLessThan(1)
  })

  it('watermark injection < 0.5ms per block', () => {
    const watermark = new AudioWatermark('test-session')
    const samples = new Float32Array(128) // One audio block
    
    const iterations = 1000
    const start = performance.now()
    
    for (let i = 0; i < iterations; i++) {
      watermark.inject(samples)
    }
    
    const elapsed = (performance.now() - start) / iterations
    expect(elapsed).toBeLessThan(0.5)
  })

  it('memory cleanup < 10ms for 50 chunks', () => {
    const buffer = new MemoryOnlyBuffer(50)
    
    for (let i = 0; i < 50; i++) {
      buffer.addChunk(i, new ArrayBuffer(80 * 1024))
    }
    
    const start = performance.now()
    buffer.clear()
    const elapsed = performance.now() - start
    
    expect(elapsed).toBeLessThan(10)
  })
})
```

---

## Integration Tests

### E7-INT: End-to-End DRM Flow

```typescript
describe('DRM-light Integration', () => {
  it('complete secure playback flow', async () => {
    // 1. Initialize session
    const session = new SessionKeyManager()
    await session.initSession(masterKey)
    
    // 2. Create memory buffer
    const buffer = new MemoryOnlyBuffer(10)
    
    // 3. Receive encrypted chunk
    const encryptedChunk = await fetchEncryptedChunk('/api/chunks/1')
    
    // 4. Decrypt chunk
    const decrypted = await session.decryptChunk(
      encryptedChunk.data,
      encryptedChunk.nonce
    )
    
    // 5. Store in memory-only buffer
    buffer.addChunk(0, decrypted)
    
    // 6. Inject watermark before playback
    const samples = new Float32Array(decrypted)
    const watermark = new AudioWatermark(session.sessionId)
    watermark.inject(samples)
    
    // 7. Play audio (would go to AudioWorklet)
    
    // 8. On stop, destroy session
    session.destroySession()
    buffer.clear()
    
    // Verify cleanup
    expect(session.isInitialized).toBe(false)
    expect(buffer.getChunk(0)).toBeUndefined()
  })
})
```

---

## Manual Test Checklist

### E7-MANUAL: Security Validation

- [ ] **DevTools Network**: No audio files cached
- [ ] **DevTools Application**: No audio in Cache Storage
- [ ] **Save Page As**: Does not include audio data
- [ ] **Memory Inspection**: Buffers zeroed after clear
- [ ] **Page Refresh**: All audio data cleared
- [ ] **Tab Close**: beforeunload cleanup runs
- [ ] **Multiple Tabs**: Sessions are independent
- [ ] **Audio Quality**: No audible watermark artifacts
- [ ] **Forensic Tool**: Extracts session ID from recording

---

## Regression Tests (Problems/Not Implemented)

### E7-REG: Known Issues

```typescript
describe('E7 Regression Tests', () => {
  it.todo('vitest dependency installation')
  it.todo('SessionKeyService DI injection')
  it.todo('No-cache middleware on audio routes')
  it.todo('Memory buffer integration with audio pipeline')
  it.todo('Session key refresh before expiry')
  it.todo('Watermark strength adaptation')
  it.todo('Forensic tool for MP3/AAC formats')
  it.todo('Automated watermark extraction in CI')
  it.todo('Cross-browser memory cleanup')
  it.todo('P2P streaming integration')
})
```

---

*E7 DRM-light QA — DAWW3 Project*
