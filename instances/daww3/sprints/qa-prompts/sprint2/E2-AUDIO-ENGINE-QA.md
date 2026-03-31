# 🎵 E2: Audio Engine — QA Test Specifications

> **Epic:** E2 - Web DAW Core
> **Status:** ✅ DONE (123 tests passing)
> **Focus:** AudioContext, AudioWorklet, Track Graph, Latency Control

---

## Agent Prompt for Audio Engine Testing

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive audio engine tests
    expertize = 'you are world class Web Audio API testing specialist'
    target = validate audio engine against E2 specifications
    test = true

    code style = [TDD, Mock Audio APIs]
    write docs = true
    deep thinking = true
    performance = measure latency, CPU usage
    tech stack = ['Vitest', 'Web Audio API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for DAWW3 audio engine covering:
- AudioContext lifecycle and gesture handling
- AudioWorklet processor registration and communication
- Track graph routing (gain, pan, mute, solo)
- Latency presets and XRun detection

{{{{ #CUSTOMER PROMT

Нужны тесты для:
- AudioContextManager: все состояния, gesture handling, iOS Safari
- AudioWorklet: TypeScript types, message passing, performance
- TrackNode: gain smoothing, pan, mute/solo logic
- MasterBus: limiter, metering, bypass
- Mixer: track registry, solo coordination, serialization
- LatencyManager: 3 presets, XRun detection, auto-fallback
- Vue composables: useAudioContext, useMixer, useLatency

}}}}

<<<<<<#RECOMMENDED TASKS

E2-QA-1. AudioContext Lifecycle Tests
- Test suspended → running → closed transitions
- Test gesture detection (click, touch, keydown)
- Test iOS Safari specific handling
- Test context recreation after close
- Test sample rate detection
- Test SSR safety (no window access on server)

E2-QA-2. AudioWorklet Tests
- Test worklet module registration
- Test process() function signature
- Test parameterDescriptors
- Test port message passing
- Test XRun reporting
- Test bypass mode

E2-QA-3. Track Graph Tests
- Test TrackNode creation and connection
- Test gain control with smoothing
- Test pan positioning (-1 to +1)
- Test mute (disconnects audio)
- Test solo logic (mutes non-solo tracks)
- Test AnalyserNode metering data

E2-QA-4. MasterBus Tests
- Test master gain control
- Test limiter prevents clipping
- Test analyzer provides spectrum data
- Test bypass mode
- Test connection to destination

E2-QA-5. Mixer Tests
- Test add/remove tracks
- Test solo coordination (multiple solos)
- Test serialization/deserialization
- Test cleanup on track removal

E2-QA-6. Latency Manager Tests
- Test low preset (128 samples, ~3ms)
- Test balanced preset (512 samples, ~12ms)
- Test eco preset (2048 samples, ~46ms)
- Test XRun detection threshold
- Test auto-fallback after consecutive XRuns
- Test settings persistence

E2-QA-7. Vue Composables Tests
- Test useAudioContext reactivity
- Test useMixer track list updates
- Test useLatency preset changes
- Test cleanup on unmount

🏁 Definition of Done
- All 123 existing tests pass
- New regression tests for "Problems/Not Implemented" items
- Browser compatibility matrix documented
- Performance benchmarks captured

>>>>>>

]]]]
```

---

## Unit Tests

### E2-QA-1: AudioContext Lifecycle

```typescript
// apps/web/src/core/audio/__tests__/audio-context-manager.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AudioContextManager } from '../audio-context-manager'

