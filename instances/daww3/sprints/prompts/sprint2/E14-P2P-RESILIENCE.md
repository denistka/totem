# E14: P2P Network Resilience — Agent Prompts

> **Goal:** NAT traversal, HTTP fallback, adaptive bitrate, peer discovery, mobile support
> **Sprint:** 2
> **Owner:** Backend / Audio
> **Source:** E6 P2P Streaming unresolved items (prioritized)

---

## E14-T1: NAT Traversal & TURN Server

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class WebRTC networking engineer'
    target = implement robust NAT traversal with TURN fallback
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = connection success rate > 95%
    tech stack = ['WebRTC', 'TURN', 'STUN', 'coturn']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement NAT traversal for DAWW3 P2P connections.
Use STUN for detection, TURN for relay when direct fails.

{{{{ #CUSTOMER PROMT

NAT traversal для WebRTC не настроен. Нужно:
- STUN server configuration
- TURN server deployment (coturn)
- ICE candidate handling
- Connection success metrics
- Fallback logic

}}}}

<<<<<<#RECOMMENDED TASKS

NAT-1. STUN Configuration
- Public STUN servers list
- Self-hosted STUN option
- ICE gathering config
- Candidate filtering
- IPv6 support

NAT-2. TURN Server Deployment
- coturn Docker setup
- Authentication (time-limited credentials)
- Relay ports configuration
- Bandwidth limits
- Geographic distribution

NAT-3. ICE Candidate Management
- Gather all candidates
- Trickle ICE support
- Candidate prioritization
- Prflx candidate handling
- Connection state tracking

NAT-4. Credential Management
- TURN credential generation
- Time-limited tokens
- Credential refresh
- Per-user quotas
- API endpoint for credentials

NAT-5. Connection Metrics
- Track connection type (direct/relay)
- Success/failure rates
- NAT type detection
- Latency per connection type
- Bandwidth consumption

NAT-6. Testing Infrastructure
- NAT simulation
- Symmetric NAT testing
- TURN-only mode for testing
- Connection diagnostics tool
- Network condition emulation

🏁 Definition of Done
- Connections work behind NAT
- TURN relays when needed
- Credentials rotate securely
- > 95% connection success
- Metrics track all connections

>>>>>>

]]]]
```

---

## E14-T2: HTTP Streaming Fallback

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class adaptive streaming engineer'
    target = implement HTTP fallback when P2P fails
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = seamless transition to HTTP
    tech stack = ['HLS', 'NestJS', 'ffmpeg', 'nginx']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement HTTP streaming fallback for DAWW3.
Gracefully degrade from P2P to server-based streaming.

{{{{ #CUSTOMER PROMT

Automatic fallback к HTTP streaming отсутствует. Нужно:
- Detect P2P failure
- Seamless switch to HTTP
- HLS streaming endpoint
- Chunk-based byte-range
- CDN compatibility

}}}}

<<<<<<#RECOMMENDED TASKS

HTTP-1. P2P Failure Detection
- Connection timeout
- Insufficient peers
- Buffer underrun threshold
- Quality degradation
- Automatic trigger

HTTP-2. HLS Endpoint
- Generate HLS playlist
- Segment encoding
- Multiple quality levels
- Encryption (AES-128)
- CDN-friendly URLs

HTTP-3. Byte-Range Streaming
- Range request support
- Chunk-based serving
- Seek support
- Resume interrupted downloads
- Cache headers

HTTP-4. Seamless Transition
- Buffer management
- Playback position sync
- No audible gap
- Quality matching
- State preservation

HTTP-5. CDN Integration
- Origin configuration
- Cache rules
- Edge locations
- Purge API
- Analytics

HTTP-6. Fallback UI
- Connection status indicator
- P2P vs HTTP indicator
- Quality selector
- Manual fallback option
- Network troubleshooting

🏁 Definition of Done
- P2P failure triggers fallback
- HTTP streaming works
- Transition is seamless
- CDN accelerates delivery
- User informed of mode

>>>>>>

]]]]
```

