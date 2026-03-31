# 🔗 E16: Full Integration — QA Test Specifications

> **Epic:** E16 - Full Integration & Polish
> **Priority:** 🔴 CRITICAL
> **Focus:** Metering, Plugin chains, WASM DSP, Transport, Undo/Redo

---

## QA Agent Prompt

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive integration tests
    expertize = 'you are world class DAW QA engineer'
    target = validate all Sprint 0-2 components work together
    test = true

    code style = [Integration testing, Visual regression]
    write docs = true
    deep thinking = true
    performance = 60fps UI, < 10ms audio latency
    tech stack = ['Vitest', 'Playwright', 'Web Audio API', 'Vue Test Utils']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement integration tests for E16 Full Integration epic.
Validate audio metering, plugin routing, WASM DSP, transport sync.

{{{{ #CUSTOMER PROMT

Нужны QA тесты для интеграции:
- E16-T1: Audio metering visualization (peak, RMS, spectrum)
- E16-T2: Plugin chain routing через mixer
- E16-T3: WASM DSP integration с worklet
- E16-T4: Transport sync с automation
- E16-T5: Undo/redo system
- E16-T6: TypeScript error cleanup validation

}}}}

<<<<<<#RECOMMENDED TASKS

E16-QA-1. Audio Metering Tests
E16-QA-2. Plugin Chain Routing Tests
E16-QA-3. WASM DSP Integration Tests
E16-QA-4. Transport Sync Tests
E16-QA-5. Undo/Redo Tests
E16-QA-6. TypeScript Validation

