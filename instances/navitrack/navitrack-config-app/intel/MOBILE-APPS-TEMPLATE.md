# Mobile-apps template — keep vs strip

Source: `navitrack/navitrack-mobile-apps`  
Target: `navitrack/navitrack-config-app`  
Package manager delta: **bun** (mobile-apps uses pnpm)

Derived from scaffold analysis. DUT auth is **sensor/device passwords**, not fleet cloud login — do not reuse fleet auth/biometry/FCM as product auth.

---

## Keep (empty shell)

| Area | Paths / notes |
|------|----------------|
| Tooling | `vite.config.ts`, `tailwind.config.ts`, `postcss`, `eslint`, `tsconfig*`, `index.html`, iOS sync script |
| package.json scripts | Same tauri/vite/ios/android scripts — rewrite install/run to **bun** |
| Design system | `src/styles/{theme,animations,glass,touch,layout,screen-layout,components}.css` — **drop** `map.css` |
| UI primitives | `src/ui/*` except Tracking* |
| Logo / brand | `public/logo-navitrack.png`, favicons, PWA icons; `src/ui/Logo.tsx` |
| Shell chrome | `AppHeader`, `GlobalLoader`, `ErrorBoundary`, slim `MobileShell` |
| Theme / i18n / toast | `hooks/useTheme.ts`, slim `locales`, Sonner |
| Utils | `lib/utils.ts` (`cn`), optional `logger.ts` |
| Stores (slim) | `useNavigationStore`, `useUIStore` only |
| Router | Minimal: `home` (+ optional `settings` placeholder) |
| Tauri | `src-tauri/` with plugins trimmed to http/store/opener as needed; copy `icons/` |

**Brand tokens:** primary HSL `74 60% 44%` (`#94b32c`), lime `#8cc63f`, dark chrome `#1a1c17`.

---

## Strip (fleet-only)

| Area | What |
|------|------|
| Screens | `map/`, `tracking/`, `reports/`, `objects/`, `object-details/`, `notification-settings/` |
| Features | `map/`, `report-table/`, `date-range-picker/`, `notifications/` (FCM), `security/` (biometrics) |
| Stores | Fleet `useAppStore`, `useNotificationStore`, tracking adapters; fleet `useAuthStore` |
| API | vehicles, tracking, reports, zones, events, notifications, fleet auth signin |
| Deps | leaflet*, FCM, biometric, geolocation, keystore, fetch-event-source |
| Native | FCM/biometric/keystore/geo plugins + capabilities; `google-services.json` |
| Root | `screens/` (store screenshots), `scratch/`, fleet `api/proxy.js`, fleet `.env` hosts |

---

## Recommended empty tree

```text
navitrack-config-app/
├── package.json          # bun; trimmed deps
├── bun.lock
├── vite / tailwind / eslint / tsconfig / index.html
├── public/logo-navitrack.png + favicons/PWA
├── scripts/sync-ios-version.sh
├── src/
│   ├── main.tsx, App.tsx, index.css (no map.css)
│   ├── config/lib/{navigation,i18n}.ts
│   ├── locales/ (slim)
│   ├── hooks/{useTheme,useToast}.ts
│   ├── lib/{utils,logger}.ts
│   ├── store/{useNavigationStore,useUIStore}.ts
│   ├── shell/ (MobileShell, ScreenRouter → home, header, loader)
│   ├── screens/home/HomeScreen.tsx  # Logo + placeholder
│   ├── screens/settings/            # theme/lang only (optional)
│   ├── styles/ (no map.css)
│   └── ui/ (no Tracking*)
└── src-tauri/ (slim plugins; new productName/identifier)
```

## Copy strategy

1. Copy tooling + `public/` + styles (minus map) + `ui` (minus Tracking*) + slim shell.
2. Delete fleet screens/features/api; strip native FCM/biometric.
3. Replace pnpm lock with bun; rename PWA id/product to config-app.
4. Home screen: company logo + placeholder for next DUT port.
