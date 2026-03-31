# E17: Audio Production Features — Agent Prompts

> **Goal:** Real DAW capabilities: record, export, MIDI files
> **Sprint:** 3
> **Owner:** Audio / Frontend
> **Source:** E2, E5, E6, E12 "Problems/Not Implemented"

---

## E17-T1: Audio Recording & Bounce

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio recording engineer'
    target = implement audio recording from input and track bounce
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = low-latency recording, gapless
    tech stack = ['Web Audio API', 'MediaRecorder', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement audio recording for DAWW3.
Record from audio input and bounce tracks to audio files.

{{{{ #CUSTOMER PROMT

Audio recording/bounce не реализован. Нужно:
- Record audio input to track
- Bounce track (with effects) to audio file
- Bounce selection/region
- Punch in/out recording
- Monitor while recording
- Format selection (WAV, MP3)

}}}}

<<<<<<#RECOMMENDED TASKS

REC-1. Recording Engine
- Connect MediaStreamAudioSourceNode
- ScriptProcessorNode or MediaRecorder
- Buffer accumulation
- Sample-accurate start/stop
- Latency compensation

REC-2. Track Recording
- Arm track for recording
- Record indicator
- Waveform display during recording
- Take management (multiple takes)
- Input monitoring toggle

REC-3. Punch Recording
- Punch in/out points
- Pre-roll/post-roll
- Seamless splice
- Crossfade at punch points
- Undo punch

REC-4. Bounce/Render
- Render track to audio file
- Include effects processing
- Selection/region bounce
- Progress indication
- Cancel mid-bounce

REC-5. Format Options
- WAV (16/24/32 bit)
- MP3 (using lamejs or backend)
- FLAC (optional)
- Sample rate selection
- Bit depth selection

REC-6. Storage Integration
- Save to IndexedDB temporarily
- Upload to MinIO
- Link to track entity
- Automatic cleanup
- Resume interrupted upload

🏁 Definition of Done
- Audio records from input
- Bounce produces playable file
- Punch recording works
- Multiple formats supported
- Files upload to storage

>>>>>>

]]]]
```

---

## E17-T2: Offline Rendering for Export

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio rendering engineer'
    target = implement offline audio context rendering for export
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = faster than real-time rendering
    tech stack = ['OfflineAudioContext', 'Web Audio API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement offline audio rendering for project export.
Render full mix faster than real-time.

{{{{ #CUSTOMER PROMT

Offline rendering для export не реализован. Нужно:
- OfflineAudioContext для render
- Rebuild audio graph in offline context
- Faster than real-time rendering
- Progress indication
- Memory management for long projects

}}}}

<<<<<<#RECOMMENDED TASKS

OFFLINE-1. Offline Context Setup
- Create OfflineAudioContext
- Match project sample rate
- Calculate buffer length
- Handle long durations
- Memory allocation

OFFLINE-2. Graph Reconstruction
- Clone audio graph to offline context
- Transfer plugin state
- Automation data to offline
- Source scheduling
- Node connections

OFFLINE-3. Render Execution
- Start rendering
- Progress callbacks
- Handle render completion
- Error handling
- Timeout protection

OFFLINE-4. Result Processing
- Get rendered AudioBuffer
- Convert to desired format
- Encode to WAV/MP3
- Chunked processing for large files
- Memory cleanup

OFFLINE-5. Progress UI
- Progress bar component
- Time remaining estimate
- Cancel button
- Phase indication (rendering, encoding)
- Completion notification

OFFLINE-6. Quality Options
- Sample rate (44.1k, 48k, 96k)
- Bit depth (16, 24, 32 float)
- Dithering option
- Normalization option
- Limiter on export

🏁 Definition of Done
- Full project renders offline
- Faster than real-time
- Progress shows accurately
- Multiple quality options
- Memory stable for long projects

>>>>>>

]]]]
```

---

