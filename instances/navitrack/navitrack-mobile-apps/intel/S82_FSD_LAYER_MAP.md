# S82 — FSD-style layer map (TM1)

**Target:** Incremental alignment with Feature-Sliced Design without a big-bang directory move.

## Layer tree (conceptual → current `src/`)

| Layer | Role | Current locations |
|-------|------|-------------------|
| **app** | Boot, shell, routing | `app/*` (`ScreenRouter`, `mobile-shell`, providers) |
| **pages** | Route-level screens (here: tab/screen switch) | `screens/*` (each folder ≈ page) |
| **features** | User flows with UI + local state | Composite under `screens/<name>/` (e.g. `tracking/components`, `reports/modules`) |
| **entities** | Business nouns, types, thin API facades | **Pilot:** `entities/vehicle/model.ts` → types; domain HTTP stays `api/domains/*` until migrated |
| **shared** | UI kit, utils, hooks | `ui/*`, `hooks/*`, `lib/*`, `styles/*`, `store/*` |

## Allowed import direction

```
app → pages (screens) → features → entities → shared
shared → (nothing upward)
entities → shared only (types may re-export from api for pilot)
api/domains → shared transforms, `client`, not screens directly from domain modules in new code when avoidable
```

## Forbidden (P0)

- **Screens / UI** importing `getApiClient` or ad-hoc `fetch` — use domain functions or store adapters.
- **api/domains** importing from `screens/*` or `ui/*`.
- **Circular** packages — enforced by `pnpm deps:cycles` (madge).

## Import policy (from sprint PTL)

- Prefer alias `@/` for `src` internals.
- Max **2** `../` segments in new/changed files where possible; grandfathered deep relatives listed in PR if unavoidable.

## Sign-off

- Map is authoritative for S82 TM/TM4 discussions; mass moves are out of scope for TM1.
