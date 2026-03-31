# 🎹 E4: Hardware & MIDI Support

> **Goal:** Studio compatibility  
> **Sprint:** 1  
> **Owner:** Frontend

---

## E4-T1: Web MIDI Integration

**Priority:** 🟠 P1 HIGH  
**Points:** 3  
**Depends on:** E2-T1

### Description
Detect and connect to MIDI devices via Web MIDI API.

### Acceptance Criteria
- [ ] MIDI devices detected
- [ ] Note On/Off events received
- [ ] CC messages received
- [ ] Device hot-plug works
- [ ] Permission handling

### Technical Requirements

```typescript
// core/midi/midi-manager.ts
export interface MIDIDevice {
  id: string
  name: string
  manufacturer: string
  type: 'input' | 'output'
  connected: boolean
}

export interface MIDIMessage {
  type: 'noteon' | 'noteoff' | 'cc' | 'pitchbend' | 'programchange'
  channel: number
  data1: number  // Note or CC number
  data2: number  // Velocity or value
  timestamp: number
}

export class MIDIManager {
  devices: MIDIDevice[]
  
  async init(): Promise<boolean>
  onMessage(callback: (msg: MIDIMessage) => void): void
  onDeviceChange(callback: (devices: MIDIDevice[]) => void): void
}
```

### MIDI Message Parsing
```typescript
function parseMIDIMessage(data: Uint8Array): MIDIMessage {
  const status = data[0]
  const channel = status & 0x0F
  const type = status >> 4
  
  switch (type) {
    case 0x9: return { type: data[2] > 0 ? 'noteon' : 'noteoff', ... }
    case 0x8: return { type: 'noteoff', ... }
    case 0xB: return { type: 'cc', ... }
    case 0xE: return { type: 'pitchbend', ... }
    case 0xC: return { type: 'programchange', ... }
  }
}
```

### Subtasks
- [ ] Check Web MIDI API support
- [ ] Request MIDI access permission
- [ ] Enumerate MIDI devices
- [ ] Parse MIDI messages
- [ ] Handle device connection/disconnection
- [ ] Create Vue composable `useMIDI`
- [ ] Add MIDI activity indicator
- [ ] Test with hardware controller

### Browser Support
| Browser | Web MIDI | Notes |
|---------|----------|-------|
| Chrome | ✅ | Full support |
| Edge | ✅ | Chromium |
| Firefox | ❌ | Requires flag |
| Safari | ❌ | Not supported |

### Definition of Done
- MIDI controller detected
- Notes trigger sounds
- CC changes parameters
- Works with multiple devices

---

## E4-T2: MIDI Learn

**Priority:** 🟡 P2 MEDIUM  
**Points:** 5  
**Depends on:** E4-T1

### Description
Assign CC messages to plugin parameters with persistence.

### Acceptance Criteria
- [ ] MIDI Learn mode activates
- [ ] Moving CC assigns automatically
- [ ] Mappings saved
- [ ] Multiple mappings per CC
- [ ] Clear mappings

### Technical Requirements

```typescript
// core/midi/midi-learn.ts
export interface MIDIMapping {
  id: string
  cc: number
  channel: number
  targetType: 'parameter' | 'transport' | 'mixer'
  targetId: string
  paramId?: string
  min?: number
  max?: number
  curve?: 'linear' | 'log' | 'exp'
}

export class MIDILearnManager {
  mappings: Map<string, MIDIMapping>
  learningTarget: string | null
  
  startLearning(targetId: string, paramId: string): void
  stopLearning(): void
  onCCReceived(cc: number, channel: number): void
  
  saveToStorage(): void
  loadFromStorage(): void
}
```

### UI Flow
```
1. User clicks "MIDI Learn" button on parameter
2. Parameter pulses/highlights
3. User moves hardware knob
4. CC is captured and assigned
5. Mapping saved to localStorage
6. Parameter now responds to CC
```

### Subtasks
- [ ] Create `MIDILearnManager` class
- [ ] Add learn mode UI state
- [ ] Capture first CC on learn
- [ ] Scale CC 0-127 to parameter range
- [ ] Add curve options (linear/log)
- [ ] Persist mappings to localStorage
- [ ] Create mapping editor UI
- [ ] Add "Clear All" function
- [ ] Test with various controllers

### Definition of Done
- User can map any CC to any parameter
- Mappings persist across sessions
- Works with multiple controllers

---

## E4-T3: Audio Input Selection

**Priority:** 🟠 P1 HIGH  
**Points:** 3  
**Depends on:** E2-T1

### Description
Select microphone or audio interface for recording/monitoring.

### Acceptance Criteria
- [ ] Audio inputs enumerated
- [ ] Input selection works
- [ ] Input level metering
- [ ] Monitoring toggle
- [ ] Latency display

### Technical Requirements

```typescript
// core/audio/audio-input.ts
export interface AudioInputDevice {
  deviceId: string
  label: string
  kind: 'audioinput'
}

export class AudioInputManager {
  devices: AudioInputDevice[]
  activeDevice: AudioInputDevice | null
  inputNode: MediaStreamAudioSourceNode | null
  monitoring: boolean
  inputLevel: number
  
  async enumerateDevices(): Promise<AudioInputDevice[]>
  async selectDevice(deviceId: string): Promise<void>
  setMonitoring(enabled: boolean): void
  getInputLevel(): number
}
```

### Subtasks
- [ ] Request microphone permission
- [ ] Enumerate audio input devices
- [ ] Create device selector UI
- [ ] Connect input to AudioContext
- [ ] Add input level meter
- [ ] Add monitoring toggle
- [ ] Handle device changes
- [ ] Show actual latency

### Monitoring Signal Flow
```
[Mic] → [MediaStream] → [GainNode] → [Destination]
                            ↓
                     (monitoring toggle)
```

### Definition of Done
- User can select any audio input
- Level meter shows input signal
- Monitoring can be toggled
- Works with USB audio interfaces

---

## Dependencies Graph

```
E2-T1 (AudioContext)
    │
    ├─────────────────────┐
    ▼                     ▼
E4-T1 (Web MIDI)    E4-T3 (Audio Input)
    │
    ▼
E4-T2 (MIDI Learn)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| No Web MIDI in Safari | High | Show warning, keyboard fallback |
| Permission denied | Medium | Clear instructions |
| Latency on monitoring | Medium | Latency compensation |
| Device hot-plug issues | Low | Polling fallback |
