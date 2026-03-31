# E26: Load Testing & Performance — Agent Prompts

> **Goal:** Validate system under production load (1000+ concurrent users)
> **Sprint:** 4
> **Owner:** DevOps / QA
> **Priority:** 🟠 P1 HIGH

---

## E26-T1: k6 Load Test Execution

```
[[[[ #SETTINGS

    mode = agent - run load tests, analyze results
    expertize = 'you are world class performance testing engineer'
    target = execute k6 load tests and identify bottlenecks
    test = true

    code style = [k6 best practices]
    write docs = true
    deep thinking = true
    performance = measure at scale
    tech stack = ['k6', 'Grafana', 'Prometheus', 'Docker']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Run k6 load tests for API, WebSocket, and P2P scenarios.

{{{{ #CUSTOMER PROMT

Load tests написаны в load-tests/k6/, но не запускались.
Нужно:
1. Запустить все сценарии
2. Собрать метрики
3. Найти bottlenecks
4. Зафиксировать baseline для monitoring

}}}}

<<<<<<#RECOMMENDED TASKS

LOAD-1. Setup Load Test Environment
```bash
# Start full stack
docker compose -f docker-compose.prod.yml up -d

# Wait for healthy
./scripts/wait-for-health.sh

# Start k6 with Prometheus output
docker run --rm -i --network=host \
  -v $(pwd)/load-tests:/scripts \
  grafana/k6:latest run /scripts/k6/api-load.js \
  --out experimental-prometheus-rw
```

LOAD-2. API Load Test (RESTful Endpoints)
```javascript
// load-tests/k6/api-load.js (existing file)
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp to 100 users
    { duration: '5m', target: 100 },  // Stay at 100
    { duration: '2m', target: 500 },  // Ramp to 500
    { duration: '5m', target: 500 },  // Stay at 500
    { duration: '2m', target: 1000 }, // Ramp to 1000
    { duration: '5m', target: 1000 }, // Stay at 1000
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<200'], // 95% <200ms
    'http_req_failed': ['rate<0.01'],   // <1% errors
  }
}

export default function () {
  // Test: GET /api/v1/tracks (search)
  const search = http.get('http://localhost:4000/api/v1/tracks?genre=electronic')
  check(search, { 'search status 200': (r) => r.status === 200 })
  
  // Test: GET /api/v1/leaderboard/xp
  const leaderboard = http.get('http://localhost:4000/api/v1/leaderboard/xp')
  check(leaderboard, { 'leaderboard status 200': (r) => r.status === 200 })
  
  // Test: POST /api/v1/tracks/:id/play
  const play = http.post('http://localhost:4000/api/v1/tracks/test-track-id/play', {
    completionRate: 0.8
  })
  check(play, { 'play status 200': (r) => r.status === 200 })
  
  sleep(1)
}
```

Run: `k6 run load-tests/k6/api-load.js`

LOAD-3. WebSocket Load Test
```javascript
// load-tests/k6/websocket-load.js (existing)
import ws from 'k6/ws'
import { check } from 'k6'

export const options = {
  vus: 1000, // 1000 concurrent connections
  duration: '10m'
}

export default function () {
  const url = 'ws://localhost:4000/leaderboard'
  
  const res = ws.connect(url, {}, (socket) => {
    socket.on('open', () => {
      socket.send(JSON.stringify({
        event: 'subscribe',
        data: { type: 'xp' }
      }))
    })
    
    socket.on('message', (data) => {
      check(data, { 'leaderboard update received': (d) => d.length > 0 })
    })
    
    socket.setTimeout(() => {
      socket.close()
    }, 60000) // Keep open 60s
  })
  
  check(res, { 'ws connection established': (r) => r && r.status === 101 })
}
```

LOAD-4. P2P Swarm Simulation
```javascript
// load-tests/k6/p2p-simulation.js (existing)
// Simulates peer connections and chunk requests
export const options = {
  scenarios: {
    seeders: {
      executor: 'constant-vus',
      vus: 50,
      duration: '10m'
    },
    leechers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 500 }
      ]
    }
  }
}

export default function () {
  // Connect to seed node
  const seedUrl = 'http://localhost:5001/connect'
  const connect = http.post(seedUrl, JSON.stringify({
    infoHash: 'test-track-hash',
    peerId: `peer-${__VU}-${__ITER}`
  }))
  
  // Request chunks
  const chunks = http.get(`http://localhost:5001/chunks/test-track-hash`)
  
  check(chunks, { 'chunks received': (r) => r.status === 200 })
  
  sleep(5)
}
```

LOAD-5. Analyze Results
```bash
# k6 outputs summary
# Look for:
# - http_req_duration p(95) <200ms ✅ or ❌
# - http_req_failed <1% ✅ or ❌
# - websocket_connection_duration
# - data_received, data_sent

# Export to Grafana
# Dashboard: Load Test Results
# Panels: RPS, latency percentiles, error rate
```

LOAD-6. Identify Bottlenecks
Common issues:
- **Database:** Slow queries (check pg_stat_statements)
- **Redis:** Connection pool exhausted
- **API:** CPU-bound (serialization, validation)
- **Network:** Bandwidth saturation
- **Memory:** OOM, GC pressure

Tools:
```bash
# API logs
docker compose logs api | grep "slow query"

