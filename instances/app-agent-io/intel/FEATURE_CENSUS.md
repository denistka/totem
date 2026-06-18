# Feature Census

**Generated:** 2026-06-18 via `node core/cli/feature-health.js`

## Summary

| Metric | Value |
|--------|-------|
| Knowledge files | 15 |
| Slugs referenced in code | 12 |
| Total `// SEE:` annotations | 52 |
| Code → knowledge coverage | 100% |
| Orphaned knowledge (no code refs) | 3 |

## Covered slugs (code + knowledge)

| Slug | File refs | Primary implementation |
|------|-----------|------------------------|
| `runtime-config` | 13 | `core/server/utils/config-service/*`, settings API |
| `authentication` | 12 | `core/server/utils/auth.ts`, auth routes, `useAuth` |
| `feature-knowledge` | 11 | `feature.ts`, registry, SEE scanner, MCP tools |
| `i18n-layers` | 3 | `useUiLocale`, `i18n-bridge.client.ts` |
| `integrations` | 3 | `integrations.ts`, models API, plugin 04 |
| `structured-logging` | 2 | logging middleware + plugin |
| `chat-status` | 1 | `apps/chat/server/api/status.get.ts` |
| `developer-tools` | 1 | CLI, dev launcher |
| `request-tracking` | 1 | `00.requestId.ts` middleware |
| `rate-limiting` | 1 | `01.rateLimit.ts` middleware |
| `layer-cascade` | 1 | `core/nuxt.config.ts` |
| `health-checks` | 1 | `core/server/routes/health.get.ts` |

## Orphaned knowledge (documented, not referenced in code)

| File | Likely reason |
|------|---------------|
| `feature-flags.md` | Planned (issue backlog) — not implemented |
| `secrets-management.md` | Documented pattern; `multi-encrypt` CLI exists at root |
| `sync-adr-tickets.md` | Meta/process doc for ADR → issue sync |

## `defineFeature*` runtime usage (production code, excl. tests)

| Wrapper | Locations |
|---------|-----------|
| `defineFeatureHandler` | `apps/chat/.../status.get.ts`, `control/.../agent/chat.post.ts`, `integrations/models.get.ts` |
| `defineFeaturePlugin` | `server/plugins/00–04` |
| `defineFeatureComposable` | `useAuth.ts`, `useUiLocale.ts` |

Middleware uses `defineFeatureHandler` pattern via wrapped handlers in auth/logging/rateLimit.

## MCP tools (docs-layer)

| Tool | File | Purpose |
|------|------|---------|
| `explain` | `explain.ts` | Read knowledge by slug/aspect |
| `record` | `record.ts` | Write knowledge during sessions |
| `introspect` | `introspect.ts` | Query feature registry |
| `census` | `census.ts` | Coverage report |
| `log-summary` | `log-summary.ts` | Slug-tagged log aggregates |
| `recent-logs` | `recent-logs.ts` | Recent logs by slug |
| `list-apps` | `list-apps.ts` | Apps and demos metadata |
| `list-components` | `list-components.ts` | Components/pages/composables |
| `get-file` | `get-file.ts` | Source file contents |
| `get-page` | `get-page.ts` | Documentation page content |
| `list-pages` | `list-pages.ts` | Doc routes |
| `get-app-structure` | `get-app-structure.ts` | App directory tree |

## Test coverage notes

- Strong unit coverage for `defineFeatureComposable`, SEE scanner, config merge, MCP tool handlers
- `core/tests/server/feature.test.ts` — 83 failures when run via `bun test` at root (stub/env mismatch — see PROBLEMS_REGISTER)
- Issue #83: expand coverage for untested source files

## Recommended agent workflow

1. `explain("layer-cascade")` before touching nuxt configs
2. `explain("feature-knowledge")` before adding features
3. `census()` after adding `// SEE:` annotations
4. `feature:health` CLI for quick local check
