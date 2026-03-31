# E12: MIDI & Audio Input Advanced Features — Agent Prompts

> **Goal:** MIDI output, clock sync, multi-channel audio, device profiles
> **Sprint:** 2
> **Owner:** Audio / Frontend
> **Source:** E4 Hardware & MIDI unresolved items

---

## E12-T1: MIDI Output Support

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI protocol engineer'
    target = implement MIDI output to external devices
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = low-latency MIDI output
    tech stack = ['Web MIDI API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement MIDI output for DAWW3 to control external hardware.
Send notes, CC, and other MIDI messages to connected devices.

{{{{ #CUSTOMER PROMT

Currently input-only. Нужно:
- MIDI output device selection
- Send Note On/Off
- Send CC messages
- Send Program Change
- Send Pitch Bend
- Scheduled output (timed messages)

}}}}

<<<<<<#RECOMMENDED TASKS

MOUT-1. MIDI Output Manager
- List available output devices
- Select output device
- Handle device connection/disconnection
- Multiple simultaneous outputs
- Default output selection

MOUT-2. Message Sending API
- sendNoteOn(channel, note, velocity)
- sendNoteOff(channel, note)
- sendCC(channel, cc, value)
- sendProgramChange(channel, program)
- sendPitchBend(channel, value)
- sendRaw(data[])

MOUT-3. Scheduled Output
- Queue messages with timestamps
- Sync with audio clock
- High-resolution timing
- Cancel scheduled messages
- Flush queue

MOUT-4. Channel Management
- Channel assignment per track
- Omni mode (all channels)
- Channel routing matrix
- Local control on/off

MOUT-5. Output Device UI
- Device selector dropdown
- Connection status indicator
- Activity LED (flashing on send)
- Test button (send note)
- Device properties display

MOUT-6. Vue Composable
- useMIDIOutput composable
- Reactive device list
- Send methods
- Connection status

🏁 Definition of Done
- External synths receive MIDI
- Notes trigger sounds
- CC controls parameters
- Timing is accurate
- Hot-plug works

>>>>>>

]]]]
```

---

## E12-T2: MIDI Clock Sync & Transport

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI sync specialist'
    target = implement MIDI clock master/slave sync
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = sample-accurate sync
    tech stack = ['Web MIDI API', 'Web Audio API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement MIDI clock sync for DAWW3.
Act as master or slave, sync tempo with external gear.

{{{{ #CUSTOMER PROMT

MIDI clock sync не реализован. Нужно:
- MIDI Clock master (send clock)
- MIDI Clock slave (receive clock)
- Transport controls (Start, Stop, Continue)
- Song Position Pointer
- Tempo detection from external clock

}}}}

<<<<<<#RECOMMENDED TASKS

SYNC-1. MIDI Clock Generator (Master)
- Generate 24 PPQ clock messages
- Sync with internal tempo
- High-precision timing
- Start/Stop/Continue messages
- Song Position Pointer

SYNC-2. MIDI Clock Receiver (Slave)
- Parse incoming clock messages
- Calculate tempo from clock
- Smoothing/averaging
- Jitter compensation
- Handle Start/Stop/Continue

SYNC-3. Transport Integration
- Play sends MIDI Start
- Stop sends MIDI Stop
- Pause sends MIDI Stop
- Resume sends MIDI Continue
- Bidirectional (follow external)

SYNC-4. Song Position Pointer
- Send SPP on seek
- Receive SPP and seek
- Bar/beat calculation
- Handle loop points

SYNC-5. Sync Mode UI
- Master/Slave/Off selector
- Input device for slave
- Output device for master
- Tempo display (incoming vs internal)
- Sync status indicator

SYNC-6. Latency Compensation
- Measure MIDI roundtrip
- Compensate output timing
- Per-device calibration
- Automatic compensation option

🏁 Definition of Done
- DAW acts as master, hardware follows
- DAW acts as slave, follows hardware
- Transport syncs correctly
- Tempo accurate within 0.1 BPM
- Jitter < 1ms

>>>>>>

]]]]
```

