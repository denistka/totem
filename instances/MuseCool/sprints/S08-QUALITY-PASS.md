# S08 Quality Pass

Conformance review against `../CODE-QUALITY.md` (piano-keyboard-export bar).  
Date: 2026-06-05 · `tsc --noEmit` ✅ · ESLint ✅ (0 errors, 1 pre-existing warning in CountdownRing)

| File | Pass | Notes |
|---|---|---|
| `src/game/emotions.ts` | ✅ | Pure logic, JSDoc, named consts, `readonly` table |
| `src/game/melodyLibrary.ts` | ✅ | Pure data, dev guard, `noteNameToMidi` reuses C4=60 |
| `src/game/runnerModel.ts` | ✅ | Pure functions, exported named constants |
| `src/game/adaptiveSpeed.ts` | ✅ | Pure helper, tier labels, doc'd thresholds |
| `src/components/MascotSVG.tsx` | ✅ | `memo`+`displayName`, data-driven face, a11y |
| `src/components/MascotWithShadow.tsx` | ✅ | `memo`+`displayName`, JSDoc `@example` |
| `src/components/ScrollingStaff.tsx` | ✅ | `memo`+`displayName`, RAF cleanup, single transform |
| `src/components/SpeedUpBanner.tsx` | ✅ | `memo`+`displayName`, GSAP cleanup, `role=status` |
| `src/components/ScorePanel.tsx` | ✅ | Extended with optional `songTitle`; `displayName` kept |
| `src/hooks/useMascotAnimation.ts` | ✅ | Per-emotion factory, tween kill on unmount |
| `src/hooks/useGroundShadow.ts` | ✅ | GSAP ticker cleanup, named physics constants |
| `src/hooks/useRunnerEngine.ts` | ✅ | Reducer+refs, ticker cleanup, `stateRef` via effect (lint) |
| `src/hooks/useRunnerMascot.ts` | ✅ | Event-driven hop/stumble, tween cleanup |
| `src/screens/RunnerGameScreen.tsx` | ✅ | Assembly only; hooks own logic |
| `src/screens/StartScreen.tsx` | ✅ | Real `<button>`s, `aria-*`, tap targets ≥44px |
| `src/screens/App.tsx` | ✅ | Mode routing `game-find` / `game-runner` |

**Fixes applied in T14:** `stateRef` sync moved to `useEffect` (useGameEngine + useRunnerEngine); lint fixes in NoteDisplay + PianoKeyboard assistive no-ops.
