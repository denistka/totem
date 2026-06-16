# S09 Landscape Audit — 667×375

Viewport: **667×375 landscape** (primary), **736×414** (secondary).  
Audit date: 2026-06-05 · pre-fix baseline from layout inspection.

## Piano height @ 667×375

| Config | Approx. keybed height |
|---|---|
| Full C4–B5 (24 keys) | ~165–180 px (dominant overflow source) |
| Compact C4–B4 (12 keys) | ~95–120 px (target ≤120 px) |

## Find — GameScreen

| Element | Symptom | Fix | Priority |
|---|---|---|---|
| Mascot `min(42vh,11rem)` | ~158 px tall → pushes piano below fold | `landscape-mascot-sm` 64 px + flex-row | P0 |
| Countdown ring 128 px max | Too large for 375 px height | `min(80, vw×0.12, vh×0.22)` | P0 |
| Score panel `py-2` | Wastes vertical space | `landscape-score-tight` | P1 |
| Piano C4–B5 | Keybed > half viewport | `useLandscapePianoRange` → C4–B4 | P0 |

## Runner — RunnerGameScreen

| Element | Symptom | Fix | Priority |
|---|---|---|---|
| Staff 140 px + mascot 80 px + piano | Vertical scroll | Staff `height=100` in compact | P0 |
| Runner mascot bottom-6 | Clips on short landscape | Smaller + `bottom-4` in compact | P1 |
| Piano full range | Same as Find | Shared `useLandscapePianoRange` | P0 |

## Start

| Element | Symptom | Fix | Priority |
|---|---|---|---|
| `text-5xl` title | Too tall stacked with CTAs | `landscape-start-title` text-3xl | P0 |
| Assistive piano bottom | Steals ~120 px | `landscape-start-piano-hide` | P0 |
| Vertical stack | CTAs below fold | `landscape-start-row` side-by-side | P0 |
| Mascot 112 px | Oversized | `landscape-start-mascot` ≤80 px | P1 |

## GameOver

| Element | Symptom | Fix | Priority |
|---|---|---|---|
| `text-6xl` score + `p-8` gap | Panel taller than viewport | `landscape-gameover-panel` max-h 90vh | P0 |
| Score `text-6xl` | Clips CTA | `landscape-gameover-score` text-4xl | P0 |

## P0 fix list (implemented S09-T02–T04)

1. Landscape CSS utilities in `index.css`
2. `useLandscapePianoRange` hook (C4–B4 compact)
3. Game + Runner layout compaction
4. Start row layout + hide assistive piano
5. GameOver panel clamps
