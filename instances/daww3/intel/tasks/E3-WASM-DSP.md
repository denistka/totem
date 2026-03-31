# 🦀 E3: WASM DSP & Plugin System

> **Goal:** Foundation for VST-like plugin system  
> **Sprint:** 0  
> **Owner:** Audio

---

## E3-T1: WASM Toolchain

**Priority:** 🔴 P0 CRITICAL  
**Points:** 3  
**Depends on:** E1-T1

### Description
Setup Rust → WASM compilation pipeline with wasm-pack.

### Acceptance Criteria
- [ ] Rust compiles to WASM
- [ ] wasm-pack produces web-ready output
- [ ] Example DSP module works
- [ ] Build integrated into monorepo

### Technical Requirements

```
packages/dsp/
├── Cargo.toml
├── build.sh
├── src/
│   ├── lib.rs
│   └── effects/
│       ├── mod.rs
│       └── gain.rs
└── pkg/              # Output (gitignored)
```

### Subtasks
- [ ] Install Rust toolchain (1.75+)
- [ ] Install wasm-pack
- [ ] Create `Cargo.toml` with dependencies
- [ ] Create basic `lib.rs` with wasm-bindgen
- [ ] Implement simple `GainProcessor`
- [ ] Create `build.sh` script
- [ ] Add to monorepo build pipeline
- [ ] Test WASM loading in browser

### Cargo Dependencies
```toml
[dependencies]
wasm-bindgen = "0.2.92"
js-sys = "0.3.69"
web-sys = { version = "0.3.69", features = ["console"] }
console_error_panic_hook = { version = "0.1.7", optional = true }

[profile.release]
lto = true
opt-level = 3
```

### Definition of Done
```bash
cd packages/dsp
./build.sh
# → pkg/ contains .wasm and .js files
# → WASM loads in browser without errors
```

---

## E3-T2: AudioWorklet ↔ WASM Bridge

**Priority:** 🔴 P0 CRITICAL  
**Points:** 8  
**Depends on:** E2-T2, E3-T1

### Description
Bridge between AudioWorkletProcessor and WASM DSP modules.

### Acceptance Criteria
- [ ] WASM loads inside AudioWorklet
- [ ] PCM buffer exchange works
- [ ] Parameter automation works
- [ ] No audio glitches
- [ ] Memory efficient

### Technical Requirements

```typescript
// workers/wasm-processor.ts
class WASMProcessor extends AudioWorkletProcessor {
  private wasmModule: any = null
  private processor: any = null
  private inputBuffer: Float32Array
  private outputBuffer: Float32Array
  
  constructor() {
    super()
    this.inputBuffer = new Float32Array(128)
    this.outputBuffer = new Float32Array(128)
  }
  
  async loadWasm(wasmBytes: ArrayBuffer) {
    const { default: init, GainProcessor } = await import('@daww3/dsp')
    await init(wasmBytes)
    this.processor = new GainProcessor(1.0)
  }
  
  process(inputs, outputs, parameters) {
    if (!this.processor) return true
    
    const input = inputs[0]?.[0]
    const output = outputs[0]?.[0]
    
    if (input && output) {
      this.inputBuffer.set(input)
      this.processor.process(this.inputBuffer, this.outputBuffer)
      output.set(this.outputBuffer)
    }
    
    return true
  }
}
```

### Memory Strategies

| Strategy | Pros | Cons | Use When |
|----------|------|------|----------|
| Copy buffers | Safe, simple | Slower | Small buffers |
| SharedArrayBuffer | Zero-copy | Complex, security | Large buffers |
| WASM memory | Direct access | Manual management | DSP-heavy |

### Subtasks
- [ ] Create `WASMProcessor` class
- [ ] Implement WASM loading in worklet
- [ ] Implement buffer copy strategy (MVP)
- [ ] Add parameter message handling
- [ ] Implement gain automation
- [ ] Profile memory usage
- [ ] Test with multiple processors
- [ ] Add error handling and recovery

### SharedArrayBuffer Setup (Phase 2)
```typescript
// Requires COOP/COEP headers
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Embedder-Policy: require-corp

const sharedBuffer = new SharedArrayBuffer(128 * 4)
const floatView = new Float32Array(sharedBuffer)
```

### Definition of Done
- Audio processes through WASM without glitches
- Gain parameter can be changed in real-time
- Memory usage stable over time
- Works in Chrome and Firefox

---

## E3-T3: Plugin Manifest Spec

