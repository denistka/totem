# E11: Plugin System Advanced Features — Agent Prompts

> **Goal:** Complete WASM DSP with Rust compilation, presets, automation, MIDI CC
> **Sprint:** 2
> **Owner:** Audio / Frontend
> **Source:** E3 WASM DSP unresolved items

---

## E11-T1: Rust Environment & WASM Compilation

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Rust and WebAssembly engineer'
    target = setup Rust toolchain and verify WASM compilation
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = optimized WASM binary size
    tech stack = ['Rust', 'wasm-pack', 'wasm-bindgen', 'wasm-opt']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Setup Rust environment and compile DAWW3 DSP plugins to WASM.
Verify all exports work correctly in browser.

{{{{ #CUSTOMER PROMT

Rust не установлен в окружении. Нужно:
- Скрипт установки Rust toolchain
- wasm-pack конфигурация
- Компиляция GainProcessor и других плагинов
- Верификация WASM exports
- CI pipeline для WASM build

}}}}

<<<<<<#RECOMMENDED TASKS

RUST-1. Rust Toolchain Setup Script
- Install rustup
- Add wasm32-unknown-unknown target
- Install wasm-pack
- Install wasm-opt (optional optimization)
- Version pinning in rust-toolchain.toml

RUST-2. WASM Build Configuration
- Cargo.toml for packages/dsp
- wasm-pack build command
- Optimization flags (--release, wasm-opt -O3)
- Output to web target format
- TypeScript bindings generation

RUST-3. Compile DSP Plugins
- Build GainProcessor
- Build any other existing processors
- Verify .wasm file sizes
- Verify .js/.ts bindings generated
- Test loading in browser

RUST-4. WASM Export Verification
- Test all exported functions
- Verify memory management
- Test parameter handling
- Performance benchmarks
- Browser compatibility

RUST-5. CI/CD Pipeline
- GitHub Actions for WASM build
- Cache Rust dependencies
- Build on PR
- Upload artifacts
- Version tagging

RUST-6. Developer Documentation
- Rust setup guide
- Building locally
- Adding new processors
- Debugging WASM
- Performance tips

🏁 Definition of Done
- make dsp builds WASM successfully
- All exports verified in browser
- CI builds WASM on every PR
- Documentation complete
- < 100KB per processor (optimized)

>>>>>>

]]]]
```

---

## E11-T2: COOP/COEP Headers for SharedArrayBuffer

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class web security and performance engineer'
    target = enable SharedArrayBuffer with proper security headers
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = zero-copy audio between threads
    tech stack = ['Vite', 'NestJS', 'HTTP headers']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Enable SharedArrayBuffer for DAWW3 audio processing.
Configure COOP/COEP headers correctly for all environments.

{{{{ #CUSTOMER PROMT

Zero-copy SharedArrayBuffer требует COOP/COEP headers.
Нужно:
- Настроить headers в Vite dev server
- Настроить headers в NestJS
- Настроить headers в production (nginx/CDN)
- Fallback для старых браузеров
- Документация по настройке

}}}}

<<<<<<#RECOMMENDED TASKS

SAB-1. Vite Dev Server Headers
- Configure vite.config.ts
- Add Cross-Origin-Opener-Policy: same-origin
- Add Cross-Origin-Embedder-Policy: require-corp
- Test SharedArrayBuffer availability
- Handle iframe embedding issues

SAB-2. NestJS Backend Headers
- Global middleware for COOP/COEP
- Conditional headers (dev vs prod)
- CORS compatibility
- API endpoint exclusions if needed

SAB-3. Production Configuration
- nginx config example
- CDN configuration (Cloudflare, etc.)
- Docker reverse proxy setup
- SSL requirements

SAB-4. SharedArrayBuffer Feature Detection
- Check crossOriginIsolated property
- Fallback to regular ArrayBuffer
- Performance comparison logging
- User notification if degraded mode

SAB-5. AudioWorklet Integration
- SharedArrayBuffer between main and worklet
- Ring buffer implementation
- Lock-free communication
- Memory management

SAB-6. Testing & Verification
- Test in all browsers
- Test with iframes disabled
- Test OAuth popup flows
- Performance benchmarks

🏁 Definition of Done
- crossOriginIsolated === true in browser
- SharedArrayBuffer works in AudioWorklet
- Fallback works when headers missing
- Production deployment guide complete
- No breaking of OAuth or popups

>>>>>>

]]]]
```

