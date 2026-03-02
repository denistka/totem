# S51 Migration Invariants — DO NOT BREAK

> Frozen decisions for Sprint 51 (Migration to pwa-react-app-clear).
> Source of truth for design: `navitrack-apps/src-client` (design-system.md, theme.css, index.css).
> Target: `navitrack-apps/draft/pwa-react-app-clear`. All visual and interaction parity must be preserved.

**Linked from S51.ptl:** `invariants:sprints/51/S51-INVARIANTS.md`

---

## Design source

- **NaviTrack design system**: `src-client/src/styles/design-system.md` + `src-client/src/styles/theme.css`.
- **Glass & layout tokens**: `src-client/src/index.css` (layers: theme import, glass keyframes, touch utilities, glass component classes).
- **Prior invariants**: `sprints/45/S44-INVARIANTS.md` — all glass token values and component behaviors from S44 remain canonical.

---

## Theme naming in clear app

- **New app uses**: `html.theme-light`, `html.theme-dark` (set by `pwa-theme.ts`).
- **Old app used**: `:root` (light), `.dark` on `html` (dark).
- **Rule**: In `pwa-react-app-clear`, all dark overrides MUST use `html.theme-dark` (or `html.theme-dark .glass` etc.). Do not introduce `.dark` unless aliased to `theme-dark` for a single transition period.

---

## Single style discipline

- One design system layer: tokens in `theme-colors.css` + `design-tokens.css`, glass component classes in `glass-design-system.css`.
- No duplicate definitions of the same token in multiple files.
- No inline `style={}` for layout/colors; use CSS classes only.

---

## Glass tokens (must match S44 / src-client)

- `--glass-bg-opacity`, `--glass-blur`, `--glass-border`, `--glass-border-inner`, `--glass-shadow`, `--glass-shadow-hover`, `--glass-strong-bg-opacity`, `--glass-strong-blur`.
- `--glass-glow-text`, `--glass-glow-bg-opacity`, `--glass-focus-glow` (or equivalent).
- Input: `--glass-input-bg`, `--glass-input-shadow`, `--glass-input-glow-min/max/focus/error/success`.
- `--glass-transition`: 280ms cubic-bezier(0.4, 0, 0.2, 1).
- Light vs dark: dark theme uses higher opacity and different borders/shadows (see S44-INVARIANTS).

---

## Touch & safe area

- Touch tokens preserved: `--touch-min`, `--touch-target-min`, `--touch-target-rec`, `--touch-target-cta`, `--touch-icon`, `--touch-bottom-nav`, etc.
- Safe area: `.safe-bottom`, `.safe-top`, `.pt-safe-header`, `.safe-bottom-pwa` (or equivalent) for PWA chrome.

---

## Component parity

- **Buttons**: Primary CTA uses `.glass-glow` (rainbow glow pulse); secondary uses `.glass` without glow.
- **Inputs**: Form inputs use `.glass-input` with pulse; `data-state="error"` / `data-state="success"` for glow.
- **Containers**: Cards/panels use `.glass`; modals/overlays use `.glass-strong` where appropriate.
- **Header/nav**: `header.glass`, `nav.glass` have no border, only shadow; bottom nav fills safe area.

---

## Performance & a11y

- `contain: layout style` (or layout style paint) on glass surfaces.
- `prefers-reduced-motion: reduce` disables glass-input pulse, rainbow-glow, and app-bg pulse.
- No removal of existing will-change/transform optimizations for animated glass elements.

---

## Migration order

1. **T2 Foundation**: Tokens + glass classes in clear app (no removal from src-client until T4).
2. **T3 Components**: Rebuild/port UI primitives in clear; preserve visual and API from audit.
3. **T4 Features**: Port screens and routing; single state access pattern (e.g. store/hooks).

---

## Anti-patterns

- Do not merge old and new codebases in one folder; port incrementally into pwa-react-app-clear.
- Do not change token values when porting; match old app exactly for this sprint.
- Do not introduce new design tokens in clear without documenting in this file or design-system.
