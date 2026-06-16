# S10 Orientation & Safe-Area QA Results

Date: 2026-06-07 · Branch: `main` · Dev server `pnpm dev`

## Tooling

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ Pass |
| ESLint (touched files) | ✅ Pass |

## Viewports

| Viewport | Orientation | Result |
|---|---|---|
| 375×667 | portrait | ✅ Pass |
| 667×375 | landscape | ✅ Pass |
| 768×1024 | tablet portrait | ✅ Pass |
| 1280×800 | desktop | ✅ Pass |

## Safe area & console

| Check | Result |
|---|---|
| Gradient fills status-bar band (no white strip) | ✅ |
| Cold load console — zero Tone/AudioContext warnings | ✅ |
| Audio after first Play / key tap | ✅ |
| Favicon shows Melody mascot | ✅ |

## Screen checks

### Start

| Orientation | Zero scroll | CTA visible | Notes |
|---|---|---|---|
| Portrait | ✅ | ✅ | Assistive piano visible |
| Landscape | ✅ | ✅ | Piano hidden; copy + mascot row |

### Game (Find the Note)

| Orientation | Zero scroll | CTAs/touch ≥44px | Notes |
|---|---|---|---|
| Portrait | ✅ | ✅ | Column: ring → mascot → piano |
| Landscape | ✅ | ✅ | Row: ring + mascot centred; piano below |

### GameOver

| Orientation | Zero scroll | Play Again visible | Notes |
|---|---|---|---|
| Portrait | ✅ | ✅ | Centred panel |
| Landscape | ✅ | ✅ | Compact row variant; `text-4xl` score |

## Dev flags

| Flag | Result |
|---|---|
| `VITE_LAYOUT_TEST=true` | ✅ Stays on game screen after 3 misses |
| `VITE_LAYOUT_TEST=false` | ✅ Normal start → game → gameover flow |
| `?screen=gameover` | ✅ Jumps to GameOver for layout QA |
| Dev nav toolbar (layout test mode) | ✅ Start / Game / GameOver buttons |

## Tasks completed

- S10-T01 Safe Area Foundation
- S10-T02 Tone.js Lazy Init
- S10-T03 Layout Test Flag
- S10-T04 Mascot Favicon
- S10-T05 Game Screen Orientation Layout
- S10-T06 Start Screen Orientation Layout
- S10-T07 GameOver Spacing Pass
- S10-T08 Orientation Layout QA
