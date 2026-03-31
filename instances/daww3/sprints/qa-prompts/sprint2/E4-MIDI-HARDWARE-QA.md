# 🎹 E4: MIDI & Hardware — QA Test Specifications

> **Epic:** E4 - Web MIDI API & Hardware Integration  
> **Status:** ✅ DONE
> **Focus:** MIDI Input, Device discovery, Learn mode, Audio Input

---

## Test Areas

### E4-QA-1: MIDI Input
```typescript
describe('MIDI Input', () => {
  it('requests MIDI access', async () => {
    const access = await navigator.requestMIDIAccess()
    expect(access).toBeDefined()
  })

  it('lists connected devices', async () => {
    const midi = new MidiManager()
    const devices = await midi.getInputDevices()
    
    expect(Array.isArray(devices)).toBe(true)
  })

  it('parses Note On message', () => {
    const parser = new MidiParser()
    const data = new Uint8Array([0x90, 60, 100]) // Note On, C4, velocity 100
    
    const event = parser.parse(data)
    
    expect(event.type).toBe('noteOn')
    expect(event.note).toBe(60)
    expect(event.velocity).toBe(100)
  })

  it('parses Note Off message', () => {
    const parser = new MidiParser()
    const data = new Uint8Array([0x80, 60, 0])
    
    const event = parser.parse(data)
    
    expect(event.type).toBe('noteOff')
  })

  it('parses CC message', () => {
    const parser = new MidiParser()
    const data = new Uint8Array([0xB0, 1, 64]) // CC1 (Mod wheel) = 64
    
    const event = parser.parse(data)
    
    expect(event.type).toBe('controlChange')
    expect(event.controller).toBe(1)
    expect(event.value).toBe(64)
  })
})
```

### E4-QA-2: MIDI Learn
```typescript
describe('MIDI Learn', () => {
  it('enters learn mode', () => {
    const manager = new MidiLearnManager()
    manager.startLearn('gain')
    
    expect(manager.isLearning).toBe(true)
    expect(manager.learningTarget).toBe('gain')
  })

  it('captures CC binding', () => {
    const manager = new MidiLearnManager()
    manager.startLearn('gain')
    
    // Simulate incoming CC
    manager.handleMidiEvent({ type: 'controlChange', controller: 1, value: 64 })
    
    expect(manager.getBinding('gain')).toEqual({ cc: 1 })
  })

  it('persists bindings', () => {
    const manager = new MidiLearnManager()
    manager.setBinding('gain', { cc: 1 })
    manager.save()
    
    const stored = localStorage.getItem('midi-bindings')
    expect(JSON.parse(stored!).gain).toEqual({ cc: 1 })
  })
})
```

### E4-QA-3: Audio Input
```typescript
describe('Audio Input', () => {
  it('enumerates audio devices', async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const audioInputs = devices.filter(d => d.kind === 'audioinput')
    
    expect(audioInputs.length).toBeGreaterThan(0)
  })

  it('opens audio stream', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false }
    })
    
    expect(stream.getAudioTracks().length).toBeGreaterThan(0)
    stream.getTracks().forEach(t => t.stop())
  })
})
```

---

## Manual Test Checklist

- [ ] Connect USB MIDI keyboard
- [ ] Play notes, see them visualized
- [ ] Use MIDI Learn on gain slider
- [ ] Turn MIDI CC knob, see slider move
- [ ] Connect audio interface
- [ ] Record from audio input

---

## Regression Tests

```typescript
describe('E4 Regression', () => {
  it.todo('MIDI output/thru')
  it.todo('MIDI clock sync')
  it.todo('SysEx support')
  it.todo('Multi-channel audio input')
  it.todo('Latency compensation')
})
```

---

*E4 MIDI & Hardware QA — DAWW3 Project*
