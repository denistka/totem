# E7: DRM-light & Memory-only Audio — Agent Prompts

---

## E7-T1: Memory-only Enforcement

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class security and media protection engineer'
    target = ensure audio never persists to disk
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = no impact on playback
    tech stack = ['typescript', 'Web Audio API']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement memory-only audio enforcement for DAWW3.
No disk cache, secure deletion, memory limits.

{{{{ #CUSTOMER PROMT

Аудио не должно попадать на диск:
- Нет HTTP кэширования
- Нет Service Worker кэша
- Память очищается при уходе
- Нельзя сохранить через DevTools

}}}}

<<<<<<#RECOMMENDED TASKS

MEM-1. MemoryOnlyBuffer Class
File: apps/web/src/core/audio/memory-only.ts

class MemoryOnlyBuffer {
  private chunks: Map<number, ArrayBuffer>
  private maxChunks: number
  
  constructor(maxChunks: number = 50)
  
  addChunk(index: number, data: ArrayBuffer): void
  getChunk(index: number): ArrayBuffer | undefined
  private secureDelete(index: number): void
  clear(): void
}

MEM-2. Secure Deletion
- Overwrite buffer with zeros before delete
- Use TypedArray.fill(0)
- Then delete reference

MEM-3. HTTP Headers
For audio endpoints:
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0

MEM-4. Service Worker Exclusion
- Don't cache audio routes
- Explicit exclusion in SW
- Or don't use SW for audio

MEM-5. Memory Limits
- Track total memory usage
- Evict oldest chunks
- Prevent OOM crashes

MEM-6. Page Unload Cleanup
window.addEventListener('beforeunload', () => {
  memoryBuffer.clear()
})

MEM-7. Blob URL Prevention
- Don't create Blob URLs for audio
- Don't use <audio> element with src
- Use AudioBufferSourceNode only

MEM-8. DevTools Mitigation
- No network cache
- No disk cache
- Streams not saveable

🏁 Definition of Done
- DevTools shows no cached audio
- Memory freed on navigation
- Can't export via "Save As"
- No disk writes detected

>>>>>>

]]]]
```

---

## E7-T2: Session Encryption

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class cryptography engineer'
    target = ephemeral encryption keys per playback session
    test = true

    code style = [DRY, Best practice, crypto best practices]
    write docs = true
    deep thinking = true
    performance = minimal decryption overhead
    tech stack = ['Web Crypto API', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement session-based encryption for audio chunks.
Unique key per session, secure key derivation, cleanup.

{{{{ #CUSTOMER PROMT

Нужно шифрование сессии:
- Уникальный ключ для каждой сессии
- Ключ не хранится
- Чанки расшифровываются на лету
- Ключ уничтожается при выходе

}}}}

<<<<<<#RECOMMENDED TASKS

ENC-1. SessionKeyManager Class
File: apps/web/src/core/crypto/session-keys.ts

class SessionKeyManager {
  private sessionKey: CryptoKey | null
  private sessionId: string
  
  constructor()
  async initSession(masterKeyMaterial: ArrayBuffer): Promise<void>
  async decryptChunk(encrypted: ArrayBuffer, nonce: Uint8Array): Promise<ArrayBuffer>
  destroySession(): void
}

ENC-2. Key Derivation (HKDF)
- Import master key material
- Derive session-specific key
- Use session ID as salt
- AES-GCM 128-bit

ENC-3. Chunk Decryption
- AES-GCM decryption
- Nonce from chunk metadata
- Handle decryption errors

ENC-4. Backend Key Endpoint
POST /api/v1/streaming/session-key

Request: { trackId }
Response: { keyMaterial: base64, expiresAt }

- Requires valid JWT
- Key tied to session

ENC-5. Key Lifecycle
- Request key on play start
- Store in memory only
- Destroy on stop/leave
- No localStorage

ENC-6. Session Isolation
- Different tabs = different sessions
- No key sharing
- Verify isolation

ENC-7. Error Handling
- Handle decryption failure
- Don't expose key in errors
- Graceful fallback

ENC-8. Key Expiry
- Keys expire after N minutes
- Refresh while playing
- Stop playback on expiry

🏁 Definition of Done
- Each session has unique key
- Chunks decrypt correctly
- Key destroyed on session end
- No key persistence

>>>>>>

]]]]
```

---

## E7-T3: Watermark Injection

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio forensics specialist'
    target = inaudible watermark with session ID
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = < 1% CPU overhead
    tech stack = ['Web Audio API', 'typescript', 'FFT']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Inject inaudible watermark containing session/user ID.
Survives basic compression, extractable for forensics.

{{{{ #CUSTOMER PROMT

Нужен watermark:
- Неслышимый для человека
- Содержит session ID
- Выживает MP3 сжатие
- Можно извлечь для расследования

}}}}

<<<<<<#RECOMMENDED TASKS

WM-1. AudioWatermark Class
File: apps/web/src/core/audio/watermark.ts

class AudioWatermark {
  private sessionId: string
  private pattern: Float32Array
  
  constructor(sessionId: string)
  private generatePattern(): Float32Array
  inject(samples: Float32Array): void
  static extract(samples: Float32Array): string | null
}

WM-2. Pattern Generation
- Encode session ID as bits
- Use spread-spectrum technique
- Low amplitude (-60dB)
- Multiple embeddings for redundancy

WM-3. Injection Process
- Add pattern to audio samples
- Very low amplitude (imperceptible)
- Apply in AudioWorklet

WM-4. Extraction Algorithm
- FFT analysis
- Correlation detection
- Error correction
- Return session ID or null

WM-5. Inaudibility Verification
- ABX test methodology
- No perceptible difference
- Test with various audio

WM-6. Compression Survival
Test with:
- MP3 128kbps
- AAC 128kbps
- Opus 64kbps

WM-7. Watermark Worklet
File: apps/web/src/workers/watermark-processor.ts

- Add watermark in audio thread
- Minimal CPU impact
- Configurable strength

WM-8. Forensic Tool
File: tools/extract-watermark.ts

CLI tool:
- Input: audio file
- Output: session ID if found
- Confidence score

🏁 Definition of Done
- Watermark is inaudible
- Session ID recoverable
- Survives MP3 compression
- Forensic tool works

>>>>>>

]]]]
```
