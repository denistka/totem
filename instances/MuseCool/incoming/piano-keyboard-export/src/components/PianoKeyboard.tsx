'use client'; // Remove this line if you are not using Next.js App Router

import { memo, useEffect, useMemo } from 'react';
import { KeyboardKeybed } from './KeyboardKeybed';
import { useNoteFinderKeyboardAudio } from '../hooks/useNoteFinderKeyboardAudio';
import { buildKeybedLayoutModel } from '../lib/noteFinderKeyboardGeometry';
import { NOTE_FINDER_KEYBOARD_RANGE } from '../lib/noteFinderPianoLayout';

/** Stable no-op refs so assistive mode does not break KeyboardKeybed memoization. */
const assistiveAuditionDown = async (_midi: number) => {
  await Promise.resolve();
};
const assistiveAuditionUp = (_midi: number) => {};

export type PianoKeyboardVariant = 'interactive' | 'assistive';

type Props = {
  /** The currently pressed MIDI note, or null. Managed by the parent. */
  pressedMidi: number | null;
  /** Called when the user presses or releases a key. */
  onChangePressed: (midi: number | null) => void;
  /** Optionally pulse-highlight this key as the correct answer. */
  hintMidi?: number | null;
  /**
   * `'interactive'` (default): fully playable keyboard with audio.
   * `'assistive'`: display-only, no touch handlers, no audio (e.g. to show the answer).
   */
  variant?: PianoKeyboardVariant;
  /** Override the default low MIDI of the range. Must start on a C for correct visual grouping. */
  lowMidi?: number;
  /** Override the default high MIDI of the range. */
  highMidi?: number;
};

/**
 * On-screen piano keyboard.
 *
 * Renders a fully measured, touch-friendly keybed that fills its container width.
 * Keys are absolutely positioned; the keybed height is derived from the key width so
 * it always looks proportional regardless of container size.
 *
 * The component manages audio (Salamander Grand Piano via Tone.js) internally.
 * The parent only needs to track `pressedMidi` as state.
 *
 * @example
 * ```tsx
 * const [pressedMidi, setPressedMidi] = useState<number | null>(null);
 *
 * <PianoKeyboard
 *   pressedMidi={pressedMidi}
 *   onChangePressed={setPressedMidi}
 * />
 * ```
 *
 * To show the correct answer highlighted (e.g. after a wrong guess):
 * ```tsx
 * <PianoKeyboard
 *   pressedMidi={pressedMidi}
 *   onChangePressed={setPressedMidi}
 *   hintMidi={correctMidi}
 * />
 * ```
 *
 * To constrain the range (e.g. for a children's game using only C4–B4):
 * ```tsx
 * <PianoKeyboard
 *   pressedMidi={pressedMidi}
 *   onChangePressed={setPressedMidi}
 *   lowMidi={60}
 *   highMidi={71}
 * />
 * ```
 */
export const PianoKeyboard = memo(({
  pressedMidi,
  onChangePressed,
  hintMidi = null,
  variant = 'interactive',
  lowMidi = NOTE_FINDER_KEYBOARD_RANGE.lowMidi,
  highMidi = NOTE_FINDER_KEYBOARD_RANGE.highMidi,
}: Props) => {
  const model = useMemo(() => buildKeybedLayoutModel(lowMidi, highMidi), [lowMidi, highMidi]);
  const interactive = variant === 'interactive';
  const { auditionDown, auditionUp } = useNoteFinderKeyboardAudio({
    preload: interactive,
  });
  const auditionDownFn = interactive ? auditionDown : assistiveAuditionDown;
  const auditionUpFn = interactive ? auditionUp : assistiveAuditionUp;

  // Release the held note if the pointer lifts outside the key (e.g. drag off screen).
  useEffect(() => {
    if (!interactive || pressedMidi === null) return;
    const midiHeld = pressedMidi;
    const clear = () => {
      auditionUp(midiHeld);
      onChangePressed(null);
    };
    window.addEventListener('pointerup', clear);
    window.addEventListener('pointercancel', clear);
    return () => {
      window.removeEventListener('pointerup', clear);
      window.removeEventListener('pointercancel', clear);
    };
  }, [pressedMidi, onChangePressed, auditionUp, interactive]);

  const groupAriaLabel =
    variant === 'assistive'
      ? 'Keyboard hint: the highlighted key matches the correct note. Keys are not playable.'
      : 'On-screen piano keyboard';

  return (
    <div
      className="w-full touch-none select-none px-2 pb-1.5 pt-0 sm:px-3 sm:pb-2 md:pb-4"
      role="group"
      aria-label={groupAriaLabel}
    >
      <div className="relative m-0 w-full max-w-3xl rounded-xl shadow-lg">
        <KeyboardKeybed
          model={model}
          pressedMidi={pressedMidi}
          hintMidi={hintMidi}
          interactive={interactive}
          onChangePressed={onChangePressed}
          auditionDown={auditionDownFn}
          auditionUp={auditionUpFn}
        />
      </div>
    </div>
  );
});

PianoKeyboard.displayName = 'PianoKeyboard';
