# S09 Cross-Device QA Results

Date: 2026-06-05 · Branch: `new-level` · Dev server `pnpm dev`

## Viewports

| Viewport | Orientation | Result |
|---|---|---|
| 375×667 | portrait | ✅ Pass |
| 667×375 | landscape | ✅ Pass (post S09 compaction) |
| 768×1024 | tablet portrait | ✅ Pass |
| 1280×800 | desktop | ✅ Pass |

## Mode 1 — Find the Note

| Check | Result |
|---|---|
| Start → Play → answer → gameover → restart | ✅ |
| Console errors | ✅ None observed |
| Mascot emotions + grounded shadow | ✅ |
| Countdown ring + piano tap | ✅ |

## Mode 2 — Note Runner

| Check | Result |
|---|---|
| Melody picker → play → hit notes → gameover | ✅ |
| Twinkle recognisable when played correctly | ✅ |
| Speed ramp + banner after 8 clean hits | ✅ |
| 3 misses → gameover | ✅ |
| Scrolling staff perf (single transform) | ✅ No jank observed |

## Landscape 667×375

| Screen | Zero scroll | CTAs visible |
|---|---|---|
| Start | ✅ | ✅ (piano hidden) |
| Find | ✅ | ✅ |
| Runner | ✅ | ✅ |
| GameOver | ✅ | ✅ |

## PWA

| Check | Result |
|---|---|
| `theme_color` #FF9800 | ✅ (manifest unchanged) |
| `display: standalone` | ✅ |
| `--app-height` visualViewport | ✅ |

## Notes

- One pre-existing ESLint **warning** in `CountdownRing` cleanup (not a runtime defect).
- Uncommitted WIP from pre-sprint branch work remains in working tree (user choice: build on top).
