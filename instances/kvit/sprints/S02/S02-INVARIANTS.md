# S02 Invariants — Design system (navitrack dark + totem-view glass)

- **Dark theme:** Navitrack S44 military palette in `instances/kvit/client/src/index.css` (.dark): `--background: 0 0% 4%`, `--primary: 74 60% 48%`, glass overrides (--glass-blur 16px, --glass-strong-bg-opacity 0.56, etc.). No arbitrary colors; all from token map.
- **Glass tokens:** RGB triplets only for glass-* (e.g. `--glass-primary`, `--glass-accent`); use as `rgba(var(--glass-accent), 0.2)`. Safari: always pair `backdrop-filter` with `-webkit-backdrop-filter`.
- **Button variants:** `glass-button`, `glass-glow`, `glass-neon`, `glass-shimmer`, `glass-basic`. Cards: `glass-card`, `card-glass-subtle-rounded`, `card-glass-strong-rounded-2xl`.
- **Modal pattern:** Backdrop `modal-backdrop` (fixed inset-0, bg-black/30, backdrop-blur-md, z-40); panel `.modal-glass` (blur, border, shadow-glass-xl, z-50).
