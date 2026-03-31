# 🏗️ TOTEM 2: TECHNICAL ARCHITECTURE

> **Соответствует:** `2.png` — DAWW3 Detailed Technical Architecture

---

## Уровень: CTO / Senior Engineer

Эта диаграмма отвечает на вопрос:
> **«Это вообще реально построить и где основные риски?»**

---

## Frontend / Browser DAW

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER DAW                          │
├─────────────────────────────────────────────────────────┤
│  Framework:     Vue 3 + Vite + Tailwind                 │
│  Audio:         WebAudio API + AudioWorklets            │
│  DSP:           WASM (Rust → wasm-pack)                 │
│  MIDI:          WebMIDI API                             │
│  State:         Singleton + Vue reactive()              │
└─────────────────────────────────────────────────────────┘
```

**Ключевые технологии:**
- `vue@^3.4.38`
- `vite@^5.4.8`
- `tailwindcss@^3.4.14`
- `standardized-audio-context@^25.3.70`

---

## Hybrid DSP System

### Powerful PC (Desktop/Laptop)
```
┌─────────────────────────────────────────┐
│  100% Local Low-Latency DSP             │
├─────────────────────────────────────────┤
│  ✓ WASM VST Host in Web Browser         │
│  ✓ SharedArrayBuffer + Audio Threads    │
│  ✓ VST GUI via HTML5 Canvas/WebGL       │
│  ✓ < 10ms latency possible              │
└─────────────────────────────────────────┘
```

### Weak Device (Mobile/Old PC)
```
┌─────────────────────────────────────────┐
│  Cloud Render Assist                    │
├─────────────────────────────────────────┤
│  ✓ Heavy DSP offloaded to server        │
│  ✓ WebRTC/WebTorrent for streaming      │
│  ✓ Graceful degradation                 │
└─────────────────────────────────────────┘
```

---

## P2P Streaming Layer

```
┌─────────────────────────────────────────────────────────┐
│                 P2P STREAMING                           │
├─────────────────────────────────────────────────────────┤
│  Protocol:      WebRTC / WebTorrent                     │
│  Format:        Chunk-based memory streaming            │
│  Security:      AES-128 encryption of audio chunks      │
│  Playback:      Memory-Only (NO disk storage!)          │
│  Verification:  Hash-based chunk verification           │
└─────────────────────────────────────────────────────────┘
```

**Ключевые технологии:**
- `webtorrent@^2.4.1`
- `simple-peer@^9.11.1`

---

## Blockchain Layer

```
┌─────────────────────────────────────────────────────────┐
│                 BLOCKCHAIN                              │
├─────────────────────────────────────────────────────────┤
│  Chains:        Ethereum / Polygon / Solana             │
│  NFT:           ERC-721 for track ownership             │
│  Royalties:     ERC-2981 + custom splits                │
│  Payments:      Stablecoin (USDC/USDT) + Fiat           │
└─────────────────────────────────────────────────────────┘
```

**Ключевые технологии:**
- `hardhat@^2.22.6`
- `ethers@^6.13.1`
- `@openzeppelin/contracts@^5.0.2`

---

## Backend (Metadata + Signaling)

```
┌─────────────────────────────────────────────────────────┐
│                 BACKEND                                 │
├─────────────────────────────────────────────────────────┤
│  Framework:     NestJS + Fastify                        │
│  Database:      PostgreSQL + Prisma                     │
│  Cache:         Redis                                   │
│  Queue:         BullMQ                                  │
│  Realtime:      Socket.io                               │
│  Storage:       MinIO (S3-compatible)                   │
├─────────────────────────────────────────────────────────┤
│  ⚠️  Backend НЕ обрабатывает аудио!                     │
│      Только metadata, signaling, analytics             │
└─────────────────────────────────────────────────────────┘
```

**Ключевые технологии:**
- `@nestjs/core@^10.3.10`
- `prisma@^5.18.0`
- `ioredis@^5.4.1`
- `socket.io@^4.7.5`

---

## Control Flow

```
1. SEED NODES = гарант доступности (always-online)
2. P2P = снижение нагрузки (popular tracks)
3. BACKEND = metadata + signaling (no audio processing)
```

---

## Основные технические риски

| Риск | Митигация |
|------|-----------|
| 🔴 Real-time audio в браузере | AudioWorklet only, latency presets |
| 🔴 WASM ↔ AudioWorklet | Single-thread MVP, SharedArrayBuffer |
| 🟠 P2P reliability | Always-on seed nodes as fallback |
| 🟠 Browser policies | Feature detection, graceful degradation |

---

## Архитектурные принципы

1. **Audio processing = client-side** (except weak devices)
2. **Backend = metadata only** (scalable, stateless)
3. **P2P = optimization** (not critical path)
4. **Blockchain = ownership** (not payment rails initially)

---

*Последнее обновление: January 2026*
