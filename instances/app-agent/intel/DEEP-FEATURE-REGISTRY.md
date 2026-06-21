# Deep Dive: Feature Registry & Instrumentation

**Traced:** 2026-06-18 (S03)  
**Slug:** `feature-knowledge`

## Core primitives (`core/server/utils/feature.ts`)

### `createFeatureScope(slug)`

Returns `FeatureScope` with:

| Method | Dev behavior | Prod behavior |
|--------|--------------|---------------|
| `log/warn/error` | Console + `writeLog()` to `logs.db` | Console only |
| `feature(child, fn)` | Registers child, records `contains` edge | Pass-through |
| `getFeature(other)` | Registers dependency, records `uses` edge | Pass-through |

### Wrappers

| Wrapper | Registers as | Used in |
|---------|--------------|---------|
| `defineFeatureHandler` | `handler` | Middleware, API routes |
| `defineFeaturePlugin` | `plugin` | Nitro plugins 00–04 |
| `defineFeatureComposable` | `composable` | `useAuth`, `useUiLocale` |

**Production overhead:** Zero — wrappers are pass-through except console logging.  
**Dev overhead:** Registry writes, edge graph, SQLite persistence.

## Startup plugin (`03.feature-registry.ts`)

Dev-only (`if (!import.meta.dev) return`):

1. Runs SEE scanner (`scanProject(root)`) — finds `// SEE: feature "slug" at path` annotations
2. `syncFileMappings(annotations)` → links slugs to source files
3. On Nitro `close` hook: flushes invocation/log counts to DB

## Persistence layer

| DB | Purpose | Location |
|----|---------|----------|
| `knowledge.db` | Registry, file mappings, query log | `.data/` (gitignored) |
| `logs.db` | Dev-mode `feat.log()` entries | `.data/` (gitignored) |

Rebuildable from source — not source of truth (knowledge `.md` files are).

## SEE annotation format

```typescript
// SEE: feature "runtime-config" at core/docs/knowledge/runtime-config.md
```

PEP 350 codetag — scanned at dev startup, counted by `feature:health` CLI.

## Static vs runtime join

| Dimension | Mechanism |
|-----------|-----------|
| Knowledge (SoT) | `core/docs/knowledge/{slug}.md` |
| Static trace | `// SEE:` annotations |
| Runtime graph | `defineFeature*` + registry DB |
| Agent query | MCP `explain`, `introspect`, `census` |

## Census status (2026-06-18)

- 12 slugs referenced in code — 100% have knowledge files
- 3 orphaned knowledge files: `feature-flags`, `secrets-management`, `sync-adr-tickets`
- 52 total SEE annotations

## Control plane integration

Control agent tools query live registry:

- `listFeatures` → `queryFeatureRegistry()`
- `getFeatureDetail` → registry + edges + file mappings + recent logs + knowledge existence

## Future (issues)

- #10 — `record()` sub-agent via MCP sampling
- #11 — auto-generate knowledge frontmatter
- OTel spans by slug — aspirational (ADR-009)
