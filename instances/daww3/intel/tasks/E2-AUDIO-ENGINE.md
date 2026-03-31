# 🎵 E2: Web DAW Core (Audio Engine)

> **Goal:** Sound in browser with controlled latency  
> **Sprint:** 0  
> **Owner:** Audio / Frontend

---

## E2-T1: AudioContext Lifecycle

**Priority:** 🔴 P0 CRITICAL  
**Points:** 3  
**Depends on:** E1-T1

### Description
Proper initialization and management of Web Audio API context.

### Acceptance Criteria
- [ ] AudioContext initializes correctly
- [ ] Resume on user gesture (click/touch)
- [ ] Sample rate detection and display
- [ ] Graceful handling of AudioContext states
- [ ] Cleanup on unmount

### Technical Requirements

```typescript
// core/audio/context.ts
interface AudioContextManager {
  context: AudioContext | null
  state: 'suspended' | 'running' | 'closed'
  sampleRate: number
  
  init(): Promise<void>
  resume(): Promise<void>
  suspend(): Promise<void>
  close(): Promise<void>
}
```

### Subtasks
- [ ] Create `AudioContextManager` singleton
- [ ] Implement user gesture detection
- [ ] Handle browser autoplay policies
- [ ] Add state change listeners
- [ ] Create Vue composable `useAudioContext`
- [ ] Add sample rate detection
- [ ] Handle context recreation after close
- [ ] Test across browsers (Chrome, Firefox, Safari)

### Browser Compatibility
| Browser | AudioContext | AudioWorklet | Notes |
|---------|--------------|--------------|-------|
| Chrome 66+ | ✅ | ✅ | Primary target |
| Firefox 76+ | ✅ | ✅ | Full support |
| Safari 14.1+ | ✅ | ✅ | May need polyfill |
| Edge 79+ | ✅ | ✅ | Chromium-based |

### Definition of Done
```typescript
const { context, state, resume } = useAudioContext()

// On button click
await resume()
// → context.state === 'running'
// → Audio plays
```

---

## E2-T2: AudioWorklet Base Processor

**Priority:** 🔴 P0 CRITICAL  
**Points:** 5  
**Depends on:** E2-T1

### Description
Create base AudioWorkletProcessor for real-time audio processing.

### Acceptance Criteria
- [ ] AudioWorklet registers without errors
- [ ] Pass-through audio works
- [ ] Performance metrics available
- [ ] Message passing works
- [ ] Handles 128-sample blocks efficiently

### Technical Requirements

```typescript
// workers/base-processor.ts
class BaseProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bypass', defaultValue: 0, minValue: 0, maxValue: 1 }
    ]
  }
  
  constructor() {
    super()
    this.port.onmessage = this.handleMessage.bind(this)
  }
  
  process(inputs, outputs, parameters) {
    // 128 samples per block
    // Return true to keep processor alive
    return true
  }
}
```

### Subtasks
- [ ] Create `BaseProcessor` class
- [ ] Implement pass-through processing
- [ ] Add bypass parameter
- [ ] Implement message passing (port)
- [ ] Add performance timing hooks
- [ ] Create processor registration utility
- [ ] Handle processor errors gracefully
- [ ] Test with multiple instances

### Performance Targets
| Metric | Target |
|--------|--------|
| Process time per block | < 2ms |
| Memory per processor | < 1MB |
| CPU usage (idle) | < 1% |

### Definition of Done
- Audio passes through without glitches
- CPU usage stable under load
- Console shows no errors

---

## E2-T3: Track Graph Abstraction

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E2-T2

### Description
Create abstraction layer for audio routing: tracks → buses → master.

### Acceptance Criteria
- [ ] TrackNode abstraction works
- [ ] Master bus receives all audio
- [ ] Gain control per track
- [ ] Pan control per track
- [ ] Mute/Solo functionality
- [ ] Dynamic routing changes

### Technical Requirements

```typescript
// core/audio/track-node.ts
interface TrackNode {
  id: string
  name: string
  
  // Nodes
  input: GainNode
  output: GainNode
  panner: StereoPannerNode
  
  // Controls
  gain: number      // 0-2 (0-200%)
  pan: number       // -1 to 1
  mute: boolean
  solo: boolean
  
  // Methods
  connect(destination: AudioNode): void
  disconnect(): void
}

// core/audio/mixer.ts
interface Mixer {
  tracks: Map<string, TrackNode>
  masterBus: MasterBus
  
  addTrack(id: string): TrackNode
  removeTrack(id: string): void
  getTrack(id: string): TrackNode | undefined
}
```

