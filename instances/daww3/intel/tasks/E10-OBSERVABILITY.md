# 🔍 E10: Observability & Dev UX

> **Goal:** Developers see what's happening  
> **Sprint:** 3  
> **Owner:** All

---

## E10-T1: Debug Overlay

**Priority:** 🟡 P2 MEDIUM  
**Points:** 3  
**Depends on:** E2-T4

### Description
In-browser debug panel showing real-time audio/network stats.

### Acceptance Criteria
- [ ] Toggle with keyboard shortcut
- [ ] Audio CPU usage displayed
- [ ] Latency displayed
- [ ] Network mode (P2P/Seed)
- [ ] XRun counter
- [ ] Memory usage

### Technical Requirements

```vue
<!-- components/debug/DebugOverlay.vue -->
<template>
  <Transition name="slide">
    <div v-if="isOpen" class="debug-overlay">
      <div class="debug-header">
        <span>🔧 Debug Panel</span>
        <button @click="close">×</button>
      </div>
      
      <div class="debug-section">
        <h4>Audio Engine</h4>
        <div class="debug-row">
          <span>State:</span>
          <span :class="stateClass">{{ audioState }}</span>
        </div>
        <div class="debug-row">
          <span>Sample Rate:</span>
          <span>{{ sampleRate }} Hz</span>
        </div>
        <div class="debug-row">
          <span>Latency:</span>
          <span>{{ latency.toFixed(1) }} ms</span>
        </div>
        <div class="debug-row">
          <span>Buffer Size:</span>
          <span>{{ bufferSize }} samples</span>
        </div>
        <div class="debug-row">
          <span>XRuns:</span>
          <span :class="{ 'text-red-500': xruns > 0 }">{{ xruns }}</span>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>P2P Network</h4>
        <div class="debug-row">
          <span>Mode:</span>
          <span>{{ p2pMode }}</span>
        </div>
        <div class="debug-row">
          <span>Peers:</span>
          <span>{{ connectedPeers }}</span>
        </div>
        <div class="debug-row">
          <span>Download:</span>
          <span>{{ formatSpeed(downloadSpeed) }}</span>
        </div>
        <div class="debug-row">
          <span>P2P Ratio:</span>
          <span>{{ (p2pRatio * 100).toFixed(0) }}%</span>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>Memory</h4>
        <div class="debug-row">
          <span>JS Heap:</span>
          <span>{{ formatBytes(jsHeap) }}</span>
        </div>
        <div class="debug-row">
          <span>Audio Buffers:</span>
          <span>{{ formatBytes(audioBuffers) }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useDebugStats } from '@/composables/useDebugStats'

const { 
  isOpen, close,
  audioState, sampleRate, latency, bufferSize, xruns,
  p2pMode, connectedPeers, downloadSpeed, p2pRatio,
  jsHeap, audioBuffers
} = useDebugStats()
</script>
```

### Subtasks
- [ ] Create `DebugOverlay` component
- [ ] Create `useDebugStats` composable
- [ ] Add keyboard shortcut (Ctrl+Shift+D)
- [ ] Collect audio stats from AudioContext
- [ ] Collect P2P stats from StreamingClient
- [ ] Add memory monitoring
- [ ] Style with Tailwind
- [ ] Add graph for latency over time

### Keyboard Shortcuts
```typescript
// composables/useDebugShortcuts.ts
onKeyDown('d', (e) => {
  if (e.ctrlKey && e.shiftKey) {
    toggleDebugPanel()
  }
})
```

### Definition of Done
- Debug panel toggles with Ctrl+Shift+D
- Shows real-time audio stats
- Shows P2P connection info
- Memory usage visible

---

## E10-T2: Logging & Metrics

**Priority:** 🟡 P2 MEDIUM  
**Points:** 5  
**Depends on:** E5-T1

### Description
Structured logging and Prometheus metrics for backend.

### Acceptance Criteria
- [ ] Structured JSON logging
- [ ] Request tracing (correlation ID)
- [ ] Audio error logs
- [ ] Prometheus metrics endpoint
- [ ] Log levels configurable

### Technical Requirements

```typescript
// apps/api/src/common/logger/logger.service.ts
@Injectable()
export class LoggerService {
  private logger: pino.Logger
  
  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development' 
        ? { target: 'pino-pretty' }
        : undefined
    })
  }
  
  info(message: string, context?: object) {
    this.logger.info({ ...context, correlationId: this.getCorrelationId() }, message)
  }
  
  error(message: string, error?: Error, context?: object) {
    this.logger.error({ 
      ...context, 
      correlationId: this.getCorrelationId(),
      error: error ? { message: error.message, stack: error.stack } : undefined
    }, message)
  }
}
```

### Prometheus Metrics

