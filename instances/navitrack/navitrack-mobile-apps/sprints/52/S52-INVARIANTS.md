# S52 Visual & Logic Parity Invariants

> Frozen decisions for Sprint 52. Builds on S51-INVARIANTS.md.
> **Source of truth:** `navitrack-apps/src-client`. **Target:** `navitrack-apps/draft/pwa-react-app-clear`.

**Linked from S52.ptl:** `invariants:sprints/52/S52-INVARIANTS.md`

---

## Layout CSS

- **app-layout.css**: Must NOT contain content-area rules for `.main-scroll-content` (min-height, padding for map vs non-map). That responsibility belongs to layout components (e.g. Main.tsx) or a single layout utility, not the global app-layout stylesheet.
- **main-scroll**: Single scroll container; padding for chrome/safe-area only in app-layout.

---

## UI discipline

- **No naive elements**: Primary forms and actions use `components/ui` — Button, Input, Modal, etc. No raw `<input>` or `<button>` for main flows.
- **Glass system**: Preserve S51 glass tokens and component parity (glass-button, glass-input, glass-card).

---

## Structure

- **Pages**: `src/pages` for top-level page wrappers where needed.
- **Layout**: `src/components/layout` — Header, Footer, Main, Background, Curtains (main app layers).
- **Features**: `src/features/<feature>/` — screens and feature-specific components.

---

## Anti-patterns

- Do not re-introduce `.main-scroll-content` min-height/padding rules into app-layout.css.
- Do not add new design tokens without documenting here or in design-system.
