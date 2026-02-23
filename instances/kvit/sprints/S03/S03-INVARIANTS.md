# S03 Invariants — Design alignment (navitrack dark + totem-view glass)

- **Dark theme:** `.dark` uses navitrack S44 military palette: `--background: 0 0% 4%`, `--primary: 74 60% 48%`. Glass overrides unchanged from S02 (--glass-blur 16px, --glass-strong-bg-opacity 0.56, etc.).
- **Glass tokens:** RGB triplets for glass-*; use as `rgba(var(--glass-accent), 0.2)`. Safari: pair `backdrop-filter` with `-webkit-backdrop-filter`.
- **Button variants:** `glass-button`, `glass-glow`, `glass-neon`, `glass-shimmer`, `glass-basic`. Cards: `glass-card`, `card-glass-subtle-rounded`, `card-glass-strong-rounded-2xl`. All glass components use `contain: layout style paint`.
- **Modal:** `modal-backdrop` (fixed inset-0, bg-black/30, backdrop-blur-md, z-40); panel `.modal-glass` (blur, border, shadow-glass-xl, z-50).