# Database stats
docker compose exec postgres psql -c "SELECT * FROM pg_stat_activity"

# Redis stats
docker compose exec redis redis-cli INFO stats

# System resources
docker stats
```

🏁 Definition of Done
- All k6 tests executed
- 1000 concurrent users sustained
- p95 latency <200ms ✅ or documented issues
- Error rate <1% ✅ or documented issues
- Bottlenecks identified
- Baseline metrics recorded

>>>>>>

]]]]
```

---

## E26-T2: P2P Swarm Simulation (100+ Peers)

```
[[[[ #SETTINGS

    mode = agent - simulate P2P network at scale
    expertize = 'you are world class P2P network engineer'
    target = test WebTorrent swarm with 100+ concurrent peers
    test = true

    code style = [simulation, realistic workloads]
    write docs = true
    deep thinking = true
    performance = measure P2P ratio, seed bandwidth
    tech stack = ['WebTorrent', 'k6', 'Docker']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Simulate P2P swarm with 100+ peers downloading/seeding simultaneously.

{{{{ #CUSTOMER PROMT

P2P tests были только unit/integration.
Нужен load test: 100+ peers одновременно качают популярный трек.
Измерить: P2P ratio, seed bandwidth, chunk availability, connection time.

}}}}

<<<<<<#RECOMMENDED TASKS

P2P-1. Setup Test Track
- Publish test track to seed node
- Pre-seed with 20 initial peers
- Verify: Chunks available, tracker running

P2P-2. Spawn Peer Processes
```typescript
// load-tests/p2p-swarm-test.ts
import WebTorrent from 'webtorrent'

async function createPeer(trackHash: string, seedMode: boolean) {
  const client = new WebTorrent()
  
  return new Promise((resolve) => {
    client.add(trackHash, {
      announce: ['ws://localhost:5001']
    }, (torrent) => {
      torrent.on('done', () => {
        if (seedMode) {
          // Keep seeding
          setTimeout(() => {}, 60000)
        } else {
          // Download complete
          resolve({ downloaded: torrent.downloaded, time: torrent.downloadTime })
        }
      })
    })
  })
}

// Spawn 100 peers
const peers = []
for (let i = 0; i < 100; i++) {
  peers.push(createPeer('test-track-hash', i < 20)) // First 20 seed
}

await Promise.all(peers)
```

P2P-3. Measure Metrics
- Track connection time: When peer joins → first chunk received
- Measure download speed: Bytes/second from peers vs seed
- Calculate P2P ratio: peer_bytes / (peer_bytes + seed_bytes)
- Monitor seed bandwidth: Should plateau as peers increase

P2P-4. Stress Test Scenarios

**Scenario 1:** Flash crowd (100 peers join simultaneously)
- Expected: Seed handles initial load, P2P takes over

**Scenario 2:** Seed node failure
- Kill seed during test
- Expected: Peers continue sharing among themselves

**Scenario 3:** Slow peer (throttled connection)
- Some peers with 1Mbps limit
- Expected: Fast peers compensate

P2P-5. Prometheus Metrics
```promql
# P2P ratio over time
sum(peer_bytes_uploaded) / (sum(peer_bytes_uploaded) + sum(seed_bytes_uploaded))

# Seed bandwidth (should plateau)
rate(seed_bytes_uploaded[5m])

# Peer connections
sum(peer_connections_active)
```

🏁 Definition of Done
- 100+ peers tested successfully
- P2P ratio >50% proven
- Seed bandwidth measured
- Connection time <5 seconds
- Chunk availability 100%

>>>>>>

]]]]
```

---

## E26-T3: WebSocket Load Test

```
[[[[ #SETTINGS

    mode = agent - test WebSocket at scale
    expertize = 'you are world class real-time systems engineer'
    target = 1000 concurrent WebSocket connections
    test = true

    code style = [concurrent connections, memory efficient]
    write docs = true
    deep thinking = false
    performance = <5s connection time, <100ms message latency
    tech stack = ['Socket.io', 'k6', 'Redis']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Test 1000 concurrent WebSocket connections for leaderboard updates.

{{{{ #CUSTOMER PROMT

WebSocket used для real-time leaderboard, collaboration.
Нужно проверить что 1000+ connections работают:
- Connection time <5s
- Message latency <100ms
- No memory leaks
- Redis pub/sub scales

}}}}

<<<<<<#RECOMMENDED TASKS

WS-1. k6 WebSocket Test
```javascript
// Already exists: load-tests/k6/websocket-load.js
// Ramp up to 1000 connections
// Measure: connection_duration, message_latency
```

WS-2. Monitor Server Resources
```bash
# Watch memory usage
watch -n 1 docker stats api

# Check open connections
netstat -an | grep :4000 | wc -l