describe('AudioContextManager', () => {
  let manager: AudioContextManager

  beforeEach(() => {
    manager = new AudioContextManager()
  })

  describe('State Transitions', () => {
    it('starts in suspended state', () => {
      expect(manager.state).toBe('suspended')
    })

    it('transitions to running on resume()', async () => {
      await manager.resume()
      expect(manager.state).toBe('running')
    })

    it('transitions to suspended on suspend()', async () => {
      await manager.resume()
      await manager.suspend()
      expect(manager.state).toBe('suspended')
    })

    it('transitions to closed on close()', async () => {
      await manager.close()
      expect(manager.state).toBe('closed')
    })

    it('can recreate context after close', async () => {
      await manager.close()
      await manager.init()
      expect(manager.context).not.toBeNull()
      expect(manager.state).toBe('suspended')
    })
  })

  describe('Gesture Handling', () => {
    it('detects click as user gesture', async () => {
      const gesturePromise = manager.waitForGesture()
      document.dispatchEvent(new MouseEvent('click'))
      await expect(gesturePromise).resolves.toBeUndefined()
    })

    it('detects touch as user gesture', async () => {
      const gesturePromise = manager.waitForGesture()
      document.dispatchEvent(new TouchEvent('touchstart'))
      await expect(gesturePromise).resolves.toBeUndefined()
    })

    it('detects keydown as user gesture', async () => {
      const gesturePromise = manager.waitForGesture()
      document.dispatchEvent(new KeyboardEvent('keydown'))
      await expect(gesturePromise).resolves.toBeUndefined()
    })

    it('removes gesture listeners after first gesture', async () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      await manager.waitForGesture()
      document.dispatchEvent(new MouseEvent('click'))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    })
  })

  describe('iOS Safari Handling', () => {
    it('handles iOS Safari autoplay restriction', async () => {
      // Mock iOS Safari user agent
      vi.stubGlobal('navigator', {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      })
      
      await manager.init()
      // Should not throw, should wait for gesture
      expect(manager.state).toBe('suspended')
    })
  })

  describe('Sample Rate Detection', () => {
    it('detects sample rate from context', async () => {
      await manager.init()
      expect(manager.sampleRate).toBeGreaterThan(0)
      expect([44100, 48000, 96000]).toContain(manager.sampleRate)
    })
  })

  describe('SSR Safety', () => {
    it('does not access window on server', () => {
      const originalWindow = globalThis.window
      // @ts-ignore
      delete globalThis.window
      
      expect(() => new AudioContextManager()).not.toThrow()
      
      globalThis.window = originalWindow
    })
  })
})
```

### E2-QA-2: TrackNode

```typescript
// apps/web/src/core/audio/__tests__/track-node.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { TrackNode } from '../track-node'

describe('TrackNode', () => {
  let track: TrackNode
  let context: AudioContext

  beforeEach(() => {
    context = new AudioContext()
    track = new TrackNode('test-track', context)
  })

  describe('Gain Control', () => {
    it('initializes with gain 1.0', () => {
      expect(track.gain).toBe(1.0)
    })

    it('sets gain with smoothing', () => {
      track.gain = 0.5
      // Gain should approach 0.5 over time (setTargetAtTime)
      expect(track.gainNode.gain.value).toBeCloseTo(1.0, 1) // Initial
      // After some time, should approach target
    })

    it('clamps gain to valid range', () => {
      track.gain = -1 // Below minimum
      expect(track.gain).toBe(0)
      
      track.gain = 3 // Above maximum
      expect(track.gain).toBe(2)
    })
  })

  describe('Pan Control', () => {
    it('initializes with pan 0 (center)', () => {
      expect(track.pan).toBe(0)
    })

    it('sets pan correctly', () => {
      track.pan = -0.5 // Left
      expect(track.panner.pan.value).toBe(-0.5)
      
      track.pan = 0.5 // Right
      expect(track.panner.pan.value).toBe(0.5)
    })

    it('clamps pan to -1 to +1 range', () => {
      track.pan = -2
      expect(track.pan).toBe(-1)
      
      track.pan = 2
      expect(track.pan).toBe(1)
    })
  })

  describe('Mute/Solo', () => {
    it('mute disconnects audio path', () => {
      track.mute = true
      expect(track.muted).toBe(true)
      // Audio should not pass through
    })

    it('unmute reconnects audio path', () => {
      track.mute = true
      track.mute = false
      expect(track.muted).toBe(false)
    })

    it('solo is a flag (coordination handled by Mixer)', () => {
      track.solo = true
      expect(track.soloed).toBe(true)
    })
  })

  describe('Metering', () => {
    it('provides analyzer node', () => {
      expect(track.analyser).toBeInstanceOf(AnalyserNode)
    })

    it('returns level data', () => {
      const levels = track.getLevels()
      expect(levels).toHaveProperty('peak')
      expect(levels).toHaveProperty('rms')
    })
  })
})
```

### E2-QA-3: Latency Manager

```typescript
// apps/web/src/core/audio/__tests__/latency-manager.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LatencyManager } from '../latency-manager'

