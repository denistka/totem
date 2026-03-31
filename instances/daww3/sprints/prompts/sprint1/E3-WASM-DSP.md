# E3: WASM DSP & Plugin System — Agent Prompts

---

## E3-T1: WASM Toolchain

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Rust and WebAssembly engineer'
    target = Rust to WASM compilation pipeline with wasm-pack
    test = true

    code style = [DRY, Best practice, Rust idioms]
    write docs = true
    deep thinking = true
    performance = optimized WASM output
    tech stack = ['rust@1.75', 'wasm-pack@0.12', 'wasm-bindgen@0.2.92']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Setup Rust → WASM compilation for audio DSP processing.
Create example gain processor to validate pipeline.

{{{{ #CUSTOMER PROMT

Нужен WASM toolchain:
- Rust компилируется в WASM
- wasm-pack создаёт web-ready output
- Пример процессора (Gain)
- Интеграция с monorepo

}}}}

<<<<<<#RECOMMENDED TASKS

WSM-1. Cargo.toml
File: packages/dsp/Cargo.toml

Dependencies:
- wasm-bindgen = "0.2.92"
- js-sys = "0.3.69"
- web-sys = "0.3.69"
- console_error_panic_hook (optional)

Profile:
- lto = true
- opt-level = 3

WSM-2. lib.rs Entry Point
File: packages/dsp/src/lib.rs

- Module declarations
- wasm_bindgen(start) for init
- Re-exports

WSM-3. GainProcessor
File: packages/dsp/src/effects/gain.rs

#[wasm_bindgen]
pub struct GainProcessor {
    gain: f32,
    smoothed_gain: f32,
}

Methods:
- new(initial_gain: f32) -> Self
- set_gain(gain: f32)
- process(buffer: &mut [f32])
- process_stereo(left: &mut [f32], right: &mut [f32])

WSM-4. Build Script
File: packages/dsp/build.sh

- wasm-pack build --target web --release
- Output to pkg/
- Optional wasm-opt

WSM-5. Monorepo Integration
- Add to pnpm workspace
- Turbo build task
- TypeScript types from wasm-pack

WSM-6. Test in Browser
- Load WASM in test page
- Verify GainProcessor works
- Check for memory leaks

🏁 Definition of Done
- ./build.sh produces pkg/ with .wasm and .js
- GainProcessor loads in browser
- No console errors
- Types available in TypeScript

>>>>>>

]]]]
```

---

## E3-T2: AudioWorklet ↔ WASM Bridge

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class WebAssembly integration specialist'
    target = bridge between AudioWorkletProcessor and WASM DSP
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = zero-copy where possible, < 1ms processing
    tech stack = ['AudioWorklet', 'WebAssembly', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create bridge for loading and using WASM DSP modules inside AudioWorkletProcessor.
Handle buffer exchange, parameter automation, error recovery.

{{{{ #CUSTOMER PROMT

Нужен мост WASM ↔ AudioWorklet:
- WASM загружается в воркере
- PCM буферы передаются в WASM
- Параметры можно автоматизировать
- Нет глюков звука

}}}}

<<<<<<#RECOMMENDED TASKS

BRG-1. WASMProcessor Class
File: apps/web/src/workers/wasm-processor.ts

class WASMProcessor extends AudioWorkletProcessor {
  private wasmModule: any
  private processor: any
  private inputBuffer: Float32Array
  private outputBuffer: Float32Array
  
  constructor()
  async loadWasm(wasmBytes: ArrayBuffer)
  process(inputs, outputs, parameters)
}

BRG-2. WASM Loading in Worklet
- Receive WASM bytes via postMessage
- Instantiate module
- Create processor instance
- Handle loading errors

BRG-3. Buffer Exchange Strategy
MVP: Copy buffers
- input.set(samples)
- processor.process(input, output)
- output copy back

Future: SharedArrayBuffer
- Document requirements (COOP/COEP headers)

BRG-4. Parameter Messaging
Main thread → Worklet:
- { type: 'param', name: 'gain', value: 0.5 }

Worklet applies:
- processor.set_gain(value)

BRG-5. Node Factory
File: apps/web/src/core/audio/wasm-node.ts

async function createWASMNode(
  context: AudioContext,
  wasmUrl: string,
  processorName: string
): Promise<AudioWorkletNode>

BRG-6. Error Handling
- Catch WASM errors
- Don't crash audio
- Report to main thread
- Fallback to bypass

BRG-7. Memory Management
- Track allocations
- Provide cleanup method
- Test for leaks

🏁 Definition of Done
- WASM processes audio in worklet
- No glitches or clicks
- Parameters change smoothly
- Memory stable over time

>>>>>>

]]]]
```

