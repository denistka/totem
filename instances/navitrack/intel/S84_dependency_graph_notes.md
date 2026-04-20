# S84 — dependency graph notes

## Cycles

- **madge:** `pnpm run deps:cycles` reports **no circular dependencies** (229 TS/TSX files analyzed).

## Direction (spot-check)

- **`api/domains/report-transforms`** imports `@/entities/report` only (no `modules/`).
- **`features/map`** may import `@/entities/vehicle/icons`; entities do not import features.
- **`src/modules`** layer **removed** — imports use `@/features/*` or `@/entities/*`.

## Risky / watched edges

- **`features/notifications/useNotificationInit`** imports `./notification-service` and `./platform` directly to avoid a barrel cycle with `@/features/notifications`.
- **Vehicle map bridge:** `features/map/VehicleIconRegistry.ts` re-exports `@/entities/vehicle/icons` for screens that historically used a single map entry.

## Codemap

- Regenerated: `pnpm run codemap` and `pnpm run codemap:src-paths` after filesystem changes.

## ESLint

- `pnpm run lint` completes with **warnings only** (pre-existing sonarjs noise + moved files); **0 errors**.
