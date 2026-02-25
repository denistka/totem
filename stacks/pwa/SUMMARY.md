# PWA template – work summary

Context: **navitrack-apps/draft/PWA-template** vs **totem/stacks/pwa** (PWA.ti gold standard).

---

## What is good

- **Viewport**
  - `viewport-fit=cover` in meta → content can extend behind notches/home indicator.
  - `--app-height` from `visualViewport.height` (and fallback) → avoids 100vh issues.
  - `interactive-widget=resizes-content` → better keyboard/virtual-keyboard behavior.

- **Display / manifest**
  - Manifest uses fullscreen/standalone; `theme_color` set.
  - iOS: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: black-translucent` (bleed behind status bar).
  - Android: Fullscreen API + exit fullscreen UI, platform-specific JS/CSS.

- **Layout**
  - Single scroll container when `pwa-no-scroll` is applied (iOS standalone): only `#root` scrolls, body/html fixed height and `overflow: hidden`.
  - iOS standalone: one-time height fix (100%+100px then 100%, then apply no-scroll and lock heights) + orientation handling.

- **Theme**
  - Light/dark/system with CSS variables; theme switcher; `theme-color` meta updated by JS.

- **Structure**
  - Project-agnostic shell; clear split: common / ios-pwa / android-pwa; cache-busted CSS/JS in dev.

- **Safe areas (partial)**
  - `.corner` uses `env(safe-area-inset-*)` for padding (but corners are still inside `#root` and scroll with content).

---

## What is wrong or missing

- **No dedicated header/footer with safe areas**
  - Theme switcher is `position: fixed` (top-right); exit fullscreen and Android hint are separate fixed/floating elements.
  - There is no sticky transparent header/footer that respect **top** and **bottom** safe areas and sit above a single scrollable content area.

- **Content not “edge-to-edge under header/footer”**
  - Desired: one scrollable content block with padding so it scrolls under transparent header/footer; corners fixed in viewport corners.
  - Current: `#root` is the scroll container but has no padding for “under header/footer”; no header/footer bars; corners are **inside** `#root` and use `position: absolute` → they **scroll with content** instead of staying in the four viewport corners.

- **Corners not fixed in viewport**
  - `.corner` is `position: absolute` inside `#root` → corners move with scroll. They should be `position: fixed` and pinned with `env(safe-area-inset-*)` so they stay in the real screen corners.

- **PWA.ti alignment**
  - **viewport:** PWA.ti suggests `user-scalable=no`; current meta does not include it (trade-off: accessibility vs accidental zoom).
  - **css-reset:** PWA.ti suggests `html, body { position: fixed; … }` for full coverage; template uses `overflow: hidden` + height only when `pwa-no-scroll` is on, not `position: fixed` on html/body.
  - **safe-areas:** “Backgrounds SHOULD NOT respect safe areas; tappable elements MUST.” Template does not yet have a clear “bleed to edges + safe-area padding for UI” pattern (header/footer + scroll padding).

- **iOS height script and `#root`**
  - If/when `#root` is made `position: fixed` (full viewport) as the only scroll container, setting `root.style.height` in `ios-pwa.js` can conflict with the fixed inset; height should be applied only to `html` and `body` (and `--app-height`), not to `#root`.

- **Height debug panel**
  - Position is `bottom: 8px; left: 8px` → can sit under home indicator or in a notch. Should use `env(safe-area-inset-bottom)` and `env(safe-area-inset-left)`.

---

## Intended next steps (from prior design)

1. Add **`.pwa-header`** and **`.pwa-footer`**: fixed, transparent, with padding from `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`; theme switcher in header, exit/hint in footer.
2. Make **`#root`** the only scroll container: `position: fixed`, inset 0, with top/bottom padding so content scrolls under header/footer; body `overflow: hidden`.
3. Move **corners** out of `#root` and use **`position: fixed`** with `top`/`bottom`/`left`/`right` and safe-area insets so they stay in the four viewport corners.
4. Optionally add `user-scalable=no` to viewport meta (per PWA.ti) and document the trade-off.
5. Update **height-debug** position to use safe-area insets.

---

## One-line summary

**Good:** Viewport, manifest, iOS height fix, theme, single scroll when no-scroll, platform split.  
**Wrong/missing:** No sticky header/footer with safe areas, content not edge-to-edge under them, corners scroll with content instead of being fixed in viewport corners; partial alignment with PWA.ti (viewport, css-reset, safe-area pattern).
