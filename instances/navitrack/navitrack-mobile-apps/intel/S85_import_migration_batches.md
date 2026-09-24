# S85 — Domain / entity import migration (batches one + two)

Consolidated touched areas (not every line — see git history for full diff).

## Batch one (store, auth, SSE, first adapters)

- `src/store/useAppStore.ts` — `getVehicles` / `getZones` / types from domains
- `src/hooks/useAuth.ts` — `getApiClient` from `@/api/client`, `signIn` from `@/api/domains/auth`
- `src/lib/sse-client.ts` — `ReportProgressEvent` from `@/api/domains/report-types`

## Batch two (screens, features, reports, object-details, tracking)

- Removed all `from '@/api'` barrel usages under `src/`; replaced with `@/api/domains/*`, `@/api/client`, or `@/entities/vehicle/model` as appropriate.
- Reports modules: `report-types`, `reports` (`downloadReport`), `misc` / `report-types` on form state.
- Tracking: `tracking-types`, `tracking.ts` for `Track`/`TrackRequest` where needed.
- Object details / history: `vehicles`, `vehicle-types`, `tracking-types`, entity `VehicleInfo` where UI-typed.

## New hooks / stores

- `src/screens/reports/hooks/useReportsScreenHeader.ts`
- `src/store/useObjectsUiStore.ts`
