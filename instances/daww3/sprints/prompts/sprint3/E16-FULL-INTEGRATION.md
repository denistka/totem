# E16: Full Integration & Polish — Agent Prompts

> **Goal:** Connect all components into cohesive DAW experience
> **Sprint:** 3
> **Owner:** Audio / Frontend
> **Source:** Sprint 0-2 "Problems/Not Implemented"

---

## E16-T1: Audio Metering Visualization

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio visualization engineer'
    target = implement visual audio meters for tracks and master
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = 60fps rendering, low CPU usage
    tech stack = ['Vue 3', 'Canvas API', 'WebGL', 'Web Audio API']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement audio metering visualization components for DAWW3.
Display peak, RMS, frequency for each track and master bus.

{{{{ #CUSTOMER PROMT

Audio metering visualization не реализован. Нужно:
- Peak meter с hold
- RMS meter (volume)
- Frequency spectrum (optional)
- Per-track meters
- Master bus meter
- 60fps rendering без тормозов

}}}}

<<<<<<#RECOMMENDED TASKS

METER-1. Meter Data Interface
- Connect to existing AnalyserNode
- Get time domain data (waveform)
- Get frequency data (FFT)
- Calculate peak, RMS, crest factor
- Peak hold with decay

METER-2. Canvas Peak Meter Component
- Vertical bar meter
- Stereo L/R display
- Peak hold indicator
- Color gradient (green/yellow/red)
- Clip indicator with latch

METER-3. RMS/VU Meter Component
- VU-style meter
- RMS smoothing (300ms)
- Needle or bar display
- Reference level indicator
- Integration time control

METER-4. Frequency Spectrum Component
- FFT visualization
- Bar or line display
- Logarithmic frequency scale
- Smoothing/decay
- Peak hold per band (optional)

METER-5. Track Meter Integration
- Meter in TrackNode UI
- Compact horizontal mode
- Expand for detail
- Mute affects display
- Solo indication

METER-6. Master Meter Panel
- Larger display for master bus
- Peak + RMS + spectrum
- Loudness (LUFS) display
- True peak detection
- Clipping history

🏁 Definition of Done
- Meters display accurate levels
- 60fps rendering achieved
- CPU usage < 5% for all meters
- Peak hold works correctly
- Clip detection accurate

>>>>>>

]]]]
```

---

## E16-T2: Plugin Chain Routing through Mixer

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DAW audio routing engineer'
    target = integrate plugin chains with mixer track nodes
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = glitch-free audio routing
    tech stack = ['Web Audio API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Integrate plugin chain management with mixer track nodes.
Each track should have insert effects with proper routing.

{{{{ #CUSTOMER PROMT

Plugin chain routing через mixer не интегрирован. Нужно:
- PluginChain подключается к TrackNode
- Insert effects в signal path
- Pre/post fader insertion point
- Send effects support
- Bypass doesn't break routing

}}}}

<<<<<<#RECOMMENDED TASKS

ROUTE-1. TrackNode Plugin Integration
- Add pluginChain property to TrackNode
- Insert chain between input and output
- Handle null/empty chain
- Chain bypass affects routing
- Hot-swap chain without glitch

ROUTE-2. Pre/Post Fader Routing
- Pre-fader insertion point
- Post-fader insertion point
- Configurable per plugin
- Visual indication in UI
- Smooth transition on change

ROUTE-3. Send Effects Architecture
- Aux send nodes
- Send level control
- Pre/post fader sends
- Return track support
- Feedback protection

ROUTE-4. Mixer UI Update
- Show chain indicator on track
- Click to expand chain editor
- Insert slot visualization
- Drag from plugin browser
- Quick bypass toggle

ROUTE-5. Audio Graph Management
- Efficient reconnection
- Minimize audio glitches
- Handle plugin load failure
- Graceful degradation
- Memory cleanup

ROUTE-6. Serialization
- Save chain with project
- Load chain on project open
- Chain state persistence
- Plugin instance recreation
- Version migration

🏁 Definition of Done
- Plugins process audio in track
- Pre/post fader works correctly
- No audio glitches on routing change
- Send effects functional
- Projects save/load with chains

>>>>>>

]]]]
```

