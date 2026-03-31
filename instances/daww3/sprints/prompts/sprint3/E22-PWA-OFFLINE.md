# E22: PWA & Offline Mode — Agent Prompts

> **Goal:** Progressive Web App with offline capabilities
> **Sprint:** 3
> **Owner:** Frontend
> **Source:** E6, E14 "Problems/Not Implemented"

---

## E22-T1: Service Worker Setup

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class PWA engineer'
    target = implement Service Worker for caching and offline
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast loads, smart caching
    tech stack = ['Vite PWA', 'Workbox', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement Service Worker for DAWW3 PWA.
Cache assets and enable offline functionality.

{{{{ #CUSTOMER PROMT

Service Worker caching не реализован. Нужно:
- Workbox integration
- App shell caching
- API caching strategy
- Audio chunk caching
- Update notification

}}}}

<<<<<<#RECOMMENDED TASKS

SW-1. Vite PWA Setup
- Install vite-plugin-pwa
- Configure workbox options
- Manifest generation
- Auto-update strategy
- Dev mode support

SW-2. Caching Strategies
- Cache-first for app shell
- Network-first for API
- Stale-while-revalidate for images
- Cache-only for audio chunks
- Custom strategies

SW-3. App Shell
- Cache HTML, CSS, JS
- Precache critical assets
- Runtime caching
- Version management
- Cleanup old caches

SW-4. API Caching
- Cache API responses
- Expiration policies
- Cache key strategies
- Background sync
- Offline fallback

SW-5. Update Flow
- Detect new version
- Prompt user to update
- Skip waiting option
- Seamless reload
- Release notes display

SW-6. Cache Management
- Storage quota checking
- Intelligent eviction
- User-controlled clear
- Debug tools
- Size monitoring

🏁 Definition of Done
- Service Worker registers
- Assets cached on first visit
- App loads offline
- Updates prompt user
- Cache size manageable

>>>>>>

]]]]
```

---

## E22-T2: Offline Chunk Caching

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class offline-first audio engineer'
    target = cache audio chunks for offline playback
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = smart prefetching, storage efficient
    tech stack = ['IndexedDB', 'Service Worker', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement audio chunk caching for offline playback.
Cache P2P chunks for offline mode.

{{{{ #CUSTOMER PROMT

Offline mode with cached chunks не реализован. Нужно:
- Cache audio chunks in IndexedDB
- Offline playback of cached tracks
- Storage management
- Selective download
- Background download

}}}}

<<<<<<#RECOMMENDED TASKS

OFFLINE-CHUNK-1. Chunk Storage
- IndexedDB for audio chunks
- Efficient blob storage
- Chunk metadata
- Encryption at rest (optional)
- Migration support

OFFLINE-CHUNK-2. Download Manager
- Queue download requests
- Priority management
- Bandwidth throttling
- Progress tracking
- Resume interrupted

OFFLINE-CHUNK-3. Offline Playback
- Detect offline mode
- Load from cache
- Seamless with P2P
- Error handling
- Quality selection

OFFLINE-CHUNK-4. Storage Management
- Track storage usage
- Per-track storage
- Storage limits
- User configurable
- Auto-eviction (LRU)

OFFLINE-CHUNK-5. Download UI
- Download button per track
- Progress indicator
- Downloaded indicator
- Storage usage display
- Remove download option

OFFLINE-CHUNK-6. Background Download
- Background fetch API
- Download while app closed
- Notification on complete
- Battery-aware
- WiFi-only option

🏁 Definition of Done
- Tracks downloadable for offline
- Plays without network
- Storage managed efficiently
- UI shows download status
- Background download works

>>>>>>

]]]]
```

---

