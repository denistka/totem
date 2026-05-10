# Tactical Tablet Interface (TRI)

## Project Hub (.pi)

**Codename**: TRI — Tactical Recon Interface  
**Status**: PLANNING  
**Reference Implementation**: `drone-interface/6` (Vue 3 → React 19 migration)

## Purpose
Production-grade tablet-first realtime tactical HUD demonstrating all key signals for the DefTech "Frontend Developer (React, Camera / Video)" vacancy. NOT a CRUD dashboard — a low-latency tactical operating interface.

## Positioning
**Realtime Frontend Systems Engineer** — not just "Frontend Developer".

## Vacancy Signal Coverage
| Signal | Implementation |
|--------|---------------|
| React 3+ yrs + TypeScript | React 19 + TS + Vite SPA |
| Camera API / getUserMedia / WebRTC | Multi-source stream manager (Camera/RTSP/WebRTC/Replay) |
| Video/media streams | RTSP via Tauri/Rust + WebRTC + Camera API + adaptive quality |
| WebSockets / real-time | Binary telemetry protocol (ArrayBuffer, DataView, Float32Array) |
| Mobile/tablet touch | Gesture engine, pinch-zoom, swipe panels, 44px targets |
| Canvas / image processing | OffscreenCanvas HUD + Worker rendering + experimental tracking |
| Binary data (Blob, ArrayBuffer) | Binary telemetry parser in Worker |
| Backend Rust | Tauri 2 IPC bridge + native video/telemetry server |
| Video processing / streaming | Adaptive stream quality + diagnostics + recording/replay |

## Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| State | Zustand (client), React Query (async) |
| Styling | Tailwind CSS 4, Framer Motion |
| Routing | React Router 7 |
| Realtime | WebSocket, WebRTC, Camera API |
| Rendering | OffscreenCanvas, Web Workers |
| Native | Tauri 2, Rust, Tokio |
| Testing | Vitest, RTL, Playwright, MSW |
| Deploy | PWA, Tauri desktop, Linux kiosk |

## Architecture
```
src/
  app/           # App shell, providers, router, error boundaries
  features/      # Feature modules (video, hud, telemetry, touch, debug)
  entities/      # Shared business entities (telemetry types, stream types)
  shared/        # UI kit, hooks, utils, design tokens
  workers/       # OffscreenCanvas rendering, telemetry parsing
  services/      # RenderScheduler, StreamManager, PerformanceMonitor, WebSocket transport
```

## Killer Features (WOW)
1. **Transparent Native HUD Overlay** — ffplay video + transparent WebView + realtime HUD
2. **OffscreenCanvas + Workers** — radar/graph rendering off main thread
3. **Binary Telemetry Protocol** — ArrayBuffer/DataView/Float32Array
4. **Priority-based Render Scheduler** — CRITICAL > NORMAL > LOW frame budgets
5. **Experimental Target Tracking** — motion detection, fake AI, bounding boxes, acquisition labels
6. **Touch-first Tablet UX** — pinch-zoom, swipe panels, oversized controls
7. **Recording + Replay** — timeline scrubber, session analysis, flight playback
8. **Adaptive Performance** — auto-degrades rendering quality when FPS drops
9. **Three Runtimes** — Browser (dev) → PWA (tablet) → Tauri (embedded)

## Sprint Plan
| Sprint | Focus | Tasks |
|--------|-------|-------|
| **S01** | Frontend Architecture Foundation | 11 tasks |
| **S02** | Video & Camera Pipeline | 8 tasks |
| **S03** | Tactical HUD Rendering | 10 tasks |
| **S04** | Realtime Telemetry System | 8 tasks |
| **S05** | Touch-first Tablet UX | 9 tasks |
| **S06** | Diagnostics, PWA & Polish | 9 tasks |
| **S07** | Testing & Reliability | 8 tasks |

**Total**: 63 tasks across 7 sprints.

## Git Protocol
Every task completion MUST be followed by:
```bash
git add .
git commit -m "task_id: brief description"
git push origin head
```

## Config
See `project.config.yml` for stack adapters and paths.
