'use client'; // Remove this line if you are not using Next.js App Router

import { memo, useLayoutEffect, useRef, useState } from 'react';
import { PianoKey } from './PianoKey';
import {
  blackKeyHitAndVisualWidth,
  type KeybedLayoutModel,
  computeKeybedPixelMetrics,
  keyboardWhiteHeightCapPx,
} from '../lib/noteFinderKeyboardGeometry';
import { MIDDLE_C_MIDI, midiToShortLabel } from '../lib/noteFinderPianoLayout';

type Props = {
  model: KeybedLayoutModel;
  pressedMidi: number | null;
  /** When set, pulse-highlight this MIDI key as the correct answer. */
  hintMidi: number | null;
  /** When false, keys are display-only (no touch, no sound). */
  interactive?: boolean;
  onChangePressed: (midi: number | null) => void;
  /** Starts audio context on first call; attack for this MIDI note. */
  auditionDown: (midi: number) => void;
  /** Release for this MIDI note (safe if already off). */
  auditionUp: (midi: number) => void;
};

type MeasuredLayout = {
  containerWidthPx: number;
  unitPx: number;
  whiteHeightPx: number;
  blackHeightPx: number;
};

/**
 * Measured keybed using ResizeObserver + visualViewport.
 * Layout is computed in **white-key units**, then converted to absolute px.
 */
export const KeyboardKeybed = memo(({
  model,
  pressedMidi,
  hintMidi,
  interactive = true,
  onChangePressed,
  auditionDown,
  auditionUp,
}: Props) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<MeasuredLayout | null>(null);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const apply = (width: number) => {
      if (width <= 0) {
        setMeasured(null);
        return;
      }
      const vv = window.visualViewport;
      const vw = vv?.width ?? window.innerWidth;
      const vh = vv?.height ?? window.innerHeight;
      const maxWhite = keyboardWhiteHeightCapPx(vw, vh);
      const m = computeKeybedPixelMetrics(width, model.nWhite, { maxWhiteHeightPx: maxWhite });
      setMeasured({
        containerWidthPx: width,
        unitPx: m.unitPx,
        whiteHeightPx: m.whiteHeightPx,
        blackHeightPx: m.blackHeightPx,
      });
    };

    const ro = new ResizeObserver((entries) => {
      apply(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(el);
    apply(el.getBoundingClientRect().width);

    const onViewportChange = () => apply(el.getBoundingClientRect().width);
    window.addEventListener('resize', onViewportChange);
    window.visualViewport?.addEventListener('resize', onViewportChange);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onViewportChange);
      window.visualViewport?.removeEventListener('resize', onViewportChange);
    };
  }, [model.nWhite]);

  const n = model.nWhite;

  return (
    <div
      ref={viewportRef}
      className="relative w-full min-w-0 overflow-hidden rounded-lg border-2 border-neutral bg-neutral"
    >
      {measured ? (
        <div
          className="relative touch-none select-none"
          style={{
            width: '100%',
            height: measured.whiteHeightPx,
            minHeight: measured.whiteHeightPx,
          }}
        >
          {model.whites.map((w) => {
            const leftPx = w.index * measured.unitPx;
            const isLast = w.index === n - 1;
            const widthPx = isLast
              ? Math.max(0, measured.containerWidthPx - leftPx)
              : measured.unitPx;

            return (
              <PianoKey
                key={w.midi}
                kind="white"
                leftPx={leftPx}
                widthPx={widthPx}
                heightPx={measured.whiteHeightPx}
                pressed={pressedMidi === w.midi}
                hintHighlighted={hintMidi !== null && hintMidi === w.midi && pressedMidi !== w.midi}
                interactive={interactive}
                showMiddleCLabel={w.midi === MIDDLE_C_MIDI}
                showRightDivider={!isLast}
                ariaLabel={midiToShortLabel(w.midi)}
                onPointerDown={
                  interactive
                    ? (e) => {
                        e.preventDefault();
                        auditionDown(w.midi);
                        onChangePressed(w.midi);
                      }
                    : undefined
                }
                onPointerUp={
                  interactive
                    ? (e) => {
                        e.preventDefault();
                        auditionUp(w.midi);
                        if (pressedMidi === w.midi) onChangePressed(null);
                      }
                    : undefined
                }
                onPointerCancel={
                  interactive
                    ? (e) => {
                        e.preventDefault();
                        auditionUp(w.midi);
                        if (pressedMidi === w.midi) onChangePressed(null);
                      }
                    : undefined
                }
                onPointerLeave={
                  interactive
                    ? (e) => {
                        if (e.buttons === 0 && pressedMidi === w.midi) {
                          auditionUp(w.midi);
                          onChangePressed(null);
                        }
                      }
                    : undefined
                }
              />
            );
          })}

          {model.blacks.map((b) => {
            const centerPx = (b.afterWhiteIndex + 1) * measured.unitPx;
            const { visualWidthPx, hitWidthPx } = blackKeyHitAndVisualWidth(measured.unitPx);
            return (
              <PianoKey
                key={b.midi}
                kind="black"
                centerXPx={centerPx}
                hitWidthPx={hitWidthPx}
                visualWidthPx={visualWidthPx}
                heightPx={measured.blackHeightPx}
                pressed={pressedMidi === b.midi}
                hintHighlighted={hintMidi !== null && hintMidi === b.midi && pressedMidi !== b.midi}
                interactive={interactive}
                ariaLabel={midiToShortLabel(b.midi)}
                onPointerDown={
                  interactive
                    ? (e) => {
                        e.preventDefault();
                        auditionDown(b.midi);
                        onChangePressed(b.midi);
                      }
                    : undefined
                }
                onPointerUp={
                  interactive
                    ? (e) => {
                        e.preventDefault();
                        auditionUp(b.midi);
                        if (pressedMidi === b.midi) onChangePressed(null);
                      }
                    : undefined
                }
                onPointerCancel={
                  interactive
                    ? (e) => {
                        e.preventDefault();
                        auditionUp(b.midi);
                        if (pressedMidi === b.midi) onChangePressed(null);
                      }
                    : undefined
                }
                onPointerLeave={
                  interactive
                    ? (e) => {
                        if (e.buttons === 0 && pressedMidi === b.midi) {
                          auditionUp(b.midi);
                          onChangePressed(null);
                        }
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="min-h-[5.5rem] w-full" aria-hidden />
      )}
    </div>
  );
});

KeyboardKeybed.displayName = 'KeyboardKeybed';
