# E2: Audio Engine Completion — Agent Prompts

> **Goal:** Complete Web DAW Core — AudioContext, AudioWorklet, Track Graph, Latency Control
> **Sprint:** 2
> **Owner:** Audio / Frontend
> **Blocker Status:** This epic was blocked in Sprint 1

---

## E2-T1: AudioContext Lifecycle & Gesture Handling

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Web Audio API specialist'
    target = proper AudioContext initialization with user gesture handling
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    cellular dependence = false
    tree-like dependency linking = true
    performance = low latency audio initialization
    tech stack = ['Web Audio API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Complete AudioContext lifecycle management for DAWW3 DAW.
Fix gesture handling so audio starts reliably on user interaction.

{{{{ #CUSTOMER PROMT

AudioContextManager существует, но нужно:
- Правильная обработка user gesture для resume()
- Обработка всех состояний AudioContext (suspended, running, closed)
- Восстановление после close
- Vue composable useAudioContext
- Тесты для всех переходов состояний

}}}}

<<<<<<#RECOMMENDED TASKS

AC-1. Fix Gesture Detection
- Detect first user interaction (click, touch, keydown)
- Call context.resume() on gesture
- Handle iOS Safari quirks
- One-time listener removal after activation

AC-2. State Management
- Track all AudioContext states
- Emit events on state change
- Handle unexpected state transitions
- Graceful error recovery

AC-3. Context Recreation
- Handle context.close() properly
- Recreate context when needed
- Preserve node connections on recreation
- Sample rate consistency

AC-4. Vue Composable
- useAudioContext composable
- Reactive state binding
- Auto-cleanup on unmount
- SSR-safe (no window access on server)

AC-5. Browser Compatibility
- Chrome autoplay policy handling
- Safari AudioContext quirks
- Firefox state handling
- Feature detection utilities

🏁 Definition of Done
- AudioContext starts on first click/touch
- State transitions work correctly
- Context recovers from errors
- useAudioContext works in Vue components
- Tests pass for all browsers

>>>>>>

]]]]
```

---

## E2-T2: AudioWorklet Processor with Proper Types

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class AudioWorklet specialist'
    target = fix AudioWorklet type errors and module registration
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = real-time audio processing < 2ms per block
    tech stack = ['AudioWorklet', 'TypeScript', 'Vite']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Fix AudioWorklet implementation in DAWW3.
Resolve type errors and implement proper worklet module registration.

{{{{ #CUSTOMER PROMT

BaseProcessor имеет ошибки типов AudioWorklet.
Нужно:
- Правильные TypeScript declarations для AudioWorklet global scope
- Фикс регистрации worklet модулей
- Рабочий pass-through processor
- Message passing между main thread и worklet
- Performance metrics

}}}}

<<<<<<#RECOMMENDED TASKS

AW-1. TypeScript Declarations
- Create audio-worklet.d.ts
- Declare AudioWorkletProcessor
- Declare AudioWorkletGlobalScope
- Declare registerProcessor
- Declare currentFrame, currentTime, sampleRate

AW-2. Worklet Module Registration
- Create worklet loader utility
- Handle Vite module URLs
- Proper error handling on load failure
- Cache loaded worklets

AW-3. BaseProcessor Implementation
- Extend AudioWorkletProcessor correctly
- Implement process() with proper signature
- Add parameterDescriptors
- Handle bypass mode
- Return true to keep alive

AW-4. Message Passing
- Port communication setup
- Typed message protocol
- Parameter updates from main thread
- State sync to main thread
- Error reporting

AW-5. Performance Monitoring
- Track process() execution time
- Detect buffer underruns
- Report metrics to main thread
- XRun counter

🏁 Definition of Done
- No TypeScript errors in worklet code
- Worklet loads and registers correctly
- Audio passes through without glitches
- Messages work bidirectionally
- Performance metrics available

>>>>>>

]]]]
```

---