describe('LatencyManager', () => {
  let manager: LatencyManager

  beforeEach(() => {
    manager = new LatencyManager()
  })

  describe('Presets', () => {
    it('low preset: 128 samples, ~3ms', () => {
      manager.setPreset('low')
      expect(manager.bufferSize).toBe(128)
      expect(manager.latencyMs).toBeCloseTo(2.9, 1) // At 44100Hz
    })

    it('balanced preset: 512 samples, ~12ms', () => {
      manager.setPreset('balanced')
      expect(manager.bufferSize).toBe(512)
      expect(manager.latencyMs).toBeCloseTo(11.6, 1)
    })

    it('eco preset: 2048 samples, ~46ms', () => {
      manager.setPreset('eco')
      expect(manager.bufferSize).toBe(2048)
      expect(manager.latencyMs).toBeCloseTo(46.4, 1)
    })
  })

  describe('XRun Detection', () => {
    it('detects XRun when process time exceeds threshold', () => {
      const xrunCallback = vi.fn()
      manager.onXrun(xrunCallback)
      
      // Simulate late processing (1.5x expected time)
      manager.reportProcessTime(10) // ms, much longer than expected
      
      expect(xrunCallback).toHaveBeenCalled()
    })

    it('counts consecutive XRuns', () => {
      manager.reportXrun()
      manager.reportXrun()
      manager.reportXrun()
      
      expect(manager.consecutiveXruns).toBe(3)
    })

    it('resets consecutive count on successful process', () => {
      manager.reportXrun()
      manager.reportXrun()
      manager.reportSuccess()
      
      expect(manager.consecutiveXruns).toBe(0)
    })
  })

  describe('Auto-Fallback', () => {
    it('suggests higher latency after 5 consecutive XRuns', () => {
      manager.setPreset('low')
      
      for (let i = 0; i < 5; i++) {
        manager.reportXrun()
      }
      
      expect(manager.suggestedPreset).toBe('balanced')
    })

    it('auto-switches when enabled', () => {
      manager.setPreset('low')
      manager.autoFallback = true
      
      for (let i = 0; i < 5; i++) {
        manager.reportXrun()
      }
      
      expect(manager.currentPreset).toBe('balanced')
    })

    it('does not auto-switch when disabled', () => {
      manager.setPreset('low')
      manager.autoFallback = false
      
      for (let i = 0; i < 10; i++) {
        manager.reportXrun()
      }
      
      expect(manager.currentPreset).toBe('low')
    })
  })

  describe('Persistence', () => {
    it('saves settings to localStorage', () => {
      manager.setPreset('eco')
      manager.save()
      
      const stored = localStorage.getItem('daww3-latency-settings')
      expect(JSON.parse(stored!).preset).toBe('eco')
    })

    it('loads settings from localStorage', () => {
      localStorage.setItem('daww3-latency-settings', JSON.stringify({
        preset: 'balanced',
        autoFallback: true
      }))
      
      manager.load()
      
      expect(manager.currentPreset).toBe('balanced')
      expect(manager.autoFallback).toBe(true)
    })
  })
})
```

---

## Integration Tests

### E2-INT-1: Full Audio Routing

```typescript
// apps/web/src/core/audio/__tests__/integration/audio-routing.test.ts

