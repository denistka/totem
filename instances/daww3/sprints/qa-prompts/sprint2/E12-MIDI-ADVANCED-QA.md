# 🎛️ E12: Advanced MIDI — QA Test Specifications

> **Epic:** E12 - Advanced MIDI Features
> **Status:** ✅ DONE
> **Focus:** MIDI Output, Clock sync, Multi-channel, SysEx

---

## Test Areas

### E12-QA-1: MIDI Output
```typescript
describe('MIDI Output', () => {
  let midiManager: MidiManager

  beforeEach(async () => {
    midiManager = new MidiManager()
    await midiManager.init()
  })

  it('lists output devices', async () => {
    const outputs = midiManager.getOutputDevices()
    expect(Array.isArray(outputs)).toBe(true)
  })

  it('sends Note On', async () => {
    const output = midiManager.getOutput('device-1')
    const spy = vi.spyOn(output, 'send')
    
    midiManager.sendNoteOn('device-1', 60, 100, 1)
    
    expect(spy).toHaveBeenCalledWith([0x90, 60, 100])
  })

  it('sends Note Off', async () => {
    const output = midiManager.getOutput('device-1')
    const spy = vi.spyOn(output, 'send')
    
    midiManager.sendNoteOff('device-1', 60, 1)
    
    expect(spy).toHaveBeenCalledWith([0x80, 60, 0])
  })

  it('sends CC', async () => {
    const output = midiManager.getOutput('device-1')
    const spy = vi.spyOn(output, 'send')
    
    midiManager.sendCC('device-1', 1, 64, 1)
    
    expect(spy).toHaveBeenCalledWith([0xB0, 1, 64])
  })
})
```

### E12-QA-2: MIDI Clock
```typescript
describe('MIDI Clock', () => {
  let clock: MidiClock

  beforeEach(() => {
    clock = new MidiClock()
  })

  it('generates clock at correct BPM', () => {
    clock.setBPM(120)
    
    const pulses: number[] = []
    clock.onPulse(() => pulses.push(Date.now()))
    
    clock.start()
    
    // Wait for several pulses
    await new Promise(r => setTimeout(r, 500))
    
    clock.stop()
    
    // 120 BPM = 24 PPQN = 48 pulses/sec
    expect(pulses.length).toBeGreaterThan(20)
  })

  it('jitter < 1ms', () => {
    clock.setBPM(120)
    
    const intervals: number[] = []
    let lastPulse = 0
    
    clock.onPulse(() => {
      const now = performance.now()
      if (lastPulse) intervals.push(now - lastPulse)
      lastPulse = now
    })
    
    clock.start()
    await new Promise(r => setTimeout(r, 1000))
    clock.stop()
    
    const expectedInterval = 60000 / 120 / 24 // ~20.8ms
    const deviations = intervals.map(i => Math.abs(i - expectedInterval))
    const maxDeviation = Math.max(...deviations)
    
    expect(maxDeviation).toBeLessThan(1)
  })

  it('sends Start/Stop/Continue messages', () => {
    const messages: number[] = []
    clock.onMessage((msg) => messages.push(msg))
    
    clock.start()
    expect(messages).toContain(0xFA) // Start
    
    clock.stop()
    expect(messages).toContain(0xFC) // Stop
    
    clock.continue()
    expect(messages).toContain(0xFB) // Continue
  })
})
```

### E12-QA-3: Multi-Channel Audio
```typescript
describe('Multi-Channel Audio Input', () => {
  it('detects multi-channel interface', async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const interfaces = devices.filter(d => 
      d.kind === 'audioinput' && d.label.includes('Multi')
    )
    
    // This test needs actual hardware
    console.log('Multi-channel interfaces:', interfaces)
  })

  it('opens stream with channel constraints', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: { ideal: 4 }
      }
    })
    
    const track = stream.getAudioTracks()[0]
    const settings = track.getSettings()
    
    console.log('Opened channels:', settings.channelCount)
    
    stream.getTracks().forEach(t => t.stop())
  })

  it('routes channels independently', () => {
    const router = new ChannelRouter(4) // 4 inputs
    
    router.route(0, 'track-1') // Input 1 to Track 1
    router.route(1, 'track-2') // Input 2 to Track 2
    router.route([2, 3], 'track-3') // Inputs 3-4 to Track 3 (stereo)
    
    expect(router.getRouting('track-1')).toEqual([0])
    expect(router.getRouting('track-3')).toEqual([2, 3])
  })
})
```

### E12-QA-4: SysEx Messages
```typescript
describe('SysEx Support', () => {
  it('requests SysEx permission', async () => {
    const access = await navigator.requestMIDIAccess({ sysex: true })
    expect(access.sysexEnabled).toBe(true)
  })

  it('sends SysEx message', () => {
    const output = midiManager.getOutput('device-1')
    const spy = vi.spyOn(output, 'send')
    
    // Universal SysEx identity request
    midiManager.sendSysEx('device-1', [0xF0, 0x7E, 0x7F, 0x06, 0x01, 0xF7])
    
    expect(spy).toHaveBeenCalledWith(
      expect.arrayContaining([0xF0, 0x7E, 0x7F, 0x06, 0x01, 0xF7])
    )
  })

  it('receives SysEx response', (done) => {
    midiManager.onSysEx((data) => {
      expect(data[0]).toBe(0xF0) // Start
      expect(data[data.length - 1]).toBe(0xF7) // End
      done()
    })
    
    // Trigger response (device-specific)
    midiManager.sendSysEx('device-1', [0xF0, 0x7E, 0x7F, 0x06, 0x01, 0xF7])
  })
})
```

---

## Manual Test Checklist

- [ ] Connect MIDI keyboard, play into DAW
- [ ] Connect external synth, trigger notes from DAW
- [ ] Enable MIDI clock sync with external gear
- [ ] Test multi-channel audio interface (if available)
- [ ] Send/receive SysEx with compatible device

---

## Regression Tests

```typescript
describe('E12 Regression', () => {
  it.todo('MIDI over Bluetooth LE')
  it.todo('MPE (MIDI Polyphonic Expression)')
  it.todo('MIDI 2.0 protocol')
  it.todo('Virtual MIDI ports')
  it.todo('Clock tempo tap detection')
})
```

---

*E12 Advanced MIDI QA — DAWW3 Project*
