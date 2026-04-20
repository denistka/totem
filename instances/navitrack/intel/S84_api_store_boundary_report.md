# S84 — API / store boundary

## Tracking (hotspot: store_tracking_adapter)

- **Before:** `store/adapters/tracking.ts` contained POST `/ws/track/get` orchestration plus daily-track fallback and dynamic import of `tracking-transforms`.
- **After:** `fetchTrackWithFallback` and `fetchDailyTrackForDay` live in `api/domains/tracking.ts`. The adapter only toggles `loading` and delegates to those functions.
- **Types:** `api/domains/tracking-types.ts` holds track DTOs so `tracking-transforms` does not import `tracking.ts`, avoiding a madge cycle.

## Reports / vehicles / zones adapters

- **Removed:** `store/adapters/reports.ts`, `vehicles.ts`, `zones.ts` — not referenced anywhere; orchestration for reports already lives under `api/domains/reports*`, and vehicles/zones list loading remains on `useAppStore.fetchVehicles` / `fetchZones` (unchanged this sprint).

## Verification

- `pnpm run build` — pass.
- `pnpm run deps:cycles` — 0 cycles after `tracking-types` split.

## Out of scope (not changed)

- `useAppStore` still performs `getVehicles` / `getZones` inside `fetchVehicles` / `fetchZones`; no UI or contract change requested beyond `store/adapters/*` audit.
