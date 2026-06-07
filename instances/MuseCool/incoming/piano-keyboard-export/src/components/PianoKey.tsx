'use client'; // Remove this line if you are not using Next.js App Router

import { memo, type PointerEvent } from 'react';

type WhiteProps = {
  kind: 'white';
  leftPx: number;
  widthPx: number;
  heightPx: number;
  pressed: boolean;
  /** Pulse-highlight this key as the correct answer (distinct from pressed). */
  hintHighlighted: boolean;
  /** When false, render a non-interactive display surface. */
  interactive?: boolean;
  showMiddleCLabel: boolean;
  /** False on the rightmost white key: no divider (outer border defines the edge). */
  showRightDivider: boolean;
  ariaLabel: string;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
};

type BlackProps = {
  kind: 'black';
  /** Seam between white keys (px from keybed left edge). */
  centerXPx: number;
  hitWidthPx: number;
  visualWidthPx: number;
  heightPx: number;
  pressed: boolean;
  hintHighlighted: boolean;
  interactive?: boolean;
  ariaLabel: string;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
};

export type PianoKeyProps = WhiteProps | BlackProps;

/**
 * One key in an absolutely-positioned keybed (`position: relative` ancestor required).
 *
 * White keys: full height, rounded at the bottom only.
 * Black keys: transparent hit area (wider for touch) with a solid rounded cap.
 * The `pressed` and `hintHighlighted` states use the `primary` Tailwind color token.
 */
export const PianoKey = memo((props: PianoKeyProps) => {
  if (props.kind === 'white') {
    const {
      leftPx,
      widthPx,
      heightPx,
      pressed,
      hintHighlighted,
      interactive = true,
      showMiddleCLabel,
      showRightDivider,
      ariaLabel,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
    } = props;

    const whiteClassName =
      'border border-solid border-black absolute top-0 min-h-0 rounded-none bg-base-100 p-0 transition-colors ' +
      (showRightDivider ? 'shadow-[inset_-1px_0_0_0_theme(colors.neutral)] ' : '') +
      (interactive
        ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary '
        : 'pointer-events-none ') +
      (pressed
        ? 'z-[1] bg-primary'
        : hintHighlighted
          ? 'z-[1] animate-pulse bg-primary'
          : interactive
            ? 'active:bg-primary'
            : '');

    const whiteStyle = { left: leftPx, width: widthPx, height: heightPx };

    if (!interactive) {
      return (
        <div
          className={whiteClassName}
          style={whiteStyle}
          aria-hidden={!hintHighlighted}
          aria-label={hintHighlighted ? `Correct key: ${ariaLabel}` : undefined}
          role={hintHighlighted ? 'img' : undefined}
        >
          {showMiddleCLabel ? (
            <span className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-neutral/55 sm:text-xs">
              C
            </span>
          ) : null}
        </div>
      );
    }

    return (
      <button
        type="button"
        className={whiteClassName}
        style={whiteStyle}
        aria-label={ariaLabel}
        aria-pressed={pressed}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
      >
        {showMiddleCLabel ? (
          <span className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-neutral/55 sm:text-xs">
            C
          </span>
        ) : null}
      </button>
    );
  }

  const {
    centerXPx,
    hitWidthPx,
    visualWidthPx,
    heightPx,
    pressed,
    hintHighlighted,
    interactive = true,
    ariaLabel,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
  } = props;

  const blackOuterStyle = {
    left: centerXPx - hitWidthPx / 2,
    width: hitWidthPx,
    height: heightPx,
  };

  const capClassName =
    'pointer-events-none absolute left-1/2 top-0 block rounded-t-sm rounded-b-md transition-[box-shadow,background-color] ' +
    (pressed
      ? 'z-[1] bg-primary ring-2 ring-inset ring-primary'
      : hintHighlighted
        ? 'z-[1] animate-pulse bg-primary ring-2 ring-inset ring-primary'
        : 'bg-neutral group-hover:bg-primary group-active:bg-primary');

  if (!interactive) {
    return (
      <div
        className="pointer-events-none absolute top-0 z-20"
        style={blackOuterStyle}
        aria-hidden={!hintHighlighted}
        aria-label={hintHighlighted ? `Correct key: ${ariaLabel}` : undefined}
        role={hintHighlighted ? 'img' : undefined}
      >
        <span
          className={capClassName}
          style={{
            width: visualWidthPx,
            minWidth: visualWidthPx,
            height: heightPx,
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={
        'group absolute top-0 z-20 rounded-none border-0 bg-transparent p-0 hover:bg-transparent active:bg-transparent ' +
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0'
      }
      style={blackOuterStyle}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerLeave}
    >
      <span
        className={capClassName}
        style={{
          width: visualWidthPx,
          minWidth: visualWidthPx,
          height: heightPx,
          transform: 'translateX(-50%)',
        }}
      />
    </button>
  );
});

PianoKey.displayName = 'PianoKey';
