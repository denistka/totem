# S44 Design Invariants — DO NOT BREAK in S45

> This file documents **every custom case, nuance, and design decision** from Sprint 44
> that MUST be preserved during S45 refactoring.
> Before ANY change, check against this list.

---

## 🔒 CSS Design Tokens (index.css :root)

### Light Theme Glass Tokens (KEEP EXACT VALUES)

```css
--glass-bg-opacity:
  0.38 /* NOT higher — transparency is key */ --glass-input-bg-opacity: 0.14
    /* Deliberately low — inputs blend with BG */ --glass-glow-bg-opacity: 0.32
    /* CTA buttons slightly more opaque */ --glass-blur: 14px
    /* Tuned for performance + aesthetics */ --glass-shadow: 0 4px 24px
    rgba(0, 0, 0, 0.06),
  0 1px 3px rgba(0, 0, 0, 0.04) --glass-border: rgba(255, 255, 255, 0.4)
    /* White border for glass edge effect */
    --glass-border-inner: rgba(255, 255, 255, 0.6)
    /* Stronger inner highlight */ --glass-glow-text: 74 50% 18%
    /* DARK text on glow buttons (light theme!) */ --glass-transition: 280ms
    cubic-bezier(0.4, 0, 0.2, 1) /* NOT 200 or 300! */;
```

### Dark Theme Overrides (DIFFERENT from light!)

```css
--glass-bg-opacity: 0.44 /* Higher than light (0.38) — panels visible */
  --glass-blur: 16px /* Slightly more blur in dark mode */ --glass-glow-text: 0
  0% 98% /* LIGHT text on glow buttons (dark theme!) */
  --glass-border: rgba(255, 255, 255, 0.14) /* Subtler than light */
  --glass-border-inner: rgba(255, 255, 255, 0.22) --glass-shadow: ...
  rgba(0, 0, 0, 0.35) /* Stronger shadows for depth */
  --glass-input-bg: rgba(0, 0, 0, 0.08) /* Near-transparent in dark */
  --glass-strong-bg-opacity: 0.56 /* Only in dark, overrides light 0.5 */;
```

### ⚠️ Key Nuance: `--glass-glow-text`

- Light theme: `74 50% 18%` → dark olive text (PRIMARY button must be readable!)
- Dark theme: `0 0% 98%` → near-white text
- This is NOT `--foreground`! It's a separate token.

---

## 🔒 Glass CSS Classes — Custom Overrides

### `.glass` has element-specific overrides:

```css
/* header.glass and nav.glass → NO border, only shadow */
header.glass,
nav.glass {
  border: none;
  box-shadow: var(--glass-shadow);
}

/* button.glass and div.glass → NO border, lower opacity, lighter shadow */
button.glass,
div.glass {
  border: none;
  background-color: hsl(var(--background) / 0.34);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* DARK override for button.glass / div.glass → different values! */
.dark button.glass,
.dark div.glass {
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
```

**⚠️ If you refactor `.glass` into sub-variants, KEEP these overrides.**

### `.glass-input` special behaviors:

1. Has `contain: layout style` (NOT `contain: layout style paint` like `.glass`)
2. Has `animation: glass-input-pulse 4s ease-in-out infinite`
3. All interactive states (`:hover`, `:focus-within`) explicitly set `animation: none` first
4. `data-state="error"` and `data-state="success"` are the attribute API
5. `prefers-reduced-motion` kills animation AND sets static glow

### `.glass-glow` (CTA button) specifics:

1. `overflow: visible` — NOT hidden! (glow extends beyond button)
2. `::before` pseudo-element extends `inset: -14px` for glow halo
3. Rainbow animation: `rainbow-glow-pulse 12s linear infinite`
4. Filter: `blur(28px)` on the pseudo-element
5. `z-index: -1` on ::before — goes BEHIND button

---

## 🔒 Performance Optimizations (DO NOT REMOVE)

```css
/* Hardware acceleration — specific elements only */
.glass-input,
.glass-glow::before,
.app-bg__layer--overlay {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* CSS containment — all glass surfaces */
.glass-input,
.glass-glow,
.glass,
.glass-strong {
  contain: layout style paint;
}

/* Reduced motion — global kill switch */
@media (prefers-reduced-motion: reduce) {
  .glass-input,
  .glass-glow::before,
  .app-bg__layer--overlay {
    will-change: auto;
    transform: none;
    animation: none;
  }
}
```

---

## 🔒 Animation Keyframes (3 custom animations)

### 1. `glass-input-pulse` (4s ease-in-out infinite)

- Oscillates between `--glass-input-glow-min` and `--glass-input-glow-max`
- Creates subtle breathing effect on idle inputs
- Killed by hover, focus, error, success states

### 2. `rainbow-glow-pulse` (12s linear infinite)

- Rotates hue from `0deg` through `120°`, `240°`, back to `360°`
- Applied ONLY to `.glass-glow::before`
- Creates rainbow glow effect on primary CTA buttons

### 3. `object-badge-dot-pulse` (1.5s ease-in-out infinite)

