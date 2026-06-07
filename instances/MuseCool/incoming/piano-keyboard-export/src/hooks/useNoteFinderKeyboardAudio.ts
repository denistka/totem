'use client'; // Remove this line if you are not using Next.js App Router

import { useCallback, useEffect, useRef } from 'react';
import { start } from 'tone';
import { getNoteFinderKeyboardAudioEngine } from '../lib/noteFinderKeyboardAudioEngine';

export type UseNoteFinderKeyboardAudioOptions = {
  /**
   * When false, skip sampler preload (no sample download).
   * Use for display-only keybeds; audition helpers no-op until another caller preloads the engine.
   */
  preload?: boolean;
};

/**
 * Preloads the shared Salamander sampler (unless `preload: false`) and returns audition helpers.
 *
 * `auditionDown(midi)` — call on pointer/key down. Calls Tone.start() internally (requires a
 * user gesture on the first call) then triggers the note attack.
 *
 * `auditionUp(midi)` — call on pointer/key up. Triggers the note release.
 */
export const useNoteFinderKeyboardAudio = (options?: UseNoteFinderKeyboardAudioOptions) => {
  const preloadEnabled = options?.preload !== false;
  const engineRef = useRef(getNoteFinderKeyboardAudioEngine());

  useEffect(() => {
    if (!preloadEnabled) return;
    const engine = engineRef.current;
    void engine.preload().catch((err: unknown) => {
      console.error('Piano keyboard samples failed to load', err);
    });
  }, [preloadEnabled]);

  const auditionDown = useCallback(async (midi: number) => {
    await start(); // Tone.js: must be called from a user gesture on first use
    engineRef.current.noteOnMidi(midi, 0.85);
  }, []);

  const auditionUp = useCallback((midi: number) => {
    engineRef.current.noteOffMidi(midi);
  }, []);

  return { auditionDown, auditionUp };
};
