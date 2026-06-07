# Piano Keyboard Component

This is a ready-to-use on-screen piano keyboard component for your take-home task. It saves you from having to build one from scratch so you can focus on the game logic, visual design, and overall product experience.

---

## What's included

```
src/
  components/
    PianoKeyboard.tsx     ← the component you'll use directly
    KeyboardKeybed.tsx    ← internal: the measured, absolutely-positioned key layout
    PianoKey.tsx          ← internal: a single white or black key
  hooks/
    useNoteFinderKeyboardAudio.ts   ← Tone.js hook (Salamander Grand Piano samples)
  lib/
    noteFinderPianoLayout.ts        ← MIDI range constants, key layout builder, MIDI utilities
    noteFinderKeyboardGeometry.ts   ← pixel metrics (key sizing, black key proportions)
    noteFinderKeyboardAudioEngine.ts ← singleton Tone.js sampler
```

You only need to import `PianoKeyboard`. The rest are internal dependencies.

---

## Setup

### 1. Install the one required dependency

```bash
npm install tone
```

Tone.js is used for the Salamander Grand Piano audio (real piano samples fetched from GitHub at runtime). Everything else is standard React.

### 2. Copy the files

Drop the `src/` folder (or just the files inside it) into your project. The components use relative imports so they'll work anywhere.

### 3. Tailwind CSS

The component is styled with Tailwind utility classes. You'll need Tailwind set up in your project with the semantic color tokens below registered in your `tailwind.config.js`. See the **Colour palette** section.

### 4. Next.js App Router only

If you're using Next.js App Router, the `'use client'` directives at the top of each component file are required. If you're using a different React setup (Vite, CRA, etc.), remove those directives — they're just Next.js conventions.

---

## Usage

```tsx
import { useState } from 'react';
import { PianoKeyboard } from './components/PianoKeyboard';

const MyGame = () => {
  const [pressedMidi, setPressedMidi] = useState<number | null>(null);

  return (
    <PianoKeyboard
      pressedMidi={pressedMidi}
      onChangePressed={setPressedMidi}
    />
  );
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pressedMidi` | `number \| null` | required | The currently pressed MIDI note number, or `null`. Managed by your state. |
| `onChangePressed` | `(midi: number \| null) => void` | required | Called when the user presses or releases a key. |
| `hintMidi` | `number \| null` | `null` | Optionally pulse-highlight a key as the correct answer (e.g. after a wrong guess or timeout). |
| `variant` | `'interactive' \| 'assistive'` | `'interactive'` | `'assistive'` renders a display-only keyboard with no touch handlers or audio — useful for showing an answer. |
| `lowMidi` | `number` | `60` (C4) | Override the lowest note in the range. Should start on a C for correct visual grouping. |
| `highMidi` | `number` | `83` (B5) | Override the highest note in the range. |

### MIDI note numbers

The component works with MIDI note numbers. Useful values:

| Note | MIDI |
|------|------|
| C3 | 48 |
| C4 (middle C) | 60 |
| D4 | 62 |
| E4 | 64 |
| F4 | 65 |
| G4 | 67 |
| A4 | 69 |
| B4 | 71 |
| C5 | 72 |
| B5 | 83 |

The default range is **C4–B5** (MIDI 60–83), which covers the common treble practice range.

For a simpler children's game, you might want to narrow the range — e.g. just **C4–B4** (MIDI 60–71):

```tsx
<PianoKeyboard
  pressedMidi={pressedMidi}
  onChangePressed={setPressedMidi}
  lowMidi={60}
  highMidi={71}
/>
```

### Showing the correct answer

After a wrong guess or timeout, pass `hintMidi` to pulse-highlight the correct key:

```tsx
<PianoKeyboard
  pressedMidi={pressedMidi}
  onChangePressed={setPressedMidi}
  hintMidi={correctAnswerMidi}
/>
```

### Display-only / answer reveal

Use `variant="assistive"` to render the keyboard without interaction (useful for a "here's the answer" state):

```tsx
<PianoKeyboard
  pressedMidi={null}
  onChangePressed={() => {}}
  hintMidi={correctAnswerMidi}
  variant="assistive"
/>
```

### Useful utility from `noteFinderPianoLayout.ts`

```ts
import { midiToShortLabel } from './lib/noteFinderPianoLayout';

midiToShortLabel(60); // → "C4"
midiToShortLabel(69); // → "A4"
midiToShortLabel(61); // → "C#4"
```

---

## Audio

The component uses [Tone.js](https://tonejs.github.io/) with the free [Salamander Grand Piano](https://github.com/Tonejs/audio) samples. Samples are fetched from GitHub at runtime — no local audio files needed.

**Important browser rule:** audio can only start after a user gesture. Tone.js handles this automatically: `auditionDown` calls `Tone.start()` internally on the first interaction. Before the first tap/click, the keyboard is silent.

You can preload the samples before the first interaction (no user gesture needed for preloading):

```ts
import { getNoteFinderKeyboardAudioEngine } from './lib/noteFinderKeyboardAudioEngine';

// Call this early (e.g. on game start screen mount) to begin downloading samples.
// The keyboard will be ready to play sooner.
getNoteFinderKeyboardAudioEngine().preload();
```

If you want to play notes programmatically (e.g. to play back the target note as a hint):

```ts
import { getNoteFinderKeyboardAudioEngine } from './lib/noteFinderKeyboardAudioEngine';

const engine = getNoteFinderKeyboardAudioEngine();

engine.tapMidi(60);           // short tap: middle C
engine.tapMidi(60, 0.8, '4n'); // quarter-note duration
```

---

## Colour palette

The keyboard uses Tailwind semantic color tokens. Add the following to your `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // adjust to your project
  theme: {
    extend: {
      colors: {
        primary:   '#FF9800',  // orange — used for pressed keys and highlights
        secondary: '#0E92BA',  // teal blue
        accent:    '#71C8BC',  // light teal
        neutral:   '#2B2B2B',  // near-black — used for black keys and borders
        info:      '#0E92BA',
        success:   '#71C8BC',
        warning:   '#FF9800',
        error:     '#EF4444',  // red
        'base-100': '#FFFFFF', // white — used for white keys
        'base-200': '#FFEFDB', // warm cream — background tone
      },
    },
  },
};
```

### Palette at a glance

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#FF9800` | Pressed keys, highlights, CTAs |
| `secondary` | `#0E92BA` | Accents, info states |
| `accent` | `#71C8BC` | Softer accents, success states |
| `neutral` | `#2B2B2B` | Black keys, borders, dividers |
| `error` | `#EF4444` | Wrong answer feedback |
| `success` | `#71C8BC` | Correct answer feedback |
| `base-100` | `#FFFFFF` | White keys, card backgrounds |
| `base-200` | `#FFEFDB` | Warm cream — page/game background |

The keyboard itself only relies on `primary`, `neutral`, and `base-100`. The rest are here for you to use across your game UI.

---

## Layout tips

- The keyboard fills the **full width** of its container. Constrain the container width to control its size.
- Key height is derived automatically from key width to keep natural proportions.
- It's fully responsive and works on both desktop and mobile touch.
- The outer `PianoKeyboard` wrapper includes some padding; if you need the raw keybed flush to an edge, use `KeyboardKeybed` directly (pass it a `KeybedLayoutModel` from `buildKeybedLayoutModel`).

```tsx
// Full width, flush to the bottom of the screen:
<div className="fixed bottom-0 left-0 right-0">
  <PianoKeyboard
    pressedMidi={pressedMidi}
    onChangePressed={setPressedMidi}
  />
</div>
```

---

Good luck — we're looking forward to seeing what you build!
