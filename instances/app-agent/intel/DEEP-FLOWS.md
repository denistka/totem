# Deep Dive: Cross-Cutting Flows

**Traced:** 2026-06-18 (S03)

## HTTP request lifecycle

```mermaid
sequenceDiagram
  participant Client
  participant MW as Server Middleware
  participant Route as API Route
  participant Feat as FeatureScope
  participant Log as logs.db

  Client->>MW: HTTP request
  MW->>MW: 00.requestId (request-tracking)
  MW->>MW: 01.rateLimit (rate-limiting)
  MW->>MW: 02.logging (structured-logging)
  MW->>MW: 03.auth (authentication)
  MW->>Route: event.context.auth set
  Route->>Feat: defineFeatureHandler(slug)
  Feat->>Log: feat.log() [dev only]
  Route->>Client: Response
```

## Nitro plugin boot order

```mermaid
flowchart LR
  P0[00.startup] --> P1[01.settings-loader]
  P1 --> P2[02.logging]
  P2 --> P3[03.feature-registry]
  P3 --> P4[04.integrations]
```

| Plugin | Slug | Failure mode |
|--------|------|--------------|
| settings-loader | runtime-config | Disables config service, static config only |
| feature-registry | feature-knowledge | Dev only — SEE scan may warn |
| integrations | integrations | Silent skip or warn on partial AI config |

## Feature slug join (ADR-009)

```mermaid
flowchart TB
  SLUG["kebab-case slug"]
  SLUG --> KNOW["knowledge/{slug}.md"]
  SLUG --> SEE["// SEE: feature slug"]
  SLUG --> DEF["defineFeature*()"]
  SLUG --> MCP["MCP explain/introspect"]
  SLUG --> CTRL["Control agent tools"]
  SLUG --> REG["feature-registry DB"]
```

## Agent onboarding path (Denis workspace)

```text
1. read totem/totem-v6/index.ti
2. load instance app-agent
3. read intel/TOTEM_INDEX.ti
4. read intel/DEEP-FLOWS.md (this file) for orientation
5. bun --bun nuxt dev in docs/ → MCP connect
6. explain("layer-cascade") before architectural changes
7. Check PROBLEMS_REGISTER P0 before claiming green
```

## Config read path (runtime)

```mermaid
sequenceDiagram
  participant API as Settings API
  participant Store as ConfigStore
  participant Prov as ConfigProvider
  participant DB as SQLite/Supabase

  API->>Store: getEffectiveConfig(appId, env, context)
  Store->>Store: Check merge cache
  Store->>Prov: getLayersForApp()
  Prov->>DB: Query layers
  Store->>Store: mergeWithGovernance(chain)
  Store->>API: MergeResult + locked paths
```

## Dev vs prod behavior summary

| System | Dev | Prod |
|--------|-----|------|
| Feature registry | Active, SQLite persistence | Disabled |
| feat.log → logs.db | Yes | No |
| SEE scanner | On startup | No |
| MCP server | If docs app running | Deploy docs app |
| Config hot-reload | Realtime subscribe | Realtime subscribe |