# Redis pub/sub channels
docker compose exec redis redis-cli PUBSUB CHANNELS
```

WS-3. Test Broadcasting
- Trigger leaderboard update while 1000 clients connected
- Measure: Time for all clients to receive message
- Expected: <1 second for broadcast to reach all

WS-4. Connection Pooling
- Verify: Redis adapter for Socket.io scaling
- Test: Multiple API instances (3 pods)
- Ensure: Clients can connect to any pod

WS-5. Failure Scenarios
- Kill API pod mid-test
- Expected: Clients reconnect automatically
- Check: No lost messages (with acknowledgments)

🏁 Definition of Done
- 1000 concurrent WebSocket connections sustained
- Connection time <5s
- Message latency <100ms
- No memory leaks after 10 minutes
- Broadcasting works at scale

>>>>>>

]]]]
```

---

## E26-T4: Performance Tuning & Bottleneck Fix

```
[[[[ #SETTINGS

    mode = agent - optimize performance based on test results
    expertize = 'you are world class performance optimization specialist'
    target = fix identified bottlenecks, improve p95 latency
    test = true

    code style = [profiling, data-driven optimization]
    write docs = true
    deep thinking = true
    performance = reduce p95 latency by 50%
    tech stack = ['Node.js profiling', 'PostgreSQL tuning', 'Redis optimization']
    remove unused files and code fragments = false

]]]]

[[[[ #PROMT

Analyze load test results and optimize bottlenecks.

{{{{ #CUSTOMER PROMT

После load tests будут найдены bottlenecks.
Типичные проблемы:
- Slow database queries
- N+1 queries
- Large JSON serialization
- Missing indexes
- Connection pool exhaustion

Нужно профилировать, найти проблемы, fix, re-test.

}}}}

<<<<<<#RECOMMENDED TASKS

TUNE-1. Database Query Optimization
```sql
-- Find slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_tracks_rating 
ON tracks(rating DESC) WHERE state = 'PAID';

CREATE INDEX CONCURRENTLY idx_user_xp_total 
ON user_xp(total DESC);

-- Explain analyze slow queries
EXPLAIN ANALYZE 
SELECT * FROM tracks 
WHERE state = 'PAID' 
ORDER BY rating DESC 
LIMIT 100;
```

TUNE-2. N+1 Query Elimination
```typescript
// Before (N+1)
const tracks = await prisma.track.findMany()
for (const track of tracks) {
  track.artist = await prisma.user.findUnique({ where: { id: track.artistId } })
}

// After (1 query)
const tracks = await prisma.track.findMany({
  include: { artist: true }
})
```

TUNE-3. Redis Caching
```typescript
// Cache leaderboards (1 hour TTL)
async getLeaderboard(type: string) {
  const cached = await this.redis.get(`leaderboard:${type}`)
  if (cached) return JSON.parse(cached)
  
  const data = await this.calculateLeaderboard(type)
  await this.redis.set(`leaderboard:${type}`, JSON.stringify(data), 'EX', 3600)
  return data
}
```

TUNE-4. Connection Pool Tuning
```typescript
// apps/api/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connection_limit = 20 // Increase from default 10
}

// Redis connection pool
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  connectionPool: 50 // For high concurrency
})
```

TUNE-5. API Response Compression
```typescript
// Enable gzip compression
app.use(compression({
  level: 6, // Balance speed vs compression
  threshold: 1024 // Only compress >1KB responses
}))
```

TUNE-6. Rate Limiting Bypass for Load Tests
```typescript
// Disable rate limiting in test mode
if (process.env.NODE_ENV !== 'load-test') {
  app.use(rateLimiter)
}
```

TUNE-7. Profiling
```bash
# Node.js --inspect mode
node --inspect apps/api/dist/main.js

# Chrome DevTools: chrome://inspect
# Record CPU profile during load test
# Identify hot functions

# Or use clinic.js
clinic doctor -- node apps/api/dist/main.js
clinic flame -- node apps/api/dist/main.js
```

TUNE-8. Before/After Comparison
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| p95 latency | 450ms | 180ms | 60% ↓ |
| Throughput | 500 req/s | 1200 req/s | 140% ↑ |
| Error rate | 2% | 0.5% | 75% ↓ |
| Database connections | 80 (exhausted) | 15 (healthy) | 81% ↓ |

🏁 Definition of Done
- All bottlenecks identified and fixed
- p95 latency <200ms
- Error rate <1%
- Re-run load tests: All passing
- Optimizations documented

>>>>>>

]]]]
```

---

## E26 Performance Baseline

After tuning, establish baseline for monitoring:

```yaml
# monitoring/slos.yaml
apiVersion: v1
kind: ServiceLevelObjective
metadata:
  name: daww3-api-performance
spec:
  objectives:
    - name: api-latency-p95
      target: 200ms
      burn_rate: 0.01 # Alert if exceeded by 1%
    
    - name: api-error-rate
      target: 1%
      burn_rate: 0.5 # Alert if doubled
    
    - name: websocket-connection-time
      target: 5s
      burn_rate: 0.1
    
    - name: p2p-ratio
      target: 50%
      direction: above # Want higher
```

---

*E26 Load Testing & Performance — DAWW3 Sprint 4*