>>>>>>

]]]]
```

---

## E16-QA-1: Audio Metering Tests

```typescript
describe('Audio Metering Visualization', () => {
  describe('Peak Meter', () => {
    it('displays accurate peak level', async () => {
      const track = await createTestTrack()
      const osc = createOscillator(0.5) // 50% amplitude
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      const peakLevel = track.meter.getPeak()
      expect(peakLevel).toBeCloseTo(-6, 1) // -6dB = 50%
      
      osc.stop()
    })

    it('peak hold decays correctly', async () => {
      const track = await createTestTrack()
      const impulse = createImpulse(1.0) // Full scale
      impulse.connect(track.input)
      impulse.start()
      
      await waitForFrames(5)
      const peakHold = track.meter.getPeakHold()
      expect(peakHold).toBeCloseTo(0, 1) // 0dB peak
      
      await waitForFrames(60) // 1 second at 60fps
      const decayedHold = track.meter.getPeakHold()
      expect(decayedHold).toBeLessThan(peakHold)
    })

    it('clip indicator latches on clipping', async () => {
      const track = await createTestTrack()
      const osc = createOscillator(1.5) // Over 0dB
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      expect(track.meter.hasClipped()).toBe(true)
      
      osc.stop()
      await waitForFrames(30)
      
      // Should remain latched until reset
      expect(track.meter.hasClipped()).toBe(true)
      
      track.meter.resetClip()
      expect(track.meter.hasClipped()).toBe(false)
    })
  })

  describe('RMS Meter', () => {
    it('displays RMS with 300ms integration', async () => {
      const track = await createTestTrack()
      const noise = createNoise(0.5)
      noise.connect(track.input)
      noise.start()
      
      await waitMs(500) // Allow integration time
      
      const rms = track.meter.getRMS()
      expect(rms).toBeGreaterThan(-20)
      expect(rms).toBeLessThan(0)
    })
  })

  describe('Spectrum Analyzer', () => {
    it('shows correct frequency distribution', async () => {
      const track = await createTestTrack()
      const osc = createOscillator(0.5, 1000) // 1kHz
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(30)
      
      const spectrum = track.meter.getSpectrum()
      const bin1kHz = Math.round(1000 / (44100 / 2048))
      
      // Peak should be around 1kHz bin
      expect(spectrum[bin1kHz]).toBeGreaterThan(spectrum[bin1kHz + 10])
    })
  })

  describe('Performance', () => {
    it('renders at 60fps with 16 tracks', async () => {
      const tracks = await Promise.all(
        Array(16).fill(null).map(() => createTestTrack())
      )
      
      tracks.forEach(t => {
        const osc = createOscillator(0.3)
        osc.connect(t.input)
        osc.start()
      })
      
      const frameStats = await measureFrameRate(1000) // 1 second
      
      expect(frameStats.avg).toBeGreaterThan(55)
      expect(frameStats.min).toBeGreaterThan(30)
    })

    it('CPU usage < 5% for all meters', async () => {
      const tracks = await Promise.all(
        Array(16).fill(null).map(() => createTestTrack())
      )
      
      const cpuBefore = await getCPUUsage()
      
      // Run meters for 5 seconds
      await waitMs(5000)
      
      const cpuAfter = await getCPUUsage()
      const meterCPU = cpuAfter - cpuBefore
      
      expect(meterCPU).toBeLessThan(5)
    })
  })
})
```

---

## E16-QA-2: Plugin Chain Routing Tests

```typescript
describe('Plugin Chain Routing', () => {
  describe('Insert Effects', () => {
    it('processes audio through plugin chain', async () => {
      const track = await createTestTrack()
      const gainPlugin = await loadPlugin('gain')
      gainPlugin.setParameter('gain', 2.0)
      
      track.insertPlugin(gainPlugin)
      
      const osc = createOscillator(0.25)
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      const output = track.meter.getPeak()
      expect(output).toBeCloseTo(-6, 1) // 0.25 * 2 = 0.5 = -6dB
    })

    it('chains multiple plugins correctly', async () => {
      const track = await createTestTrack()
      const gain1 = await loadPlugin('gain')
      const gain2 = await loadPlugin('gain')
      
      gain1.setParameter('gain', 2.0)
      gain2.setParameter('gain', 0.5)
      
      track.insertPlugin(gain1)
      track.insertPlugin(gain2)
      
      const osc = createOscillator(0.5)
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      // 0.5 * 2.0 * 0.5 = 0.5
      const output = track.meter.getPeak()
      expect(output).toBeCloseTo(-6, 1)
    })

    it('bypasses plugin without audio glitch', async () => {
      const track = await createTestTrack()
      const compressor = await loadPlugin('compressor')
      track.insertPlugin(compressor)
      
      const osc = createOscillator(0.5)
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      // Record buffer before bypass
      const bufferBefore = await captureAudioBuffer(100)
      
      compressor.bypass = true
      
      const bufferDuring = await captureAudioBuffer(100)
      
      // Check for no discontinuities
      expect(hasAudioGlitch(bufferBefore, bufferDuring)).toBe(false)
    })
  })

  describe('Pre/Post Fader', () => {
    it('pre-fader processes before volume', async () => {
      const track = await createTestTrack()
      track.gain = 0.5
      
      const meter = await loadPlugin('meter')
      track.insertPlugin(meter, 'pre-fader')
      
      const osc = createOscillator(1.0)
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      // Pre-fader meter should see full amplitude
      expect(meter.getPeak()).toBeCloseTo(0, 1)
      // Output should be reduced by fader
      expect(track.meter.getPeak()).toBeCloseTo(-6, 1)
    })

    it('post-fader processes after volume', async () => {
      const track = await createTestTrack()
      track.gain = 0.5
      
      const meter = await loadPlugin('meter')
      track.insertPlugin(meter, 'post-fader')
      
      const osc = createOscillator(1.0)
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      // Post-fader meter should see reduced amplitude
      expect(meter.getPeak()).toBeCloseTo(-6, 1)
    })
  })

  describe('Send Effects', () => {
    it('sends audio to aux return', async () => {
      const track = await createTestTrack()
      const auxReturn = await createAuxReturn()
      
      track.setSendLevel(auxReturn, 0.5)
      
      const osc = createOscillator(1.0)
      osc.connect(track.input)
      osc.start()
      
      await waitForFrames(10)
      
      expect(auxReturn.meter.getPeak()).toBeCloseTo(-6, 1)
    })
  })

  describe('Serialization', () => {
    it('saves and loads plugin chain with project', async () => {
      const track = await createTestTrack()
      const gain = await loadPlugin('gain')
      gain.setParameter('gain', 1.5)
      track.insertPlugin(gain)
      
      const projectData = await project.serialize()
      
      await project.clear()
      await project.deserialize(projectData)
      
      const loadedTrack = project.tracks[0]
      const loadedGain = loadedTrack.plugins[0]
      
      expect(loadedGain.getParameter('gain')).toBe(1.5)
    })
  })
})
```

---

## E16-QA-3: WASM DSP Integration Tests

```typescript
describe('WASM DSP Integration', () => {
  describe('WASM Loading', () => {
    it('loads WASM module in AudioWorklet', async () => {
      const plugin = await loadWASMPlugin('gain')
      
      expect(plugin.isLoaded).toBe(true)
      expect(plugin.wasmInstance).toBeDefined()
    })

    it('handles loading failure gracefully', async () => {
      const plugin = await loadWASMPlugin('nonexistent')
      
      expect(plugin.isLoaded).toBe(false)
      expect(plugin.error).toContain('not found')
    })
  })

  describe('SharedArrayBuffer', () => {
    it('uses SAB when available', async () => {
      if (!crossOriginIsolated) {
        console.log('Skipping SAB test - not cross-origin isolated')
        return
      }
      
      const plugin = await loadWASMPlugin('gain')
      
      expect(plugin.usesSharedArrayBuffer).toBe(true)
    })

    it('falls back to copy mode without SAB', async () => {
      // Simulate non-isolated environment
      const plugin = await loadWASMPlugin('gain', { forceCopyMode: true })
      
      expect(plugin.usesSharedArrayBuffer).toBe(false)
      expect(plugin.isLoaded).toBe(true)
    })
  })

  describe('Performance', () => {
    it('processes 128 samples in < 2ms', async () => {
      const plugin = await loadWASMPlugin('gain')
      const times: number[] = []
      
      plugin.onProcessTime((time) => times.push(time))
      
      // Run for 1 second
      await waitMs(1000)
      
      const avgTime = times.reduce((a, b) => a + b) / times.length
      const maxTime = Math.max(...times)
      
      console.log(`WASM process avg: ${avgTime.toFixed(3)}ms, max: ${maxTime.toFixed(3)}ms`)
      
      expect(avgTime).toBeLessThan(2)
      expect(maxTime).toBeLessThan(5)
    })

    it('no memory leak over 10 minutes', async () => {
      const plugin = await loadWASMPlugin('gain')
      
      const memoryBefore = plugin.getMemoryUsage()
      
      // Run for 10 minutes
      await waitMs(10 * 60 * 1000)
      
      const memoryAfter = plugin.getMemoryUsage()
      const growth = (memoryAfter - memoryBefore) / memoryBefore
      
      expect(growth).toBeLessThan(0.1) // < 10% growth
    }, 15 * 60 * 1000)
  })

  describe('Parameter Sync', () => {
    it('syncs JS parameter to WASM', async () => {
      const plugin = await loadWASMPlugin('gain')
      
      plugin.setParameter('gain', 0.5)
      
      await waitForFrames(5)
      
      const wasmValue = plugin.getWASMParameter('gain')
      expect(wasmValue).toBeCloseTo(0.5, 3)
    })

    it('interpolates parameter changes smoothly', async () => {
      const plugin = await loadWASMPlugin('gain')
      plugin.setParameter('gain', 1.0)
      
      await waitForFrames(5)
      
      plugin.setParameter('gain', 0.5)
      
      // Values should transition, not jump
      const values: number[] = []
      for (let i = 0; i < 10; i++) {
        values.push(plugin.getWASMParameter('gain'))
        await waitForFrames(1)
      }
      
      // Check monotonic decrease
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeLessThanOrEqual(values[i - 1])
      }
    })
  })
})
```

---

## E16-QA-4: Transport Sync Tests

```typescript
describe('Transport Sync with Automation', () => {
  describe('Playback', () => {
    it('automation values apply during playback', async () => {
      const track = await createTestTrack()
      const automation = track.createAutomationLane('gain')
      
      automation.addPoint(0, 0.5)
      automation.addPoint(1000, 1.0)
      
      transport.play()
      
      await waitMs(500)
      
      const currentGain = track.gain
      expect(currentGain).toBeGreaterThan(0.5)
      expect(currentGain).toBeLessThan(1.0)
      
      transport.stop()
    })

    it('seek updates automation values instantly', async () => {
      const track = await createTestTrack()
      const automation = track.createAutomationLane('gain')
      
      automation.addPoint(0, 0.0)
      automation.addPoint(2000, 1.0)
      
      transport.seek(1000)
      
      await waitForFrames(1)
      
      expect(track.gain).toBeCloseTo(0.5, 2)
    })
  })

  describe('Loop', () => {
    it('automation loops correctly', async () => {
      const track = await createTestTrack()
      const automation = track.createAutomationLane('gain')
      
      automation.addPoint(0, 0.0)
      automation.addPoint(500, 1.0)
      
      transport.setLoop(0, 500)
      transport.play()
      
      // Wait for loop to complete twice
      await waitMs(1200)
      
      // Should have looped back to start value
      const finalGain = track.gain
      expect(finalGain).toBeLessThan(0.5)
      
      transport.stop()
    })
  })

  describe('Visual Sync', () => {
    it('playhead position updates in real-time', async () => {
      const { page } = await setupPage()
      
      await page.click('[data-testid="play-button"]')
      
      const positions: number[] = []
      for (let i = 0; i < 60; i++) {
        const pos = await page.locator('[data-testid="playhead"]')
          .evaluate(el => parseFloat(el.style.left))
        positions.push(pos)
        await waitForFrames(1)
      }
      
      // Playhead should move right
      expect(positions[59]).toBeGreaterThan(positions[0])
      
      await page.click('[data-testid="stop-button"]')
    })
  })

  describe('MIDI Clock', () => {
    it('transport follows external MIDI clock', async () => {
      const midiClock = createMockMIDIClock(120) // 120 BPM
      
      transport.setClockSource('external')
      midiClock.start()
      
      await waitMs(500)
      
      expect(transport.isPlaying).toBe(true)
      expect(transport.position).toBeGreaterThan(0)
      
      midiClock.stop()
    })
  })
})
```

---

## E16-QA-5: Undo/Redo Tests

```typescript
describe('Undo/Redo System', () => {
  describe('Basic Operations', () => {
    it('Ctrl+Z undoes last action', async () => {
      const track = await createTestTrack()
      track.gain = 0.5
      
      await page.keyboard.press('Control+z')
      
      expect(track.gain).toBe(1.0) // Default value
    })

    it('Ctrl+Y redoes', async () => {
      const track = await createTestTrack()
      track.gain = 0.5
      
      await page.keyboard.press('Control+z')
      await page.keyboard.press('Control+y')
      
      expect(track.gain).toBe(0.5)
    })

    it('multiple undos work correctly', async () => {
      const track = await createTestTrack()
      
      track.gain = 0.8
      track.gain = 0.6
      track.gain = 0.4
      
      await page.keyboard.press('Control+z')
      expect(track.gain).toBe(0.6)
      
      await page.keyboard.press('Control+z')
      expect(track.gain).toBe(0.8)
      
      await page.keyboard.press('Control+z')
      expect(track.gain).toBe(1.0)
    })
  })

  describe('Mixer Commands', () => {
    it('undoes track add', async () => {
      const initialCount = project.tracks.length
      
      await project.addTrack()
      expect(project.tracks.length).toBe(initialCount + 1)
      
      await historyManager.undo()
      expect(project.tracks.length).toBe(initialCount)
    })

    it('undoes mute/solo', async () => {
      const track = await createTestTrack()
      
      track.mute = true
      await historyManager.undo()
      expect(track.mute).toBe(false)
      
      track.solo = true
      await historyManager.undo()
      expect(track.solo).toBe(false)
    })
  })

  describe('Automation Commands', () => {
    it('undoes point add', async () => {
      const track = await createTestTrack()
      const automation = track.createAutomationLane('gain')
      
      automation.addPoint(500, 0.5)
      expect(automation.points.length).toBe(1)
      
      await historyManager.undo()
      expect(automation.points.length).toBe(0)
    })

    it('undoes point move', async () => {
      const track = await createTestTrack()
      const automation = track.createAutomationLane('gain')
      automation.addPoint(500, 0.5)
      
      automation.movePoint(0, 1000, 0.8)
      await historyManager.undo()
      
      expect(automation.points[0].time).toBe(500)
      expect(automation.points[0].value).toBe(0.5)
    })
  })

  describe('Plugin Commands', () => {
    it('undoes plugin add', async () => {
      const track = await createTestTrack()
      
      await track.insertPlugin(await loadPlugin('gain'))
      expect(track.plugins.length).toBe(1)
      
      await historyManager.undo()
      expect(track.plugins.length).toBe(0)
    })

    it('undoes parameter change (coalesced)', async () => {
      const track = await createTestTrack()
      const gain = await loadPlugin('gain')
      track.insertPlugin(gain)
      
      // Rapid parameter changes should coalesce
      gain.setParameter('gain', 0.9)
      gain.setParameter('gain', 0.8)
      gain.setParameter('gain', 0.7)
      
      await historyManager.undo()
      
      // Should undo all rapid changes as one
      expect(gain.getParameter('gain')).toBe(1.0)
    })
  })

  describe('History Panel', () => {
    it('displays action history', async () => {
      const track = await createTestTrack()
      track.gain = 0.5
      track.pan = -0.5
      
      await page.click('[data-testid="history-panel-toggle"]')
      
      const historyItems = await page.locator('[data-testid="history-item"]').count()
      expect(historyItems).toBeGreaterThanOrEqual(2)
    })

    it('click jumps to state', async () => {
      const track = await createTestTrack()
      track.gain = 0.5
      track.gain = 0.3
      track.gain = 0.1
      
      await page.click('[data-testid="history-panel-toggle"]')
      await page.click('[data-testid="history-item"]:nth-child(2)')
      
      expect(track.gain).toBe(0.5)
    })
  })

  describe('Memory Management', () => {
    it('limits history size', async () => {
      const maxHistory = 100
      
      for (let i = 0; i < 150; i++) {
        const track = await createTestTrack()
        track.gain = Math.random()
      }
      
      expect(historyManager.length).toBeLessThanOrEqual(maxHistory)
    })
  })
})
```

---

## E16-QA-6: TypeScript Validation

```bash
# CI Test Script
#!/bin/bash