- Pulse on vehicle badge dots (fuel level indicators)
- Scale-based: `scale(0.6)` → `scale(1.2)` → `scale(0.6)`
- Respects `prefers-reduced-motion`

---

## 🔒 Component Variants (button.tsx)

### Glass Variants (added in S44):

```typescript
// KEEP these variant names — they are the S44 API
variant: {
  glass:        'glass h-12 px-4 ...',        // Standard glass button
  'glass-strong': 'glass-strong h-12 px-4 ...', // Strong glass
  'glass-glow':   'glass-glow h-14 px-6 ...',   // Primary CTA
  'glass-subtle': 'h-10 px-3 ...',              // Minimal glass
  'glass-outline': 'glass h-10 px-4 border-2 ...' // Outlined glass
}

// Glass sizes (added in S44):
size: {
  'glass-sm':     'h-9 rounded-lg px-3 text-xs',
  'glass-lg':     'h-14 rounded-xl px-6 text-lg',
  'glass-icon':   'h-10 w-10 rounded-lg',
  'glass-icon-lg': 'h-12 w-12 rounded-xl',
}
```

**⚠️ S45 may change heights (e.g. h-10→h-11) but must NOT rename variants.**

### Input Glass Variant (added in S44):

```typescript
// input.tsx
variant: {
  glass: "glass-input rounded-xl border-0 ...";
}
```

---

## 🔒 GlassButton Component (glass-button.tsx, 127 lines)

Separate from `Button` — has additional props:

- `loading` → shows spinner
- `leftIcon` / `rightIcon` → icon slots
- `fullWidth` → w-full variant
- Uses `glassButtonVariants` from CVA (NOT shared with `buttonVariants`)

**⚠️ GlassButton and Button are TWO separate components. Don't merge them in S45.**

---

## 🔒 GlassCard Component (glass-card.tsx, 78 lines)

- Variants: `default` (glass), `strong` (glass-strong), `subtle` (glass + backdrop-blur-sm)
- Sizes: sm (p-3), default (p-4), lg (p-6), xl (p-8)
- `interactive: true` → `hover:scale-[1.02] active:scale-[0.98]`
- Props: `header`, `footer` — optional slots
- `rounded-xl border transition-all duration-280`

---

## 🔒 GlassInputWrapper Component (glass-input-wrapper.tsx, 109 lines)

- Uses `React.cloneElement` to inject classes into child input
- Icon positioning: `left-3.5 top-1/2 z-10`
- Icon color: `text-primary` (NOT text-muted-foreground!)
- `data-state` attribute injected for error/success glows
- Size variants match themselves: sm=h-9, default=h-12, lg=h-14

---

## 🔒 Background System (app-bg.tsx)

- `BG_ANIM_IMAGES`: Rotates 1-4.webp backgrounds (15s interval)
- Overlay classes: `.app-bg__layer--overlay`
- Pulse animation with randomized duration (500-5000ms)
- Light/dark overlay colors from tokens
- Event listener cleanup in useEffect

---

## 🔒 Logo Component (logo.tsx)

- 3 variants: icon-only, vertical (icon + text stacked), horizontal
- Vertical layout: NAVITRACK (italic, large) + "Monitoring Systems" (small, tight)
- Used in Login screen and MobileHeader
- No inline styles
- Responsive sizing: h-12 to h-44

---

## 🔒 Theme-Specific Quirks

1. **Primary color differs**: light `74 60% 44%`, dark `74 60% 48%` (4% higher saturation)
2. **Destructive**: same HSL in both themes, but foreground changes
3. **Background**: light `0 0% 98%`, dark `0 0% 4%` (near black)
4. **Map tokens**: `--map-bg`, `--map-grid` have separate light/dark values
5. **`safe-bottom`** class used on bottom nav (for iPhone notch area)

---

## 🔒 Anti-Patterns Established in S44

These rules were established and MUST be carried forward:

- ❌ No inline `style={}` — use CSS classes
- ❌ No CSS-in-JS — use .css files
- ❌ No `!important` — ever
- ❌ No ID selectors in CSS
- ❌ No fixed widths — use min/max/clamp
- ❌ No JS-driven responsive logic — CSS only

---

## 📋 S45 Compatibility Checklist

Before completing ANY S45 task, verify:

- [ ] All `--glass-*` tokens preserved (exact values)
- [ ] Light/dark theme differences maintained
- [ ] `glass-glow ::before` with `inset: -14px` still works
- [ ] `glass-input` pulse animation still runs on idle inputs
- [ ] `prefers-reduced-motion` kills all animations
- [ ] `contain: layout style paint` on glass surfaces
- [ ] `will-change` on animated elements
- [ ] `button.glass` / `div.glass` overrides (no border, lower opacity)
- [ ] `header.glass` / `nav.glass` overrides (no border)
- [ ] `data-state` API for input error/success
- [ ] GlassButton, GlassCard, GlassInputWrapper unchanged API
- [ ] Button variant names unchanged (glass, glass-strong, etc.)
- [ ] Logo component untouched
- [ ] AppBg animation untouched
- [ ] object-badge-dot-pulse animation preserved
