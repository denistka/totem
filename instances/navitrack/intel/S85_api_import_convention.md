# S85 — API import convention (machine-oriented)

## Barrel `src/api/index.ts`

- **Role:** Facade for **multi-domain** call sites (auth bootstrap, legacy wide imports) and re-exports used at app boundaries.
- **Prefer:** `import { … } from '@/api/domains/<domain>'` or `import type { … } from '@/api/domains/<types-file>'` when a module only needs **one** domain or shared types (`vehicle-types`, `tracking-types`, `report-types`).
- **Prefer:** `import type { Vehicle, … } from '@/entities/vehicle/model'` for UI-only **vehicle shapes** (re-exported from domains; avoids barrel churn).

## Exceptions

- **Multi-domain in one file:** Barrel `@/api` is acceptable if the file truly coordinates several domains and splitting would obscure flow; note in PR if adding a new such file.
- **`getApiClient`:** Import from `@/api/client` (not the barrel) when only the client is needed.

## Process

- Before expanding barrel exports, add or use a **domain module** under `src/api/domains/`.
- After refactors, run `pnpm codemap` from `navitrack-apps/src-client` and keep `codemap-import-refs` unresolved at **0**.
