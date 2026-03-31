# ⚡ Performance — QA Test Specifications

> **Scope:** Performance benchmarks and load testing across DAWW3 platform
> **Target:** Real-time audio < 10ms, API < 50ms, 10K concurrent users

---

## Agent Prompt for Performance Testing

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive performance tests
    expertize = 'you are world class performance engineer and load testing specialist'
    target = validate DAWW3 meets performance targets under load
    test = true

    code style = [Benchmark-driven, Statistically significant]
    write docs = true
    deep thinking = true
    performance = identify bottlenecks
    tech stack = ['Artillery', 'k6', 'Lighthouse', 'Web Vitals']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement performance tests for DAWW3 covering:
- Audio engine latency and CPU usage
- API response times
- WebSocket throughput
- P2P streaming performance
- Frontend load times

{{{{ #CUSTOMER PROMT

Нужны performance tests для:
- Audio: < 10ms latency, < 50% CPU at 16 tracks
- API: < 50ms response, 1000 RPS capacity
- WebSocket: 10K connections, < 20ms latency
- P2P: < 1s time-to-first-chunk, > 50% P2P ratio
- Frontend: LCP < 2.5s, FID < 100ms, CLS < 0.1

}}}}

<<<<<<#RECOMMENDED TASKS

PERF-1. Audio Engine Performance Tests
PERF-2. API Response Time Tests
PERF-3. WebSocket Load Tests
PERF-4. P2P Streaming Performance Tests
PERF-5. Frontend Web Vitals Tests
PERF-6. Database Query Performance Tests

>>>>>>

]]]]
```

---

## PERF-1: Audio Engine Performance

```typescript
// apps/web/src/core/audio/__tests__/performance.test.ts

describe('Audio Engine Performance', () => {
  describe('Latency Benchmarks', () => {
    it('AudioWorklet process() < 2ms per block', async () => {
      const context = new AudioContext({ sampleRate: 44100 })
      await context.audioWorklet.addModule('processors/base-processor.js')
      
      const node = new AudioWorkletNode(context, 'base-processor')
      const processTimes: number[] = []
      
      node.port.onmessage = (e) => {
        if (e.data.type === 'metrics') {
          processTimes.push(e.data.processTime)
        }
      }
      
      // Run for 1 second
      await new Promise(r => setTimeout(r, 1000))
      
      const avgProcessTime = processTimes.reduce((a, b) => a + b, 0) / processTimes.length
      const maxProcessTime = Math.max(...processTimes)
      
      console.log(`Average process time: ${avgProcessTime.toFixed(3)}ms`)
      console.log(`Max process time: ${maxProcessTime.toFixed(3)}ms`)
      
      expect(avgProcessTime).toBeLessThan(2)
      expect(maxProcessTime).toBeLessThan(5) // Allow occasional spikes
    })

    it('low latency preset achieves < 10ms', async () => {
      const manager = new LatencyManager()
      manager.setPreset('low')
      
      const actualLatency = manager.getActualLatency()
      
      console.log(`Low preset latency: ${actualLatency.toFixed(2)}ms`)
      expect(actualLatency).toBeLessThan(10)
    })

    it('balanced preset achieves < 15ms', async () => {
      const manager = new LatencyManager()
      manager.setPreset('balanced')
      
      expect(manager.getActualLatency()).toBeLessThan(15)
    })
  })

  describe('CPU Usage', () => {
    it('16 tracks < 50% CPU usage', async () => {
      const context = new AudioContext()
      const mixer = new Mixer(context)
      
      // Create 16 tracks with oscillators
      for (let i = 0; i < 16; i++) {
        const track = mixer.addTrack(`track-${i}`)
        const osc = context.createOscillator()
        osc.connect(track.input)
        osc.start()
      }
      
      // Measure CPU (approximation via process time)
      const blockTime = 128 / context.sampleRate * 1000 // ms per block
      const processTimes: number[] = []
      
      // Collect samples
      await new Promise(r => setTimeout(r, 2000))
      
      const avgLoad = processTimes.reduce((a, b) => a + b, 0) / processTimes.length / blockTime
      
      console.log(`CPU load estimate: ${(avgLoad * 100).toFixed(1)}%`)
      expect(avgLoad).toBeLessThan(0.5)
    })

    it('WASM DSP plugin < 0.5ms per block', async () => {
      const context = new AudioContext()
      await context.audioWorklet.addModule('processors/wasm-processor.js')
      
      const node = new AudioWorkletNode(context, 'wasm-processor')
      const times: number[] = []
      
      node.port.onmessage = (e) => {
        if (e.data.processTime) times.push(e.data.processTime)
      }
      
      await new Promise(r => setTimeout(r, 1000))
      
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      expect(avg).toBeLessThan(0.5)
    })
  })

  describe('Memory Usage', () => {
    it('memory stable over 10 minutes', async () => {
      const samples: number[] = []
      
      const interval = setInterval(() => {
        if (performance.memory) {
          samples.push(performance.memory.usedJSHeapSize)
        }
      }, 1000)
      
      // Run audio for 10 minutes
      await new Promise(r => setTimeout(r, 10 * 60 * 1000))
      
      clearInterval(interval)
      
      // Check for memory leak (growth > 20%)
      const firstQuarter = samples.slice(0, samples.length / 4)
      const lastQuarter = samples.slice(-samples.length / 4)
      
      const avgFirst = firstQuarter.reduce((a, b) => a + b) / firstQuarter.length
      const avgLast = lastQuarter.reduce((a, b) => a + b) / lastQuarter.length
      
      const growth = (avgLast - avgFirst) / avgFirst
      expect(growth).toBeLessThan(0.2)
    }, 15 * 60 * 1000)
  })
})
```

---

## PERF-2: API Response Times

```typescript
// apps/api/src/__tests__/performance/api-load.test.ts

