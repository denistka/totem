# S05 Invariants — Glass system

**Sprint result:** Дизайн totem-view **не соответствует** taskboard-supabase; токены и классы портированы, визуальная parity не достигнута.

- **Glass accent tokens (RGB, no `rgba()`):** `--glass-primary`, `--glass-accent`, `--glass-secondary`, `--glass-tertiary` in `:root`. Use in styles as `rgba(var(--glass-accent), 0.2)`.
- **Shadow tokens:** `--shadow-glass`, `--shadow-glass-lg`, `--shadow-glass-xl` (depth); `--shadow-neon`, `--shadow-neon-lg` (accent glow, use `--glass-accent`).
- **Safari:** Always pair `backdrop-filter` with `-webkit-backdrop-filter` for blur on glass surfaces.

## Modal / Overlay pattern

- **Backdrop:** `fixed inset-0 bg-black/30 backdrop-blur-md z-40` (dim + blur).
- **Panel:** `.modal-glass` — semi-transparent bg, blur (with Safari prefix), light border (`border-white/20`, dark: `border-gray-700/40`), shadow (`var(--shadow-glass-xl)` or `shadow-2xl`), `z-50`, width/position as needed.

## Glass buttons and cards

- **Buttons:** Classes `glass-button`, `glass-neon`, `glass-shimmer`, `glass-basic`. Use with `--glass-primary` / `--glass-accent` from `:root` or set per-component via inline style. Base: blur(5px), semi-transparent bg, border, inset highlight; hover: glow from `rgba(var(--glass-accent), 0.2)`.
- **Cards:** Use `card-glass-subtle-rounded`, `card-glass-strong-rounded-2xl`, or utility `glass-card`. TaskCard and lists use `glass-card` / `glass-subtle` for visual parity.
