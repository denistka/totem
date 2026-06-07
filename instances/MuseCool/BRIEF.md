# MuseCool Take-Home — Strategic Brief

## Company context

MuseCool = London's largest music school, building **The Muse** — a platform for
real-time lesson analysis with live piano input. They're hiring a **Frontend Engineer
(Music Education Games)** to build interactive games that respond to live piano playing.

**This test IS the job.** The note-finding game is a miniature version of what Denis would
build every day: real-time audio → visual feedback → timing precision.

---

## WOW strategy

### Core principle
Every technical decision must double as a portfolio signal for the actual role.
Don't just ship a game — ship a proof-of-concept for their real product.

---

### #1 — GSAP as the game engine backbone (not Framer Motion)

They suggest Framer Motion, but Denis's GSAP expertise is a direct match to their
"timing precision" and "audio-visual synchronisation" requirements.

**What to do:**
- Drive the timer bar with a GSAP timeline (`gsap.timeline()` + `onUpdate`)
- Note entrance: GSAP-powered fly-in with bounce ease
- Answer feedback: GSAP-driven shake (wrong) / scale burst (correct)
- Build a `useGameTimeline` hook that wraps GSAP — shows architecture thinking

**Signal sent:** "I can build the real-time, frame-precise animations your lesson engine needs."

---

### #2 — Animated SVG mascot (idle + reaction states)

They need "real-time visual feedback" in their actual product. A reactive SVG character
controlled by GSAP timelines is a direct demo of that capability.

**What to do:**
- Simple SVG character (music note with face, or small animal with headphones)
- States: `idle` (breathing loop), `correct` (jump/spin), `wrong` (shake/wilt), `countdown` (nervous)
- State machine: `useCharacter(state)` hook drives GSAP timelines
- Keep the SVG small and clean — 30–50 paths max, no complexity for its own sake

**Signal sent:** "I can build the animated, emotionally-responsive UI your platform needs."

---

### #3 — Audio-visual sync with Tone.js

Play the note the moment it appears. This is ear training + visual recognition simultaneously,
and it directly demonstrates audio-visual synchronisation skill.

**What to do:**
- `engine.tapMidi(correctMidi)` fires on note spawn
- Wrong answer: short dissonant chord + GSAP screen shake
- Correct answer: ascending arpeggio + particle burst (GSAP)
- Preload samples on Start screen mount (`engine.preload()`)

**Signal sent:** "I understand the audio side, not just the visual side."

---

### #4 — VexFlow staff notation

They use VexFlow internally. Using it in the test signals cultural alignment.
Even showing just a treble clef with the target note (not a full score) is enough.

**What to do:**
- SVG-based staff rendered via VexFlow, note highlighted in colour
- Animate the note appearing on the staff with GSAP (fade + scale in)
- On wrong answer: the note briefly shakes on the staff

**Signal sent:** "I've already used the tools you use. Zero ramp-up."

---

### #5 — Difficulty that makes musical sense

Don't just increase speed. Add musical progression:
- Level 1: C, D, E, F, G (5 white keys, C4–G4)
- Level 2: full C major scale (C4–C5)
- Level 3: add sharps/flats
- Level 4: two octaves

This shows music knowledge (a stated requirement) and smart UX design.

---

### #6 — The README is a cover letter

They explicitly ask for "what tools you used including LLMs". This is an invitation.

**Write:**
- Why GSAP over Framer Motion (timing precision, GSAP timeline as game clock)
- Why VexFlow (alignment with their stack, ear training value)
- Honest LLM usage: used Claude for scaffolding + piano component integration,
  owned animation architecture and game design decisions personally
- What you'd build next: multiplayer, live MIDI input, tutor dashboard

---

## Time budget (~10–12 hours — extended scope for WOW)

User confirmed the extra time is worth it for the WOW layer (living mascot + juice).
Core game still completable in ~6h; the delight layer is the differentiator.

| Block | Hours | What |
|---|---|---|
| S01 Foundation (scaffold, Tailwind, piano, PWA, Vercel) | 1.5h | Deployable empty shell |
| S02 Game core (types, pool, engine, levels) | 1.5h | Pure logic, testable |
| S03 Animation + JUICE (timer, entrance, feedback, particles, audio) | 2.5h | GSAP layer + confetti + arpeggios |
| S04 UI + LIVING MASCOT (panels, VexFlow, grid, mascot art+behaviors, assembly) | 2.5h | The character is the centrepiece |
| S05 Screens & flow (start, gameover, routing) | 1h | Full loop |
| S06 PWA hardening + deploy | 1h | iOS/Android installable |
| S07 README + final QA | 1h | Cover-letter README + cross-device QA |
| Buffer | 1h | |

### The two WOW differentiators (where the extra hours go)
1. **Living mascot (S04-T04 + S04-T06):** not a bouncing blob — blinks, breathes, pupils
   track the note, gets excited on streaks. This is Denis's animation signature and the #1
   thing the JD asks for ("a character with animation that brings the game to life").
2. **Juice (S03-T05 + S03-T06):** particle confetti + ascending arpeggio on correct,
   screen shake + dissonant chord on wrong. Audio-visual sync = a live demo of the exact
   skill the role requires ("animations that respond to live audio").

---

## Tech stack (final)

| Layer | Choice | Why |
|---|---|---|
| Framework | React + TypeScript | Required |
| Build | Vite | Fast, simple |
| Styling | Tailwind CSS | Piano component requires it |
| Animation | **GSAP** | Timing precision, Denis's core skill |
| Audio | Tone.js | Already in piano component |
| Notation | VexFlow | Muse's internal tool |
| State | React state + custom hooks | Task brief says keep it simple |
| Deploy | Vercel | One command |

---

## Deliverables checklist

- [ ] Working game (start → play → game over → restart)
- [ ] Piano keyboard component integrated (+ mx-auto fix noted)
- [ ] LIVING SVG mascot — blink, breathe, eye-tracking, streak reactions (not just states)
- [ ] VexFlow staff notation
- [ ] GSAP-driven timer bar + feedback
- [ ] Juice: particle confetti on correct, screen shake on wrong
- [ ] Audio feedback: arpeggio on correct, dissonant chord on wrong (Tone.js)
- [ ] Mobile-first layout + installable PWA (iOS + Android)
- [ ] Git repo + README (design decisions, LLM usage, tradeoffs, what's next)
