# E4: Hardware & MIDI Support — Agent Prompts

---

## E4-T1: Web MIDI Integration

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI systems engineer'
    target = Web MIDI API integration for device detection and events
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = low latency MIDI events
    tech stack = ['Web MIDI API', 'vue@3.4', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement Web MIDI API integration for DAWW3.
Detect devices, receive note/CC events, handle hot-plug.

{{{{ #CUSTOMER PROMT

Нужна интеграция Web MIDI:
- Обнаружение MIDI устройств
- Note On/Off события
- CC сообщения
- Hot-plug поддержка

}}}}

<<<<<<#RECOMMENDED TASKS

MIDI-1. MIDIManager Class
File: apps/web/src/core/midi/midi-manager.ts

interface MIDIDevice {
  id: string
  name: string
  manufacturer: string
  type: 'input' | 'output'
  connected: boolean
}

interface MIDIMessage {
  type: 'noteon' | 'noteoff' | 'cc' | 'pitchbend'
  channel: number
  data1: number
  data2: number
  timestamp: number
}

class MIDIManager {
  devices: MIDIDevice[]
  
  async init(): Promise<boolean>
  onMessage(callback: (msg: MIDIMessage) => void)
  onDeviceChange(callback: (devices: MIDIDevice[]) => void)
}

MIDI-2. Permission Handling
- Request MIDI access
- Handle permission denied
- Show user-friendly message

MIDI-3. Message Parsing
- Parse status byte
- Extract channel
- Identify message type
- Handle running status

MIDI-4. Device Enumeration
- List all inputs and outputs
- Update on connect/disconnect
- Store device info

MIDI-5. Vue Composable
File: apps/web/src/composables/useMIDI.ts

Returns:
- devices: Ref<MIDIDevice[]>
- isSupported: boolean
- hasPermission: Ref<boolean>
- onNote(callback): void
- onCC(callback): void
- requestPermission(): Promise<boolean>

MIDI-6. MIDI Activity Indicator
- Visual feedback for MIDI input
- Flash on note/CC
- Show last event

MIDI-7. Browser Compatibility
- Check for Web MIDI support
- Graceful fallback message
- Test Chrome, Edge

🏁 Definition of Done
- MIDI devices detected
- Notes received with velocity
- CC messages parsed
- Hot-plug works
- Works in supported browsers

>>>>>>

]]]]
```

---

## E4-T2: MIDI Learn

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI mapping specialist'
    target = assign CC messages to parameters with persistence
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    tech stack = ['vue@3.4', 'typescript', 'localStorage']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement MIDI Learn functionality.
User clicks parameter, moves hardware knob, mapping created.

{{{{ #CUSTOMER PROMT

Нужен MIDI Learn:
- Клик на параметр активирует learn mode
- Движение CC автоматически привязывает
- Маппинги сохраняются
- Можно очистить

}}}}

<<<<<<#RECOMMENDED TASKS

LRN-1. MIDIMapping Interface
interface MIDIMapping {
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

LRN-2. MIDILearnManager Class
File: apps/web/src/core/midi/midi-learn.ts

- mappings: Map<string, MIDIMapping>
- learningTarget: string | null
- startLearning(targetId, paramId): void
- stopLearning(): void
- onCCReceived(cc, channel): void
- applyCC(cc, channel, value): void
- saveToStorage(): void
- loadFromStorage(): void

LRN-3. Learn Mode UI State
- isLearning: Ref<boolean>
- learningTarget: Ref<string | null>
- Visual indicator on learning parameter

LRN-4. CC to Parameter Scaling
- Map 0-127 to parameter range
- Support curves (linear, log, exp)
- Invert option

LRN-5. Vue Composable
File: apps/web/src/composables/useMIDILearn.ts

Returns:
- isLearning: Ref<boolean>
- mappings: Ref<MIDIMapping[]>
- startLearning(targetId, paramId): void
- cancelLearning(): void
- removeMapping(id): void
- clearAllMappings(): void

LRN-6. Mapping Editor UI
File: apps/web/src/components/midi/MappingEditor.vue

- List all mappings
- Edit min/max/curve
- Delete mapping
- Clear all button

LRN-7. Persistence
- Save to localStorage
- Restore on load
- Export/import JSON

🏁 Definition of Done
- User can map any CC to any parameter
- Mappings apply in real-time
- Settings persist
- Can clear mappings

>>>>>>

]]]]
```

---

## E4-T3: Audio Input Selection

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio I/O engineer'
    target = microphone/interface selection with monitoring
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = low latency monitoring
    tech stack = ['getUserMedia', 'vue@3.4', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement audio input device selection and monitoring.
List devices, select input, level metering, monitoring toggle.

{{{{ #CUSTOMER PROMT

Нужен выбор аудио входа:
- Список микрофонов/интерфейсов
- Выбор устройства
- Индикатор уровня
- Мониторинг вкл/выкл

}}}}

<<<<<<#RECOMMENDED TASKS

AIN-1. AudioInputManager Class
File: apps/web/src/core/audio/audio-input.ts

interface AudioInputDevice {
  deviceId: string
  label: string
  kind: 'audioinput'
}

class AudioInputManager {
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

AIN-2. Permission Request
- Request microphone permission
- Handle denial gracefully
- Re-enumerate after permission

AIN-3. Device Enumeration
- List audio input devices
- Filter by kind: 'audioinput'
- Update on device change

AIN-4. MediaStream Handling
- Create MediaStreamAudioSourceNode
- Connect to AudioContext
- Cleanup on device change

AIN-5. Level Metering
- AnalyserNode for input
- Calculate RMS or peak
- Update at 30-60fps

AIN-6. Monitoring Toggle
- Connect/disconnect from destination
- Visual feedback
- Warning about feedback

AIN-7. Vue Composable
File: apps/web/src/composables/useAudioInput.ts

Returns:
- devices: Ref<AudioInputDevice[]>
- activeDevice: Ref<AudioInputDevice | null>
- inputLevel: Ref<number>
- monitoring: Ref<boolean>
- selectDevice(id): Promise<void>
- toggleMonitoring(): void

AIN-8. Input Selector UI
File: apps/web/src/components/audio/InputSelector.vue

- Dropdown for device selection
- Level meter
- Monitoring toggle button
- Permission request button

🏁 Definition of Done
- All audio inputs listed
- Can select any device
- Level meter shows signal
- Monitoring works
- No feedback when monitoring

>>>>>>

]]]]
```
