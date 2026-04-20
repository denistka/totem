# S81 — Architecture review brief

**Invariants:** `totem/instances/navitrack/sprints/54/INVARIANTS.md` (portals, PWA height, glass tokens, global vehicle load).

**Scope:** Refactor/decompose only — **no intentional business-logic or UX behavior changes**.

## Target layering

| Layer | Responsibility |
|-------|----------------|
| UI (screens/components) | Orchestration, JSX, local layout |
| Hooks | Stateful workflows, subscriptions |
| `api/domains/*` | HTTP + domain types; transforms colocated or under `report-transforms` |
| `api/transforms`, `api/interfaces` | Shared coercion and cross-domain contracts (incremental) |
| `lib/` | Pure helpers (datetime, sorting, track math) |
| `store/adapters` | React hooks wrapping API; no duplicate transform logic |

## Folder boundaries

- **`screens/*`:** route-level composition; should stay thin after S81.
- **`modules/*`:** reusable feature UI (date picker, map, reports tables).
- **`api/*`:** no React; avoid cycles (verified with madge).

## Shared layer (S81 delivered)

- `src/lib/datetime.ts` — calendar + telemetry-relative formatting.
- `src/lib/sorting.ts` — list filter/sort primitives for `useSortedItems`.
- `src/api/transforms/coerce.ts` — `rowBunchId`, `isPositiveFiniteId` (reports + vehicles).
- `src/api/interfaces/auth.ts` — auth request/response types (consumed by `domains/auth`).
- `src/modules/map/VehicleIconRegistry.ts` — map-facing re-export for icons.
- `src/styles/components.css` — small set of `@apply` semantic classes (TH1).

## Large files — status

- **Split / thinned:** `reports` domain, `TrackingActionScreen`, `TrackingScreen`, `map-screen`, `DateRangePicker` module, map popup assembly, settings/reports screens, `ClusterMap` (leaflet effects / zones / vehicle layer), `TrackingRouteMap` (chrome + fit key util), `HistoryTimeline` (tabs, summary, list, scroll hook), `TimePickerAnalogWheel` (gesture hook + clock SVG). See sprint `.pd` `done` + `out`.
- **Future follow-up:** re-run jscpd / Sonar after releases; optional further splits if line counts creep (see `S81_DUPLICATION_AND_UNIFICATION.md`).

## Risks & constraints

- **Leaflet popups:** HTML structure and i18n keys preserved in `MapPopupFactory` / `PopupRow`.
- **Reports:** Column ordering and grand-total sentinel behavior unchanged in `report-transforms`.
- **Glass / dark mode:** TH2 uses `:is()` to dedupe selectors without altering computed styles.

## Remaining sprint tasks (`.pd` still `pending`)

None for the S81 TF/TG thin/split track — verify in `totem/instances/navitrack/sprints/81/*.pd`.

## References

- TK1–TK3: `S81_DUPLICATION_AND_UNIFICATION.md`
- Sprint tasks: `totem/instances/navitrack/sprints/81/*.pd`, planner `S81-CODEMAP-GOD-OBJECTS.ptl`