---

## E14-T3: Adaptive Bitrate Streaming

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class adaptive bitrate streaming engineer'
    target = implement quality adaptation based on network conditions
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = smooth quality transitions
    tech stack = ['WebRTC', 'HLS', 'DASH', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement adaptive bitrate streaming for DAWW3.
Adjust quality based on network bandwidth and device capability.

{{{{ #CUSTOMER PROMT

Adaptive bitrate streaming не реализован. Нужно:
- Multiple quality levels (64k, 128k, 256k, 320k, FLAC)
- Bandwidth estimation
- Smooth quality switching
- Buffer-based adaptation
- Manual quality override

}}}}

<<<<<<#RECOMMENDED TASKS

ABR-1. Quality Levels
- Define quality tiers
- Encoding profiles
- Metadata per quality
- Storage requirements
- Transcoding pipeline

ABR-2. Bandwidth Estimation
- Download speed measurement
- Moving average
- P2P-specific estimation
- Peer bandwidth aggregation
- Prediction algorithms

ABR-3. Adaptation Algorithm
- Buffer-based ABR
- Throughput-based ABR
- Hybrid approach
- Quality stability bias
- Quick start (low quality first)

ABR-4. Quality Switching
- Seamless chunk switch
- Crossfade between qualities
- Seek to new quality
- Cache old quality briefly
- No playback interruption

ABR-5. Manual Override
- Quality selector UI
- Lock to quality
- Data saver mode
- High quality mode
- Remember preference

ABR-6. Quality Metrics
- Time per quality level
- Switch frequency
- Buffer health
- Rebuffer events
- User quality preference

🏁 Definition of Done
- Multiple qualities available
- Auto-adaptation works
- Switches are smooth
- Manual override works
- Metrics track quality

>>>>>>

]]]]
```

---

## E14-T4: DHT Peer Discovery

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class distributed systems engineer'
    target = implement DHT for decentralized peer discovery
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = find peers in < 5 seconds
    tech stack = ['WebTorrent', 'Bittorrent DHT', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement DHT-based peer discovery for DAWW3.
Reduce reliance on centralized signaling servers.

{{{{ #CUSTOMER PROMT

Peer discovery через DHT не реализован. Нужно:
- WebTorrent DHT integration
- Info hash generation
- Peer announcement
- Peer lookup
- Bootstrap nodes

}}}}

<<<<<<#RECOMMENDED TASKS

DHT-1. DHT Client Setup
- WebTorrent DHT module
- Browser-compatible implementation
- Bootstrap node configuration
- Connection to public DHT
- Self-hosted bootstrap option

DHT-2. Info Hash Generation
- Track ID → info hash
- Deterministic hashing
- Version handling
- Magnet URI support
- Metadata extension

DHT-3. Peer Announcement
- Announce on track play
- Re-announce periodically
- Port announcement
- Token handling
- Expiry management

DHT-4. Peer Lookup
- Query DHT for peers
- Parallel queries
- Response aggregation
- Timeout handling
- Cache results

DHT-5. Hybrid Discovery
- DHT + signaling server
- Fallback ordering
- Fastest peer selection
- Load balancing
- Failover logic

DHT-6. DHT Health Monitoring
- Connected nodes count
- Query success rate
- Announce success rate
- Network health score
- Debug logging

🏁 Definition of Done
- DHT finds peers for tracks
- Works without signaling server
- Bootstrap nodes reachable
- < 5 second peer discovery
- Metrics track DHT health

>>>>>>

]]]]
```

---

## E14-T5: Swarm Health & Peer Quality

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class P2P network engineer'
    target = implement swarm health monitoring and peer quality scoring
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = optimal peer selection
    tech stack = ['WebRTC', 'TypeScript', 'Statistics']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement swarm health monitoring and peer quality scoring.
