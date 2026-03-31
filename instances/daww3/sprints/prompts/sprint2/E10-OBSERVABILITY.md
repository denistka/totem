# E10: Observability & Monitoring — Agent Prompts

> **Goal:** Debug tools, structured logging, metrics, and documentation
> **Sprint:** 2
> **Owner:** All teams
> **Status:** TODO from Sprint 1

---

## E10-T1: Debug Overlay for Audio & P2P

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class frontend debugging tools engineer'
    target = create debug overlay showing audio, P2P, and system metrics
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = minimal overhead when disabled
    tech stack = ['Vue 3', 'TypeScript', 'Canvas API']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create a debug overlay for DAWW3 that shows real-time metrics.
Toggle with keyboard shortcut, minimal performance impact.

{{{{ #CUSTOMER PROMT

Нужен debug overlay показывающий:
- Audio: latency, XRuns, CPU usage, buffer state
- P2P: connected peers, download/upload speed, chunk buffer
- System: memory usage, FPS, network status
- Включается по Ctrl+Shift+D
- Должен работать в production (hidden by default)

}}}}

<<<<<<#RECOMMENDED TASKS

DBG-1. Debug Panel Component
- Floating panel with drag support
- Collapsible sections
- Toggle visibility with keyboard shortcut
- Position persistence
- Semi-transparent background

DBG-2. Audio Metrics Section
- Current latency (ms)
- XRun count and rate
- AudioContext state
- Sample rate
- Buffer size
- CPU usage estimate (process time / block time)

DBG-3. P2P Metrics Section
- Connected peer count
- Download speed (KB/s)
- Upload speed (KB/s)
- Chunk buffer fill level
- Swarm health indicator
- Current track seeding status

DBG-4. System Metrics Section
- JS heap size (performance.memory)
- FPS counter
- Network status (online/offline)
- WebSocket connection state
- localStorage usage

DBG-5. Performance Graph
- Canvas-based rolling graph
- Audio CPU usage over time
- Network bandwidth over time
- Memory usage trend
- 60-second history

DBG-6. Log Viewer
- Recent console logs (filtered)
- Error highlighting
- Log level filter
- Copy to clipboard
- Clear button

🏁 Definition of Done
- Overlay toggles with Ctrl+Shift+D
- All metrics update in real-time
- < 1% CPU overhead when visible
- Zero overhead when hidden
- Position saves across sessions

>>>>>>

]]]]
```

---

## E10-T2: Structured Logging & Metrics Collection

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class observability engineer'
    target = implement structured logging and Prometheus metrics
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = async logging, no blocking
    tech stack = ['Pino', 'Prometheus', 'NestJS', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement comprehensive logging and metrics for DAWW3 backend.
Structured JSON logs, correlation IDs, Prometheus metrics.

{{{{ #CUSTOMER PROMT

Backend уже использует Pino. Нужно расширить:
- Correlation ID для трассировки запросов
- Structured logging с контекстом
- Prometheus metrics endpoint
- Custom metrics для audio streaming
- Grafana dashboard (basic)

}}}}

<<<<<<#RECOMMENDED TASKS

LOG-1. Correlation ID Middleware
- Generate UUID for each request
- Pass through X-Request-ID header
- Inject into Pino logger context
- Propagate to async operations
- Include in error responses

LOG-2. Structured Log Format
- Timestamp ISO8601
- Level (debug, info, warn, error)
- Correlation ID
- Service name
- Module/context
- Message
- Extra fields (userId, trackId, etc.)

LOG-3. Prometheus Metrics Setup
- Install prom-client
- Create /metrics endpoint
- Default Node.js metrics
- HTTP request duration histogram
- HTTP request count by status

LOG-4. Custom Business Metrics
- active_websocket_connections gauge
- p2p_chunks_served counter
- p2p_chunks_requested counter
- track_plays_total counter
- audio_stream_duration_seconds histogram
- rating_calculations_total counter

LOG-5. P2P Seed Node Metrics
- connected_peers gauge
- chunks_in_memory gauge
- bandwidth_upload_bytes counter
- bandwidth_download_bytes counter
- swarm_health_score gauge

LOG-6. Grafana Dashboard
- Create dashboard JSON
- Request rate panel
- Error rate panel
- Latency percentiles
- WebSocket connections
- P2P metrics overview

🏁 Definition of Done
- All logs have correlation ID
- /metrics returns Prometheus format
- Custom metrics track key events
- Grafana dashboard importable
- No performance degradation

>>>>>>

]]]]
```

---

