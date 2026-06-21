# Deep Dive: Runtime Config Service (ADR-005)

**Traced:** 2026-06-18 (S03)  
**Slug:** `runtime-config`  
**Entry:** `core/server/plugins/01.settings-loader.ts`

## Boot sequence

1. Nitro plugin `01.settings-loader` runs as `defineFeaturePlugin('runtime-config', ...)`.
2. `createConfigProvider()` reads `CORE_DATASOURCE_*` from **process.env** (not `useRuntimeConfig()` — intentional isolation).
3. Provider selection (`provider.ts`):
   - `CORE_DATASOURCE_PROVIDER=sqlite` → `SqliteConfigProvider` (optional file path via URL)
   - No URL+key → SQLite fallback (local-first, zero setup)
   - URL+key → `SupabaseConfigProvider` (default when provider unset)
4. `initConfigStore(provider)` creates singleton `ConfigStore`.
5. Pre-loads layers for `appId` (from `runtimeConfig.public.serviceId` or `'app-agent'`) + `environment` (`CORE_ENVIRONMENT` or `NODE_ENV`).
6. Subscribes to realtime changes → `store.invalidate()` on any change.
7. On failure: logs error, **disables service** — app continues with static Nuxt config only.

## ConfigStore merge chain

`getEffectiveConfig(appId, environment, context?)` builds:

```
['core', 'core:org', 'core:app', ...customLayers from $meta.layers, 'user']
```

| Layer name | Resolution |
|------------|------------|
| `core`, `core:org` | `app_id='*'`, `layer_key='default'` |
| `core:app` | `app_id=appId` |
| `user` | `app_id=appId`, `layer_key='{appId}/{userId}'` (needs context.userId) |
| Custom | `layer_key=context[layerName]` |

Merge uses `mergeWithGovernance()` (`merge.ts`):

1. Process tiers in order (platform → org → app → user).
2. Strip paths locked by **previous** tiers (`$meta.lock` exact + ancestor match).
3. Deep-merge stripped config into result.
4. Accumulate current tier's locks for future tiers.

**Governance rule:** Lower tiers can lock paths; higher tiers cannot override locked values.

## CRUD + audit

All mutations go through `ConfigStore`:

- `updateSetting(path, value)` — dot-notation path within layer
- `replaceLayer(configData)` — full layer replace
- `deleteSetting(path)` / `deleteEntireLayer()`
- Every mutation writes `ConfigHistory` via provider + calls `invalidate()`

## Providers

| Provider | File | Storage |
|----------|------|---------|
| SQLite | `provider-sqlite.ts` | `bun:sqlite` — local `.data/` |
| Supabase | `provider-supabase.ts` | PostgreSQL via Supabase client |

**Root .env loading:** `ensureRootEnv()` walks up to `turbo.json` and parses root `.env` because Nuxt only loads `.env` from app `rootDir`.

## API surface (control plane)

Settings API routes live in `core/server/api/settings/` — consumed by control plane UI for live config diff and editing.

## Local dev defaults

```env
CORE_DATASOURCE_PROVIDER=sqlite
CORE_ENVIRONMENT=development
```

No Supabase credentials required for local investigation.

## Known gaps (issues)

- #4 — no live Supabase integration tests (mock-only unit tests)
- #8 — client WebSocket hot-reload not implemented
- #12 — raw PostgreSQL provider not built (only Supabase wrapper)
