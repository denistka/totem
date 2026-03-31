# E6: P2P Streaming & Seed Nodes — Agent Prompts

---

## E6-T1: Seed Node Service

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class P2P networking engineer'
    target = always-online seed node for WebTorrent streaming
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = high throughput, low latency
    tech stack = ['webtorrent@2.4', 'socket.io@4.7', 'wrtc@0.4', 'leveldb']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create P2P seed node service for DAWW3.
Always-online seeder, signaling server, chunk storage.

{{{{ #CUSTOMER PROMT

Нужен seed node:
- WebTorrent клиент (Node.js)
- Signaling server для WebRTC
- Хранение и раздача чанков
- Метрики для мониторинга

}}}}

<<<<<<#RECOMMENDED TASKS

SEED-1. SeedNode Class
File: apps/seed/src/core/seed-node.ts

import WebTorrent from 'webtorrent'
import wrtc from 'wrtc'

class SeedNode {
  private client: WebTorrent.Instance
  private torrents: Map<string, WebTorrent.Torrent>
  
  constructor()
  async seedTrack(trackId: string, magnetUri: string): Promise<void>
  async removeTorrent(trackId: string): Promise<void>
  getStats(): SeedStats
}

SEED-2. Signaling Server
File: apps/seed/src/signaling/signaling-server.ts

Socket.io namespace: /signaling

Events:
- join-swarm: { trackId, peerId }
- leave-swarm: { trackId }
- signal: { targetPeerId, signal }
- peer-list: { peers: string[] }
- peer-joined: { peerId }
- peer-left: { peerId }

SEED-3. Room Manager
File: apps/seed/src/signaling/room-manager.ts

- Track peers per track
- Notify on join/leave
- Limit peers per room

SEED-4. Chunk Storage
File: apps/seed/src/core/chunk-store.ts

Using LevelDB:
- storeChunk(trackId, index, data)
- getChunk(trackId, index)
- getTrackChunks(trackId)
- deleteTrack(trackId)

SEED-5. Encryption Module
File: apps/seed/src/streaming/encryption.ts

Using tweetnacl:
- generateKey(): Uint8Array
- encrypt(data, key): { encrypted, nonce }
- decrypt(encrypted, nonce, key): Buffer | null

SEED-6. Health Check Endpoint
GET /health

{
  "status": "ok",
  "torrents": 150,
  "peers": 1250,
  "uploadSpeed": "125.5 MB/s"
}

SEED-7. Prometheus Metrics
File: apps/seed/src/metrics/prometheus.ts

Metrics:
- seed_active_torrents
- seed_connected_peers
- seed_bytes_uploaded_total
- seed_chunks_served_total

SEED-8. Configuration
File: apps/seed/src/config.ts

- PORT (signaling)
- WEBTORRENT_PORT
- REDIS_URL
- CHUNK_STORE_PATH
- MAX_TORRENTS

🏁 Definition of Done
- Seed node starts and seeds
- Signaling works
- Peers can connect
- Metrics available

