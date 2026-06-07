# MuseCool Game — Design System

## Concept: "Sunny Music World"

Warm gradient background × MuseCool brand palette × light glassmorphism from taskboard.
Not dark, not garish — warm cream fading into soft teal, white cards with gentle shadows.
Feels like a premium children's app: inviting, readable, playful but not chaotic.

Sources (priority order):
1. **README palette** — exact token names, locked, used as-is
2. **MuseCool brand** — warm/bright spirit, orange energy, teal calm
3. **taskboard-supabase** — light glass cards, soft shadows, smooth transitions

---

## Color Palette

### Source of truth — README tokens (DO NOT RENAME)

The piano component consumes these exact Tailwind token names.
Renaming any of them breaks the component.

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#FF9800` | Orange — CTAs, timer bar, pressed key, correct flash |
| `secondary` | `#0E92BA` | Teal — score panel, level badge, headings |
| `accent` | `#71C8BC` | Light teal — streak, success state |
| `neutral` | `#2B2B2B` | Black keys, dividers, dark text |
| `info` | `#0E92BA` | Same as secondary |
| `success` | `#71C8BC` | Same as accent |
| `warning` | `#FF9800` | Same as primary |
| `error` | `#EF4444` | Wrong answer feedback |
| `base-100` | `#FFFFFF` | White keys, card backgrounds |
| `base-200` | `#FFEFDB` | Warm cream — page background, warm surfaces |

### Game extras (non-conflicting additions)

| Token | Hex | Usage |
|---|---|---|
| `game-bg-from` | `#FFF5E6` | Gradient start — warm cream (slightly lighter than base-200) |
| `game-bg-to` | `#E4F4F2` | Gradient end — soft teal |
| `game-surface` | `#FFFFFF` | Glass card base (on light bg → white with opacity) |

### Semantic map

| Situation | Color |
|---|---|
| Body background | gradient `#FFF5E6 → #E4F4F2` (top-left → bottom-right) |
| Cards / panels | `white/80` + `backdrop-blur-xl` + soft shadow |
| Timer bar fill | `primary` orange → animates to `error` red when low |
| Correct answer | `success` teal bg tint + orange burst particle |
| Wrong answer | `error` red bg tint + shake |
| Score / streak | `secondary` teal |
| Piano white keys | `base-200` `#FFEFDB` |
| Piano black keys | `neutral` `#2B2B2B` |
| Pressed key | `primary` `#FF9800` |
| Note name text | `neutral` `#2B2B2B` (dark on light bg — readable for kids) |
| VexFlow staff | `secondary` teal lines, `primary` orange note head |

---

## Typography

**Font:** `Nunito` — rounded, friendly, legible for children, modern enough to feel premium.

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
```

| Role | Size | Weight |
|---|---|---|
| Note name (main target) | `clamp(4rem, 12vw, 7rem)` | 900 |
| Score / streak | `clamp(1.5rem, 4vw, 2.5rem)` | 800 |
| Button label | `1.125rem–1.25rem` | 700 |
| Body / instructions | `1rem` | 600 |

---

## Background

Warm cream → soft teal gradient. Feels like a summer day — energetic but calm.
Two subtle radial blobs add depth without noise.

```css
body {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 15% 20%, rgba(255,152,0,0.10) 0%, transparent 45%),
    radial-gradient(ellipse at 85% 80%, rgba(113,200,188,0.12) 0%, transparent 45%),
    linear-gradient(135deg, #FFF5E6 0%, #E4F4F2 100%);
}
```

The orange blob top-left echoes the piano's pressed-key color.
The teal blob bottom-right echoes the staff/score color.
Background is static — animation budget goes to GSAP game elements.

---

## Glassmorphism (light variant — taskboard-style on light bg)

On a light background, glass = white with opacity + blur + subtle border.
Cards feel lifted, airy, modern — not developer-prototype flat.

```css
/* Main game panel — score, level, streak */
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 1.5rem;
  box-shadow:
    0 4px 24px rgba(14, 146, 186, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.06);
}

/* Answer option buttons */
.glass-option {
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.18s ease;
}
.glass-option:hover {
  background: rgba(255, 152, 0, 0.08);
  border-color: rgba(255, 152, 0, 0.4);
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.18);
  transform: translateY(-2px);
}

/* Correct */
.glass-option--correct {
  background: rgba(113, 200, 188, 0.15);
  border-color: rgba(113, 200, 188, 0.6);
  box-shadow: 0 4px 20px rgba(113, 200, 188, 0.30);
}

