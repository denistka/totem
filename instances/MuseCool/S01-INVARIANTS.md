# S01 Invariants — MuseCool

Frozen after Sprint 1. Any change requires explicit discussion — auto-approve is BLOCKED.

## Colors (locked — piano component depends on these)
- `primary: #FF9800` — orange. CTAs, timer bar, pressed key.
- `secondary: #0E92BA` — teal. Score, headings.
- `accent: #71C8BC` — light teal. Success state.
- `neutral: #2B2B2B` — black keys, dark text.
- `base-100: #FFFFFF` — white keys.
- `base-200: #FFEFDB` — warm cream.
- `error: #EF4444` — wrong answer.

## Background
- `linear-gradient(135deg, #FFF5E6 0%, #E4F4F2 100%)` — warm cream → soft teal.
- Two radial blobs (orange top-left, teal bottom-right). Static. Defined in `index.css`.

## Typography
- Font: Nunito (Google Fonts), weights 600/700/800/900.
- Note display size: `clamp(4rem, 12vw, 7rem)`, weight 900.

## Code Style Reference
- piano-keyboard-export components are the canonical style standard.
- All new components: `memo`, `useCallback`/`useMemo`, discriminated union props.
- Folder: `lib/` pure logic, `hooks/` React, `components/` UI, `screens/` full screens.

## Animation Engine
- GSAP (not Framer Motion, not CSS transitions) for game-loop animations.
- Timer bar driven by GSAP timeline — not setInterval, not CSS animation.

## PWA
- `theme_color: #FF9800`, `background_color: #FFF5E6`.
- `display: standalone`, `orientation: portrait`.
- `--app-height` from `visualViewport.height`.

## Piano Component
- Code at: `/Users/denistka/Projects/musecool` (repo: github.com/denistka/musecool).
- Source: `src/piano/` — DO NOT modify except the approved `mx-auto` fix.
- Tailwind tokens must match README exactly (locked above).