---

## E16-T3: WASM DSP Integration with Worklet

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class WebAssembly audio engineer'
    target = connect WASM DSP processors to AudioWorklet infrastructure
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = < 2ms per 128 sample block
    tech stack = ['Rust', 'WASM', 'AudioWorklet', 'SharedArrayBuffer']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Integrate WASM DSP processors with new AudioWorklet infrastructure.
Enable zero-copy audio processing where supported.

{{{{ #CUSTOMER PROMT

WASM DSP integration с новым worklet infrastructure не протестирован. Нужно:
- WASM загружается в AudioWorklet
- SharedArrayBuffer для zero-copy (где поддерживается)
- Fallback для браузеров без SAB
- Parameter sync между WASM и JS
- Performance benchmarking

}}}}

<<<<<<#RECOMMENDED TASKS

WASM-INT-1. WASM Module Loading in Worklet
- Fetch and compile WASM
- Instantiate in AudioWorkletProcessor
- Handle async loading
- Error recovery
- Memory management

WASM-INT-2. SharedArrayBuffer Integration
- Feature detection (crossOriginIsolated)
- Create shared audio buffers
- Lock-free ring buffer
- Fallback to copy mode
- Performance comparison

WASM-INT-3. Parameter Synchronization
- JS parameter → WASM
- Atomic operations for SAB
- Message passing fallback
- Rate limiting updates
- Interpolation in WASM

WASM-INT-4. Multi-processor Support
- Multiple WASM instances
- Processor pool
- Memory sharing strategy
- Instance lifecycle
- Hot reload support

WASM-INT-5. Performance Monitoring
- Process time measurement
- Buffer underrun detection
- Memory usage tracking
- CPU utilization
- Latency contribution

WASM-INT-6. Integration Tests
- Test with GainProcessor WASM
- Test parameter automation
- Test with plugin chain
- Cross-browser testing
- Performance benchmarks

🏁 Definition of Done
- WASM processes audio in worklet
- < 2ms per 128 sample block
- SharedArrayBuffer works where available
- Fallback works on all browsers
- No memory leaks

>>>>>>

]]]]
```

---

## E16-T4: Transport Sync with Automation

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DAW transport engineer'
    target = synchronize transport playhead with automation system
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = sample-accurate playback
    tech stack = ['Web Audio API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Synchronize transport playhead with automation system.
Automation values update in real-time during playback.

{{{{ #CUSTOMER PROMT

Automation editor не интегрирован с transport. Нужно:
- Playhead position sync
- Automation values apply во время playback
- Seek обновляет automation значения
- Loop points работают с automation
- Visual playhead в automation editor

}}}}

<<<<<<#RECOMMENDED TASKS

TRANS-1. Transport Service
- Play/pause/stop controls
- Current position tracking
- Sample-accurate timing
- Tempo/BPM support
- Time signature handling

TRANS-2. Automation Playback
- Read automation at current position
- Apply values to parameters
- Lookahead scheduling
- Handle tempo changes
- Loop region support

TRANS-3. Seek Handling
- Jump to position
- Update all automation values
- AudioParam scheduling
- Cancel pending automation
- Smooth transition

TRANS-4. Visual Sync
- Playhead in automation editor
- Real-time position updates
- Zoom-independent accuracy
- Follow playhead option
- Visible range management

TRANS-5. MIDI Clock Integration
- Sync with MIDIClockManager
- Transport follows external clock
- Position from SPP
- Master/slave coordination

TRANS-6. Recording Integration
- Arm for automation recording
- Write mode during playback
- Capture parameter changes
- Punch in/out points
- Latch/touch modes

🏁 Definition of Done
- Playhead moves during playback
- Automation values apply correctly
- Seek updates parameters instantly
- Loop works with automation
- Visual sync is frame-accurate

>>>>>>

]]]]
```

---

## E16-T5: Undo/Redo System

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class application state management engineer'
    target = implement comprehensive undo/redo system
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = instant undo/redo, efficient memory
    tech stack = ['Vue 3', 'Pinia', 'TypeScript', 'immer']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement comprehensive undo/redo system for DAWW3.