---

## E11-T3: Plugin Preset System

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio software UX engineer'
    target = implement plugin preset save/load system
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast preset switching
    tech stack = ['Vue 3', 'TypeScript', 'IndexedDB', 'JSON']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement preset system for DAWW3 audio plugins.
Save, load, share, and manage plugin presets.

{{{{ #CUSTOMER PROMT

Plugin preset persistence не реализован. Нужно:
- Сохранение пресетов в IndexedDB
- Factory presets (встроенные)
- User presets (пользовательские)
- Import/Export в JSON
- Preset browser UI

}}}}

<<<<<<#RECOMMENDED TASKS

PRESET-1. Preset Data Model
- PresetSchema interface
- Plugin ID reference
- Parameter values map
- Metadata (name, author, tags, created)
- Version for migrations

PRESET-2. Storage Layer
- IndexedDB wrapper
- Factory presets (bundled)
- User presets CRUD
- Preset categories/folders
- Search by name/tags

PRESET-3. Preset Manager Service
- Load preset to plugin
- Save current state as preset
- Compare (has changes indicator)
- Default preset per plugin
- Recent presets list

PRESET-4. Import/Export
- Export single preset to JSON
- Export all user presets
- Import from JSON file
- Validation on import
- Duplicate handling

PRESET-5. Preset Browser UI
- Preset list component
- Category filtering
- Search functionality
- Preview on hover (optional)
- Drag-drop to plugin

PRESET-6. Factory Presets
- Create presets for each plugin
- "Init" preset (default state)
- 3-5 useful presets per plugin
- Bundle with app

🏁 Definition of Done
- Presets save and load correctly
- Factory presets available
- Import/export works
- Preset browser UI functional
- Presets persist across sessions

>>>>>>

]]]]
```

---

## E11-T4: Parameter Automation Curves

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DAW automation engineer'
    target = implement parameter automation with multiple curve types
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = sample-accurate automation
    tech stack = ['Web Audio API', 'TypeScript', 'Canvas']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement parameter automation for DAWW3 plugins.
Support multiple curve types beyond linear.

{{{{ #CUSTOMER PROMT

Automation только linear. Нужно:
- Exponential curves
- Logarithmic curves
- S-curves (ease in/out)
- Step (instant jump)
- Bezier curves (advanced)
- UI для редактирования automation

}}}}

<<<<<<#RECOMMENDED TASKS

AUTO-1. Curve Types Implementation
- Linear interpolation
- Exponential curve
- Logarithmic curve
- S-curve (ease in/out/both)
- Step (instant change)
- Custom bezier (control points)

AUTO-2. Automation Point Data Model
- Time position (beats or seconds)
- Value (normalized 0-1)
- Curve type to next point
- Curve tension/parameters
- Snap settings

AUTO-3. Automation Lane Class
- Points array management
- Get value at time
- Add/remove/move points
- Curve calculation
- Sample-accurate interpolation

AUTO-4. Web Audio Integration
- AudioParam automation scheduling
- setValueAtTime for steps
- linearRampToValueAtTime
- exponentialRampToValueAtTime
- Custom curves via setValueCurveAtTime

AUTO-5. Automation Editor UI
- Canvas-based curve display
- Point creation (click)
- Point dragging
- Curve type selector
- Zoom and scroll

AUTO-6. Real-time Preview
- Live parameter updates
- Visual feedback during playback
- Playhead position sync
- Bypass automation toggle

🏁 Definition of Done
- All curve types work correctly
- Sample-accurate automation
- UI allows curve editing
- Integrates with AudioParam
- Smooth playback

>>>>>>

]]]]
```

---

