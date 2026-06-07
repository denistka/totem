/**
 * Piano keybed model: **white-key units** (each natural = width 1).
 * Black keys sit on seams at i+1.
 * Pixel metrics are derived in the UI from the measured container width.
 */

import { buildNoteFinderKeyLayout } from './noteFinderPianoLayout';

/** Black key **drawn** width as a fraction of one white key (typ. 0.52–0.62). */
export const BLACK_KEY_WIDTH_RATIO = 0.56;

/** Never draw a black key narrower than this (px), or it reads as a hairline on phones. */
export const BLACK_KEY_MIN_VISUAL_PX = 11;

/** Black key height as a fraction of white key height. */
export const BLACK_KEY_HEIGHT_RATIO = 0.62;

/** Wider invisible hit strip (px) — makes narrow black keys tappable on mobile. */
export const BLACK_KEY_MIN_HIT_PX = 42;

/** Cap hit area width as a multiple of `unitPx`. */
export const BLACK_KEY_MAX_HIT_UNITS = 1.82;

export type KeybedLayoutModel = {
  nWhite: number;
  whites: Array<{ midi: number; index: number }>;
  blacks: Array<{ midi: number; afterWhiteIndex: number }>;
};

export const buildKeybedLayoutModel = (lowMidi: number, highMidi: number): KeybedLayoutModel => {
  const { whites, blacks } = buildNoteFinderKeyLayout(lowMidi, highMidi);
  const nWhite = Math.max(1, whites.length);
  return {
    nWhite,
    whites: whites.map((w) => ({ midi: w.midi, index: w.whiteIndex })),
    blacks: blacks.map((b) => ({ midi: b.midi, afterWhiteIndex: b.afterWhiteIndex })),
  };
};

export type KeybedPixelMetrics = {
  unitPx: number;
  whiteHeightPx: number;
  blackHeightPx: number;
};

/** Default max white-key height (px). */
const DEFAULT_MAX_WHITE_HEIGHT_PX = 172;

/**
 * Tighter white-key cap in **short landscape** (e.g. iPhone SE): reserve vertical space
 * for other UI elements.
 */
export const keyboardWhiteHeightCapPx = (viewportWidthPx: number, viewportHeightPx: number): number => {
  const landscape = viewportWidthPx > viewportHeightPx;
  if (!landscape || viewportHeightPx >= 480) return DEFAULT_MAX_WHITE_HEIGHT_PX;
  return Math.max(68, Math.min(DEFAULT_MAX_WHITE_HEIGHT_PX, Math.round(viewportHeightPx * 0.26)));
};

export type ComputeKeybedPixelMetricsOptions = {
  /** Upper bound for white key height; defaults to {@link DEFAULT_MAX_WHITE_HEIGHT_PX}. */
  maxWhiteHeightPx?: number;
};

export const computeKeybedPixelMetrics = (
  containerWidthPx: number,
  nWhite: number,
  options?: ComputeKeybedPixelMetricsOptions
): KeybedPixelMetrics => {
  const n = Math.max(1, nWhite);
  const unitPx = containerWidthPx / n;
  const cap = options?.maxWhiteHeightPx ?? DEFAULT_MAX_WHITE_HEIGHT_PX;
  const floor = Math.min(84, cap);
  const whiteHeightPx = Math.min(cap, Math.max(floor, Math.round(unitPx * 4.65)));
  const blackHeightPx = Math.round(whiteHeightPx * BLACK_KEY_HEIGHT_RATIO);
  return { unitPx, whiteHeightPx, blackHeightPx };
};

/** Solid-looking black key width + wider touch target (centered on seam). */
export const blackKeyHitAndVisualWidth = (
  unitPx: number
): { visualWidthPx: number; hitWidthPx: number } => {
  const visualWidthPx = Math.max(BLACK_KEY_MIN_VISUAL_PX, Math.round(unitPx * BLACK_KEY_WIDTH_RATIO));
  const hitWidthPx = Math.min(
    Math.max(visualWidthPx + 12, BLACK_KEY_MIN_HIT_PX),
    unitPx * BLACK_KEY_MAX_HIT_UNITS
  );
  return { visualWidthPx, hitWidthPx };
};