## E17-T3: Multi-format Export (WAV/MP3)

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio codec engineer'
    target = implement multi-format audio export with encoding
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast encoding, good quality
    tech stack = ['lamejs', 'Web Workers', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement multi-format audio export for DAWW3.
Support WAV, MP3, and potentially FLAC encoding.

{{{{ #CUSTOMER PROMT

Export (MIDI, WAV, MP3) не реализован. Нужно:
- WAV export (PCM encoding)
- MP3 export (lamejs или backend)
- Worker thread для encoding
- Quality/bitrate options
- Metadata embedding

}}}}

<<<<<<#RECOMMENDED TASKS

EXPORT-1. WAV Encoder
- PCM encoding (16/24/32 bit)
- WAV header generation
- Chunked writing for large files
- Sample rate handling
- Stereo/mono support

EXPORT-2. MP3 Encoder
- lamejs integration
- VBR/CBR options
- Bitrate selection (128-320 kbps)
- Web Worker encoding
- Progress reporting

EXPORT-3. Worker Threading
- Encoding in Web Worker
- Message passing for progress
- Chunked processing
- Memory management
- Cancelation support

EXPORT-4. Metadata Embedding
- ID3 tags for MP3
- WAV metadata chunks
- Title, artist, album
- Cover art embedding
- Custom tags

EXPORT-5. Export Dialog UI
- Format selector
- Quality options per format
- Metadata editor
- File name template
- Destination selection

EXPORT-6. Backend Integration
- Upload exported file
- Generate public URL
- CDN distribution
- Track entity update
- Sharing options

🏁 Definition of Done
- WAV export works correctly
- MP3 encodes with good quality
- Encoding doesn't block UI
- Metadata saved in files
- Files downloadable/uploadable

>>>>>>

]]]]
```

---

## E17-T4: MIDI File Import/Export

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI file specialist'
    target = implement MIDI file import and export
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast parsing, accurate timing
    tech stack = ['TypeScript', 'Web MIDI', 'Tone.js']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement MIDI file (.mid) import and export for DAWW3.
Parse Standard MIDI Files and create from project.

{{{{ #CUSTOMER PROMT

MIDI file import/export не реализован. Нужно:
- Parse .mid files
- Create MIDI tracks from file
- Export project MIDI to .mid
- Tempo map support
- Time signature support

}}}}

<<<<<<#RECOMMENDED TASKS

MIDI-FILE-1. MIDI File Parser
- Standard MIDI File format 0/1/2
- Header chunk parsing
- Track chunk parsing
- Variable-length quantities
- Running status handling

MIDI-FILE-2. Event Parsing
- Note on/off events
- Control change events
- Program change
- Pitch bend
- Meta events (tempo, time sig)

MIDI-FILE-3. Track Creation from Import
- Create track per MIDI track
- Note to region/clip
- CC to automation lane
- Tempo track extraction
- Channel mapping

MIDI-FILE-4. MIDI Export
- Build MIDI file from tracks
- Note events from regions
- CC from automation
- Tempo map inclusion
- Format 1 output

MIDI-FILE-5. Import Dialog UI
- File picker
- Track mapping options
- Tempo handling
- Merge/replace option
- Preview before import

MIDI-FILE-6. Export Dialog UI
- Track selection
- Format options
- Tempo inclusion
- Range selection
- File naming

🏁 Definition of Done
- .mid files import correctly
- Tempo and notes preserved
- Export creates valid .mid
- Round-trip preserves data
- UI guides user through process

>>>>>>

]]]]
```

---