## E11-T5: MIDI CC Parameter Mapping

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI integration specialist'
    target = implement MIDI CC to plugin parameter mapping
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = low-latency MIDI response
    tech stack = ['Web MIDI API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement MIDI CC mapping for DAWW3 plugin parameters.
Allow any CC to control any parameter with curves.

{{{{ #CUSTOMER PROMT

MIDI CC mapping к параметрам не реализован. Нужно:
- Map любой CC к любому параметру
- Response curves (linear, log, exp)
- CC range limiting (min/max)
- Multiple mappings per CC
- MIDI learn mode

}}}}

<<<<<<#RECOMMENDED TASKS

MIDI-CC-1. Mapping Data Model
- Source: MIDI channel + CC number
- Target: Plugin ID + Parameter ID
- Response curve type
- Input range (CC min/max)
- Output range (param min/max)
- Enabled flag

MIDI-CC-2. Mapping Manager
- Active mappings registry
- Process incoming CC messages
- Apply curve transformation
- Update target parameter
- Mapping CRUD operations

MIDI-CC-3. Response Curves
- Linear (direct map)
- Logarithmic (better for freq/volume)
- Exponential (better for time)
- S-curve (smooth response)
- Custom curve points

MIDI-CC-4. MIDI Learn Integration
- Extend existing MIDI learn
- Detect CC movement
- Auto-create mapping
- Suggest parameter based on CC
- Conflict detection

MIDI-CC-5. Mapping Editor UI
- List of active mappings
- Source CC display (with name if known)
- Target parameter selector
- Curve type dropdown
- Range sliders
- Test button

MIDI-CC-6. Persistence
- Save mappings with project
- Global mappings (device profiles)
- Import/export mappings
- Mapping presets

🏁 Definition of Done
- CC controls parameters in real-time
- Curves modify response correctly
- MIDI learn creates mappings
- Mappings saved with project
- Low latency (< 10ms)

>>>>>>

]]]]
```

---

## E11-T6: Plugin Chain Management

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio plugin architecture engineer'
    target = implement plugin chain with multiple instances
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = efficient chain processing
    tech stack = ['Web Audio API', 'AudioWorklet', 'Vue 3']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement plugin chain management for DAWW3.
Support multiple plugin instances per track with reordering.

{{{{ #CUSTOMER PROMT

Plugin chain management не реализован. Нужно:
- Multiple plugin instances per track
- Drag-drop reordering
- Insert/remove plugins
- Bypass individual plugins
- Chain presets (save whole chain)

}}}}

<<<<<<#RECOMMENDED TASKS

CHAIN-1. Plugin Chain Data Model
- Ordered list of plugin instances
- Per-instance state (params, bypass)
- Chain-level bypass
- Unique instance IDs
- Parent track reference

CHAIN-2. Audio Graph Management
- Connect plugins in series
- Handle insertion (reconnect)
- Handle removal (reconnect)
- Handle reorder (reconnect)
- Minimize glitches on change

CHAIN-3. Plugin Instance Manager
- Create plugin instance
- Clone existing instance
- Destroy instance (cleanup)
- Instance state serialization
- Hot-swap plugin type

CHAIN-4. Chain Editor UI
- Vertical plugin slots
- Drag-drop reordering
- Add plugin button (+)
- Remove button per slot
- Bypass toggle per slot
- Expand/collapse plugin UI

CHAIN-5. Chain Presets
- Save entire chain as preset
- Load chain preset
- Factory chain presets
- Import/export chains

CHAIN-6. Performance Optimization
- Lazy instantiation
- Bypass skips processing
- Efficient reconnection
- Memory management

🏁 Definition of Done
- Multiple plugins on one track
- Reordering works without glitches
- Individual bypass works
- Chain presets save/load
- UI is intuitive

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E3 (WASM DSP) ✅
    │
    ▼
E11-T1 (Rust Environment) ← Sprint 2 START
    │
    ├────────────────────────┐
    ▼                        ▼
E11-T2 (COOP/COEP)     E11-T3 (Presets)
    │                        │
    ▼                        ▼
E11-T4 (Automation) ←───────┤
    │                        │
    ▼                        ▼
E11-T5 (MIDI CC) ──────► E11-T6 (Plugin Chain)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rust learning curve | Medium | Good documentation, examples |
| COOP/COEP breaking features | High | Feature detection, fallbacks |
| Automation performance | Medium | Web Audio native scheduling |
| Plugin chain reconnection glitches | Medium | Crossfade on change |