## E2-T3: Track Graph & Mixer Implementation

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio routing engineer'
    target = implement track graph abstraction for DAW mixer
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = efficient audio routing with minimal overhead
    tech stack = ['Web Audio API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement track graph abstraction for DAWW3 DAW.
Create TrackNode, MasterBus, and Mixer classes.

{{{{ #CUSTOMER PROMT

Track graph не реализован. Нужно:
- TrackNode с gain, pan, mute, solo
- MasterBus для финального микса
- Mixer для управления всеми треками
- Динамическое добавление/удаление треков
- Vue composable useMixer

}}}}

<<<<<<#RECOMMENDED TASKS

TG-1. TrackNode Class
- Input and output GainNodes
- StereoPannerNode for panning
- Gain control with smoothing (setTargetAtTime)
- Pan control (-1 to +1)
- Mute implementation (disconnect vs gain=0)
- Solo logic coordination

TG-2. MasterBus Class
- Master gain control
- Limiter for protection
- Analyzer for metering
- Connection to destination
- Bypass mode

TG-3. Mixer Manager
- Track registry (Map<id, TrackNode>)
- Add/remove tracks
- Solo logic (when solo active, mute non-solo)
- Track ordering
- Save/restore mixer state

TG-4. Vue Composable
- useMixer composable
- Reactive track list
- Individual track controls
- Master controls
- Metering data

TG-5. Audio Routing Tests
- Test gain changes
- Test pan positions
- Test mute/solo logic
- Test dynamic routing
- Test cleanup on remove

🏁 Definition of Done
- Multiple tracks route to master
- Gain/pan controls work with smoothing
- Mute/solo logic correct
- useMixer provides reactive state
- No audio glitches on routing changes

>>>>>>

]]]]
```

---

## E2-T4: Latency Control & XRun Detection

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class real-time audio systems engineer'
    target = implement latency presets and XRun detection
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = achieve < 10ms latency on capable hardware
    tech stack = ['Web Audio API', 'AudioWorklet', 'Vue 3']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement latency control system for DAWW3 DAW.
Create latency presets, XRun detection, and automatic fallback.

{{{{ #CUSTOMER PROMT

Latency measurement отсутствует. Нужно:
- 3 пресета: Low (3ms), Balanced (12ms), Eco (46ms)
- XRun detection в AudioWorklet
- Автоматический fallback при underruns
- UI компонент для выбора пресета
- Персистентность настроек

}}}}

<<<<<<#RECOMMENDED TASKS

LAT-1. Latency Presets
- Define preset configurations
- Calculate actual latency from sampleRate
- Buffer size recommendations
- Hardware capability detection

LAT-2. Latency Manager
- Current preset tracking
- Preset switching logic
- Context recreation for buffer size change
- Actual latency measurement

LAT-3. XRun Detection
- Implement in AudioWorklet processor
- Track timing between process() calls
- Detect when actual > expected * 1.5
- Count consecutive XRuns
- Report to main thread

LAT-4. Automatic Fallback
- Monitor XRun frequency
- Suggest higher latency preset
- Auto-switch after N consecutive XRuns
- User preference for auto-fallback

LAT-5. UI Components
- LatencySelector component
- Current latency display
- XRun indicator/counter
- Preset recommendations
- Settings persistence (localStorage)

LAT-6. Vue Composable
- useLatency composable
- Reactive preset state
- XRun event handling
- Settings persistence

🏁 Definition of Done
- Three presets work correctly
- XRuns detected and reported
- Auto-fallback prevents continuous glitches
- UI shows latency and XRun count
- Settings persist across sessions

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E1-T1 (Monorepo) ✅
    │
    ▼
E2-T1 (AudioContext) ← Sprint 2 START
    │
    ▼
E2-T2 (AudioWorklet)
    │
    ├────────────────────────┐
    ▼                        ▼
E2-T3 (Track Graph)    E3 (WASM DSP) ✅
    │
    ▼
E2-T4 (Latency Control)
    │
    ▼
[Audio Engine Complete] → E11 (Plugin Advanced)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| AudioWorklet browser support | High | Feature detection, ScriptProcessor fallback |
| Safari audio quirks | High | Specific Safari handling, testing on real devices |
| Latency spikes | Medium | XRun detection, automatic fallback |
| Memory leaks in audio nodes | Medium | Proper cleanup, weak references |

---

## Testing Strategy

### Unit Tests
- AudioContext state machine
- Latency calculations
- Gain/pan value clamping

### Integration Tests
- Full audio routing
- Worklet registration and communication
- Preset switching

### Manual Tests
- Real audio playback on different devices
- Latency measurement with hardware
- XRun behavior under load
