# E10: Observability & Dev UX — Agent Prompts

---

## E10-T1: Debug Overlay

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class developer tools engineer'
    target = in-browser debug panel for audio/network stats
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = minimal impact when closed
    tech stack = ['vue@3.4', 'tailwindcss', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create debug overlay for DAWW3 showing real-time stats.
Audio CPU, latency, XRuns, P2P status, memory.

{{{{ #CUSTOMER PROMT

Нужен debug overlay:
- Toggle по Ctrl+Shift+D
- Audio CPU usage
- Латентность
- P2P статус (peers, speed)
- Memory usage

}}}}

<<<<<<#RECOMMENDED TASKS

DBG-1. DebugOverlay Component
File: apps/web/src/components/debug/DebugOverlay.vue

Sections:
- Audio Engine (state, sample rate, latency, buffer, XRuns)
- P2P Network (mode, peers, download/upload speed, P2P ratio)
- Memory (JS heap, audio buffers)

DBG-2. useDebugStats Composable
File: apps/web/src/composables/useDebugStats.ts

Returns:
- isOpen: Ref<boolean>
- toggle(): void
- close(): void

Audio:
- audioState, sampleRate, latency, bufferSize, xruns

P2P:
- p2pMode, connectedPeers, downloadSpeed, uploadSpeed, p2pRatio

Memory:
- jsHeap, audioBuffers

DBG-3. Keyboard Shortcut
- Ctrl+Shift+D toggles overlay
- Escape closes
- Remember state in session

DBG-4. Stat Collection
Audio:
- From AudioContext
- From AudioWorklet messages
- From LatencyManager

P2P:
- From StreamingClient
- Update every second

Memory:
- performance.memory (Chrome)
- Track buffer sizes

DBG-5. Graph Component
File: apps/web/src/components/debug/StatGraph.vue

- Mini line graph
- Last 60 seconds
- For latency, CPU, etc.

DBG-6. Styling
- Dark semi-transparent background
- Fixed position (bottom-right)
- Draggable (optional)
- Collapsible sections

DBG-7. Performance
- No impact when closed
- Throttle updates (1-5 fps)
- Use CSS transforms

DBG-8. Dev-only Build
- Strip from production build
- Or keep but hide toggle

🏁 Definition of Done
- Overlay toggles with shortcut
- Shows all stats in real-time
- No performance impact when closed
- Looks good

>>>>>>

]]]]
```

---

## E10-T2: Logging & Metrics

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class observability engineer'
    target = structured logging and Prometheus metrics
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = minimal logging overhead
    tech stack = ['nestjs', 'pino', 'prom-client', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement structured logging and Prometheus metrics for backend.
Correlation IDs, request tracing, business metrics.

{{{{ #CUSTOMER PROMT

Нужно логирование и метрики:
- Structured JSON логи
- Correlation ID для трейсинга
- Prometheus метрики
- Логирование audio errors

}}}}

<<<<<<#RECOMMENDED TASKS

LOG-1. Logger Service
File: apps/api/src/common/logger/logger.service.ts

Using Pino:
- info(message, context)
- error(message, error, context)
- debug(message, context)
- warn(message, context)

Features:
- Correlation ID injection
- Pretty print in dev
- JSON in production

LOG-2. Correlation ID Middleware
File: apps/api/src/common/middleware/correlation.middleware.ts

- Generate UUID for each request
- Attach to request object
- Include in all logs
- Return in response header

LOG-3. Request Logging
- Log request method, path
- Log response status, duration
- Exclude health checks
- Redact sensitive data

LOG-4. Metrics Service
File: apps/api/src/common/metrics/metrics.service.ts

Using prom-client:
- httpRequestDuration (histogram)
- httpRequestsTotal (counter)
- activeConnections (gauge)
- tracksPublished (counter)
- streamsActive (gauge)
- paymentsProcessed (counter)

LOG-5. Metrics Endpoint
GET /metrics

- Prometheus format
- All registered metrics
- No auth required (internal)

LOG-6. Business Metrics
- Tracks published
- Streams started
- P2P peers connected
- Payments processed
- Errors by type

LOG-7. Error Tracking
- Log all errors with stack
- Categorize by type
- Include correlation ID
- Sentry integration (optional)

LOG-8. Log Rotation
- Max file size
- Max files
- Compression
- Docker: stdout only

🏁 Definition of Done
- Logs are structured JSON
- Correlation IDs work
- /metrics returns Prometheus format
- Business metrics tracked

>>>>>>

]]]]
```

---

## E10-T3: Documentation

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class technical writer'
    target = comprehensive developer documentation
    test = true

    code style = [DRY, Best practice, clear writing]
    write docs = true
    deep thinking = true
    tech stack = ['markdown', 'vitepress', 'openapi']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create comprehensive documentation for DAWW3.
Architecture, getting started, API reference, contribution guide.

{{{{ #CUSTOMER PROMT

Нужна документация:
- Architecture overview
- Getting started guide
- API reference (OpenAPI)
- Audio engine docs
- P2P flow docs
- Contribution guide

}}}}

<<<<<<#RECOMMENDED TASKS

DOC-1. Architecture Overview
File: docs/architecture/overview.md

- System diagram
- Component descriptions
- Data flow
- Key decisions

DOC-2. Audio Engine Docs
File: docs/architecture/audio-engine.md

- AudioContext lifecycle
- AudioWorklet architecture
- WASM integration
- Track routing
- Latency management

DOC-3. P2P Flow Docs
File: docs/architecture/p2p-flow.md

- Signaling protocol
- Chunk format
- Peer discovery
- Seed node role
- Security (encryption)

DOC-4. Getting Started Guide
File: docs/guides/getting-started.md

- Prerequisites
- Installation
- Quick start (5 minutes)
- Development setup
- Troubleshooting

DOC-5. API Reference
File: docs/api/openapi.yaml

- Generated from NestJS
- All endpoints
- Request/response schemas
- Authentication

DOC-6. WebSocket Events
File: docs/api/websocket.md

- Namespaces
- Events (client → server)
- Events (server → client)
- Authentication

DOC-7. Contribution Guide
File: docs/contributing/CONTRIBUTING.md

- How to contribute
- PR process
- Code style
- Testing requirements

DOC-8. VitePress Site
- Setup VitePress
- Sidebar navigation
- Search
- Deploy to GitHub Pages

🏁 Definition of Done
- New developer can start in <30 min
- All APIs documented
- Architecture understood from docs
- Docs site deployed

>>>>>>

]]]]
```