**Priority:** 🟡 P2 MEDIUM  
**Points:** 3  
**Depends on:** E3-T2

### Description
JSON schema for plugin metadata, parameters, and UI hints.

### Acceptance Criteria
- [ ] JSON schema defined
- [ ] TypeScript types generated
- [ ] Validation works
- [ ] Example plugin manifest

### Plugin Manifest Schema

```json
{
  "$schema": "https://daww3.io/schemas/plugin.json",
  "id": "daww3.core.gain",
  "name": "Gain",
  "version": "1.0.0",
  "author": "DAWW3",
  "category": "utility",
  
  "audio": {
    "inputs": 2,
    "outputs": 2,
    "latency": 0
  },
  
  "parameters": [
    {
      "id": "gain",
      "name": "Gain",
      "type": "float",
      "default": 1.0,
      "min": 0.0,
      "max": 2.0,
      "unit": "linear",
      "automatable": true
    },
    {
      "id": "gainDb",
      "name": "Gain (dB)",
      "type": "float",
      "default": 0.0,
      "min": -60.0,
      "max": 12.0,
      "unit": "dB",
      "automatable": true,
      "display": {
        "widget": "slider",
        "ticks": [-60, -12, 0, 6, 12]
      }
    }
  ],
  
  "ui": {
    "width": 200,
    "height": 100,
    "resizable": false,
    "theme": "dark"
  }
}
```

### Subtasks
- [ ] Define JSON schema
- [ ] Create TypeScript interface `PluginManifest`
- [ ] Create parameter type definitions
- [ ] Add validation function
- [ ] Create example manifests (Gain, Filter, Compressor)
- [ ] Document schema

### Definition of Done
- Schema validates example manifests
- TypeScript types match schema
- Documentation complete

---

## E3-T4: Plugin UI Binding

**Priority:** 🟡 P2 MEDIUM  
**Points:** 5  
**Depends on:** E3-T3

### Description
Auto-generate UI controls from plugin manifest.

### Acceptance Criteria
- [ ] UI generated from manifest
- [ ] Parameters bound to DSP
- [ ] Real-time updates work
- [ ] Multiple widget types

### Widget Types

| Type | Widget | Use Case |
|------|--------|----------|
| float | Slider / Knob | Gain, pan |
| int | Stepper | Semitones |
| bool | Toggle | Bypass |
| enum | Dropdown | Filter type |
| color | Color picker | Visual FX |

### Technical Requirements

```vue
<!-- components/modules/PluginUI.vue -->
<template>
  <div class="plugin-ui" :style="{ width: manifest.ui.width + 'px' }">
    <div v-for="param in manifest.parameters" :key="param.id">
      <ParameterControl
        :param="param"
        :value="values[param.id]"
        @update="updateParam(param.id, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePluginParams } from '@/composables/usePluginParams'

const props = defineProps<{
  manifest: PluginManifest
  processorId: string
}>()

const { values, updateParam } = usePluginParams(props.processorId, props.manifest)
</script>
```

### Subtasks
- [ ] Create `ParameterControl` component
- [ ] Create slider widget
- [ ] Create knob widget (SVG-based)
- [ ] Create toggle widget
- [ ] Create dropdown widget
- [ ] Bind parameters to AudioWorklet
- [ ] Add parameter smoothing (avoid clicks)
- [ ] Add preset save/load

### Definition of Done
- Plugin UI renders from manifest
- Parameter changes affect DSP
- No audio clicks on parameter changes

---

## Dependencies Graph

```
E1-T1 (Monorepo)
    │
    ├─────────────────────────────┐
    ▼                             ▼
E2-T2 (AudioWorklet)        E3-T1 (WASM Toolchain)
    │                             │
    └──────────┬──────────────────┘
               ▼
         E3-T2 (WASM Bridge)
               │
               ▼
         E3-T3 (Plugin Manifest)
               │
               ▼
         E3-T4 (Plugin UI)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| WASM in Worklet loading | High | Async loading, fallback |
| SharedArrayBuffer blocked | Medium | Copy fallback |
| WASM memory leaks | Medium | Manual free, WeakRefs |
| Cross-browser WASM | Low | Standard WASM, no extensions |

---

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| WASM load time | < 100ms | < 500ms |
| Process block (128 samples) | < 1ms | < 2ms |
| Memory per plugin | < 2MB | < 5MB |
| Parameter update latency | < 10ms | < 50ms |
