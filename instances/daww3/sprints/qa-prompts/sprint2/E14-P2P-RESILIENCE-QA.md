# 🛡️ E14: P2P Network Resilience — QA Test Specifications

> **Epic:** E14 - P2P Network Resilience
> **Status:** ✅ DONE
> **Focus:** NAT/TURN, HTTP fallback, ABR, DHT, Swarm health, Mobile

---

## Agent Prompt for P2P Resilience Testing

```
[[[[ #SETTINGS

    mode = agent - implement P2P resilience tests
    expertize = 'you are world class network resilience and chaos engineering specialist'
    target = validate P2P network works under adverse conditions
    test = true

    code style = [Chaos testing, Network simulation]
    write docs = true
    deep thinking = true
    performance = seamless degradation
    tech stack = ['Vitest', 'WebRTC', 'tc (traffic control)', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for DAWW3 P2P resilience covering:
- NAT traversal with TURN fallback
- HTTP streaming fallback when P2P fails
- Adaptive bitrate under varying conditions
- DHT peer discovery
- Swarm health monitoring
- Mobile browser optimizations

}}}}

<<<<<<#RECOMMENDED TASKS

E14-QA-1. NAT Traversal Tests
E14-QA-2. HTTP Fallback Tests
E14-QA-3. Adaptive Bitrate Tests
E14-QA-4. DHT Discovery Tests
E14-QA-5. Swarm Health Tests
E14-QA-6. Mobile Optimization Tests

>>>>>>

]]]]
```

---

## Unit Tests

### E14-QA-1: NAT Traversal

```typescript
describe('NAT Traversal', () => {
  describe('ICE Manager', () => {
    it('detects NAT type', async () => {
      const iceManager = new IceManager()
      
      const natType = await iceManager.detectNatType()
      
      expect(['full-cone', 'restricted', 'port-restricted', 'symmetric'])
        .toContain(natType)
    })

    it('generates ICE configuration', async () => {
      const iceManager = new IceManager()
      
      const config = await iceManager.getIceConfig()
      
      expect(config.iceServers).toBeDefined()
      expect(config.iceServers.length).toBeGreaterThan(0)
    })

    it('includes TURN credentials', async () => {
      const iceManager = new IceManager()
      
      const config = await iceManager.getIceConfig()
      const turnServer = config.iceServers.find(s => s.urls.includes('turn:'))
      
      expect(turnServer).toBeDefined()
      expect(turnServer.username).toBeDefined()
      expect(turnServer.credential).toBeDefined()
    })
  })

  describe('TURN Credentials', () => {
    it('generates time-limited credentials', async () => {
      const service = new TurnCredentialsService()
      
      const creds = await service.generateCredentials('user-1')
      
      expect(creds.username).toBeDefined()
      expect(creds.credential).toBeDefined()
      expect(creds.ttl).toBeGreaterThan(0)
    })

    it('credentials expire', async () => {
      const service = new TurnCredentialsService()
      
      const creds = await service.generateCredentials('user-1', { ttl: 1 })
      
      await new Promise(r => setTimeout(r, 2000))
      
      expect(service.validateCredentials(creds)).toBe(false)
    })
  })

  describe('Connection Metrics', () => {
    it('tracks connection success by NAT type', async () => {
      const manager = new IceManager()
      
      manager.recordConnection('full-cone', 'direct', true)
      manager.recordConnection('symmetric', 'relay', true)
      manager.recordConnection('symmetric', 'direct', false)
      
      const stats = manager.getConnectionStats()
      
      expect(stats['full-cone'].directSuccess).toBe(1)
      expect(stats['symmetric'].relaySuccess).toBe(1)
      expect(stats['symmetric'].directFailure).toBe(1)
    })
  })
})
```

### E14-QA-2: HTTP Fallback

```typescript
describe('HTTP Fallback', () => {
  describe('Fallback Manager', () => {
    it('triggers fallback on P2P timeout', async () => {
      const fallback = new FallbackManager({
        p2pTimeout: 1000,
        minPeers: 1
      })
      
      const mode = await fallback.determineMode({
        peerCount: 0,
        connectionTime: 2000
      })
      
      expect(mode).toBe('http')
    })

    it('triggers fallback on insufficient peers', async () => {
      const fallback = new FallbackManager({
        minPeers: 3
      })
      
      const mode = await fallback.determineMode({
        peerCount: 1,
        connectionTime: 500
      })
      
      expect(mode).toBe('http')
    })

    it('stays on P2P when conditions good', async () => {
      const fallback = new FallbackManager()
      
      const mode = await fallback.determineMode({
        peerCount: 10,
        connectionTime: 200,
        bufferHealth: 0.9
      })
      
      expect(mode).toBe('p2p')
    })
  })

  describe('HLS Streaming', () => {
    it('generates master playlist', () => {
      const hls = new HlsService()
      
      const playlist = hls.generateMasterPlaylist('track-1', [
        { quality: 'low', bitrate: 64000 },
        { quality: 'medium', bitrate: 128000 },
        { quality: 'high', bitrate: 256000 }
      ])
      
      expect(playlist).toContain('#EXT-X-STREAM-INF')
      expect(playlist).toContain('BANDWIDTH=64000')
    })

    it('generates media playlist', () => {
      const hls = new HlsService()
      
      const playlist = hls.generateMediaPlaylist('track-1', 'medium', [
        { index: 0, duration: 5 },
        { index: 1, duration: 5 },
        { index: 2, duration: 5 }
      ])
      
      expect(playlist).toContain('#EXTINF:5')
      expect(playlist).toContain('segment_0.ts')
    })
  })

  describe('Byte Range Requests', () => {
    it('handles Range header', async () => {
      const service = new ByteRangeService()
      
      const result = await service.handleRequest(
        'track-1',
        'bytes=0-999'
      )
      
      expect(result.status).toBe(206)
      expect(result.headers['Content-Range']).toContain('bytes 0-999')
    })
  })
})
```