/* Wrong */
.glass-option--wrong {
  background: rgba(239, 68, 68, 0.10);
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.20);
}
```

---

## Shadows (light-mode adapted, not neon)

On a light background, hard neon glows look cheap. Use soft colored shadows instead.

```js
boxShadow: {
  // Soft colored lifts — visible on light bg, kid-friendly
  'lift-orange': '0 4px 20px rgba(255,152,0,0.22), 0 1px 4px rgba(0,0,0,0.06)',
  'lift-teal':   '0 4px 20px rgba(14,146,186,0.20), 0 1px 4px rgba(0,0,0,0.06)',
  'lift-green':  '0 4px 20px rgba(113,200,188,0.22), 0 1px 4px rgba(0,0,0,0.06)',
  'lift-red':    '0 4px 20px rgba(239,68,68,0.22), 0 1px 4px rgba(0,0,0,0.06)',
  // Glass card elevations
  'glass':       '0 4px 24px rgba(14,146,186,0.08), 0 1px 4px rgba(0,0,0,0.06)',
  'glass-lg':    '0 8px 40px rgba(14,146,186,0.12), 0 2px 8px rgba(0,0,0,0.08)',
  'glass-xl':    '0 16px 60px rgba(14,146,186,0.15), 0 4px 16px rgba(0,0,0,0.10)',
}
```

---

## Border Radius

| Element | Radius |
|---|---|
| Game screen card | `1.5rem` (24px) |
| Answer buttons | `1rem` (16px) |
| Countdown ring | circular (SVG `r`) |
| Score badge | `0.75rem` (12px) |
| Mascot bubble | `2rem` (32px) |

---

## Animation Palette (GSAP)

| Action | Easing | Duration |
|---|---|---|
| Note entrance (fly in from right) | `elastic.out(1, 0.6)` | 0.5s |
| Countdown ring depletion | `none` (linear, GSAP timeline) | per level |
| Correct burst (scale up + fade) | `back.out(2)` | 0.35s |
| Wrong shake (horizontal) | `power2.inOut` | 0.4s, 3 cycles |
| Mascot idle breathe | `sine.inOut`, yoyo | 2s loop |
| Mascot celebrate jump | `bounce.out` | 0.6s |
| Mascot sad wilt | `power3.out` | 0.5s |
| Level-up screen flash | `power4.out` | 0.3s |
| Button press feedback | `back.out(3)` scale 0.92→1 | 0.2s |

---

## Component Inventory

### Body / Screen
- Background: `linear-gradient(135deg, #FFF5E6, #E4F4F2)` + two radial blobs
- All screens (Start, Play, GameOver) fade in with GSAP `power2.out`, 0.3s

### Countdown Ring (the ONLY timer — wraps the note)
- SVG ring around the note zone, depletes via `stroke-dashoffset`
- Driven by `useGameTimeline` `progressRef` through a RAF loop (no re-renders)
- Stroke `primary` orange; below 25% → `error` red + GSAP yoyo pulse
- Round linecaps, soft brand-color `drop-shadow` glow
- Single-focus design: child's eyes stay on the note (no separate top bar)

### Score / Streak Panel (top glass card)
- `glass-panel`, compact, top of screen
- Score: `text-secondary` weight-800
- Streak: `🎵 × N` in `text-primary` orange

### Note Display (center stage — sits inside the Countdown Ring)
- VexFlow staff: teal lines, orange note head — SVG, centered
- Giant note name below: `text-note` size, `text-neutral` weight-900
- Entrance: flies in from right, `elastic.out` ease

### Answer Buttons (2 × 2 grid)
- `glass-option`, `rounded-2xl`
- Font: `1.25rem` weight-700, `text-neutral`
- Min height: `64px` (mobile tap target)
- States: default → hover (orange lift) → correct (teal) → wrong (red shake)

### Mascot (SVG character)
- Positioned bottom-right, floats above piano
- States: `idle` (breathing loop) / `correct` (jump) / `wrong` (wilt) / `hurry` (nervous bounce)
- Size: `80px` mobile, `120px` desktop

### Piano Keyboard (bottom, fixed)
- `fixed bottom-0 left-0 right-0`
- Provided component, unchanged
- White keys: `base-200` cream — blends into warm background naturally

---

## Full tailwind.config.js

```js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        game: ['Nunito', 'sans-serif'],
      },
      colors: {
        // ── README tokens — DO NOT RENAME (piano component depends on these) ──
        primary:    '#FF9800',
        secondary:  '#0E92BA',
        accent:     '#71C8BC',
        neutral:    '#2B2B2B',
        info:       '#0E92BA',
        success:    '#71C8BC',
        warning:    '#FF9800',
        error:      '#EF4444',
        'base-100': '#FFFFFF',
        'base-200': '#FFEFDB',
        // ── Game extras ───────────────────────────────────────────────────────
        game: {
          'bg-from':  '#FFF5E6',  // gradient start — warm cream
          'bg-to':    '#E4F4F2',  // gradient end — soft teal
        },
      },
      backgroundImage: {
        'game-bg': 'linear-gradient(135deg, #FFF5E6 0%, #E4F4F2 100%)',
      },
      boxShadow: {
        'lift-orange': '0 4px 20px rgba(255,152,0,0.22), 0 1px 4px rgba(0,0,0,0.06)',
        'lift-teal':   '0 4px 20px rgba(14,146,186,0.20), 0 1px 4px rgba(0,0,0,0.06)',
        'lift-green':  '0 4px 20px rgba(113,200,188,0.22), 0 1px 4px rgba(0,0,0,0.06)',
        'lift-red':    '0 4px 20px rgba(239,68,68,0.22), 0 1px 4px rgba(0,0,0,0.06)',
        'glass':       '0 4px 24px rgba(14,146,186,0.08), 0 1px 4px rgba(0,0,0,0.06)',
        'glass-lg':    '0 8px 40px rgba(14,146,186,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        'glass-xl':    '0 16px 60px rgba(14,146,186,0.15), 0 4px 16px rgba(0,0,0,0.10)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        'note':     ['clamp(4rem,12vw,7rem)', { lineHeight: '1', fontWeight: '900' }],
        'score':    ['clamp(1.5rem,4vw,2.5rem)', { fontWeight: '800' }],
        'fluid-sm': 'clamp(0.875rem,1.2vw,1rem)',
        'fluid-lg': 'clamp(1.125rem,2vw,1.5rem)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
```