describe('API Performance', () => {
  describe('Response Time Benchmarks', () => {
    it('GET /health < 10ms', async () => {
      const times: number[] = []
      
      for (let i = 0; i < 100; i++) {
        const start = performance.now()
        await request(app).get('/api/v1/health')
        times.push(performance.now() - start)
      }
      
      const avg = times.reduce((a, b) => a + b) / times.length
      const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)]
      
      console.log(`Health check avg: ${avg.toFixed(2)}ms, p95: ${p95.toFixed(2)}ms`)
      expect(avg).toBeLessThan(10)
      expect(p95).toBeLessThan(20)
    })

    it('GET /tracks/:id < 50ms', async () => {
      const times: number[] = []
      
      for (let i = 0; i < 100; i++) {
        const start = performance.now()
        await request(app).get('/api/v1/tracks/test-track-1')
        times.push(performance.now() - start)
      }
      
      const avg = times.reduce((a, b) => a + b) / times.length
      const p99 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.99)]
      
      console.log(`Track fetch avg: ${avg.toFixed(2)}ms, p99: ${p99.toFixed(2)}ms`)
      expect(avg).toBeLessThan(50)
      expect(p99).toBeLessThan(200)
    })

    it('POST /tracks (create) < 100ms', async () => {
      const times: number[] = []
      const token = await getTestToken()
      
      for (let i = 0; i < 50; i++) {
        const start = performance.now()
        await request(app)
          .post('/api/v1/tracks')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: `Track ${i}`, userId: 'user-1' })
        times.push(performance.now() - start)
      }
      
      const avg = times.reduce((a, b) => a + b) / times.length
      expect(avg).toBeLessThan(100)
    })
  })

  describe('Throughput', () => {
    it('handles 1000 RPS for read endpoints', async () => {
      const duration = 10 // seconds
      const targetRps = 1000
      let successCount = 0
      let errorCount = 0
      
      const start = Date.now()
      const promises: Promise<void>[] = []
      
      while (Date.now() - start < duration * 1000) {
        for (let i = 0; i < targetRps / 100; i++) {
          promises.push(
            request(app)
              .get('/api/v1/tracks')
              .then(() => { successCount++ })
              .catch(() => { errorCount++ })
          )
        }
        await new Promise(r => setTimeout(r, 10))
      }
      
      await Promise.all(promises)
      
      const actualRps = successCount / duration
      const errorRate = errorCount / (successCount + errorCount)
      
      console.log(`Achieved RPS: ${actualRps.toFixed(0)}, Error rate: ${(errorRate * 100).toFixed(2)}%`)
      expect(actualRps).toBeGreaterThan(800) // 80% of target
      expect(errorRate).toBeLessThan(0.01) // < 1% errors
    })
  })
})
```

---

## PERF-3: WebSocket Load Tests

```yaml
# artillery/websocket-load.yml

