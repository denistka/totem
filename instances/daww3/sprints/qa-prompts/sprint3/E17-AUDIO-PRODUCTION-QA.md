# 🎙️ E17: Audio Production — QA Test Specifications

> **Epic:** E17 - Audio Production Features
> **Priority:** 🟠 HIGH
> **Focus:** Recording, Export, MIDI Files, Transcoding

---

## QA Agent Prompt

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive audio production tests
    expertize = 'you are world class audio production QA engineer'
    target = validate recording, export, MIDI file handling
    test = true

    code style = [TDD, Audio quality testing]
    write docs = true
    deep thinking = true
    performance = low-latency recording, fast export
    tech stack = ['Vitest', 'Playwright', 'Web Audio API', 'ffmpeg']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for E17 Audio Production features.
Validate recording, offline rendering, export, MIDI files.

{{{{ #CUSTOMER PROMT

Нужны QA тесты для audio production:
- E17-T1: Audio recording & bounce
- E17-T2: Offline rendering для export
- E17-T3: Multi-format export (WAV/MP3)
- E17-T4: MIDI file import/export
- E17-T5: MIDI recording
- E17-T6: Audio codec transcoding

}}}}

<<<<<<#RECOMMENDED TASKS

E17-QA-1. Recording Tests
E17-QA-2. Offline Rendering Tests
E17-QA-3. Export Format Tests
E17-QA-4. MIDI File Tests
E17-QA-5. MIDI Recording Tests
E17-QA-6. Transcoding Tests

