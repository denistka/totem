# S37 — Platform Audit

**Sprint:** S37 — Architecture Consolidation  
**Objective:** List browser vs Tauri assumptions and PWA gaps.

---

## Places that assume Tauri vs browser

| Location | Assumption | Notes |
|----------|------------|--------|
| `utils/storage.ts` | `isTauri()` — Tauri Store / Keystore vs localStorage | Secure storage: Tauri = plugin store; browser = localStorage fallback. |
| `api/platformFetch.ts` | `isTauri()` — Tauri HTTP plugin vs native fetch | Native uses Tauri fetch; browser uses fetch + proxy rewrite. |
| `services/deepLinkService.ts` | `__TAURI__` in window — Tauri event listener | Deep links only when Tauri. |
| `services/notificationService.ts` | `__TAURI__` — Tauri notification plugin | Push only in Tauri. |
| `services/phoneService.ts` | Tauri opener plugin | Tel: links. |
| `composables/useBackButton.ts` | `__TAURI__` — Tauri back | Native back only in Tauri. |
| `composables/useStatusBar.ts` | `__TAURI__` — status bar plugin | Only in Tauri. |
| `composables/usePlatform.ts` | `__TAURI__` in window for `detectPlatform()` | Returns ios | android | desktop | web; desktop when Tauri + non-mobile UA. |

**Pattern:** Most use `'__TAURI__' in window` or a local `isTauri()` helper. No single module exports `isTauri`/`isPWA` for the whole app.

---

## PWA gaps

- **Offline:** No explicit service worker or offline UI documented in this audit; app may rely on Tauri for “offline” on native.
- **Install prompt:** No PWA install prompt or “Add to Home Screen” flow documented.
- **Storage in PWA:** If run as PWA (browser), storage uses localStorage (see storage.ts); secure storage (Keystore) is Tauri-only.
- **Capabilities:** No single `hasStorage()`, `isPWA()`, `isTauri()` used app-wide for feature flags.

---

## Recommendation

- **Single abstraction:** `usePlatform()` or `platform.ts` exposing `isTauri()`, `isPWA()` (e.g. `window.matchMedia('(display-mode: standalone)')` or similar), `hasSecureStorage()` (Tauri + keystore available).
- **Consumers:** Migrate duplicate `isTauri` checks to use the shared module where feasible.
- **PWA fallbacks:** Use abstraction for offline message, install prompt, and storage behavior.
