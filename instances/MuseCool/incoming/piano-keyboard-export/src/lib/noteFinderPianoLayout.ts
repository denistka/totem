/**
 * On-screen keyboard MIDI range (inclusive).
 *
 * Must start on **C** so each octave shows the real pattern: **two** black keys (C#–D#), gap at E–F,
 * **three** blacks (F#–G#–A#), gap at B–C — i.e. **2 + 3** repeating, not "3 + 2".
 * Starting on G (e.g. MIDI 55) makes the left edge look like **2 + 2 + 3** (wrong).
 *
 * End at **B5** (83), not A5 (81), so the top **F#–G#–A#** group is complete; ending on A leaves only F#–G# (looks like an extra pair of 2s).
 *
 * Range fits typical treble notes from the backend; extra naturals (e.g. A5/B5) keep a normal keyboard silhouette.
 */

/** Treble range: keyboard C4–B5. */
export const NOTE_FINDER_KEYBOARD_RANGE = { lowMidi: 60, highMidi: 83 } as const;

/** Bass range: keyboard C2–B4. */
export const NOTE_FINDER_BASS_KEYBOARD_RANGE = { lowMidi: 36, highMidi: 71 } as const;

/** MIDI note number for middle C (C4). */
export const MIDDLE_C_MIDI = 60;

const BLACK_PC = new Set([1, 3, 6, 8, 10]);

export const midiIsBlack = (midi: number): boolean => BLACK_PC.has(((midi % 12) + 12) % 12);

export type PianoWhiteKey = { kind: 'white'; midi: number; whiteIndex: number };

export type PianoBlackKey = { kind: 'black'; midi: number; afterWhiteIndex: number };

/**
 * White keys left→right, then black keys with anchor index into the white row (for % positioning).
 *
 * `afterWhiteIndex`: index of the lower white neighbor (e.g. C# → C's index).
 * Horizontally, the seam is at (index+1)/nWhite.
 */
export const buildNoteFinderKeyLayout = (
  lowMidi: number,
  highMidi: number
): { whites: PianoWhiteKey[]; blacks: PianoBlackKey[] } => {
  const whites: PianoWhiteKey[] = [];
  for (let m = lowMidi; m <= highMidi; m++) {
    if (!midiIsBlack(m)) {
      whites.push({ kind: 'white', midi: m, whiteIndex: whites.length });
    }
  }

  const whiteMidiToIndex = new Map<number, number>();
  for (const w of whites) {
    whiteMidiToIndex.set(w.midi, w.whiteIndex);
  }

  const blacks: PianoBlackKey[] = [];
  for (let m = lowMidi; m <= highMidi; m++) {
    if (!midiIsBlack(m)) continue;
    let w = m - 1;
    while (w >= lowMidi && midiIsBlack(w)) w--;
    if (w < lowMidi) continue;
    const idx = whiteMidiToIndex.get(w);
    if (idx === undefined) continue;
    blacks.push({ kind: 'black', midi: m, afterWhiteIndex: idx });
  }

  return { whites, blacks };
};

export const midiToShortLabel = (midi: number): string => {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const r = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return `${names[r]}${oct}`;
};