config:
  target: "http://localhost:4000"
  phases:
    - duration: 60
      arrivalRate: 100  # 100 new connections per second
      name: "Ramp up"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
  socketio:
    path: "/socket.io"

scenarios:
  - name: "Join track room and receive updates"
    engine: socketio
    flow:
      - emit:
          channel: "join-track"
          data:
            trackId: "track-{{ $randomNumber(1, 100) }}"
      - think: 5
      - emit:
          channel: "play-progress"
          data:
            trackId: "track-1"
            position: "{{ $randomNumber(0, 300) }}"
      - think: 30
      - emit:
          channel: "leave-track"
          data:
            trackId: "track-1"
```

```typescript
describe('WebSocket Performance', () => {
  it('10K concurrent connections', async () => {
    const sockets: Socket[] = []
    const connectionTimes: number[] = []
    
    console.log('Connecting 10K sockets...')
    
    for (let batch = 0; batch < 100; batch++) {
      const batchStart = performance.now()
      
      const batchPromises = Array(100).fill(null).map(() =>
        new Promise<Socket>((resolve, reject) => {
          const socket = io('http://localhost:4000', {
            transports: ['websocket']
          })
          socket.on('connect', () => resolve(socket))
          socket.on('connect_error', reject)
        })
      )
      
      const batchSockets = await Promise.all(batchPromises)
      sockets.push(...batchSockets)
      connectionTimes.push(performance.now() - batchStart)
      
      console.log(`Batch ${batch + 1}/100 connected`)
    }
    
    console.log(`Total connections: ${sockets.length}`)
    console.log(`Avg batch time: ${(connectionTimes.reduce((a, b) => a + b) / connectionTimes.length).toFixed(0)}ms`)
    
    expect(sockets.length).toBe(10000)
    
    // Measure message latency
    const latencies: number[] = []
    const socket = sockets[0]
    
    for (let i = 0; i < 100; i++) {
      const start = performance.now()
      await new Promise<void>(resolve => {
        socket.emit('ping')
        socket.once('pong', () => {
          latencies.push(performance.now() - start)
          resolve()
        })
      })
    }
    
    const avgLatency = latencies.reduce((a, b) => a + b) / latencies.length
    console.log(`Average message latency: ${avgLatency.toFixed(2)}ms`)
    
    expect(avgLatency).toBeLessThan(20)
    
    // Cleanup
    sockets.forEach(s => s.close())
  }, 300000) // 5 minute timeout
})
```

---

## PERF-4: P2P Streaming Performance

```typescript
describe('P2P Streaming Performance', () => {
  describe('Time to First Chunk', () => {
    it('first chunk < 1 second from seed', async () => {
      const client = new StreamingClient('http://localhost:5001')
      
      const start = performance.now()
      
      await new Promise<void>(resolve => {
        client.onChunk((index, data) => {
          if (index === 0) {
            resolve()
          }
        })
        client.joinSwarm('test-track')
      })
      
      const ttfc = performance.now() - start
      console.log(`Time to first chunk: ${ttfc.toFixed(0)}ms`)
      
      expect(ttfc).toBeLessThan(1000)
    })

    it('buffering starts in < 3 seconds', async () => {
      const client = new StreamingClient('http://localhost:5001')
      
      const start = performance.now()
      
      await new Promise<void>(resolve => {
        client.on('buffering-ready', () => resolve())
        client.joinSwarm('test-track')
      })
      
      const bufferTime = performance.now() - start
      expect(bufferTime).toBeLessThan(3000)
    })
  })

  describe('P2P Ratio', () => {
    it('popular track achieves > 50% P2P', async () => {
      // Simulate multiple clients joining same track
      const clients = await Promise.all(
        Array(50).fill(null).map(() => createStreamingClient('popular-track'))
      )
      
      // Wait for peer connections
      await new Promise(r => setTimeout(r, 10000))
      
      // Aggregate stats
      const totalStats = clients.reduce((acc, client) => ({
        fromSeed: acc.fromSeed + client.stats.downloadedFromSeed,
        fromPeers: acc.fromPeers + client.stats.downloadedFromPeers
      }), { fromSeed: 0, fromPeers: 0 })
      
      const p2pRatio = totalStats.fromPeers / (totalStats.fromSeed + totalStats.fromPeers)
      console.log(`P2P ratio: ${(p2pRatio * 100).toFixed(1)}%`)
      
      expect(p2pRatio).toBeGreaterThan(0.5)
      
      clients.forEach(c => c.close())
    }, 60000)
  })
})
```

---

## PERF-5: Frontend Web Vitals

```typescript
// apps/web/src/__tests__/performance/web-vitals.test.ts