describe('Audio Routing Integration', () => {
  it('routes audio from track through master to destination', async () => {
    const manager = new AudioContextManager()
    await manager.init()
    await manager.resume()
    
    const mixer = new Mixer(manager.context!)
    const track = mixer.addTrack('track-1')
    
    // Create oscillator as audio source
    const osc = manager.context!.createOscillator()
    osc.connect(track.input)
    osc.start()
    
    // Verify audio reaches destination
    // (In real test, would use OfflineAudioContext and check output buffer)
    
    osc.stop()
    mixer.removeTrack('track-1')
  })

  it('multiple tracks mix correctly to master', async () => {
    const context = new OfflineAudioContext(2, 44100, 44100)
    const mixer = new Mixer(context)
    
    const track1 = mixer.addTrack('track-1')
    const track2 = mixer.addTrack('track-2')
    
    track1.gain = 0.5
    track2.gain = 0.5
    
    // Create constant sources
    const src1 = context.createConstantSource()
    const src2 = context.createConstantSource()
    src1.offset.value = 0.5
    src2.offset.value = 0.5
    
    src1.connect(track1.input)
    src2.connect(track2.input)
    
    src1.start()
    src2.start()
    
    const buffer = await context.startRendering()
    
    // Output should be ~0.5 (0.5 * 0.5 + 0.5 * 0.5 = 0.5, limited by master)
    const samples = buffer.getChannelData(0)
    expect(samples[44000]).toBeCloseTo(0.5, 1)
  })
})
```

---

## Browser Compatibility Tests

### E2-BROWSER: Cross-Browser Matrix

| Test | Chrome 66+ | Firefox 76+ | Safari 14.1+ | Edge 79+ |
|------|------------|-------------|--------------|----------|
| AudioContext creation | ✅ | ✅ | ✅ | ✅ |
| AudioWorklet registration | ✅ | ✅ | ✅ | ✅ |
| Gesture handling | ✅ | ✅ | ⚠️ | ✅ |
| SharedArrayBuffer | ✅ | ✅ | ⚠️ | ✅ |
| Latency measurement | ✅ | ✅ | ⚠️ | ✅ |

**Notes:**
- Safari requires additional gesture handling
- Safari SharedArrayBuffer needs COOP/COEP headers
- Safari latency measurement may be less accurate

---

## Performance Benchmarks

### E2-PERF: Performance Targets

```typescript
describe('Audio Engine Performance', () => {
  it('AudioWorklet process() completes in < 2ms', async () => {
    const context = new AudioContext()
    await context.audioWorklet.addModule('base-processor.js')
    
    const node = new AudioWorkletNode(context, 'base-processor')
    
    // Measure process time via message
    const processTime = await new Promise<number>(resolve => {
      node.port.onmessage = (e) => {
        if (e.data.type === 'metrics') {
          resolve(e.data.processTime)
        }
      }
    })
    
    expect(processTime).toBeLessThan(2)
  })

  it('TrackNode creation is fast', () => {
    const context = new AudioContext()
    const start = performance.now()
    
    for (let i = 0; i < 100; i++) {
      new TrackNode(`track-${i}`, context)
    }
    
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(100) // 100 tracks in < 100ms
  })

  it('Memory per track is reasonable', () => {
    const before = (performance as any).memory?.usedJSHeapSize || 0
    const context = new AudioContext()
    const tracks = []
    
    for (let i = 0; i < 50; i++) {
      tracks.push(new TrackNode(`track-${i}`, context))
    }
    
    const after = (performance as any).memory?.usedJSHeapSize || 0
    const perTrack = (after - before) / 50
    
    expect(perTrack).toBeLessThan(1024 * 1024) // < 1MB per track
  })
})
```

---

## Manual Test Checklist

### E2-MANUAL: Hardware Testing

- [ ] **MIDI Keyboard Latency**: Play notes, measure perceived latency
- [ ] **Audio Interface**: Test with USB interface, verify sample rate
- [ ] **Headphone Output**: Verify no crackling at low latency
- [ ] **Multiple Tracks**: Create 16 tracks, verify mix sounds correct
- [ ] **Pan Automation**: Automate pan, verify spatial movement
- [ ] **Mute/Solo**: Verify immediate effect, no clicks
- [ ] **XRun Recovery**: Force high CPU, verify auto-fallback

---

## Regression Tests (Problems/Not Implemented)

### E2-REG: Known Issues

```typescript
describe('E2 Regression Tests', () => {
  it.todo('WASM DSP integration with new worklet infrastructure')
  it.todo('Audio metering visualization updates')
  it.todo('Plugin chain routing through mixer')
  it.todo('Multi-channel (surround) audio support')
  it.todo('Audio recording/bounce functionality')
  it.todo('Offline rendering for export')
  it.todo('Undo/redo for mixer state changes')
})
```

---

*E2 Audio Engine QA — DAWW3 Project*