### E14-QA-3: Adaptive Bitrate

```typescript
describe('Adaptive Bitrate', () => {
  describe('Quality Levels', () => {
    const levels = [
      { name: 'low', bitrate: 64000 },
      { name: 'medium', bitrate: 128000 },
      { name: 'high', bitrate: 256000 },
      { name: 'ultra', bitrate: 320000 },
      { name: 'lossless', bitrate: 1411000 }
    ]

    levels.forEach(({ name, bitrate }) => {
      it(`defines ${name} quality at ${bitrate}bps`, () => {
        const abr = new AdaptiveBitrateManager()
        const level = abr.getQualityLevel(name)
        
        expect(level.bitrate).toBe(bitrate)
      })
    })
  })

  describe('Bandwidth Estimation', () => {
    it('estimates bandwidth from samples', () => {
      const abr = new AdaptiveBitrateManager()
      
      abr.recordDownload(80000, 500) // 80KB in 500ms = 160KB/s
      abr.recordDownload(100000, 400) // 100KB in 400ms = 250KB/s
      
      const estimate = abr.getEstimatedBandwidth()
      
      expect(estimate).toBeGreaterThan(0)
    })

    it('uses weighted moving average', () => {
      const abr = new AdaptiveBitrateManager()
      
      // Old samples
      for (let i = 0; i < 10; i++) {
        abr.recordDownload(50000, 1000) // 50KB/s
      }
      
      // New faster samples
      abr.recordDownload(200000, 1000) // 200KB/s
      
      const estimate = abr.getEstimatedBandwidth()
      
      // Should be weighted towards recent
      expect(estimate).toBeGreaterThan(50000)
      expect(estimate).toBeLessThan(200000)
    })
  })

  describe('Quality Selection', () => {
    it('selects quality based on bandwidth', () => {
      const abr = new AdaptiveBitrateManager()
      
      // Simulate 500KB/s bandwidth
      for (let i = 0; i < 5; i++) {
        abr.recordDownload(500000, 1000)
      }
      
      const quality = abr.selectQuality()
      
      // 500KB/s = 4Mbps, should select ultra or high
      expect(['high', 'ultra']).toContain(quality)
    })

    it('avoids oscillation with stability bias', () => {
      const abr = new AdaptiveBitrateManager({ stabilityBias: 0.2 })
      
      abr.recordDownload(200000, 1000) // 200KB/s
      const quality1 = abr.selectQuality()
      
      // Slight bandwidth drop
      abr.recordDownload(180000, 1000) // 180KB/s
      const quality2 = abr.selectQuality()
      
      // Should stay stable despite small drop
      expect(quality2).toBe(quality1)
    })
  })

  describe('Manual Override', () => {
    it('locks quality when requested', () => {
      const abr = new AdaptiveBitrateManager()
      
      abr.lockQuality('low')
      
      // Even with high bandwidth
      abr.recordDownload(1000000, 1000)
      
      expect(abr.selectQuality()).toBe('low')
    })

    it('data saver mode caps quality', () => {
      const abr = new AdaptiveBitrateManager()
      
      abr.setDataSaverMode(true)
      abr.recordDownload(1000000, 1000) // High bandwidth
      
      expect(abr.selectQuality()).toBe('low')
    })
  })
})
```

### E14-QA-5: Swarm Health