>>>>>>

]]]]
```

---

## E6-T2: Chunked Audio Streaming

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class streaming media engineer'
    target = chunk format and progressive audio playback
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = < 1s to first chunk, no buffering gaps
    tech stack = ['opus', 'webtorrent', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement chunked audio streaming format for P2P.
Chunk creation, manifest, ring buffer, progressive playback.

{{{{ #CUSTOMER PROMT

Нужен chunked streaming:
- Аудио разбито на 5-секундные чанки
- Манифест с метаданными
- Ring buffer для воспроизведения
- Прогрессивное воспроизведение

}}}}

<<<<<<#RECOMMENDED TASKS

CHK-1. Chunk Format
interface ChunkMetadata {
  trackId: string
  index: number
  offset: number       // Start time in ms
  duration: number     // Chunk duration in ms
  size: number         // Bytes
  hash: string         // SHA-256
  encrypted: boolean
  nonce?: string       // Base64
}

CHK-2. Chunk Manifest
interface ChunkManifest {
  trackId: string
  title: string
  totalDuration: number
  chunkDuration: number    // 5000ms default
  chunkSize: number
  sampleRate: number
  channels: number
  format: 'opus' | 'aac'
  chunks: ChunkMetadata[]
  encryptionKeyHash: string
}

CHK-3. Chunk Encoder
File: apps/api/src/modules/streaming/chunk-encoder.ts

- Encode audio to Opus
- Split into fixed-duration chunks
- Generate hashes
- Encrypt chunks
- Create manifest

CHK-4. Ring Buffer
File: apps/web/src/core/audio/ring-buffer.ts

class AudioRingBuffer {
  private buffer: Float32Array
  private writePos: number
  private readPos: number
  
  constructor(durationSeconds, sampleRate)
  write(chunk: Float32Array): boolean
  read(output: Float32Array): boolean
  available(): number
  space(): number
  clear(): void
}

CHK-5. Progressive Decoder
File: apps/web/src/core/audio/progressive-decoder.ts

- Receive chunks out of order
- Reorder buffer
- Decode to PCM
- Feed to ring buffer

CHK-6. Playback Controller
File: apps/web/src/core/audio/playback-controller.ts

- Buffer enough before start
- Handle underruns
- Seek support
- Report progress

CHK-7. Gap Handling
- Detect missing chunks
- Request from seed
- Skip if timeout
- Mute gap (not click)

🏁 Definition of Done
- Audio splits into chunks
- Manifest is valid
- Playback starts before full download
- No gaps or glitches

>>>>>>

]]]]
```

---

## E6-T3: Client P2P Logic

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class P2P client engineer'
    target = browser-side P2P client with seed priority
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast peer discovery, efficient downloading
    tech stack = ['webtorrent', 'simple-peer', 'vue@3.4', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement browser P2P client for DAWW3.
Connect to signaling, discover peers, download from seed/peers.

{{{{ #CUSTOMER PROMT

Нужен P2P клиент:
- Подключение к signaling
- Обнаружение пиров
- Загрузка с seed в приоритете
- Раздача другим пирам
- Graceful degradation

}}}}

<<<<<<#RECOMMENDED TASKS

P2P-1. StreamingClient Class
File: apps/web/src/core/p2p/streaming-client.ts

class StreamingClient {
  private signaling: Socket
  private peers: Map<string, SimplePeer.Instance>
  private chunksHave: Set<number>
  private chunksWant: Set<number>
  
  constructor(signalingUrl: string)
  
  async joinSwarm(trackId: string): Promise<void>
  async leaveSwarm(): Promise<void>
  
  onChunk(callback: (index, data) => void): void
  
  getStats(): {
    connectedPeers: number
    downloadedFromSeed: number
    downloadedFromPeers: number
    uploaded: number
  }
}

P2P-2. Signaling Connection
- Connect to Socket.io
- Handle reconnection
- Join/leave swarms

P2P-3. Peer Connection Management
- Create SimplePeer instances
- Handle WebRTC signaling
- Track peer state
- Cleanup on disconnect

P2P-4. Chunk Request Protocol
Messages:
- HAVE: { chunks: number[] }
- WANT: { chunks: number[] }
- CHUNK: { index, data }
- CANCEL: { index }

P2P-5. Seed Priority Logic
- Request rare chunks from seed
- Request common from peers
- Balance load
- Prefer fast peers

P2P-6. Upload to Peers
- Respond to WANT messages
- Rate limit uploads
- Track upload stats

P2P-7. Vue Composable
File: apps/web/src/composables/useP2PStream.ts

Returns:
- status: Ref<'connecting' | 'buffering' | 'playing' | 'error'>
- peers: Ref<number>
- progress: Ref<number>
- downloadSpeed: Ref<number>
- p2pRatio: Ref<number>
- connect(): Promise<void>
- disconnect(): void

P2P-8. Network Status UI
File: apps/web/src/components/streaming/NetworkStatus.vue

- Connected peers count
- Download speed
- P2P vs seed ratio
- Connection quality indicator

🏁 Definition of Done
- Client connects to swarm
- Downloads from seed and peers
- Uploads to other peers
- Stats visible in UI
- Works without peers (seed-only)

>>>>>>

]]]]
```
