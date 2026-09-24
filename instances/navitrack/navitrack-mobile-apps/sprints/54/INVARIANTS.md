# Sprint 54 Invariants

These rules were established during S54 and govern the React PWA structure.

1. **Portals:** `Header` and `Footer` React components must mount to `#portal-header` and `#portal-footer` respectively.
2. **Empty Portals:** If the current screen (`useAppStore(s => s.screen)`) does not support a header or footer (e.g. login screen), those components must return `null`. The raw wrapper in `index.html` remains but functions seamlessly via `:empty` pseudo-classes.
3. **PWA Height:** Always use `100dvh` (Dynamic Viewport Height) on global app roots (`html`, `body`, `#root`, and background/curtains layers) to prevent the bottom tab bar from jumping or hiding beneath iOS home indicators before the initial scroll.
4. **App Data Sync:** `useAppStore(s => s.loadVehicles)` must be integrated as an initial auth-gated effect inside `App.tsx` (not nested deep in page components). This allows the global map to be pre-hydrated before the `MapScreen` mounts.
5. **Glassmorphism:** Adopt and preserve the established Tokens from `.glass` and `.glass-strong` globally. Hard-coded semi-transparent HEX should be avoided in favor of `hsl(var(--background) / opacity)`.