## E17-T5: MIDI Recording

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class MIDI recording engineer'
    target = implement MIDI recording from external devices
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = low-latency, sample-accurate
    tech stack = ['Web MIDI API', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement MIDI recording for DAWW3.
Record notes and CC from MIDI input to track.

{{{{ #CUSTOMER PROMT

MIDI recording functionality отсутствует. Нужно:
- Record MIDI notes from input
- Record CC messages
- Quantize option
- Overdub recording
- Take management
- Visual feedback during recording

}}}}

<<<<<<#RECOMMENDED TASKS

MIDI-REC-1. MIDI Event Capture
- Timestamp MIDI events
- Correlate with transport position
- Note on/off pairing
- CC value capture
- Velocity capture

MIDI-REC-2. Recording Engine
- Start/stop with transport
- Pre-roll/count-in option
- Loop recording (overdub)
- Punch recording
- Latency compensation

MIDI-REC-3. Quantization
- Quantize on input (optional)
- Quantize strengths (25%, 50%, 100%)
- Grid values (1/4, 1/8, 1/16, triplets)
- Swing option
- Non-destructive quantize

MIDI-REC-4. Visual Feedback
- Notes appear as recorded
- Waveform-style note display
- Velocity coloring
- Real-time update
- Recorded region highlight

MIDI-REC-5. Take Management
- Multiple takes (layers)
- Comp takes together
- Take lanes view
- Mute/solo takes
- Flatten to single take

MIDI-REC-6. Undo Integration
- Recording creates undo point
- Undo last recording
- Undo quantize
- Redo support
- History navigation

🏁 Definition of Done
- MIDI records from device
- Timing accurate to < 1ms
- Quantize works correctly
- Takes manageable
- Undo works for recording

>>>>>>

]]]]
```

---

## E17-T6: Audio Codec Transcoding

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class audio transcoding engineer'
    target = implement server-side audio transcoding for P2P
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast transcoding, parallel processing
    tech stack = ['ffmpeg', 'NestJS', 'BullMQ', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement audio codec transcoding service for DAWW3.
Convert uploads to multiple quality levels for streaming.

{{{{ #CUSTOMER PROMT

Audio codec transcoding (Opus/AAC) не реализован. Нужно:
- Transcode uploads to streaming formats
- Multiple quality levels (64k, 128k, 256k, 320k)
- Opus and AAC output
- Background job processing
- Progress tracking

}}}}

<<<<<<#RECOMMENDED TASKS

TRANSCODE-1. ffmpeg Integration
- ffmpeg binary in Docker
- Spawn process from Node
- Input format detection
- Output format configuration
- Error handling

TRANSCODE-2. Quality Presets
- Low: 64kbps Opus
- Medium: 128kbps Opus
- High: 256kbps Opus
- Ultra: 320kbps AAC
- Lossless: FLAC

TRANSCODE-3. BullMQ Job Processor
- Transcoding job queue
- Priority levels
- Retry on failure
- Progress reporting
- Result storage

TRANSCODE-4. Chunked Output
- Split into streaming chunks
- Consistent chunk duration
- Chunk naming convention
- Manifest generation
- Chunk encryption (optional)

TRANSCODE-5. Storage Integration
- Upload chunks to MinIO
- Generate presigned URLs
- Cleanup source after transcode
- Cache management
- Bandwidth optimization

TRANSCODE-6. API Endpoints
- POST /tracks/:id/transcode
- GET /tracks/:id/transcode/status
- GET /tracks/:id/qualities
- Webhook on completion
- Cancel transcoding

🏁 Definition of Done
- Uploads automatically transcode
- All quality levels generated
- Chunks ready for P2P
- Progress trackable
- Fast turnaround (< 2x real-time)

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E16 (Full Integration) ✅
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
E17-T1 (Recording)   E17-T4 (MIDI Import) E17-T6 (Transcoding)
    │                     │                     │
    ▼                     ▼                     │
E17-T2 (Offline)     E17-T5 (MIDI Record)      │
    │                                           │
    ▼                                           │
E17-T3 (Export Formats)                         │
    │                                           │
    └───────────────────────────────────────────┘
                        │
                        ▼
              [Audio Production Complete]
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Recording latency | High | Latency compensation, presets |
| Large file memory | High | Chunked processing, Web Workers |
| MIDI timing accuracy | Medium | High-resolution timestamps |
| Transcoding queue backup | Medium | Parallel processing, limits |