import { test, expect } from '@playwright/test'

test.describe('Web Vitals', () => {
  test('LCP < 2.5s', async ({ page }) => {
    await page.goto('/')
    
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ type: 'largest-contentful-paint', buffered: true })
      })
    })
    
    console.log(`LCP: ${lcp}ms`)
    expect(lcp).toBeLessThan(2500)
  })

  test('FID < 100ms', async ({ page }) => {
    await page.goto('/')
    
    // Trigger interaction
    const fid = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          resolve(entries[0].processingStart - entries[0].startTime)
        }).observe({ type: 'first-input', buffered: true })
        
        // Simulate click
        document.body.click()
      })
    })
    
    console.log(`FID: ${fid}ms`)
    expect(fid).toBeLessThan(100)
  })

  test('CLS < 0.1', async ({ page }) => {
    await page.goto('/')
    
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
        }).observe({ type: 'layout-shift', buffered: true })
        
        setTimeout(() => resolve(clsValue), 5000)
      })
    })
    
    console.log(`CLS: ${cls}`)
    expect(cls).toBeLessThan(0.1)
  })

  test('Time to Interactive < 5s', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const tti = Date.now() - start
    
    console.log(`TTI: ${tti}ms`)
    expect(tti).toBeLessThan(5000)
  })
})
```

---

## PERF-6: Database Performance

```typescript
describe('Database Performance', () => {
  it('track listing query < 10ms with index', async () => {
    const start = performance.now()
    
    await prisma.track.findMany({
      where: { isPublic: true },
      orderBy: { rating: 'desc' },
      take: 20
    })
    
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(10)
  })

  it('user lookup by wallet < 5ms', async () => {
    const start = performance.now()
    
    await prisma.user.findUnique({
      where: { walletAddress: '0x1234...' }
    })
    
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(5)
  })

  it('complex rating query < 50ms', async () => {
    const start = performance.now()
    
    await prisma.track.findMany({
      where: {
        status: 'PAID',
        rating: { gte: 40 }
      },
      include: {
        user: true,
        _count: { select: { plays: true } }
      },
      orderBy: { rating: 'desc' },
      take: 100
    })
    
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(50)
  })
})
```

---

## Performance Benchmarks Summary

| Metric | Target | Critical | Test |
|--------|--------|----------|------|
| Audio latency (low) | < 10ms | < 20ms | PERF-1 |
| Audio CPU (16 tracks) | < 50% | < 80% | PERF-1 |
| API response (p95) | < 50ms | < 200ms | PERF-2 |
| API throughput | 1000 RPS | 500 RPS | PERF-2 |
| WebSocket latency | < 20ms | < 100ms | PERF-3 |
| WebSocket connections | 10K | 5K | PERF-3 |
| P2P time-to-first-chunk | < 1s | < 3s | PERF-4 |
| P2P ratio (popular) | > 50% | > 20% | PERF-4 |
| LCP | < 2.5s | < 4s | PERF-5 |
| FID | < 100ms | < 300ms | PERF-5 |
| CLS | < 0.1 | < 0.25 | PERF-5 |

---

*Performance QA — DAWW3 Project*
