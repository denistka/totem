# 🌐 E6: P2P Streaming & Seed Nodes

> **Goal:** Minimal torrent-like audio streaming  
> **Sprint:** 1  
> **Owner:** Backend / DevOps / Frontend

---

## E6-T1: Seed Node Service

**Priority:** 🟠 P1 HIGH  
**Points:** 8  
**Depends on:** E5-T2

### Description
Always-online seed node that guarantees track availability.

### Acceptance Criteria
- [ ] Seed node starts and connects
- [ ] Signaling server for WebRTC
- [ ] Can seed multiple tracks
- [ ] Metrics exposed
- [ ] Auto-restart on failure

### Technical Requirements

```typescript
// apps/seed/src/core/seed-node.ts
export class SeedNode {
  private client: WebTorrent.Instance
  private torrents: Map<string, WebTorrent.Torrent>
  
  constructor() {
    this.client = new WebTorrent({
      wrtc,                 // Native WebRTC
      uploadLimit: -1,      // Unlimited
      downloadLimit: -1
    })
  }
  
  async seedTrack(trackId: string, magnetUri: string): Promise<void>
  async removeTorrent(trackId: string): Promise<void>
  getStats(): SeedStats
}
```

### Subtasks
- [ ] Create seed node project structure
- [ ] Implement `SeedNode` class
- [ ] Implement signaling server (Socket.io)
- [ ] Add chunk storage (LevelDB)
- [ ] Add encryption module (AES-128)
- [ ] Create health check endpoint
- [ ] Add Prometheus metrics
- [ ] Create Dockerfile
- [ ] Add auto-restart via Docker
- [ ] Test with multiple clients

### Signaling Protocol
```typescript
// Socket.io events for WebRTC signaling
'join-swarm'     → { trackId, peerId }
'leave-swarm'    → { trackId }
'signal'         → { targetPeerId, signal: RTCSessionDescription }
'peer-list'      ← { peers: string[] }
'peer-joined'    ← { peerId }
'peer-left'      ← { peerId }
```

### Metrics
```
# Prometheus metrics
seed_active_torrents        # Gauge
seed_connected_peers        # Gauge
seed_bytes_uploaded_total   # Counter
seed_bytes_downloaded_total # Counter
seed_chunks_served_total    # Counter
```

### Definition of Done
```bash
# Seed node running
curl http://localhost:5000/health
# → { status: "ok", torrents: 10, peers: 50 }

# Metrics
curl http://localhost:9090/metrics
# → Prometheus format metrics
```

---

## E6-T2: Chunked Audio Streaming

**Priority:** 🟠 P1 HIGH  
**Points:** 8  
**Depends on:** E6-T1

### Description
Chunk format and progressive playback for P2P streaming.

### Acceptance Criteria
- [ ] Audio chunks created correctly
- [ ] Chunk manifest generated
- [ ] Ring buffer for playback
- [ ] Progressive playback works
- [ ] Encryption working

### Chunk Format

```typescript
interface ChunkMetadata {
  trackId: string
  index: number
  offset: number       // Start time in ms
  duration: number     // Chunk duration in ms
  size: number         // Bytes
  hash: string         // SHA-256
  encrypted: boolean
  nonce?: string       // For AES-GCM
}

interface ChunkManifest {
  trackId: string
  title: string
  totalDuration: number    // Total track duration
  chunkDuration: number    // Default: 5000ms
  chunkSize: number        // Target bytes per chunk
  sampleRate: number
  channels: number
  format: 'opus' | 'aac'
  chunks: ChunkMetadata[]
  encryptionKeyHash: string
}
```

### Chunk Size Calculation
```
Target: 5 seconds per chunk
Audio: 44.1kHz, stereo, 16-bit
Raw size: 44100 * 2 * 2 * 5 = 882KB

Compressed (Opus 128kbps):
128kbps * 5s = 80KB per chunk
```

### Subtasks
- [ ] Create chunk encoder (Opus)
- [ ] Create chunk manifest generator
- [ ] Implement chunk encryption (AES-128-GCM)
- [ ] Create ring buffer for playback
- [ ] Implement progressive decoding
- [ ] Handle chunk reordering
- [ ] Handle missing chunks (gaps)
- [ ] Test with variable network