Cover mixer, automation, plugin, and project changes.

{{{{ #CUSTOMER PROMT

Undo/redo не реализован. Нужно:
- Undo/redo для mixer state changes
- Undo/redo для automation edits
- Undo/redo для plugin parameter changes
- History panel UI
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

}}}}

<<<<<<#RECOMMENDED TASKS

UNDO-1. Command Pattern Implementation
- Command interface (execute, undo, redo)
- Command factory
- Compound commands (group multiple)
- Command serialization
- Command description

UNDO-2. History Manager
- History stack (undo/redo)
- Max history limit
- Memory management
- Branch handling
- Save points

UNDO-3. Mixer Commands
- Track add/remove
- Gain change
- Pan change
- Mute/solo toggle
- Track reorder

UNDO-4. Automation Commands
- Point add/remove
- Point move
- Curve type change
- Value change
- Range operations

UNDO-5. Plugin Commands
- Plugin add/remove
- Parameter change (coalesced)
- Preset change
- Bypass toggle
- Chain reorder

UNDO-6. UI Integration
- History panel component
- Step list with descriptions
- Click to jump to state
- Keyboard shortcuts
- Menu integration

🏁 Definition of Done
- Ctrl+Z undoes last action
- Ctrl+Y redoes
- History shows all actions
- Memory usage bounded
- No state corruption

>>>>>>

]]]]
```

---

## E16-T6: TypeScript Error Cleanup

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class TypeScript engineer'
    target = fix all pre-existing TypeScript errors across codebase
    test = true

    code style = [DRY, Best practice, strict types]
    write docs = false
    deep thinking = true
    performance = n/a
    tech stack = ['TypeScript', 'Vue 3', 'NestJS']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Fix all pre-existing TypeScript errors in DAWW3 codebase.
Ensure strict mode passes across all packages.

{{{{ #CUSTOMER PROMT

Pre-existing TypeScript errors в других модулях (plugin-spec, p2p, midi). Нужно:
- Запустить typecheck по всему проекту
- Исправить все ошибки
- Включить strict mode где возможно
- Улучшить типы где weak
- Убрать any где возможно

}}}}

<<<<<<#RECOMMENDED TASKS

TS-1. Error Audit
- Run pnpm typecheck across workspace
- Catalog all errors by package
- Prioritize by severity
- Identify patterns
- Create fix plan

TS-2. Plugin-spec Package
- Fix Zod schema types
- Manifest type improvements
- Export all types properly
- Remove implicit any
- Add missing generics

TS-3. P2P Package
- Fix WebRTC types
- Socket.io event types
- Chunk buffer types
- Encryption types
- Event emitter types

TS-4. MIDI Package
- Fix WebMIDI API types
- Message type narrowing
- Device type improvements
- Event handler types
- SysEx buffer types

TS-5. Strict Mode Enablement
- Enable strict per package
- Fix new errors from strict
- noImplicitAny: true
- strictNullChecks: true
- strictFunctionTypes: true

TS-6. CI Integration
- Add typecheck to CI
- Fail on new errors
- Type coverage reporting
- Document conventions
- Pre-commit hook

🏁 Definition of Done
- Zero TypeScript errors
- Strict mode enabled
- CI blocks on type errors
- No implicit any remaining
- Type coverage > 95%

>>>>>>

]]]]
```

---

## Dependencies Graph

```
Sprint 2 Complete ✅
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
E16-T1 (Metering)   E16-T2 (Chain Routing) E16-T6 (TS Cleanup)
    │                     │
    └─────────┬───────────┘
              ▼
        E16-T3 (WASM Integration)
              │
              ▼
        E16-T4 (Transport Sync)
              │
              ▼
        E16-T5 (Undo/Redo)
              │
              ▼
        [Full DAW Integration Complete]
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| WASM performance in worklet | High | Benchmarking, fallback modes |
| Audio glitches during routing | High | Crossfade, async updates |
| Undo memory consumption | Medium | History limits, compression |
| Transport jitter | Medium | Web Audio scheduling |
