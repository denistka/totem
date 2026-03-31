# 🌐 E6: P2P Streaming — QA Test Specifications

> **Epic:** E6 - P2P Streaming & Seed Nodes
> **Status:** ✅ DONE
> **Focus:** Seed node, Chunk encryption, Client P2P, Ring buffer

---

## Agent Prompt for P2P Testing

```
[[[[ #SETTINGS

    mode = agent - implement P2P streaming tests
    expertize = 'you are world class distributed systems testing specialist'
    target = validate P2P streaming infrastructure
    test = true

    code style = [Network simulation, Chaos testing]
    write docs = true
    deep thinking = true
    performance = time-to-first-chunk, P2P ratio
    tech stack = ['Vitest', 'WebRTC', 'Socket.io', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for DAWW3 P2P streaming covering:
- Seed node availability and chunk serving
- Chunk encryption and verification
- Client P2P connections and chunk exchange
- Ring buffer progressive playback

}}}}

<<<<<<#RECOMMENDED TASKS

E6-QA-1. Seed Node Tests
E6-QA-2. Chunk Encryption Tests
E6-QA-3. Client P2P Tests
E6-QA-4. Ring Buffer Tests
E6-QA-5. Signaling Tests

>>>>>>

]]]]
```

---

## Unit Tests

### E6-QA-1: Seed Node

```typescript
describe('Seed Node', () => {
  describe('Track Seeding', () => {
    it('seeds track and serves chunks', async () => {
      const seed = new SeedNode()
      await seed.seedTrack('track-1', '/fixtures/track-1.mp3')
      
      const chunk = await seed.getChunk('track-1', 0)
      
      expect(chunk).toBeDefined()
      expect(chunk.byteLength).toBeGreaterThan(0)
    })

    it('removes track from seeding', async () => {
      const seed = new SeedNode()
      await seed.seedTrack('track-1', '/fixtures/track-1.mp3')
      await seed.removeTorrent('track-1')
      
      expect(seed.hasTrack('track-1')).toBe(false)
    })
  })

  describe('Metrics', () => {
    it('tracks active torrents', async () => {
      const seed = new SeedNode()
      await seed.seedTrack('track-1', '/fixtures/track-1.mp3')
      await seed.seedTrack('track-2', '/fixtures/track-2.mp3')
      
      const stats = seed.getStats()
      expect(stats.activeTorrents).toBe(2)
    })

    it('tracks bytes uploaded', async () => {
      const seed = new SeedNode()
      const initialStats = seed.getStats()
      
      // Simulate serving chunks
      await seed.seedTrack('track-1', '/fixtures/track-1.mp3')
      await seed.serveChunk('track-1', 0, mockPeer)
      
      const finalStats = seed.getStats()
      expect(finalStats.bytesUploaded).toBeGreaterThan(initialStats.bytesUploaded)
    })
  })
})
```

### E6-QA-2: Chunk Encryption

```typescript
describe('Chunk Encryption', () => {
  describe('AES-128-GCM', () => {
    it('encrypts and decrypts chunk', async () => {
      const original = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
      const key = await generateEncryptionKey()
      
      const { encrypted, nonce } = await encryptChunk(original, key)
      const decrypted = await decryptChunk(encrypted, nonce, key)
      
      expect(new Uint8Array(decrypted)).toEqual(original)
    })

    it('fails with wrong key', async () => {
      const original = new Uint8Array([1, 2, 3, 4])
      const key1 = await generateEncryptionKey()
      const key2 = await generateEncryptionKey()
      
      const { encrypted, nonce } = await encryptChunk(original, key1)
      
      await expect(decryptChunk(encrypted, nonce, key2)).rejects.toThrow()
    })

    it('different nonce produces different ciphertext', async () => {
      const original = new Uint8Array([1, 2, 3, 4])
      const key = await generateEncryptionKey()
      
      const result1 = await encryptChunk(original, key)
      const result2 = await encryptChunk(original, key)
      
      expect(result1.encrypted).not.toEqual(result2.encrypted)
    })
  })

  describe('Chunk Verification', () => {
    it('verifies chunk hash', () => {
      const chunk = new Uint8Array([1, 2, 3, 4])
      const hash = computeChunkHash(chunk)
      
      expect(verifyChunkHash(chunk, hash)).toBe(true)
    })

    it('rejects tampered chunk', () => {
      const chunk = new Uint8Array([1, 2, 3, 4])
      const hash = computeChunkHash(chunk)
      
      chunk[0] = 99 // Tamper
      
      expect(verifyChunkHash(chunk, hash)).toBe(false)
    })
  })
})
```

### E6-QA-3: Streaming Client

