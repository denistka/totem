# E2: Web DAW Core — Agent Prompts

---

## E2-T1: AudioContext Lifecycle

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Web Audio engineer'
    target = AudioContext initialization and lifecycle management
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    cellular dependence = false
    tree-like dependency linking = true
    performance = low latency audio
    tech stack = ['vue@3.4', 'typescript@5.6', 'Web Audio API']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement AudioContext lifecycle management for browser-based DAW.
Handle user gesture requirements, sample rate detection, state management.

{{{{ #CUSTOMER PROMT

Мне нужен надёжный AudioContext manager:
- Инициализация при клике пользователя
- Resume при возврате из suspended
- Определение sample rate
- Graceful cleanup

}}}}

<<<<<<#RECOMMENDED TASKS

CTX-1. AudioContextManager Class
File: apps/web/src/core/audio/context.ts

Interface:
- context: AudioContext | null
- state: 'suspended' | 'running' | 'closed'
- sampleRate: number
- init(): Promise<void>
- resume(): Promise<void>
- suspend(): Promise<void>
- close(): Promise<void>

CTX-2. User Gesture Detection
- Detect first click/touch/keydown
- Auto-resume on gesture
- Handle autoplay policy

CTX-3. State Change Listeners
- Listen to AudioContext.onstatechange
- Emit events for UI updates
- Log state transitions

CTX-4. Vue Composable
File: apps/web/src/composables/useAudioContext.ts

Returns:
- context: Ref<AudioContext | null>
- state: Ref<AudioContextState>
- sampleRate: Ref<number>
- resume(): Promise<void>
- isReady: ComputedRef<boolean>

CTX-5. Browser Compatibility
- Test Chrome, Firefox, Safari, Edge
- Polyfill if needed
- Feature detection

CTX-6. Error Handling
- Handle context creation failure
- Retry logic
- User feedback

🏁 Definition of Done
- AudioContext resumes on first user gesture
- State is reactive in Vue
- Works in all major browsers
- No console errors

>>>>>>

]]]]
```

---

## E2-T2: AudioWorklet Base Processor

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio DSP engineer'
    target = AudioWorkletProcessor base class for real-time audio
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = < 2ms per 128 sample block
    tech stack = ['AudioWorklet', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create base AudioWorkletProcessor for real-time audio processing.
Pass-through audio, performance metrics, message passing.

{{{{ #CUSTOMER PROMT

Нужен базовый процессор:
- 128 samples per block
- Bypass parameter
- Message passing to/from main thread
- Performance timing hooks

}}}}

<<<<<<#RECOMMENDED TASKS

WRK-1. BaseProcessor Class
File: apps/web/src/workers/base-processor.ts

static parameterDescriptors:
- bypass (0-1)

process(inputs, outputs, parameters):
- Handle stereo
- Return true to keep alive

WRK-2. Message Passing
- port.postMessage for metrics
- port.onmessage for commands
- Structured message types

WRK-3. Performance Metrics
- Measure process() time
- Track buffer underruns
- Report to main thread

WRK-4. Processor Registration
File: apps/web/src/core/audio/worklet-loader.ts

- Load worklet module
- Handle registration errors
- Create nodes from registered processors

WRK-5. WorkletNode Wrapper
File: apps/web/src/core/audio/worklet-node.ts

- Wrap AudioWorkletNode
- Handle parameter automation
- Message passing helpers

WRK-6. Error Handling
- Catch errors in process()
- Report without crashing
- Graceful degradation

🏁 Definition of Done
- Audio passes through without glitches
- process() < 2ms
- Parameters change smoothly
- Errors don't crash audio

>>>>>>

]]]]
```

---

## E2-T3: Track Graph Abstraction

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio software architect'
    target = audio routing abstraction - tracks to master bus
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = efficient audio graph
    tech stack = ['Web Audio API', 'vue@3.4', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create abstraction layer for audio routing in DAW.
Tracks with gain/pan → Master bus → Destination.

{{{{ #CUSTOMER PROMT

Нужна абстракция:
- TrackNode с gain и pan
- Master bus
- Mute/Solo логика
- Динамическое добавление/удаление треков

}}}}

<<<<<<#RECOMMENDED TASKS

TRK-1. TrackNode Class
File: apps/web/src/core/audio/track-node.ts

Properties:
- id: string
- name: string
- gain: number (0-2)
- pan: number (-1 to 1)
- mute: boolean
- solo: boolean
- input: GainNode
- output: GainNode
- panner: StereoPannerNode

Methods:
- connect(destination)
- disconnect()
- setGain(value, smooth?)
- setPan(value, smooth?)

TRK-2. MasterBus Class
File: apps/web/src/core/audio/master-bus.ts

- Single instance
- Gain control
- Limiter (optional)
- Connects to destination

TRK-3. Mixer Class
File: apps/web/src/core/audio/mixer.ts

- Map<string, TrackNode>
- addTrack(id, name): TrackNode
- removeTrack(id): void
- getTrack(id): TrackNode
- Solo logic (mute non-solo)

TRK-4. Gain Smoothing
- Use setTargetAtTime
- Avoid clicks
- Configurable time constant

TRK-5. Vue Composable
File: apps/web/src/composables/useMixer.ts

Returns:
- tracks: Ref<TrackNode[]>
- masterGain: Ref<number>
- addTrack(name): TrackNode
- removeTrack(id): void
- solo(id): void
- unsolo(id): void

TRK-6. Metering
- Peak meter output per track
- RMS optional
- Update at 60fps max

🏁 Definition of Done
- Tracks route to master
- Gain/pan changes are smooth
- Solo/mute work correctly
- Adding/removing tracks is dynamic

>>>>>>

]]]]
```

---

## E2-T4: Buffer & Latency Control

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class real-time audio engineer'
    target = latency presets and XRun detection
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = < 10ms latency possible
    tech stack = ['Web Audio API', 'vue@3.4', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement configurable latency presets and buffer underrun detection.
Low-latency for live playing, eco mode for playback.

{{{{ #CUSTOMER PROMT

Нужны пресеты латентности:
- Low Latency (~3ms) для живой игры
- Balanced (~12ms) общего назначения
- Eco (~46ms) для прослушивания
- Определение XRuns

}}}}

<<<<<<#RECOMMENDED TASKS

LAT-1. Latency Presets
File: apps/web/src/core/audio/latency.ts

Presets:
- LOW: 128 samples, ~3ms
- BALANCED: 512 samples, ~12ms
- ECO: 2048 samples, ~46ms

LAT-2. LatencyManager Class
- currentPreset: LatencyConfig
- setPreset(preset): void
- getActualLatency(): number (from AudioContext)
- onXrun(callback): void

LAT-3. XRun Detection
In AudioWorklet:
- Track time between process() calls
- If gap > expected * 1.5 → XRun
- Post message to main thread

LAT-4. Automatic Fallback
- Count XRuns
- If > threshold → suggest higher latency
- Never auto-switch (user decision)

LAT-5. Vue Composable
File: apps/web/src/composables/useLatency.ts

Returns:
- preset: Ref<'low' | 'balanced' | 'eco'>
- latencyMs: Ref<number>
- xrunCount: Ref<number>
- setPreset(preset): void

LAT-6. Persistence
- Save preset to localStorage
- Restore on page load

LAT-7. UI Component
File: apps/web/src/components/LatencySelector.vue

- Dropdown/buttons for presets
- Show actual latency
- Show XRun count

🏁 Definition of Done
- User can switch latency presets
- Actual latency displayed
- XRuns detected and counted
- Settings persist

>>>>>>

]]]]
```
