# S24 INVARIANTS — Landscape safe area (DRAFT, awaiting Denis approval)

Depends: [`S23-INVARIANTS.md`](S23-INVARIANTS.md). Date: 2026-10-15. Scope: iOS only.

1. **Horizontal insets come only from `--safe-left` / `--safe-right`** (`max(env(safe-area-inset-*), 16px)`, styles/screen-layout.css) via `.safe-x`, or `.safe-x-raw` (notch only) when children supply their own gutter. No `px-4` on `.content-wrapper`; no JS notch detection — `env()` gives the right side for either rotation.
2. **Inset content, not backgrounds.** Header, tab bar, modals keep full-width glass; only their inner rows are inset. Tab bar: the buttons row only.
3. **`.content-wrapper` still takes no vertical padding utilities** — spacing goes on an inner element (ScreenContainer `inset="page"`).
