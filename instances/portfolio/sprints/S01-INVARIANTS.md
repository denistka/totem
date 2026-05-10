# S01-INVARIANTS — Foundation freeze

Frozen decisions from Sprint S01-FOUNDATION (closed 2026-05-10). Any change to items below requires explicit invariant-modification approval — auto-modify is BLOCKED.

## Stack (locked)

| Layer | Choice | Version line |
|---|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) | ^3.5 |
| Build | Vite | ^8.0 |
| Language | TypeScript with strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` | ~6.0 |
| Styling | Tailwind v4 (CSS-first, no JS config) + custom CSS variables | ^4.3 |
| Motion | GSAP free-tier ONLY (no SplitText/MorphSVG/DrawSVG/InertiaPlugin) | ^3 |
| Router | vue-router 4 | ^4 |
| BaaS | Supabase (PostgreSQL + Realtime + Auth + Storage) | client ^2.105 |
| Hosting | Vercel | n/a |
| PWA | vite-plugin-pwa with workbox | ^1.3 |

## Path layout (locked)

```
/Users/denistka/Projects/portfolio/             ← workspace
├── app/                                          ← all client code (paths.code)
│   ├── src/
│   │   ├── components/glass/                    ← GlassEntity SFC + types + css
│   │   ├── components/loader/                   ← LoaderScreen + css
│   │   ├── composables/                         ← useSupabase, useAppReady, useDwellTracker
│   │   ├── directives/                          ← v-enter
│   │   ├── layouts/                             ← AppShell, BottomNav
│   │   ├── lib/                                 ← supabase singleton
│   │   ├── motion/                              ← timelines, easings, a11y, useMotion
│   │   ├── router/                              ← routes + index
│   │   ├── rooms/                               ← S02 lands here (Room SDK)
│   │   ├── styles/                              ← tokens, motion, themes, index
│   │   ├── transitions/                         ← PageTransition
│   │   ├── types/                               ← database.types.ts
│   │   └── views/                               ← Hero, Work, Lab, Contact (system pages)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons/icon.svg + icon-maskable.svg
│   ├── eslint.config.js  vite.config.ts  vercel.json  ...
└── supabase/                                     ← migrations + config + edge functions
```

## Design tokens (locked)

### Entity contract — `--e-*`
`--e-radius`, `--e-delay`, `--e-primary`, `--e-ambient`, `--e-pulse`, `--e-wash`, `--e-intensity`, `--e-pulse-speed`, `--e-wash-speed`, `--e-blur`.
Defined at `:root` in `tokens.css`. Components READ these; consumers may override per-instance via inline style.

### Surface contract — `--sdui-*`
`--sdui-card-bg`, `--sdui-card-backdrop`, `--sdui-card-border`, `--sdui-card-shadow`, `--sdui-card-bevel`, `--sdui-card-radius`, `--sdui-card-padding`, plus `search`, `nav`, `modal`, `action-btn`, `avatar`, `list-border`, `pill` variants. Theme-specific values in `themes/<name>.css`.

### Themes — three only
`dark` (default + `[data-theme="dark"]`, glass), `flat` (light/solid), `mixed` (warm/playful). Theme switch is data-attribute swap on `<html>` — NO rebuild required, NO JS reload.

### Motion tokens
- Durations: `--motion-instant` (80ms), `--motion-fast` (150ms), `--motion-base` (300ms), `--motion-slow` (500ms), `--motion-emphasis` (800ms)
- Easings: `--ease-emphasis`, `--ease-gentle`, `--ease-snap`, `--ease-overshoot`
- Reduced-motion: media query collapses durations to 0ms AND globalTimeline timescale flips to 100x in JS (motion/a11y.ts).

## Glass-entity component contract

- **Path:** `app/src/components/glass/GlassEntity.vue`
- **Statuses** (frozen list): `calm | alert | notify | warn | alarm | dim | dream`
- **Props:** `status, radius?, delay?, intensity?, interactive?, hideAmbient?, hideBottom?, hideWash?, pureLayout?`
- **Slots:** `default` → layer-content; `bg` → layer-bg
- **Imperative API:** `flash()` exposed via `defineExpose`
- **Layer order** must match sdui-proto port. Adding new layers requires schema bump.

## Supabase schema (S01 baseline — locked)

| Table | Purpose | RLS |
|---|---|---|
| `page_visits` | route analytics | anon insert-only with path length check |
| `room_dwell` | per-route/room dwell ms | anon insert-only with room length + bounded dwell |
| `contact_msgs` | contact-form submissions | NO anon access; edge function w/ service role only |

Per-room migrations (S02+) MUST namespace tables `room_<slug>_*`. Migration files numbered sequentially `NNNN_*.sql`.

## Motion system contract

- Single source: `app/src/motion/`. Timelines named: `heroIntro`, `cardEnter`, `sectionScroll`, `flashAlarm`. Adding new timelines = additive (allowed). Renaming or breaking existing ones = invariant violation.
- `useMotion(scope?)` returns `{ ctx }`; `ctx.revert()` runs in `onBeforeUnmount` automatically.
- `v-enter` directive runs `cardEnter(el, opts)` once on mount. Globally registered.
- NO inline `gsap.to(...)` in components (constraint — must call a named timeline).

## App shell shape

`AppShell.vue`:
1. `<RouterView v-slot>` wrapped in `<PageTransition>` (GSAP fade+blur+lift, 350ms enter / 250ms leave; reduced-motion → snap)
2. `<BottomNav>` fixed at bottom — 4 items: Hero / Work / Lab / Contact
3. `<LoaderScreen>` overlay until `useAppReady` resolves all 3 milestones (fonts / styles / firstFrame, 4s ceiling)

## PWA decisions

- registerType: `autoUpdate` with `skipWaiting + clientsClaim` (no stale UI)
- Precache: `**/*.{js,css,html,svg,woff,woff2}`
- Runtime cache: fonts (StaleWhileRevalidate), images (StaleWhileRevalidate)
- Icons: SVG only for v1 (`icon.svg` + `icon-maskable.svg`); PNG variants deferred to S03
- Manifest: theme_color + background_color = `#060a12`, display:standalone, shortcuts to /work, /rooms/animation-lab, /rooms/contact

## Build + quality gates

- `pnpm build` — vue-tsc -b + vite build clean
- `pnpm lint` — eslint flat-config, `--max-warnings 0`
- `pnpm dev` — boots on :5173, all 4 routes return HTTP 200
- Bundle baseline (gzipped): ~67 kB index + ~50 kB lazy chunks (Vue + GSAP + Vue Router + Supabase + workbox-window)

## Deferred (NOT in S01 — picked up by user or S02+)

- Docker Desktop boot (required for `supabase start`)
- `supabase login` + cloud project (required for prod env)
- `vercel link` + Vercel login (required to push)
- Real `VITE_SUPABASE_*` env values in `.env.local`
- PNG icon variants for older browsers
- Inter web font (currently system fallback)
- Visual regression tests (Playwright deferred)
