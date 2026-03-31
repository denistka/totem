# 🔧 E3: WASM DSP Plugins — QA Test Specifications

> **Epic:** E3 - WASM DSP Plugin System
> **Status:** ✅ DONE
> **Focus:** Rust/WASM compilation, Plugin manifest, Host bridge, SharedArrayBuffer

---

## Test Areas

### E3-QA-1: WASM Compilation
```typescript
describe('WASM Compilation', () => {
  it('builds Rust to WASM', async () => {
    const result = await exec('cd packages/dsp-plugins && wasm-pack build')
    expect(result.exitCode).toBe(0)
  })

  it('WASM size < 100KB per plugin', async () => {
    const stats = await fs.stat('packages/dsp-plugins/pkg/gain.wasm')
    expect(stats.size).toBeLessThan(100 * 1024)
  })

  it('exports correct functions', async () => {
    const wasm = await WebAssembly.instantiate(wasmBytes)
    expect(wasm.instance.exports.process).toBeDefined()
    expect(wasm.instance.exports.set_parameter).toBeDefined()
  })
})
```

### E3-QA-2: Plugin Manifest
```typescript
describe('Plugin Manifest', () => {
  it('validates against JSON schema', () => {
    const manifest = require('./fixtures/gain-manifest.json')
    const valid = ajv.validate(pluginSchema, manifest)
    expect(valid).toBe(true)
  })

  it('parameter constraints enforced', () => {
    const manifest = { parameters: [{ min: 0, max: 2, default: 5 }] }
    const valid = ajv.validate(pluginSchema, manifest)
    expect(valid).toBe(false)
  })
})
```

### E3-QA-3: DSP Processing
```typescript
describe('DSP Processing', () => {
  it('Gain plugin amplifies correctly', async () => {
    const plugin = await loadPlugin('gain')
    const input = new Float32Array(128).fill(0.5)
    
    plugin.setParameter('gain', 2.0)
    const output = plugin.process(input)
    
    expect(output[0]).toBeCloseTo(1.0, 2)
  })

  it('Compressor reduces peaks', async () => {
    const plugin = await loadPlugin('compressor')
    const input = new Float32Array(128)
    input[64] = 1.0 // Peak
    
    plugin.setParameter('threshold', -12)
    plugin.setParameter('ratio', 4)
    const output = plugin.process(input)
    
    expect(output[64]).toBeLessThan(1.0)
  })

  it('processing time < 2ms for 128 samples', async () => {
    const plugin = await loadPlugin('gain')
    const input = new Float32Array(128)
    
    const times = []
    for (let i = 0; i < 100; i++) {
      const start = performance.now()
      plugin.process(input)
      times.push(performance.now() - start)
    }
    
    const avg = times.reduce((a, b) => a + b) / times.length
    expect(avg).toBeLessThan(2)
  })
})
```

### E3-QA-4: SharedArrayBuffer
```typescript
describe('SharedArrayBuffer', () => {
  it('COOP/COEP headers enable SAB', async () => {
    const res = await fetch('/')
    expect(res.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin')
    expect(res.headers.get('Cross-Origin-Embedder-Policy')).toBe('require-corp')
  })

  it('creates SharedArrayBuffer', () => {
    expect(() => new SharedArrayBuffer(1024)).not.toThrow()
  })
})
```

---

## Regression Tests

```typescript
describe('E3 Regression', () => {
  it.todo('wasm-pack build integration in Turborepo')
  it.todo('WASM module hot reload')
  it.todo('Plugin presets save/load')
  it.todo('Automation parameter curves')
  it.todo('Plugin chain serialization')
})
```

---

*E3 WASM DSP QA — DAWW3 Project*