---

## E3-T3: Plugin Manifest Spec

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class plugin system architect'
    target = JSON schema for plugin metadata and parameters
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    tech stack = ['json-schema', 'typescript', 'zod']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Define JSON schema for DAWW3 plugin manifests.
Parameters, I/O configuration, UI hints.

{{{{ #CUSTOMER PROMT

Нужен манифест для плагинов:
- Метаданные (name, version, author)
- Параметры с типами и ranges
- Audio I/O конфигурация
- UI hints

}}}}

<<<<<<#RECOMMENDED TASKS

MNF-1. JSON Schema
File: packages/plugin-spec/schema.json

Properties:
- $schema
- id, name, version, author
- category
- audio: { inputs, outputs, latency }
- parameters: []
- ui: { width, height, resizable }

MNF-2. Parameter Schema
Types:
- float: min, max, default, unit, automatable
- int: min, max, default, step
- bool: default
- enum: options, default

Display hints:
- widget: slider | knob | toggle | dropdown
- ticks: number[]
- format: string

MNF-3. TypeScript Interface
File: packages/plugin-spec/src/types.ts

interface PluginManifest {
  id: string
  name: string
  version: string
  author: string
  category: PluginCategory
  audio: AudioConfig
  parameters: ParameterDef[]
  ui: UIConfig
}

MNF-4. Zod Validation
File: packages/plugin-spec/src/validation.ts

- PluginManifestSchema
- validateManifest(json): Result<PluginManifest, Error>

MNF-5. Example Manifests
- gain.json
- filter.json
- compressor.json

MNF-6. Documentation
- Schema documentation
- Examples
- Parameter types reference

🏁 Definition of Done
- Schema defined and documented
- TypeScript types generated
- Validation works
- Example manifests valid

>>>>>>

]]]]
```

---

## E3-T4: Plugin UI Binding

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class UI/UX engineer for audio software'
    target = auto-generate plugin UI from manifest
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = 60fps UI updates
    tech stack = ['vue@3.4', 'tailwindcss', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Auto-generate plugin UI controls from manifest.
Bind parameters to DSP with smooth updates.

{{{{ #CUSTOMER PROMT

Нужен UI генератор:
- UI из манифеста
- Слайдеры, кнопки, dropdown
- Связь с DSP
- Без кликов при изменении

}}}}

<<<<<<#RECOMMENDED TASKS

PUI-1. ParameterControl Component
File: apps/web/src/components/plugin/ParameterControl.vue

Props:
- param: ParameterDef
- value: number | boolean | string
- @update: (value) => void

Renders appropriate widget based on param.type

PUI-2. Slider Widget
File: apps/web/src/components/plugin/widgets/Slider.vue

- Horizontal slider
- Value display
- Min/max labels
- Tick marks optional

PUI-3. Knob Widget
File: apps/web/src/components/plugin/widgets/Knob.vue

- SVG-based rotary knob
- Drag to change
- Double-click to reset
- Value display

PUI-4. Toggle Widget
File: apps/web/src/components/plugin/widgets/Toggle.vue

- On/off toggle
- Visual state

PUI-5. Dropdown Widget
File: apps/web/src/components/plugin/widgets/Dropdown.vue

- Select from enum options

PUI-6. PluginUI Container
File: apps/web/src/components/plugin/PluginUI.vue

<template>
  <div class="plugin-ui">
    <ParameterControl
      v-for="param in manifest.parameters"
      :key="param.id"
      :param="param"
      :value="values[param.id]"
      @update="updateParam(param.id, $event)"
    />
  </div>
</template>

PUI-7. usePluginParams Composable
File: apps/web/src/composables/usePluginParams.ts

- Manage parameter values
- Send to AudioWorklet
- Smooth interpolation
- Preset save/load

PUI-8. Parameter Smoothing
- Don't send every mouse move
- Throttle or debounce
- Interpolate in worklet

🏁 Definition of Done
- Plugin UI renders from manifest
- All widget types work
- Parameter changes affect audio
- No clicks or glitches
- 60fps UI responsiveness

>>>>>>

]]]]
```