---

## E12-T3: Audio Input Hot-Plug & Device Settings

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio device engineer'
    target = handle audio input device changes and settings
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = seamless device switching
    tech stack = ['Web Audio API', 'MediaDevices API', 'Vue 3']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement audio input device hot-plug detection and per-device settings.
Handle device changes gracefully without audio interruption.

{{{{ #CUSTOMER PROMT

Audio input hot-plug не обрабатывается. Нужно:
- Detect device connection/disconnection
- Switch input seamlessly
- Per-device settings (gain, phase)
- Remember preferred device
- Auto-select fallback

}}}}

<<<<<<#RECOMMENDED TASKS

AUDIO-HP-1. Device Change Detection
- Listen to devicechange event
- Enumerate devices on change
- Detect new devices
- Detect removed devices
- Update device list reactively

AUDIO-HP-2. Seamless Device Switching
- Switch without stopping audio
- Crossfade between devices
- Handle sample rate changes
- Maintain monitoring state
- Error recovery

AUDIO-HP-3. Per-Device Settings
- Input gain trim
- Phase invert option
- High-pass filter (rumble)
- Sample rate preference
- Buffer size preference

AUDIO-HP-4. Device Memory
- Remember last used device
- Device ID persistence
- Fallback device selection
- Auto-select on reconnect
- Device profiles

AUDIO-HP-5. Device Settings UI
- Device selector with status
- Gain trim slider
- Phase invert toggle
- Sample rate display
- Buffer size recommendation

AUDIO-HP-6. Error Handling
- Handle permission denial
- Handle device in use
- Handle device failure
- User-friendly messages
- Retry mechanisms

🏁 Definition of Done
- Devices detected on connect
- Switching is seamless
- Settings persist per device
- Preferred device auto-selected
- Errors handled gracefully

>>>>>>

]]]]
```

---

## E12-T4: Multi-Channel Audio Input

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class multi-channel audio engineer'
    target = support multi-channel audio interfaces
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = efficient multi-channel routing
    tech stack = ['Web Audio API', 'MediaDevices API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement multi-channel audio input for DAWW3.
Support interfaces with more than 2 channels.

{{{{ #CUSTOMER PROMT

Multi-channel audio input не поддерживается. Нужно:
- Detect channel count capabilities
- Select specific input channels
- Route channels to tracks
- Channel naming
- Level metering per channel

}}}}

<<<<<<#RECOMMENDED TASKS

MULTI-1. Channel Capability Detection
- Query deviceInfo for channels
- MediaStreamConstraints for channelCount
- Handle mono/stereo/multi
- Display available channels
- Constraint negotiation

MULTI-2. Channel Selection
- Select input channels per track
- Mono from any channel
- Stereo pairs
- Custom routing matrix
- Channel labels

MULTI-3. Channel Splitter/Merger
- ChannelSplitterNode usage
- ChannelMergerNode usage
- Routing to different tracks
- Efficient node graph
- Dynamic reconfiguration

MULTI-4. Channel Naming
- Default names (Input 1, 2...)
- Custom names per device
- Interface name integration
- Save with device profile

MULTI-5. Multi-Channel Metering
- Per-channel level meters
- Peak hold
- RMS display
- Clip indicators
- Overview mode

MULTI-6. Input Routing UI
- Channel grid/matrix
- Track input selector
- Visual routing diagram
- Metering integration

🏁 Definition of Done
- 8+ channel interfaces work
- Any channel routable to track
- Metering shows all channels
- Channel names persistent
- No crosstalk or routing errors

>>>>>>

]]]]
```

---

