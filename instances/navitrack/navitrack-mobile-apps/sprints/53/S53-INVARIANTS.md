# S53 Dependencies & Deep Parity Invariants

> Frozen decisions for Sprint 53. Builds on S51-INVARIANTS.md and S52-INVARIANTS.md.
> **Source of truth:** `navitrack-apps/src-client`. **Target:** `navitrack-apps/draft/pwa-react-app-clear`.

**Linked from S53.ptl:** `invariants:sprints/53/S53-INVARIANTS.md`

---

## Dependencies

- **Parity set**: pwa-react-app-clear shall use the same dependency families as src-client for UI (Radix UI where used), forms (react-hook-form, zod, @hookform/resolvers), i18n (i18next, react-i18next, i18next-browser-languagedetector), routing (react-router-dom), toasts (sonner), dates (date-fns, react-day-picker), and utilities (class-variance-authority, clsx, tailwind-merge, tailwindcss-animate, vaul). Versions may be equal or compatible.
- **Leaflet cluster**: Use same cluster package as src-client (react-leaflet-markercluster) for map parity; remove or replace react-leaflet-cluster if different.
- **No Tauri in PWA**: Do not add @tauri-apps/* or http-proxy to pwa-react-app-clear; those remain src-client-only for desktop build.

---

## Radix UI

- Add only the Radix primitives that src-client actually uses (button, dialog, label, select, popover, switch, toast/sonner, separator, etc.). Full list is defined by src-client components/ui imports.

---

## Anti-patterns

- Do not add desktop-only or native-only deps to pwa-react-app-clear.
- Do not change S51/S52 layout or glass tokens when adding deps or doing deep parity.
