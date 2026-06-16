import { Frequency, now, Sampler } from 'tone';

// Salamander Grand Piano samples — free, high-quality, fetched directly from GitHub.
// Source: github.com/Tonejs/audio (MIT-compatible)
const SALAMANDER_BASE = 'https://raw.githubusercontent.com/Tonejs/audio/master/salamander/';

const SALAMANDER_URLS: Record<string, string> = {
  A1: 'A1.mp3',
  C2: 'C2.mp3',
  'D#2': 'Ds2.mp3',
  'F#2': 'Fs2.mp3',
  A2: 'A2.mp3',
  C3: 'C3.mp3',
  'D#3': 'Ds3.mp3',
  'F#3': 'Fs3.mp3',
  A3: 'A3.mp3',
  C4: 'C4.mp3',
  'D#4': 'Ds4.mp3',
  'F#4': 'Fs4.mp3',
  A4: 'A4.mp3',
  C5: 'C5.mp3',
  'D#5': 'Ds5.mp3',
  'F#5': 'Fs5.mp3',
  A5: 'A5.mp3',
  C6: 'C6.mp3',
  'D#6': 'Ds6.mp3',
  'F#6': 'Fs6.mp3',
  A6: 'A6.mp3',
  C7: 'C7.mp3',
  'D#7': 'Ds7.mp3',
  'F#7': 'Fs7.mp3',
  A7: 'A7.mp3',
  C8: 'C8.mp3',
};

/**
 * Singleton Salamander Grand Piano sampler (Tone.js).
 * UI layers call `noteOnMidi` / `noteOffMidi`; they do not own Tone nodes directly.
 *
 * Usage:
 *   const engine = getNoteFinderKeyboardAudioEngine();
 *   await engine.preload();          // kick off sample download (no user gesture needed)
 *   engine.noteOnMidi(60);           // play middle C (requires prior Tone.start() — see hook)
 *   engine.noteOffMidi(60);          // release
 *   engine.tapMidi(60);              // short attack-release tap
 */
export class NoteFinderKeyboardAudioEngine {
  private sampler: Sampler | null = null;
  private loadPromise: Promise<void> | null = null;

  /** Decode/load samples. Safe to call without a user gesture; does not call Tone.start(). */
  preload(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      this.sampler = new Sampler({
        urls: SALAMANDER_URLS,
        baseUrl: SALAMANDER_BASE,
        release: 1.2,
        onload: () => resolve(),
        onerror: (err) => reject(err),
      }).toDestination();
    });

    return this.loadPromise;
  }

  get loaded(): boolean {
    return Boolean(this.sampler?.loaded);
  }

  noteOn(note: string, velocity = 0.8): void {
    if (!this.sampler?.loaded) return;
    this.sampler.triggerAttack(note, now(), velocity);
  }

  noteOff(note: string): void {
    if (!this.sampler?.loaded) return;
    this.sampler.triggerRelease(note, now());
  }

  noteOnMidi(midi: number, velocity = 0.8): void {
    const note = Frequency(midi, 'midi').toNote();
    this.noteOn(note, velocity);
  }

  noteOffMidi(midi: number): void {
    const note = Frequency(midi, 'midi').toNote();
    this.noteOff(note);
  }

  /** Short tap (hints / demos); prefer attack/release for held keyboard presses. */
  tapMidi(midi: number, velocity = 0.8, duration = '8n'): void {
    if (!this.sampler?.loaded) return;
    const note = Frequency(midi, 'midi').toNote();
    this.sampler.triggerAttackRelease(note, duration, now(), velocity);
  }
}

let singleton: NoteFinderKeyboardAudioEngine | null = null;

export const getNoteFinderKeyboardAudioEngine = (): NoteFinderKeyboardAudioEngine => {
  if (!singleton) singleton = new NoteFinderKeyboardAudioEngine();
  return singleton;
};