### Ring Buffer for Playback
```typescript
class AudioRingBuffer {
  private buffer: Float32Array
  private writePos: number = 0
  private readPos: number = 0
  
  constructor(durationSeconds: number, sampleRate: number) {
    this.buffer = new Float32Array(durationSeconds * sampleRate * 2)
  }
  
  write(chunk: Float32Array): boolean
  read(output: Float32Array): boolean
  available(): number  // Samples available
  space(): number      // Space for writing
}
```

### Definition of Done
- Track split into chunks
- Chunks encrypted and hashed
- Playback starts before full download
- No gaps or glitches

---

## E6-T3: Client P2P Logic

**Priority:** 🟠 P1 HIGH  
**Points:** 8  
**Depends on:** E6-T2

### Description
Browser-side P2P client with seed node priority.

### Acceptance Criteria
- [ ] Connect to signaling server
- [ ] Discover peers for track
- [ ] Download from seed first
- [ ] Switch to P2P when available
- [ ] Upload to other peers
- [ ] Graceful degradation

### Technical Requirements

```typescript
// core/p2p/streaming-client.ts
export class StreamingClient {
  private signaling: Socket
  private peers: Map<string, SimplePeer.Instance>
  private chunksHave: Set<number>
  private chunksWant: Set<number>
  
  constructor(signalingUrl: string) {}
  
  async joinSwarm(trackId: string): Promise<void>
  async leaveSwarm(): Promise<void>
  
  onChunk(callback: (index: number, data: ArrayBuffer) => void): void
  
  getStats(): {
    connectedPeers: number
    downloadedFromSeed: number
    downloadedFromPeers: number
    uploaded: number
  }
}
```

### Peer Priority Logic
```
1. Check seed node first (always available)
2. Request rare chunks from seed
3. Request common chunks from peers
4. Balance load across peers
5. Prefer fast peers
```

### Subtasks
- [ ] Create `StreamingClient` class
- [ ] Implement signaling connection
- [ ] Implement WebRTC peer connections
- [ ] Implement chunk request/receive
- [ ] Add seed priority logic
- [ ] Add peer discovery
- [ ] Implement chunk verification
- [ ] Add upload to peers
- [ ] Create Vue composable `useP2PStream`
- [ ] Add network status indicators

### Vue Composable
```typescript
// composables/useP2PStream.ts
export function useP2PStream(trackId: Ref<string>) {
  const client = ref<StreamingClient | null>(null)
  const status = ref<'connecting' | 'buffering' | 'playing' | 'error'>()
  const peers = ref(0)
  const progress = ref(0)
  const downloadSpeed = ref(0)
  
  const connect = async () => { ... }
  const disconnect = () => { ... }
  
  return { status, peers, progress, downloadSpeed, connect, disconnect }
}
```

### Definition of Done
- Client connects to swarm
- Downloads chunks from seed/peers
- Uploads to other peers
- Stats visible in UI
- Works without peers (seed only)

---

## Dependencies Graph

```
E5-T2 (Core Entities)
    │
    ▼
E6-T1 (Seed Node) ◀────── E1-T2 (Docker)
    │
    ▼
E6-T2 (Chunked Streaming)
    │
    ▼
E6-T3 (Client P2P) ───────▶ E2-T3 (Track Graph)
```

---

## Network Topology

```
                    ┌─────────────┐
                    │  SIGNALING  │
                    │   SERVER    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │  SEED   │◀──────▶│ CLIENT  │◀──────▶│ CLIENT  │
   │  NODE   │        │    A    │        │    B    │
   └─────────┘        └─────────┘        └─────────┘
        │                  ▲                  │
        │                  │                  │
        └──────────────────┴──────────────────┘
                    P2P MESH
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| NAT traversal fails | High | TURN server fallback |
| Seed node overload | High | Multiple seed nodes |
| Slow peers | Medium | Peer scoring, timeout |
| Chunk verification | Medium | Hash checking |

---

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Time to first chunk | < 1s | < 3s |
| Buffering events | < 1/min | < 5/min |
| P2P ratio (popular) | > 50% | > 20% |
| Seed bandwidth saved | > 60% | > 30% |