## E22-T3: PWA Manifest & Install

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class PWA UX engineer'
    target = implement PWA manifest and install experience
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = installable, native-like
    tech stack = ['Web App Manifest', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement PWA manifest and install experience for DAWW3.
Native-like app installation.

{{{{ #CUSTOMER PROMT

PWA manifest и install experience. Нужно:
- Web App Manifest
- Install prompt
- App icons (all sizes)
- Splash screens
- Standalone mode

}}}}

<<<<<<#RECOMMENDED TASKS

PWA-1. Web App Manifest
- name, short_name
- theme_color, background_color
- display: standalone
- orientation
- start_url, scope

PWA-2. App Icons
- 192x192 standard
- 512x512 for splash
- Maskable icons
- Apple touch icons
- Favicon set

PWA-3. Install Prompt
- Detect beforeinstallprompt
- Custom install banner
- Install button placement
- Dismiss handling
- Re-prompt strategy

PWA-4. Standalone Mode
- Detect standalone mode
- Adjust UI accordingly
- Back button handling
- Navigation bar
- Status bar color

PWA-5. iOS Support
- Apple-specific meta tags
- Splash screen images
- Status bar style
- Safari limitations handling
- Home screen naming

PWA-6. Install Analytics
- Track install events
- Track usage mode
- Conversion tracking
- A/B test prompts
- User segments

🏁 Definition of Done
- Manifest validates
- Install prompt appears
- Icons display correctly
- Standalone mode works
- iOS supported

>>>>>>

]]]]
```

---

## E22-T4: Mobile Safari Optimization

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class iOS web engineer'
    target = optimize for iOS Safari limitations
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = best possible iOS experience
    tech stack = ['Safari', 'Web Audio API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Optimize DAWW3 for iOS Safari limitations.
Handle audio, background, and PWA constraints.

{{{{ #CUSTOMER PROMT

Mobile Safari имеет ограничения. Нужно:
- Audio autoplay policy
- Background audio handling
- Memory constraints
- WebRTC limitations
- Keyboard handling

}}}}

<<<<<<#RECOMMENDED TASKS

SAFARI-1. Audio Handling
- User gesture requirement
- AudioContext resume strategy
- Audio session management
- Interruption handling
- Playback rate limits

SAFARI-2. Background Audio
- Media Session API
- Now Playing info
- Control center integration
- Background restrictions
- Wake lock alternatives

SAFARI-3. Memory Management
- Monitor memory usage
- Aggressive cleanup
- Reduce concurrent audio
- Lower quality fallback
- Restart recovery

SAFARI-4. WebRTC Optimizations
- Safari WebRTC quirks
- TURN relay preference
- Connection timeout handling
- Reconnection strategies
- Bandwidth adaptation

SAFARI-5. Input Handling
- Keyboard appearance
- Viewport meta
- Touch events
- Safe area insets
- Focus management

SAFARI-6. Testing & Debugging
- Safari DevTools usage
- Simulator testing
- Real device testing
- Performance profiling
- Bug workarounds

🏁 Definition of Done
- Audio plays reliably
- Background playback works (with limits)
- Memory stable
- WebRTC connects
- Input works correctly

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E14 (P2P Resilience) ✅
    │
    ▼
E22-T1 (Service Worker)
    │
    ├─────────────────────┐
    ▼                     ▼
E22-T2 (Offline Chunks)  E22-T3 (PWA Manifest)
    │                     │
    └─────────┬───────────┘
              ▼
        E22-T4 (Safari Optimization)
              │
              ▼
        [PWA Complete]
```

---

## TOTEM Alignment

| TOTEM Reference | Implementation |
|-----------------|----------------|
| 1-VISION.md | Offline access to music |
| 2-ARCHITECTURE.md | P2P chunks cached locally |
| Mobile-first | PWA install, offline mode |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Storage limits | Medium | Smart eviction, user control |
| Safari bugs | High | Workarounds, graceful degradation |
| Update confusion | Low | Clear update UX |
| Cache corruption | Medium | Validation, recovery |

---

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Background Sync | ✅ | ❌ | ❌ | ✅ |
| Background Fetch | ✅ | ❌ | ❌ | ✅ |
| Install Prompt | ✅ | ❌ | ❌ | ✅ |
| Media Session | ✅ | ✅ | ✅ | ✅ |
