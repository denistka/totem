# 🔌 E11: Advanced Plugin System — QA Test Specifications

> **Epic:** E11 - Advanced Plugin Features
> **Status:** ✅ DONE
> **Focus:** Presets, Automation, Parameter curves, Plugin chains

---

## Test Areas

### E11-QA-1: Plugin Presets
```typescript
describe('Plugin Presets', () => {
  it('saves preset with current parameters', async () => {
    const plugin = await loadPlugin('compressor')
    plugin.setParameter('threshold', -12)
    plugin.setParameter('ratio', 4)
    
    const preset = plugin.savePreset('Vocal Squash')
    
    expect(preset.parameters.threshold).toBe(-12)
    expect(preset.parameters.ratio).toBe(4)
  })

  it('loads preset and applies parameters', async () => {
    const plugin = await loadPlugin('compressor')
    
    await plugin.loadPreset('factory/punchy-drums')
    
    expect(plugin.getParameter('threshold')).toBe(-18)
    expect(plugin.getParameter('attack')).toBe(5)
  })

  it('lists available presets', async () => {
    const manager = new PresetManager()
    const presets = await manager.listPresets('compressor')
    
    expect(presets.factory.length).toBeGreaterThan(0)
  })

  it('persists user presets', async () => {
    const manager = new PresetManager()
    await manager.saveUserPreset('eq', 'My EQ', { lowShelf: 3 })
    
    const presets = await manager.listPresets('eq')
    expect(presets.user.find(p => p.name === 'My EQ')).toBeDefined()
  })
})
```

### E11-QA-2: Parameter Automation
```typescript
describe('Parameter Automation', () => {
  it('creates automation lane', () => {
    const track = new Track()
    const lane = track.createAutomationLane('gain', 'volume')
    
    expect(lane).toBeDefined()
    expect(lane.parameter).toBe('gain')
  })

  it('adds automation points', () => {
    const lane = new AutomationLane('gain')
    
    lane.addPoint(0, 0.5)
    lane.addPoint(1000, 1.0)
    lane.addPoint(2000, 0.7)
    
    expect(lane.points.length).toBe(3)
  })

  it('interpolates between points', () => {
    const lane = new AutomationLane('gain')
    lane.addPoint(0, 0.0)
    lane.addPoint(1000, 1.0)
    
    expect(lane.getValueAt(500)).toBeCloseTo(0.5)
    expect(lane.getValueAt(0)).toBe(0.0)
    expect(lane.getValueAt(1000)).toBe(1.0)
  })

  it('supports curve types', () => {
    const lane = new AutomationLane('gain')
    lane.addPoint(0, 0.0, 'exponential')
    lane.addPoint(1000, 1.0)
    
    // Exponential curve should be different from linear
    const linearValue = 0.5
    const actualValue = lane.getValueAt(500)
    
    expect(actualValue).not.toBeCloseTo(linearValue)
  })

  it('records automation in real-time', async () => {
    const lane = new AutomationLane('gain')
    lane.startRecording()
    
    // Simulate parameter changes
    lane.recordValue(100, 0.3)
    lane.recordValue(200, 0.5)
    lane.recordValue(300, 0.7)
    
    lane.stopRecording()
    
    expect(lane.points.length).toBe(3)
  })
})
```

### E11-QA-3: Plugin Chains
```typescript
describe('Plugin Chains', () => {
  it('creates chain with multiple plugins', async () => {
    const chain = new PluginChain()
    
    await chain.add('eq')
    await chain.add('compressor')
    await chain.add('limiter')
    
    expect(chain.plugins.length).toBe(3)
  })

  it('processes audio through chain', async () => {
    const chain = new PluginChain()
    await chain.add('gain')
    
    chain.plugins[0].setParameter('gain', 2.0)
    
    const input = new Float32Array(128).fill(0.25)
    const output = chain.process(input)
    
    expect(output[0]).toBeCloseTo(0.5)
  })

  it('reorders plugins', async () => {
    const chain = new PluginChain()
    await chain.add('eq')
    await chain.add('compressor')
    
    chain.move(1, 0) // Move compressor before EQ
    
    expect(chain.plugins[0].type).toBe('compressor')
  })

  it('bypasses individual plugins', async () => {
    const chain = new PluginChain()
    await chain.add('gain')
    
    chain.plugins[0].setParameter('gain', 2.0)
    chain.plugins[0].bypass = true
    
    const input = new Float32Array(128).fill(0.5)
    const output = chain.process(input)
    
    expect(output[0]).toBe(0.5) // Unchanged
  })
})
```

---

## Regression Tests

```typescript
describe('E11 Regression', () => {
  it.todo('Preset import/export JSON')
  it.todo('Automation record latency compensation')
  it.todo('Plugin chain CPU optimization')
  it.todo('Undo/redo for automation')
  it.todo('Bezier curve automation')
})
```

---

*E11 Advanced Plugins QA — DAWW3 Project*