>>>>>>

]]]]
```

---

## E17-QA-1: Audio Recording Tests

```typescript
describe('Audio Recording', () => {
  describe('Basic Recording', () => {
    it('records audio from input', async () => {
      const track = await createTestTrack()
      const mockInput = createMockAudioInput(440, 0.5) // 440Hz, 50%
      
      track.setInput(mockInput)
      track.arm()
      
      transport.record()
      await waitMs(2000) // Record 2 seconds
      transport.stop()
      
      expect(track.hasRecording()).toBe(true)
      expect(track.recording.duration).toBeCloseTo(2, 0.1)
    })

    it('waveform displays during recording', async () => {
      const track = await createTestTrack()
      track.setInput(createMockAudioInput())
      track.arm()
      
      transport.record()
      await waitMs(500)
      
      const waveformData = track.getRecordingWaveform()
      expect(waveformData.length).toBeGreaterThan(0)
      
      transport.stop()
    })

    it('monitors input while recording', async () => {
      const track = await createTestTrack()
      track.setInput(createMockAudioInput(440, 0.5))
      track.arm()
      track.inputMonitor = true
      
      await waitMs(100)
      
      // Check audio reaches output
      const outputLevel = masterBus.meter.getPeak()
      expect(outputLevel).toBeGreaterThan(-20)
    })
  })

  describe('Punch Recording', () => {
    it('punch in/out at specified points', async () => {
      const track = await createTestTrack()
      await track.loadAudio(testAudioBuffer) // Pre-existing audio
      
      track.setInput(createMockAudioInput(880, 0.5)) // Different freq
      track.arm()
      
      transport.setPunchIn(1000)
      transport.setPunchOut(2000)
      
      transport.play()
      await waitMs(3000)
      transport.stop()
      
      // Check splice at punch points
      const audioData = track.getAudioData()
      const prePunch = analyzeFrequency(audioData, 500)
      const duringPunch = analyzeFrequency(audioData, 1500)
      const postPunch = analyzeFrequency(audioData, 2500)
      
      expect(prePunch.dominantFreq).not.toBe(880)
      expect(duringPunch.dominantFreq).toBeCloseTo(880, 50)
      expect(postPunch.dominantFreq).not.toBe(880)
    })

    it('crossfades at punch points', async () => {
      const track = await createTestTrack()
      await track.loadAudio(testAudioBuffer)
      track.setInput(createMockAudioInput())
      track.arm()
      
      transport.setPunchIn(1000)
      transport.setPunchOut(2000)
      
      transport.play()
      await waitMs(3000)
      transport.stop()
      
      // Check for clicks at punch points
      const audioData = track.getAudioData()
      const clicksAtPunchIn = detectClicks(audioData, 1000, 50)
      const clicksAtPunchOut = detectClicks(audioData, 2000, 50)
      
      expect(clicksAtPunchIn).toBe(false)
      expect(clicksAtPunchOut).toBe(false)
    })
  })

  describe('Take Management', () => {
    it('creates multiple takes', async () => {
      const track = await createTestTrack()
      track.setInput(createMockAudioInput())
      track.arm()
      
      // Record take 1
      transport.record()
      await waitMs(1000)
      transport.stop()
      
      // Record take 2
      transport.record()
      await waitMs(1000)
      transport.stop()
      
      expect(track.takes.length).toBe(2)
    })

    it('switch between takes', async () => {
      const track = await createTestTrack()
      track.setInput(createMockAudioInput(440, 0.5))
      track.arm()
      
      transport.record()
      await waitMs(1000)
      transport.stop()
      
      track.setInput(createMockAudioInput(880, 0.5))
      
      transport.record()
      await waitMs(1000)
      transport.stop()
      
      track.selectTake(0)
      expect(analyzeFrequency(track.getAudioData()).dominantFreq).toBeCloseTo(440, 50)
      
      track.selectTake(1)
      expect(analyzeFrequency(track.getAudioData()).dominantFreq).toBeCloseTo(880, 50)
    })
  })

  describe('Bounce/Render', () => {
    it('bounces track with effects', async () => {
      const track = await createTestTrack()
      await track.loadAudio(testAudioBuffer)
      
      const gain = await loadPlugin('gain')
      gain.setParameter('gain', 0.5)
      track.insertPlugin(gain)
      
      const bounced = await track.bounce()
      
      // Check gain was applied
      const originalPeak = getPeakLevel(testAudioBuffer)
      const bouncedPeak = getPeakLevel(bounced)
      
      expect(bouncedPeak).toBeCloseTo(originalPeak * 0.5, 0.1)
    })

    it('bounces selection only', async () => {
      const track = await createTestTrack()
      await track.loadAudio(testAudioBuffer) // 5 second buffer
      
      const bounced = await track.bounce({ start: 1000, end: 3000 })
      
      expect(bounced.duration).toBeCloseTo(2, 0.1)
    })
  })
})
```

---

## E17-QA-2: Offline Rendering Tests

```typescript
describe('Offline Rendering', () => {
  describe('Full Project Render', () => {
    it('renders entire project offline', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudio1)
      await project.addTrack().loadAudio(testAudio2)
      
      const rendered = await project.renderOffline()
      
      expect(rendered).toBeInstanceOf(AudioBuffer)
      expect(rendered.duration).toBeCloseTo(project.duration, 0.1)
    })

    it('renders faster than real-time', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(longAudio) // 60 second audio
      
      const start = performance.now()
      await project.renderOffline()
      const elapsed = (performance.now() - start) / 1000
      
      expect(elapsed).toBeLessThan(60) // Faster than real-time
    })

    it('includes automation in render', async () => {
      const project = await createTestProject()
      const track = await project.addTrack()
      await track.loadAudio(testAudioBuffer)
      
      const automation = track.createAutomationLane('gain')
      automation.addPoint(0, 0.0)
      automation.addPoint(track.duration, 1.0)
      
      const rendered = await project.renderOffline()
      
      // Check fade-in applied
      const startLevel = getPeakLevel(rendered, 0, 100)
      const endLevel = getPeakLevel(rendered, rendered.duration - 100, 100)
      
      expect(endLevel).toBeGreaterThan(startLevel)
    })
  })

  describe('Progress Reporting', () => {
    it('reports progress during render', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(longAudio)
      
      const progressValues: number[] = []
      
      project.on('renderProgress', (progress) => {
        progressValues.push(progress)
      })
      
      await project.renderOffline()
      
      expect(progressValues.length).toBeGreaterThan(5)
      expect(progressValues[progressValues.length - 1]).toBeCloseTo(1, 0.01)
    })

    it('can cancel mid-render', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(longAudio)
      
      const renderPromise = project.renderOffline()
      
      await waitMs(500)
      project.cancelRender()
      
      await expect(renderPromise).rejects.toThrow('cancelled')
    })
  })

  describe('Quality Options', () => {
    it('renders at specified sample rate', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const rendered = await project.renderOffline({ sampleRate: 48000 })
      
      expect(rendered.sampleRate).toBe(48000)
    })

    it('renders at specified bit depth', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const wavBlob = await project.exportWAV({ bitDepth: 24 })
      const header = await parseWAVHeader(wavBlob)
      
      expect(header.bitsPerSample).toBe(24)
    })
  })
})
```

---

## E17-QA-3: Export Format Tests

```typescript
describe('Multi-format Export', () => {
  describe('WAV Export', () => {
    it('exports valid WAV file', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const wavBlob = await project.exportWAV()
      
      expect(wavBlob.type).toBe('audio/wav')
      
      // Validate WAV structure
      const header = await parseWAVHeader(wavBlob)
      expect(header.format).toBe('WAVE')
      expect(header.audioFormat).toBe(1) // PCM
    })

    it('exports 16/24/32 bit', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const wav16 = await project.exportWAV({ bitDepth: 16 })
      const wav24 = await project.exportWAV({ bitDepth: 24 })
      const wav32 = await project.exportWAV({ bitDepth: 32 })
      
      expect((await parseWAVHeader(wav16)).bitsPerSample).toBe(16)
      expect((await parseWAVHeader(wav24)).bitsPerSample).toBe(24)
      expect((await parseWAVHeader(wav32)).bitsPerSample).toBe(32)
    })
  })

  describe('MP3 Export', () => {
    it('exports valid MP3 file', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const mp3Blob = await project.exportMP3({ bitrate: 320 })
      
      expect(mp3Blob.type).toBe('audio/mpeg')
      
      // Validate MP3 structure
      const header = await parseMP3Header(mp3Blob)
      expect(header.version).toBeDefined()
    })

    it('exports at different bitrates', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const mp3_128 = await project.exportMP3({ bitrate: 128 })
      const mp3_320 = await project.exportMP3({ bitrate: 320 })
      
      // Higher bitrate = larger file
      expect(mp3_320.size).toBeGreaterThan(mp3_128.size)
    })

    it('encoding happens in Worker (no UI block)', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(longAudio)
      
      let uiBlocked = false
      const checkInterval = setInterval(() => {
        const start = performance.now()
        // Force layout
        document.body.offsetHeight
        if (performance.now() - start > 50) {
          uiBlocked = true
        }
      }, 16)
      
      await project.exportMP3({ bitrate: 320 })
      
      clearInterval(checkInterval)
      expect(uiBlocked).toBe(false)
    })
  })

  describe('Metadata', () => {
    it('embeds ID3 tags in MP3', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const mp3Blob = await project.exportMP3({
        metadata: {
          title: 'Test Track',
          artist: 'Test Artist',
          album: 'Test Album'
        }
      })
      
      const id3 = await parseID3(mp3Blob)
      expect(id3.title).toBe('Test Track')
      expect(id3.artist).toBe('Test Artist')
    })

    it('embeds cover art', async () => {
      const project = await createTestProject()
      await project.addTrack().loadAudio(testAudioBuffer)
      
      const coverImage = await loadTestImage('cover.jpg')
      
      const mp3Blob = await project.exportMP3({
        metadata: {
          title: 'Test Track',
          coverArt: coverImage
        }
      })
      
      const id3 = await parseID3(mp3Blob)
      expect(id3.picture).toBeDefined()
    })
  })
})
```

---

## E17-QA-4: MIDI File Tests

```typescript
describe('MIDI File Import/Export', () => {
  describe('Import', () => {
    it('parses Standard MIDI File', async () => {
      const midiFile = await loadTestMIDI('test.mid')
      
      const parsed = parseMIDIFile(midiFile)
      
      expect(parsed.format).toBeOneOf([0, 1, 2])
      expect(parsed.tracks.length).toBeGreaterThan(0)
    })

    it('creates tracks from MIDI file', async () => {
      const midiFile = await loadTestMIDI('multitrack.mid')
      const project = await createTestProject()
      
      await project.importMIDI(midiFile)
      
      expect(project.tracks.length).toBeGreaterThan(0)
    })

    it('preserves tempo map', async () => {
      const midiFile = await loadTestMIDI('tempo-changes.mid')
      const project = await createTestProject()
      
      await project.importMIDI(midiFile)
      
      expect(project.tempoTrack.events.length).toBeGreaterThan(1)
    })

    it('converts notes to regions', async () => {
      const midiFile = await loadTestMIDI('notes.mid')
      const project = await createTestProject()
      
      await project.importMIDI(midiFile)
      
      const midiTrack = project.tracks.find(t => t.type === 'midi')
      expect(midiTrack.regions.length).toBeGreaterThan(0)
      expect(midiTrack.regions[0].notes.length).toBeGreaterThan(0)
    })
  })

  describe('Export', () => {
    it('exports valid MIDI file', async () => {
      const project = await createTestProject()
      const track = await project.addMIDITrack()
      
      track.addNote({ pitch: 60, start: 0, duration: 500, velocity: 100 })
      track.addNote({ pitch: 64, start: 500, duration: 500, velocity: 100 })
      
      const midiBlob = await project.exportMIDI()
      
      // Validate by re-parsing
      const parsed = parseMIDIFile(midiBlob)
      expect(parsed.tracks.length).toBeGreaterThan(0)
    })

    it('round-trip preserves data', async () => {
      const midiFile = await loadTestMIDI('complex.mid')
      const project = await createTestProject()
      
      await project.importMIDI(midiFile)
      const exportedMIDI = await project.exportMIDI()
      
      const original = parseMIDIFile(midiFile)
      const exported = parseMIDIFile(exportedMIDI)
      
      // Note count should match (approximately)
      const originalNotes = countNotes(original)
      const exportedNotes = countNotes(exported)
      
      expect(exportedNotes).toBeCloseTo(originalNotes, originalNotes * 0.05)
    })
  })
})
```

---

## E17-QA-5: MIDI Recording Tests

```typescript
describe('MIDI Recording', () => {
  describe('Note Capture', () => {
    it('records MIDI notes from input', async () => {
      const track = await createMIDITrack()
      track.setInput(mockMIDIInput)
      track.arm()
      
      transport.record()
      
      // Simulate MIDI note
      mockMIDIInput.sendNote(60, 100, 500) // C4, velocity 100, 500ms
      
      await waitMs(1000)
      transport.stop()
      
      expect(track.regions.length).toBe(1)
      expect(track.regions[0].notes.length).toBe(1)
      expect(track.regions[0].notes[0].pitch).toBe(60)
    })

    it('records CC messages', async () => {
      const track = await createMIDITrack()
      track.setInput(mockMIDIInput)
      track.arm()
      
      transport.record()
      
      mockMIDIInput.sendCC(1, 64) // Mod wheel = 64
      
      await waitMs(500)
      transport.stop()
      
      const automation = track.getAutomationLane('cc1')
      expect(automation.points.length).toBeGreaterThan(0)
    })

    it('captures velocity accurately', async () => {
      const track = await createMIDITrack()
      track.setInput(mockMIDIInput)
      track.arm()
      
      transport.record()
      
      mockMIDIInput.sendNote(60, 127, 500) // Max velocity
      mockMIDIInput.sendNote(60, 1, 500) // Min velocity
      
      await waitMs(1500)
      transport.stop()
      
      const notes = track.regions[0].notes
      expect(notes[0].velocity).toBe(127)
      expect(notes[1].velocity).toBe(1)
    })
  })

  describe('Quantization', () => {
    it('quantizes notes on input', async () => {
      const track = await createMIDITrack()
      track.setInput(mockMIDIInput)
      track.quantize = { enabled: true, value: '1/8', strength: 100 }
      track.arm()
      
      transport.record()
      
      // Send note slightly off-grid
      await waitMs(50) // 50ms off from start
      mockMIDIInput.sendNote(60, 100, 200)
      
      await waitMs(500)
      transport.stop()
      
      const note = track.regions[0].notes[0]
      // Should be quantized to grid
      expect(note.start % (60000 / 120 / 2)).toBe(0) // 1/8 at 120 BPM
    })

    it('applies swing', async () => {
      const track = await createMIDITrack()
      track.quantize = { enabled: true, value: '1/8', swing: 50 }
      
      // Manually add off-grid notes
      track.addNote({ pitch: 60, start: 250, duration: 100 }) // 1/8 note 2
      track.addNote({ pitch: 60, start: 500, duration: 100 }) // 1/8 note 3
      
      track.applyQuantize()
      
      const notes = track.regions[0].notes
      // Note 2 should be swung late
      expect(notes[0].start).toBeGreaterThan(250)
    })
  })

  describe('Overdub', () => {
    it('overdubs on loop', async () => {
      const track = await createMIDITrack()
      track.setInput(mockMIDIInput)
      track.arm()
      
      transport.setLoop(0, 1000)
      transport.record()
      
      // First loop
      mockMIDIInput.sendNote(60, 100, 500)
      await waitMs(1000)
      
      // Second loop (overdub)
      mockMIDIInput.sendNote(64, 100, 500)
      await waitMs(1000)
      
      transport.stop()
      
      const notes = track.regions[0].notes
      expect(notes.length).toBe(2) // Both notes present
    })
  })
})
```

---

## E17-QA-6: Transcoding Tests

```typescript
describe('Audio Transcoding', () => {
  describe('Quality Presets', () => {
    const presets = [
      { name: 'low', bitrate: 64, codec: 'opus' },
      { name: 'medium', bitrate: 128, codec: 'opus' },
      { name: 'high', bitrate: 256, codec: 'opus' },
      { name: 'ultra', bitrate: 320, codec: 'aac' }
    ]

    presets.forEach(({ name, bitrate, codec }) => {
      it(`generates ${name} quality (${bitrate}k ${codec})`, async () => {
        const result = await transcodeService.transcode(testAudioFile, name)
        
        expect(result.codec).toBe(codec)
        expect(result.bitrate).toBeCloseTo(bitrate * 1000, bitrate * 100)
      })
    })
  })

  describe('Job Processing', () => {
    it('processes transcode job', async () => {
      const job = await transcodeQueue.add('transcode', {
        trackId: 'track-1',
        inputPath: '/uploads/track-1.wav'
      })
      
      const result = await job.finished()
      
      expect(result.status).toBe('completed')
      expect(result.outputs.length).toBeGreaterThan(0)
    })

    it('reports progress', async () => {
      const progressUpdates: number[] = []
      
      const job = await transcodeQueue.add('transcode', {
        trackId: 'track-1',
        inputPath: '/uploads/long-track.wav'
      })
      
      job.on('progress', (progress) => {
        progressUpdates.push(progress)
      })
      
      await job.finished()
      
      expect(progressUpdates.length).toBeGreaterThan(0)
    })

    it('retries on failure', async () => {
      let attempts = 0
      
      // Mock ffmpeg failure
      mockFfmpeg.mockImplementation(() => {
        attempts++
        if (attempts < 3) throw new Error('ffmpeg failed')
        return { success: true }
      })
      
      const job = await transcodeQueue.add('transcode', {
        trackId: 'track-1'
      }, { attempts: 3 })
      
      await job.finished()
      
      expect(attempts).toBe(3)
    })
  })

  describe('Chunked Output', () => {
    it('splits into streaming chunks', async () => {
      const result = await transcodeService.transcode(testAudioFile, 'medium')
      
      expect(result.chunks.length).toBeGreaterThan(0)
      // Each chunk ~5 seconds
      expect(result.chunks[0].duration).toBeCloseTo(5, 0.5)
    })

    it('generates manifest', async () => {
      const result = await transcodeService.transcode(testAudioFile, 'medium')
      
      expect(result.manifest).toBeDefined()
      expect(result.manifest.chunks).toEqual(result.chunks.length)
    })
  })
})
```

---

## Manual Test Checklist

### E17-T1: Recording
- [ ] Arm track, record from mic
- [ ] Waveform appears during recording
- [ ] Monitor toggle works
- [ ] Punch in/out at markers
- [ ] Multiple takes saved
- [ ] Select between takes

### E17-T2: Offline Render
- [ ] Export project to file
- [ ] Progress bar shows accurately
- [ ] Cancel stops export
- [ ] Result plays correctly

### E17-T3: Export Formats
- [ ] Export WAV (16/24/32 bit)
- [ ] Export MP3 (128/256/320 kbps)
- [ ] Metadata appears in file
- [ ] File plays in external player

### E17-T4: MIDI Files
- [ ] Import .mid file
- [ ] Tracks created correctly
- [ ] Export project to .mid
- [ ] Re-import exported file

### E17-T5: MIDI Recording
- [ ] Play MIDI keyboard, notes record
- [ ] Quantize works
- [ ] CC records to automation
- [ ] Overdub on loop

### E17-T6: Transcoding
- [ ] Upload triggers transcode
- [ ] Multiple qualities generated
- [ ] Chunks ready for streaming
- [ ] Fast turnaround

---

*E17 Audio Production QA — DAWW3 Sprint 3*