### Audio Graph Structure
```
[Track 1] ─┐
           ├──▶ [Master Bus] ──▶ [Destination]
[Track 2] ─┤
           │
[Track N] ─┘
```

### Subtasks
- [ ] Create `TrackNode` class
- [ ] Create `MasterBus` class
- [ ] Create `Mixer` manager
- [ ] Implement gain control with smoothing
- [ ] Implement pan control (stereo panner)
- [ ] Implement mute (disconnect input)
- [ ] Implement solo logic
- [ ] Create Vue composable `useMixer`
- [ ] Add metering output hooks

### Definition of Done
```typescript
const { mixer, addTrack, masterGain } = useMixer()

const track = addTrack('synth')
track.gain = 0.8
track.pan = -0.3  // Slightly left
// → Audio routes correctly to master
```

---

## E2-T4: Buffer & Latency Control

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E2-T3

### Description
Configurable latency presets and XRun detection for different use cases.

### Acceptance Criteria
- [ ] Three latency presets work
- [ ] XRun detection alerts user
- [ ] Automatic fallback on underruns
- [ ] Latency displayed in UI
- [ ] Settings persist

### Latency Presets

| Preset | Buffer Size | Latency | Use Case |
|--------|-------------|---------|----------|
| **Low Latency** | 128 samples | ~3ms | Live playing |
| **Balanced** | 512 samples | ~12ms | General use |
| **Eco** | 2048 samples | ~46ms | Playback only |

### Technical Requirements

```typescript
// core/audio/latency.ts
interface LatencyConfig {
  preset: 'low' | 'balanced' | 'eco'
  bufferSize: number
  latencyMs: number
  sampleRate: number
}

interface LatencyManager {
  currentPreset: LatencyConfig
  xrunCount: number
  
  setPreset(preset: 'low' | 'balanced' | 'eco'): void
  getActualLatency(): number
  onXrun(callback: () => void): void
}
```

### Subtasks
- [ ] Create `LatencyManager` class
- [ ] Implement preset switching
- [ ] Calculate actual latency from AudioContext
- [ ] Implement XRun detection (buffer underrun)
- [ ] Add automatic preset fallback
- [ ] Create Vue composable `useLatency`
- [ ] Persist settings to localStorage
- [ ] Add latency display component

### XRun Detection Logic
```typescript
// In AudioWorklet
let lastProcessTime = 0

process(inputs, outputs, parameters) {
  const now = currentTime
  const expectedDelta = 128 / sampleRate
  
  if (lastProcessTime > 0) {
    const actualDelta = now - lastProcessTime
    if (actualDelta > expectedDelta * 1.5) {
      this.port.postMessage({ type: 'xrun', delta: actualDelta })
    }
  }
  
  lastProcessTime = now
  return true
}
```

### Definition of Done
- User can switch presets
- XRuns are detected and reported
- Latency is displayed accurately
- Settings persist across sessions

---

## Dependencies Graph

```
E1-T1 (Monorepo)
    │
    ▼
E2-T1 (AudioContext) ────────────────────────┐
    │                                         │
    ▼                                         ▼
E2-T2 (AudioWorklet) ◀──────────────── E3-T1 (WASM Toolchain)
    │                                         │
    ▼                                         ▼
E2-T3 (Track Graph) ◀──────────────── E3-T2 (WASM Bridge)
    │
    ▼
E2-T4 (Latency Control)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| AudioWorklet browser support | High | Feature detection, fallback |
| Latency spikes | High | XRun detection, preset fallback |
| Safari quirks | Medium | Test on real devices |
| Memory leaks | Medium | Proper cleanup, WeakRefs |

---

## Testing Strategy

### Unit Tests
- AudioContext state transitions
- Gain/pan calculations
- Latency preset values

### Integration Tests
- Full audio routing
- Worklet registration
- Message passing

### Manual Tests
- Real audio playback
- Live input monitoring
- Different buffer sizes
- Multiple browser testing