Select best peers, detect bad actors, optimize network.

{{{{ #CUSTOMER PROMT

Swarm health monitoring и peer quality scoring отсутствуют. Нужно:
- Peer reputation scoring
- Bandwidth contribution tracking
- Bad peer detection
- Optimal peer selection
- Swarm visualization

}}}}

<<<<<<#RECOMMENDED TASKS

SWARM-1. Peer Quality Metrics
- Download speed per peer
- Upload speed per peer
- Latency measurements
- Chunk success rate
- Connection stability

SWARM-2. Reputation System
- Score calculation algorithm
- Historical weighting
- Trust levels
- Reputation decay
- Bootstrap reputation

SWARM-3. Bad Peer Detection
- Slow peers
- Corrupt data detection
- Sybil attack patterns
- Resource abuse
- Automatic banning

SWARM-4. Optimal Peer Selection
- Select by reputation
- Geographic diversity
- Bandwidth matching
- Connection count balancing
- Unchoke algorithm

SWARM-5. Swarm Visualization
- Connected peers map
- Bandwidth flow diagram
- Health indicators
- Real-time updates
- Debug mode

SWARM-6. Swarm Analytics
- Aggregate statistics
- Trending tracks swarm size
- Global swarm health
- Contribution distribution
- Network growth metrics

🏁 Definition of Done
- Peer quality scored
- Bad peers detected
- Best peers preferred
- Visualization shows network
- Analytics available

>>>>>>

]]]]
```

---

## E14-T6: Mobile Browser Support

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class mobile web engineer'
    target = optimize P2P streaming for mobile browsers
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = battery efficient, data conscious
    tech stack = ['WebRTC', 'Web Audio API', 'Service Workers']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Optimize P2P streaming for mobile browsers.
Handle battery, bandwidth, and mobile-specific limitations.

{{{{ #CUSTOMER PROMT

P2P streaming для mobile browsers не оптимизирован. Нужно:
- Battery-efficient mode
- Data usage controls
- Background playback
- Connection handling on mobile
- iOS/Android specific fixes

}}}}

<<<<<<#RECOMMENDED TASKS

MOBILE-1. Battery Optimization
- Reduce P2P upload when on battery
- Disable seeding on low battery
- Efficient connection management
- Wake lock for playback
- Battery status API integration

MOBILE-2. Data Usage Controls
- Data saver mode
- Quality caps on cellular
- WiFi-only streaming option
- Data usage display
- Monthly limit warnings

MOBILE-3. Background Playback
- Service Worker for background
- Media Session API
- Notification controls
- Lock screen integration
- Audio focus handling

MOBILE-4. Mobile Network Handling
- Detect network changes
- Pause on disconnect
- Resume on reconnect
- Handle IP changes
- Graceful degradation

MOBILE-5. iOS Specific
- Safari WebRTC limitations
- Autoplay policy handling
- PWA support
- Home screen shortcut
- Audio interruption handling

MOBILE-6. Android Specific
- Chrome optimizations
- Data saver detection
- Split screen support
- Picture-in-picture
- Notification channels

🏁 Definition of Done
- Works on mobile browsers
- Battery drain minimal
- Data usage controlled
- Background playback works
- Platform issues addressed

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E6 (P2P Streaming) ✅
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
E14-T1 (NAT/TURN)   E14-T2 (HTTP Fallback) E14-T4 (DHT)
    │                     │                     │
    └─────────┬───────────┘                     │
              ▼                                 │
        E14-T3 (Adaptive Bitrate)               │
              │                                 │
              └─────────────────────────────────┤
                                                ▼
                                    E14-T5 (Swarm Health)
                                                │
                                                ▼
                                    E14-T6 (Mobile Support)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| TURN server cost | High | Bandwidth quotas, fallback limits |
| DHT reliability | Medium | Hybrid with signaling |
| Mobile battery drain | Medium | Aggressive power management |
| Adaptive bitrate latency | Low | Buffer management |
