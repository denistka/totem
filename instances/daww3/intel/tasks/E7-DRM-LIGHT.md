# 🔒 E7: DRM-light & Memory-only Audio

> **Goal:** Protection without killing UX  
> **Sprint:** 2  
> **Owner:** Audio / Backend

---

## Philosophy

**DRM-light is NOT about preventing piracy.**  
It's about making piracy inconvenient while keeping UX smooth.

```
Traditional DRM:     Makes life hard for paying users
DAWW3 DRM-light:    Makes piracy slightly harder, legitimate use seamless
```

---

## E7-T1: Memory-only Enforcement

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E6-T2

### Description
Ensure audio never touches disk, only lives in memory.

### Acceptance Criteria
- [ ] No disk cache of audio
- [ ] No Service Worker caching
- [ ] Memory cleaned on leave
- [ ] Can't save via DevTools easily
- [ ] Works with P2P chunks

### Technical Requirements

```typescript
// core/audio/memory-only.ts
export class MemoryOnlyBuffer {
  private chunks: Map<number, ArrayBuffer>
  private maxChunks: number
  
  constructor(maxChunks: number = 50) {
    this.chunks = new Map()
    this.maxChunks = maxChunks
  }
  
  addChunk(index: number, data: ArrayBuffer): void {
    // Evict oldest if at capacity
    if (this.chunks.size >= this.maxChunks) {
      const oldest = Math.min(...this.chunks.keys())
      this.secureDelete(oldest)
    }
    this.chunks.set(index, data)
  }
  
  getChunk(index: number): ArrayBuffer | undefined {
    return this.chunks.get(index)
  }
  
  private secureDelete(index: number): void {
    const chunk = this.chunks.get(index)
    if (chunk) {
      // Overwrite with zeros before delete
      new Uint8Array(chunk).fill(0)
      this.chunks.delete(index)
    }
  }
  
  clear(): void {
    for (const index of this.chunks.keys()) {
      this.secureDelete(index)
    }
  }
}
```

### HTTP Headers
```
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
```

### Subtasks
- [ ] Create `MemoryOnlyBuffer` class
- [ ] Disable HTTP caching for audio
- [ ] Disable Service Worker for audio routes
- [ ] Implement secure deletion
- [ ] Add memory limit (prevent OOM)
- [ ] Clear on page unload
- [ ] Test with DevTools Network tab
- [ ] Verify no disk writes

### Definition of Done
- DevTools shows no cached audio
- Memory freed on navigation
- Can't export via "Save As"

---

## E7-T2: Session Encryption

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E7-T1

### Description
Ephemeral encryption keys per session for chunk decryption.

### Acceptance Criteria
- [ ] Unique key per session
- [ ] Key never stored permanently
- [ ] Chunks encrypted with session key
- [ ] Key derivation secure
- [ ] Works offline once loaded

### Technical Requirements

```typescript
// core/crypto/session-keys.ts
export class SessionKeyManager {
  private sessionKey: CryptoKey | null = null
  private sessionId: string
  
  constructor() {
    this.sessionId = crypto.randomUUID()
  }
  
  async initSession(masterKeyMaterial: ArrayBuffer): Promise<void> {
    // Derive session-specific key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      masterKeyMaterial,
      'HKDF',
      false,
      ['deriveKey']
    )
    
    this.sessionKey = await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        salt: new TextEncoder().encode(this.sessionId),
        info: new TextEncoder().encode('daww3-session'),
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 128 },
      false,
      ['decrypt']
    )
  }
  
  async decryptChunk(encrypted: ArrayBuffer, nonce: Uint8Array): Promise<ArrayBuffer> {
    if (!this.sessionKey) throw new Error('Session not initialized')
    
    return crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce },
      this.sessionKey,
      encrypted
    )
  }
  
  destroySession(): void {
    this.sessionKey = null
    this.sessionId = ''
  }
}
```

### Key Flow
```
1. User starts playing track
2. Request session key material from backend (JWT required)
3. Derive session-specific key (HKDF)
4. Decrypt chunks as they arrive
5. Destroy key on stop/leave
```

### Subtasks
- [ ] Create `SessionKeyManager` class
- [ ] Implement key derivation (HKDF)
- [ ] Add AES-GCM decryption
- [ ] Create backend endpoint for key material
- [ ] Tie key to JWT session
- [ ] Destroy key on session end
- [ ] Test key isolation between tabs
- [ ] Handle key expiry

### Definition of Done
- Each session has unique key
- Chunks can't decrypt without valid session
- Key destroyed on page unload

---

## E7-T3: Watermark Injection

**Priority:** 🟡 P2 MEDIUM  
**Points:** 8  
**Depends on:** E7-T2

### Description
Inject inaudible watermark containing session ID.

### Acceptance Criteria
- [ ] Watermark inaudible to humans
- [ ] Contains session/user ID
- [ ] Survives basic compression
- [ ] Can be extracted for forensics
- [ ] Minimal CPU overhead

### Technical Requirements

```typescript
// core/audio/watermark.ts
export class AudioWatermark {
  private sessionId: string
  private pattern: Float32Array
  
  constructor(sessionId: string) {
    this.sessionId = sessionId
    this.pattern = this.generatePattern()
  }
  
  private generatePattern(): Float32Array {
    // Encode session ID into frequency pattern
    // Use frequencies outside music range (18-20kHz)
    // Or use spread-spectrum in lower frequencies
  }
  
  inject(samples: Float32Array): void {
    // Add watermark at very low amplitude (-60dB)
    for (let i = 0; i < samples.length; i++) {
      samples[i] += this.pattern[i % this.pattern.length] * 0.001
    }
  }
  
  static extract(samples: Float32Array): string | null {
    // FFT analysis to recover watermark
    // Return session ID or null if not found
  }
}
```

### Watermarking Techniques

| Technique | Pros | Cons |
|-----------|------|------|
| High-frequency | Simple | Easy to filter |
| Spread-spectrum | Robust | Complex |
| Echo hiding | Survives compression | Audible if strong |
| Phase coding | Inaudible | Fragile |

### Subtasks
- [ ] Research watermarking techniques
- [ ] Implement spread-spectrum encoder
- [ ] Add to playback pipeline
- [ ] Create extraction tool
- [ ] Test with various audio
- [ ] Verify inaudibility (ABX test)
- [ ] Test compression survival
- [ ] Document forensic process

### Definition of Done
- Watermark is inaudible
- Can identify session from leaked audio
- Works after MP3 compression

---

## Dependencies Graph

```
E6-T2 (Chunked Streaming)
    │
    ▼
E7-T1 (Memory-only)
    │
    ▼
E7-T2 (Session Encryption)
    │
    ▼
E7-T3 (Watermark)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Audio capture via OS | Can't prevent | Watermark for forensics |
| Memory dumping | Can't prevent | Encrypt in memory |
| Screen recording | Can't prevent | Watermark survives |
| DRM adds latency | Medium | Async decryption |

---

## What DRM-light Does NOT Do

❌ Prevent all piracy (impossible)  
❌ Require special browser plugins  
❌ Block legitimate users  
❌ Add significant latency  
❌ Require constant server connection

## What DRM-light DOES Do

✅ Make casual copying inconvenient  
✅ Enable forensic tracking of leaks  
✅ Provide legal basis for takedowns  
✅ Reduce value of pirated copies  
✅ Keep UX smooth for legitimate users