```typescript
// apps/api/src/common/metrics/metrics.service.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client'

@Injectable()
export class MetricsService {
  private registry = new Registry()
  
  // HTTP metrics
  httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 5]
  })
  
  // Business metrics
  tracksPublished = new Counter({
    name: 'tracks_published_total',
    help: 'Total tracks published'
  })
  
  activeSessions = new Gauge({
    name: 'active_sessions',
    help: 'Number of active user sessions'
  })
  
  streamingPeers = new Gauge({
    name: 'streaming_peers',
    help: 'Number of P2P streaming peers',
    labelNames: ['track_id']
  })
  
  paymentsProcessed = new Counter({
    name: 'payments_processed_total',
    help: 'Total payments processed',
    labelNames: ['type', 'status']
  })
  
  async getMetrics(): Promise<string> {
    return this.registry.metrics()
  }
}
```

### Log Format
```json
{
  "level": "info",
  "time": "2026-01-27T16:00:00.000Z",
  "correlationId": "abc123",
  "msg": "Track published",
  "trackId": "xyz",
  "userId": "user1",
  "duration": 245
}
```

### Subtasks
- [ ] Setup Pino logger
- [ ] Add correlation ID middleware
- [ ] Create `MetricsService`
- [ ] Add HTTP request metrics
- [ ] Add business metrics
- [ ] Create `/metrics` endpoint
- [ ] Add error tracking
- [ ] Configure log rotation
- [ ] Document metric names

### Definition of Done
```bash
# View logs (structured)
docker-compose logs api | jq '.'

# View metrics
curl http://localhost:4000/metrics
# → Prometheus format
```

---

## E10-T3: Documentation

**Priority:** 🟢 P3 LOW  
**Points:** 8  
**Depends on:** All

### Description
Comprehensive documentation for developers.

### Acceptance Criteria
- [ ] Architecture overview
- [ ] Audio engine docs
- [ ] P2P flow documentation
- [ ] API reference (OpenAPI)
- [ ] Getting started guide
- [ ] Contribution guide

### Documentation Structure

```
docs/
├── 00-STACK-OVERVIEW.md      ✅ Created
├── 01-BACKEND-API.md         ✅ Created
├── 02-P2P-SEED.md            ✅ Created
├── 03-SMART-CONTRACTS.md     ✅ Created
├── 04-WASM-DSP.md            ✅ Created
├── 05-DEVOPS.md              ✅ Created
├── 06-DATABASE.md            ✅ Created
│
├── architecture/
│   ├── overview.md           # System architecture
│   ├── audio-engine.md       # Audio processing flow
│   ├── p2p-flow.md           # P2P streaming flow
│   └── data-flow.md          # Data flow diagrams
│
├── guides/
│   ├── getting-started.md    # Quick start
│   ├── local-development.md  # Dev environment
│   ├── testing.md            # Testing guide
│   └── deployment.md         # Production deploy
│
├── api/
│   ├── openapi.yaml          # OpenAPI spec
│   └── websocket.md          # WebSocket events
│
└── contributing/
    ├── CONTRIBUTING.md       # How to contribute
    ├── CODE_OF_CONDUCT.md    # Code of conduct
    └── STYLE_GUIDE.md        # Code style
```

### Subtasks
- [ ] Create architecture diagrams
- [ ] Document audio engine internals
- [ ] Document P2P protocol
- [ ] Generate OpenAPI from NestJS
- [ ] Write getting started guide
- [ ] Write deployment guide
- [ ] Create contribution guidelines
- [ ] Setup docs site (VitePress)

### Definition of Done
- New developer can start in < 30 min
- All APIs documented
- Architecture understood from docs

---

## Dependencies Graph

```
E2-T4 (Latency)
    │
    ▼
E10-T1 (Debug Overlay)

E5-T1 (Backend)
    │
    ▼
E10-T2 (Logging)

[All Epics]
    │
    ▼
E10-T3 (Documentation)
```

---

## Monitoring Stack (Production)

| Tool | Purpose |
|------|---------|
| **Prometheus** | Metrics collection |
| **Grafana** | Dashboards |
| **Loki** | Log aggregation |
| **Jaeger** | Distributed tracing |
| **Sentry** | Error tracking |

### Future: Grafana Dashboard
```
┌────────────────────────────────────────────────────────┐
│                    DAWW3 Dashboard                     │
├────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ │ Active Users │ │ Streams/sec  │ │ P2P Ratio    │    │
│ │    1,234     │ │     456      │ │    67%       │    │
│ └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                        │
│ ┌────────────────────────────────────────────────────┐│
│ │ Request Latency (p99)                              ││
│ │ ▁▂▃▄▅▆▇▆▅▄▃▂▁▂▃▄▅▆▇▆▅▄▃▂▁▂▃▄▅                    ││
│ └────────────────────────────────────────────────────┘│
│                                                        │
│ ┌────────────────────────────────────────────────────┐│
│ │ Errors by Type                                     ││
│ │ [bar chart]                                        ││
│ └────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```
