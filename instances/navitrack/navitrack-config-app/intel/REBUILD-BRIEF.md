# Rebuild brief — navitrack-config-app

Status: phase 2 shell done. Phase 3 **S01–S12 complete** (`gate: CLOSED`, 2026-09-18).  
Hard rules: `intel/TEST-COVERAGE-MANDATE.md` · `intel/CODE-QUALITY-MANDATE.md` (post-sprint review + refactor).


## Intent

Rebuild **navitrack-dut-config-mobile** (Xamarin DUT configurator) as a hybrid Tauri app that shares **visual identity** with **navitrack-mobile-apps**.

| Role | Repo |
|------|------|
| Functionality source | `navitrack/navitrack-dut-config-mobile` |
| UI / shell template | `navitrack/navitrack-mobile-apps` |
| Target | `navitrack/navitrack-config-app` |

## Testing (locked)

Pattern from `quintagroup/fintech-dashboard` — full map: `intel/TESTING.md`.

| Layer | Tool |
|-------|------|
| Unit / component | Vitest + happy-dom + Testing Library (React) |
| HTTP integration | MSW |
| E2E | Playwright (Chromium) |

Scaffold must include `test` / `test:e2e` bun scripts and co-located `src/**/*.test.ts`.

---

## Package manager (locked)

**bun** — not pnpm.

When scaffolding from mobile-apps:

- replace pnpm scripts/lockfile with bun (`bun.lock` / `bun.lockb`)
- docs and README must say `bun install`, `bun run …`
- never commit `pnpm-lock.yaml` or `package-lock.json`

This is the **only** intentional tooling delta vs the mobile-apps template called out by product.

## Phases

1. **Analyze DUT** — screens, navigation, domain, hardware/services → `DUT-FUNCTIONALITY.md`
2. **Empty template** — copy mobile-apps shell; keep logo, UI kit, Tauri/Vite/Tailwind; strip fleet screens/stores/APIs; placeholder home
3. **Port functionality** — DUT features on the new shell

## Legacy DUT shape

Full inventory: `intel/DUT-FUNCTIONALITY.md` (from deep analysis).

Summary: Xamarin.Forms BLE fuel-DUT configurator (`com.navitrack.dut_configurator` v56). Screens: Main → Sensors → Sensor (Standard / Change Password / Calibration / Advanced) + Settings / Logs / About. Transport: BLE GATT only (CRC8 framing). Cloud: feature flags + cal params from `api.fcs.navitrack.com.ua`. No USB/serial host, no firmware OTA. iOS scaffold incomplete vs Android.

## Mobile-apps keep vs strip

Full map: `intel/MOBILE-APPS-TEMPLATE.md` (from scaffold analysis).

**Keep:** Tauri/Vite/React/Tailwind tooling, design tokens, `src/ui` (minus Tracking*), logo assets, slim shell + home placeholder; scripts on **bun**.

**Strip:** fleet screens/features/API/stores, Leaflet, FCM, biometrics, geolocation, keystore, fleet auth.