## E12-T5: MIDI SysEx & Device Profiles

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI system exclusive specialist'
    target = implement SysEx support and device profiles
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = efficient SysEx handling
    tech stack = ['Web MIDI API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement MIDI SysEx message support and device-specific profiles.
Enable deep integration with specific hardware.

{{{{ #CUSTOMER PROMT

MIDI SysEx не поддерживается. Нужно:
- Send/receive SysEx messages
- Device identification
- Patch dump/load
- Device-specific profiles
- Custom control definitions

}}}}

<<<<<<#RECOMMENDED TASKS

SYSEX-1. SysEx Message Handling
- Request sysex permission
- Parse SysEx messages
- Validate structure (F0...F7)
- Manufacturer ID detection
- Message type identification

SYSEX-2. Send SysEx
- Build SysEx messages
- Checksums (Roland, Yamaha)
- Bulk transfer handling
- Progress indication
- Error handling

SYSEX-3. Device Identification
- Universal Device Inquiry
- Parse Identity Reply
- Manufacturer database
- Model detection
- Firmware version

SYSEX-4. Device Profiles
- JSON profile format
- CC definitions (names, ranges)
- SysEx templates
- Parameter pages
- Device image

SYSEX-5. Profile Library
- Built-in profiles (popular devices)
- Community profiles (import)
- Create custom profile
- Profile editor UI
- Export profiles

SYSEX-6. Patch Management
- Request patch dump
- Send patch to device
- Librarian UI
- Patch naming
- Bulk transfer

🏁 Definition of Done
- SysEx permission requested
- Messages send/receive correctly
- Devices auto-identified
- Profiles enhance control
- Patch transfer works

>>>>>>

]]]]
```

---

## E12-T6: Real-Time Latency Monitoring

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class real-time audio latency specialist'
    target = implement accurate MIDI and audio latency monitoring
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = sub-millisecond measurement accuracy
    tech stack = ['Web Audio API', 'Web MIDI API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement real-time latency monitoring for MIDI and audio.
Show users actual roundtrip latency.

{{{{ #CUSTOMER PROMT

Real-time latency monitoring отсутствует. Нужно:
- Audio input→output latency
- MIDI input→audio output latency
- MIDI roundtrip measurement
- Historical graphs
- Latency optimization tips

}}}}

<<<<<<#RECOMMENDED TASKS

LATMON-1. Audio Roundtrip Measurement
- Loopback detection
- Impulse injection
- Cross-correlation
- Calculate total latency
- Separate input/output/processing

LATMON-2. MIDI-to-Audio Latency
- Measure MIDI note to audio
- Account for software processing
- MIDI device latency
- AudioContext latency
- Total MIDI triggering latency

LATMON-3. MIDI Roundtrip
- Send test message
- Measure return time
- Per-device measurement
- Jitter calculation
- Running average

LATMON-4. Latency Dashboard
- Current latency display
- Min/max/average
- Historical graph
- Per-component breakdown
- Jitter visualization

LATMON-5. Optimization Tips
- Suggest buffer size changes
- Recommend driver settings
- Compare to optimal
- Performance score
- Platform-specific tips

LATMON-6. Calibration Wizard
- Step-by-step measurement
- Hardware loopback guide
- Auto-compensation setup
- Save calibration
- Device-specific profiles

🏁 Definition of Done
- Latency measured accurately
- Breakdown by component
- Graph shows history
- Tips improve performance
- Calibration saves

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E4 (MIDI & Hardware) ✅
    │
    ├────────────────────────────────┬─────────────────────┐
    ▼                                ▼                     ▼
E12-T1 (MIDI Output)           E12-T3 (Audio Hot-Plug)  E12-T5 (SysEx)
    │                                │                     │
    ▼                                ▼                     │
E12-T2 (Clock Sync)            E12-T4 (Multi-Channel)    │
    │                                │                     │
    └────────────────┬───────────────┘                     │
                     ▼                                     │
              E12-T6 (Latency Monitoring) ◀────────────────┘
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| MIDI output browser support | Medium | Feature detection, clear messaging |
| SysEx permission UX | Low | Clear explanation dialog |
| Multi-channel browser limitations | High | Document supported interfaces |
| Latency measurement accuracy | Medium | Statistical smoothing |
