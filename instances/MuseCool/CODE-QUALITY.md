# MuseCool — Code Quality Standard

The bar is the **provided `incoming/piano-keyboard-export/`**. All new code (S08+) must read
as if it shipped in the same package. Reviewers (and Muse) will compare directly.

## Reference exemplars
- `PianoKey.tsx` — discriminated-union props, `memo`, a11y, no magic numbers.
- `PianoKeyboard.tsx` — public API with JSDoc `@example`, stable no-op refs, pointer cleanup.
- `noteFinderKeyboardGeometry.ts` — pure metrics, named/doc'd constants, landscape-aware caps.
- `useNoteFinderKeyboardAudio.ts` — small focused hook, `useCallback`, error handling.

## Mandatory bar (every new file)

### Types & props
- **Discriminated unions** for variant components (cf. `WhiteProps | BlackProps`), not boolean soup.
- Export public `type`s; props documented with one-line JSDoc each.
- No `any`. Prefer `readonly` for data tables. `as` casts only with a comment justifying.

### Components
- `memo` + explicit `.displayName` on every component.
- `useMemo`/`useCallback` for derived models and handlers passed to memoized children.
- Stable identities for no-op/optional callbacks (cf. `assistiveAuditionDown`).
- One responsibility per component; split when it grows two concerns.

### Hooks & logic
- Pure logic → `src/game/` (`lib`-style, no React). React glue → `src/hooks/`. UI → `src/components/` / `src/screens/`.
- Custom hooks return a small, named object; options passed as a typed options object.
- All timers/tweens/listeners/RAF/`gsap.ticker` cleaned up on unmount (no leaks).
- `try/catch` + `console.error` on async that can fail (cf. preload).

### Constants & numbers
- No magic numbers in logic/animation — extract named consts with a doc comment explaining the value (cf. `BLACK_KEY_WIDTH_RATIO`, easing/duration tables in DESIGN.md).

### Accessibility (kids app, still matters)
- Interactive elements are real `<button>`s with `aria-label` / `aria-pressed` where stateful.
- Visible focus (`focus-visible:ring-...`); decorative SVG `aria-hidden`; meaningful `role`/labels.
- Tap targets ≥ 44px (already enforced by piano hit strips — keep this for game buttons).

### Styling
- Tailwind tokens from S01-INVARIANTS only — never raw hex in JSX/CSS for brand colours.
- `touch-none select-none` on game surfaces; respect `env(safe-area-inset-*)`.

### JSDoc
- Public components/hooks/utils get a JSDoc block; non-trivial public APIs include an `@example`.

## Definition of "quality-passed" (per task)
- `tsc --noEmit` clean; ESLint clean (no disables except the existing documented ones).
- No console errors/warnings in the touched flow.
- Matches the folder convention + the bar above; diff reviewable in < 5 min.
- `memo`/`displayName`/cleanup present where applicable.

## Anti-patterns (auto-reject in review)
- Inline magic numbers, untyped props, missing `displayName`.
- Uncleaned GSAP/RAF/listeners; per-frame React `setState` in scroll/animation loops.
- Raw hex brand colours; divs-as-buttons; missing `aria-*` on interactive controls.
- God components mixing engine + UI + audio.