```typescript
describe('Swarm Health', () => {
  describe('Peer Quality', () => {
    it('calculates peer score', () => {
      const manager = new PeerQualityManager()
      
      manager.recordMetric('peer-1', {
        downloadSpeed: 100000, // 100KB/s
        uploadSpeed: 50000,
        latency: 50,
        chunkSuccessRate: 0.95
      })
      
      const score = manager.getPeerScore('peer-1')
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('assigns trust levels', () => {
      const manager = new PeerQualityManager()
      
      // Good peer
      manager.setPeerScore('peer-1', 90)
      expect(manager.getTrustLevel('peer-1')).toBe('trusted')
      
      // New peer
      manager.setPeerScore('peer-2', 50)
      expect(manager.getTrustLevel('peer-2')).toBe('medium')
      
      // Bad peer
      manager.setPeerScore('peer-3', 10)
      expect(manager.getTrustLevel('peer-3')).toBe('untrusted')
    })

    it('bans bad peers', () => {
      const manager = new PeerQualityManager()
      
      // Record corrupt data events
      for (let i = 0; i < 3; i++) {
        manager.recordCorruptData('bad-peer')
      }
      
      expect(manager.isPeerBanned('bad-peer')).toBe(true)
    })
  })

  describe('Swarm Monitor', () => {
    it('calculates swarm health score', () => {
      const monitor = new SwarmHealthMonitor()
      
      monitor.updatePeerList([
        { id: 'peer-1', score: 90 },
        { id: 'peer-2', score: 80 },
        { id: 'peer-3', score: 70 }
      ])
      
      const health = monitor.getSwarmHealth()
      
      expect(health.score).toBeGreaterThan(0)
      expect(health.peerCount).toBe(3)
    })

    it('provides visualization data', () => {
      const monitor = new SwarmHealthMonitor()
      
      monitor.updatePeerList([
        { id: 'peer-1', score: 90 },
        { id: 'peer-2', score: 80 }
      ])
      
      const viz = monitor.getVisualizationData()
      
      expect(viz.nodes).toHaveLength(3) // Self + 2 peers
      expect(viz.edges).toHaveLength(2)
    })
  })
})
```

### E14-QA-6: Mobile Optimization

```typescript
describe('Mobile Optimization', () => {
  describe('Battery Awareness', () => {
    it('detects low battery', async () => {
      const mobile = new MobileOptimization()
      
      // Mock Battery API
      vi.stubGlobal('navigator', {
        getBattery: async () => ({
          level: 0.15,
          charging: false
        })
      })
      
      await mobile.init()
      
      expect(mobile.powerMode).toBe('low-power')
    })

    it('adjusts settings for battery', async () => {
      const mobile = new MobileOptimization()
      
      mobile.setPowerMode('ultra-low-power')
      
      const settings = mobile.getRecommendedSettings()
      
      expect(settings.maxQuality).toBe('low')
      expect(settings.seedingEnabled).toBe(false)
    })
  })

  describe('Network Awareness', () => {
    it('detects cellular vs WiFi', async () => {
      const mobile = new MobileOptimization()
      
      // Mock Network Information API
      vi.stubGlobal('navigator', {
        connection: {
          type: 'cellular',
          effectiveType: '4g'
        }
      })
      
      await mobile.init()
      
      expect(mobile.networkType).toBe('cellular')
    })

    it('enables data saver on cellular', async () => {
      const mobile = new MobileOptimization()
      
      mobile.setNetworkType('cellular')
      
      expect(mobile.isDataSaverRecommended()).toBe(true)
    })

    it('tracks data usage', () => {
      const mobile = new MobileOptimization()
      
      mobile.recordDataUsage(10 * 1024 * 1024) // 10MB
      mobile.recordDataUsage(5 * 1024 * 1024) // 5MB
      
      expect(mobile.getSessionDataUsage()).toBe(15 * 1024 * 1024)
    })
  })

  describe('Background Playback', () => {
    it('uses Media Session API', async () => {
      const mobile = new MobileOptimization()
      
      mobile.setNowPlaying({
        title: 'Test Track',
        artist: 'Test Artist',
        artwork: '/cover.jpg'
      })
      
      expect(navigator.mediaSession.metadata.title).toBe('Test Track')
    })

    it('prevents sleep during playback', async () => {
      const mobile = new MobileOptimization()
      
      await mobile.requestWakeLock()
      
      expect(mobile.hasWakeLock).toBe(true)
    })
  })
})
```

---

## Integration Tests

```typescript
describe('P2P Resilience Integration', () => {
  it('seamless P2P to HTTP transition', async () => {
    const client = new StreamingClient()
    await client.start('track-1')
    
    // Verify playing via P2P
    expect(client.currentMode).toBe('p2p')
    
    // Simulate P2P failure
    client.simulateP2PFailure()
    
    await new Promise(r => setTimeout(r, 2000))
    
    // Should have fallen back to HTTP
    expect(client.currentMode).toBe('http')
    
    // Playback should continue
    expect(client.isPlaying).toBe(true)
  })

  it('quality adaptation under network throttling', async () => {
    const client = new StreamingClient()
    await client.start('track-1')
    
    const initialQuality = client.currentQuality
    
    // Simulate slow network
    client.simulateNetworkThrottle(64000) // 64KB/s
    
    await new Promise(r => setTimeout(r, 10000))
    
    expect(client.currentQuality).not.toBe(initialQuality)
    expect(client.isBuffering).toBe(false)
  })
})
```

---

## Regression Tests

```typescript
describe('E14 Regression Tests', () => {
  it.todo('DHT WebSocket bridge implementation')
  it.todo('TURN server deployment')
  it.todo('HLS segment encoding with ffmpeg')
  it.todo('Audio gap during P2P-HTTP transition')
  it.todo('Mobile Safari background audio')
  it.todo('Swarm visualization component')
  it.todo('Geographic peer prioritization')
  it.todo('Service Worker offline caching')
})
```

---

*E14 P2P Resilience QA — DAWW3 Project*