## E10-T3: Technical Documentation

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class technical writer'
    target = create comprehensive technical documentation
    test = false

    code style = [clear, concise, examples]
    write docs = true
    deep thinking = true
    performance = n/a
    tech stack = ['Markdown', 'Mermaid diagrams']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create technical documentation for DAWW3.
Architecture docs, API reference, deployment guide.

{{{{ #CUSTOMER PROMT

Нужна документация:
- Architecture overview с диаграммами
- API reference (автогенерация из Swagger)
- Deployment guide (local, staging, production)
- Contributing guide
- Security considerations

}}}}

<<<<<<#RECOMMENDED TASKS

DOC-1. Architecture Overview (docs/01-ARCHITECTURE.md)
- High-level system diagram
- Component descriptions
- Data flow diagrams
- Technology choices rationale
- Scalability considerations

DOC-2. Audio Engine Docs (docs/02-AUDIO-ENGINE.md)
- WebAudio architecture
- AudioWorklet implementation
- WASM DSP integration
- Latency management
- Plugin system

DOC-3. P2P Streaming Docs (docs/03-P2P-STREAMING.md)
- WebRTC/WebTorrent setup
- Chunk format and encryption
- Seed node architecture
- Peer discovery
- Fallback strategies

DOC-4. API Reference (docs/04-API-REFERENCE.md)
- REST endpoints (from Swagger)
- WebSocket events
- Error codes
- Rate limits
- Authentication

DOC-5. Deployment Guide (docs/05-DEPLOYMENT.md)
- Local development setup
- Docker deployment
- Environment variables
- Database migrations
- SSL/COOP/COEP headers

DOC-6. Smart Contracts Docs (docs/06-SMART-CONTRACTS.md)
- Contract architecture
- TrackNFT functions
- RoyaltySplit logic
- LicenseManager usage
- Deployment addresses

DOC-7. Contributing Guide (CONTRIBUTING.md)
- Code style
- Branch naming
- PR process
- Testing requirements
- Documentation requirements

DOC-8. Security Docs (docs/07-SECURITY.md)
- Authentication flow
- DRM-light approach
- Watermarking
- Smart contract security
- Data privacy

🏁 Definition of Done
- All docs written and reviewed
- Diagrams render correctly
- API reference matches implementation
- Deployment tested against docs
- No broken links

>>>>>>

]]]]
```

---

## E10-T4: Error Tracking & Alerting

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class SRE engineer'
    target = implement error tracking and alerting system
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = async error reporting
    tech stack = ['Sentry', 'NestJS', 'Vue 3']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement error tracking for DAWW3 frontend and backend.
Use Sentry or similar, with proper context and alerting.

{{{{ #CUSTOMER PROMT

Нужен error tracking:
- Frontend errors с stack trace
- Backend errors с request context
- Source maps для production
- Alert rules для критических ошибок
- User feedback widget

}}}}

<<<<<<#RECOMMENDED TASKS

ERR-1. Sentry Setup (or self-hosted alternative)
- Create Sentry project
- Configure DSN for frontend/backend
- Environment separation (dev/staging/prod)
- Release tracking

ERR-2. Frontend Integration
- Install @sentry/vue
- Configure Vue error handler
- Capture unhandled rejections
- User context (id, email)
- Add breadcrumbs for navigation

ERR-3. Backend Integration
- Install @sentry/nestjs
- Global exception filter
- Request context capture
- Correlation ID as tag
- Performance tracing

ERR-4. Source Maps
- Generate source maps in build
- Upload to Sentry on deploy
- Configure release version
- Hide source maps from users

ERR-5. Alert Rules
- Error spike detection
- Critical error immediate alert
- Slack/Discord integration
- On-call schedule

ERR-6. User Feedback
- Feedback widget on error
- Screenshot capture (optional)
- User description field
- Attach to Sentry issue

🏁 Definition of Done
- Errors captured with full context
- Source maps resolve correctly
- Alerts fire for critical errors
- User feedback collected
- Dashboard shows error trends

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E1 (Infrastructure) ✅
    │
    ├────────────────────────────────┐
    ▼                                ▼
E10-T1 (Debug Overlay)         E10-T2 (Logging & Metrics)
    │                                │
    │                                ▼
    │                          E10-T4 (Error Tracking)
    │                                │
    └────────────────────────────────┤
                                     ▼
                              E10-T3 (Documentation)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Debug overlay performance | Medium | Lazy loading, disabled by default |
| Metrics cardinality explosion | Medium | Careful label design |
| Sentry cost | Low | Self-hosted alternative option |
| Documentation drift | Medium | Doc tests, CI checks |