```typescript
describe('Streaming Client', () => {
  describe('Swarm Connection', () => {
    it('joins swarm and discovers peers', async () => {
      const client = new StreamingClient('ws://localhost:5001')
      
      await client.joinSwarm('track-1')
      
      expect(client.isConnected).toBe(true)
    })

    it('leaves swarm cleanly', async () => {
      const client = new StreamingClient('ws://localhost:5001')
      await client.joinSwarm('track-1')
      await client.leaveSwarm()
      
      expect(client.isConnected).toBe(false)
    })
  })

  describe('Chunk Download', () => {
    it('downloads chunk from seed', async () => {
      const client = new StreamingClient('ws://localhost:5001')
      await client.joinSwarm('track-1')
      
      const chunk = await client.requestChunk(0)
      
      expect(chunk).toBeDefined()
      expect(chunk.byteLength).toBeGreaterThan(0)
    })

    it('downloads from peer when available', async () => {
      const client1 = new StreamingClient('ws://localhost:5001')
      const client2 = new StreamingClient('ws://localhost:5001')
      
      await client1.joinSwarm('track-1')
      await client1.requestChunk(0) // Cache chunk
      
      await client2.joinSwarm('track-1')
      const chunk = await client2.requestChunk(0)
      
      // Check stats to verify it came from peer
      expect(client2.stats.downloadedFromPeers).toBeGreaterThan(0)
    })
  })

  describe('Stats', () => {
    it('tracks download statistics', async () => {
      const client = new StreamingClient('ws://localhost:5001')
      await client.joinSwarm('track-1')
      
      await client.requestChunk(0)
      await client.requestChunk(1)
      
      const stats = client.getStats()
      expect(stats.downloadedFromSeed + stats.downloadedFromPeers).toBeGreaterThan(0)
    })
  })
})
```

### E6-QA-4: Ring Buffer

```typescript
describe('Audio Ring Buffer', () => {
  describe('Write/Read', () => {
    it('writes and reads data', () => {
      const buffer = new AudioRingBuffer(1, 44100) // 1 second
      const data = new Float32Array(1024).fill(0.5)
      
      buffer.write(data)
      
      const output = new Float32Array(1024)
      const read = buffer.read(output)
      
      expect(read).toBe(1024)
      expect(output[0]).toBe(0.5)
    })

    it('tracks available samples', () => {
      const buffer = new AudioRingBuffer(1, 44100)
      const data = new Float32Array(1000)
      
      buffer.write(data)
      
      expect(buffer.available()).toBe(1000)
    })

    it('handles wrap-around', () => {
      const buffer = new AudioRingBuffer(0.1, 44100) // ~4410 samples
      
      // Write more than buffer size
      for (let i = 0; i < 10; i++) {
        buffer.write(new Float32Array(1000).fill(i))
      }
      
      // Should wrap around
      expect(buffer.available()).toBeLessThanOrEqual(4410)
    })
  })

  describe('Progressive Playback', () => {
    it('supports progressive filling', async () => {
      const buffer = new AudioRingBuffer(5, 44100) // 5 seconds
      
      // Fill incrementally
      for (let i = 0; i < 5; i++) {
        buffer.write(new Float32Array(44100)) // 1 second at a time
        await new Promise(r => setTimeout(r, 100))
      }
      
      expect(buffer.available()).toBe(5 * 44100)
    })
  })
})
```

---

## Integration Tests

### E6-INT: Full P2P Flow

```typescript
describe('P2P Integration', () => {
  it('complete streaming flow', async () => {
    // Start seed node
    const seed = new SeedNode()
    await seed.start(5001)
    await seed.seedTrack('track-1', '/fixtures/track-1.mp3')
    
    // Connect client
    const client = new StreamingClient('ws://localhost:5001')
    await client.joinSwarm('track-1')
    
    // Download chunks progressively
    const chunks: ArrayBuffer[] = []
    for (let i = 0; i < 10; i++) {
      const chunk = await client.requestChunk(i)
      chunks.push(chunk)
    }
    
    expect(chunks.length).toBe(10)
    
    // Cleanup
    await client.leaveSwarm()
    await seed.stop()
  })
})
```

---

## Regression Tests

```typescript
describe('E6 Regression Tests', () => {
  it.todo('wrtc dependency alternative for Node.js')
  it.todo('Socket.io Redis adapter for scaling')
  it.todo('Chunk rate limiting')
  it.todo('Peer reputation scoring')
  it.todo('Adaptive bitrate')
  it.todo('NAT traversal')
  it.todo('HTTP streaming fallback')
  it.todo('Mobile browser P2P')
})
```

---

*E6 P2P Streaming QA — DAWW3 Project*
