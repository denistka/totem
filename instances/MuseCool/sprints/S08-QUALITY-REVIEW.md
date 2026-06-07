# S08 Quality Review — MuseCool vs Requirements

Audit by PLANNER against `incoming/task.md` + `incoming/letter.md`.
Verdict: **core is solid, WOW layer is under-delivered**. The character and the
"Chrome-dino" reference are the two biggest missed opportunities.

## Requirements coverage (task.md)

| Requirement | Status | Note |
|---|---|---|
| One note at a time | ✅ | `useGameEngine` + `NoteDisplay` |
| Choose from multiple options | ✅ | Piano keyboard = the option set |
| Gets faster / harder | ✅ | Timer shrinks 5s→1.5s, pool widens L1→L4 |
| Immediate feedback correct/wrong | ✅ | Particles, shake, audio, mascot |
| Score / streak | ✅ | `ScorePanel`, streak multiplier |
| Ends on mistakes/timeout/miss | ✅ | 3 mistakes → gameover; expire = wrong |
| Start / play / gameover / restart | ✅ | `App.tsx` routing |
| Difficulty progression mechanic | ✅ | Speed + pool (two mechanics) |
| Kid UI: big targets, clear, bright | ✅ | Warm palette, piano keys, glass |
| Character with animation | ⚠️ | Present but shallow — see gaps |
| Visual polish, playful | ✅ | Good baseline, can go further |
| Audio (optional) | ✅ | Tone.js arpeggio / dissonant chord |
| React + TS | ✅ | |
| VexFlow (recommended) | ✅ | Staff notation |
| Keep state simple | ✅ | Hooks only, no store |
| README (run/design/tradeoffs/LLM) | ✅ | Drafted |

**Bonus ideas (task.md lines 78–85):** lives/slow-on-mistake, speed-on-streak,
auto note generation following a scale/key, chords, key changes. → We will hit
**speed-on-streak** + **scale-following melodies** hard in Mode 2.

## Gaps to fix (this sprint)

### G1 — Character is emotionally flat (P0, WOW)
- Only 4 states; `idle` and `hurry` share the same mouth path (MascotSVG.tsx L41–45).
- No brows, no varied mouth, no sweat/sparkle/zzz props, no wink.
- `correct` = single hop, `wrong` = rotate shake. Not enough range for a 5–11 audience.
- **Fix:** expand to a real emotion set (idle, happy, celebrate, wink, wrong, sad,
  nervous/hurry, sleepy, cheer-streak) with distinct face + body GSAP per emotion.

### G2 — Shadow rides the mascot (P0)
- Shadow `<ellipse>` is inside the same `<svg>` that GSAP translates on `y`
  (useMascotAnimation jump), so the shadow jumps too — physically wrong.
- **Fix:** detach shadow into its own element on the ground plane; when mascot lifts,
  shadow **shrinks + fades** (smaller/ lighter when higher), independent tween.

### G3 — Chrome-dino reference unused (P0, WOW = Mode 2)
- task.md explicitly suggests the Chrome dino runner. We only built a static note.
- **Fix (user direction):** Mode 2 = side-scrolling runner where the **staff scrolls**
  (notes run toward a hit-line), the avatar runs along the ground and hops to help the
  child land notes **in time / in duration**. Real children's melodies.

### G4 — No rhythm / duration dimension (P1, WOW)
- Current game tests pitch only. task.md bonus mentions chords/duration.
- **Fix:** Mode 2 introduces note **durations** (quarter/half/eighth) and a hit window.

### G5 — Random notes, no musicality (P1)
- `generateQuestion` picks random pool notes — no melody, no key feel.
- **Fix:** Mode 2 plays **known tunes** (Twinkle, Mary Had a Little Lamb, Jingle Bells,
  Happy Birthday, Ode to Joy) so the child hears a real song emerge.

### G6 — Adaptive difficulty is mechanical (P1)
- Level-up = every 5 corrects, hard step. No encouragement, no "earned" feel.
- **Fix:** Mode 2 speeds up only after clean play, with a friendly warning banner
  ("Great! Let's try a bit faster 🚀") before each ramp.

### G7 — Landscape 667×375 unverified (P1) → deferred to S09
- Smallest landscape phone not audited; piano height likely dominates.

## Decisions locked for S08
- Mode 1 (Find) stays as-is; all new logic in **separate hooks/screens** (no regression).
- Character upgrades apply to **all screens** (Start, Find, Runner, GameOver).
- Landscape + final README/QA split into **S09** to keep S08 shippable.