echo "Running TypeScript validation..."

# Full workspace typecheck
pnpm typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found"
  exit 1
fi

# Check for any type
grep -r "any" --include="*.ts" --include="*.vue" \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  apps/ packages/ | grep -v "// @ts-ignore" | grep -v "eslint-disable"

if [ $? -eq 0 ]; then
  echo "⚠️ 'any' types found - review required"
fi

# Type coverage
npx type-coverage --at-least 95

echo "✅ TypeScript validation complete"
```

---

## Manual Test Checklist

### E16-T1: Metering
- [ ] Peak meter shows accurate levels
- [ ] Peak hold decays over ~3 seconds
- [ ] Clip indicator latches on red
- [ ] RMS meter matches perceived loudness
- [ ] Spectrum shows frequency content
- [ ] 60fps rendering with 16 tracks

### E16-T2: Plugin Routing
- [ ] Plugin appears in track chain
- [ ] Audio processes through plugin
- [ ] Bypass is instant, no glitch
- [ ] Pre/post fader routing works
- [ ] Send effects work
- [ ] Project saves/loads with plugins

### E16-T3: WASM Integration
- [ ] WASM plugin loads in browser
- [ ] Audio quality matches non-WASM
- [ ] Parameter changes work
- [ ] Performance is acceptable
- [ ] No memory leaks

### E16-T4: Transport
- [ ] Play/pause/stop work
- [ ] Seek updates automation
- [ ] Loop points work
- [ ] Playhead moves smoothly
- [ ] MIDI clock sync (if available)

### E16-T5: Undo/Redo
- [ ] Ctrl+Z undoes
- [ ] Ctrl+Y redoes
- [ ] History panel shows actions
- [ ] Click in history jumps to state
- [ ] No state corruption

---

*E16 Integration QA — DAWW3 Sprint 3*
