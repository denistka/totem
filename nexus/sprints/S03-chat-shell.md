# S03 · Chat shell — glassmorphic UI

**Phase:** P1 · Core MVP
**Window:** M3
**Status:** in progress — frontend prototype shipped on branch `nexus` of `taskboard-supabase`
**Depends on:** S01 (schemas)
**Blocks:** S04 (router needs a surface), S06 (WS-bound chat)

## Objective

Ship the chat-first surface that becomes the primary entry point to a Nexus
project. Visual language: glassmorphism over a structure layer ("прозрачность —
сверху чат, под ним проект"). Three discrete stops: Chat / Split / Structure.

## Acceptance criteria

- [x] Route `/nexus` rendered without global header/footer (full-bleed)
- [x] Top utility bar: logo, stop switcher, agent presence pills
- [x] Glassmorphic curtain that resizes on drag (pointer + touch)
- [x] Snap to 3 stops (1.0, 0.55, 0.18)
- [x] Mock chat with user/agent/system message types
- [x] Composer with slash-command hints (`/bug`, `/feat`, `/lgtm`)
- [x] Intent chips on messages (bug / feature / discussion / lgtm / question)
- [x] Inline attachment chips (screenshot · log · taskcard · diff)
- [ ] A11y: keyboard control for the curtain (↑ ↓ steps)
- [ ] Mobile gestures: bottom-sheet style on < 640px
- [ ] Persist last stop in `localStorage` for return visits

## Out of scope (next sprints)

- Real WS wiring (S06)
- AI router that actually classifies (S04)
- Agent thought log side-panel (S08)

## Engineering notes

- Reuse existing `glass-card` / `glass-effect` utilities from `client/src/style.css`
- Palette: `primary` (indigo) + `accent` (violet) already configured in tailwind
- Curtain height driven via inline `style.height: <pct>vh` — animated with
  Tailwind `transition-[height]`, disabled while dragging for direct control
- Density of the structure layer is a derived `computed` from curtain value:
  `> 0.75` → hint (just glowing plates) · `> 0.35` → compact (sprints+progress)
  · `≤ 0.35` → full (kanban + agent strip)

## Files

- `client/src/components/pages/NexusChat.vue`
- `client/src/components/modules/nexus/NexusChatPanel.vue`
- `client/src/components/modules/nexus/NexusStructureLayer.vue`
- `client/src/composables/useNexusMocks.ts`

## Risks

- Browser blur performance on low-end devices → fallback: drop saturate(140%),
  reduce blur to 6px when `prefers-reduced-motion` or low memory hint
- iOS Safari `position: fixed` + `100vh` quirks → switch to `100dvh` later
