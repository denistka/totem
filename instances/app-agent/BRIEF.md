# App Agent — Project Brief

> Read this before planning any sprint. Source of truth: `app-agent-io/core/AGENTS.md` + `core/docs/adr/`.

## What it is

**App Agent** is a turnkey, forkable **Nuxt 4 layered monorepo** with an embedded AI development agent.
The thesis: *"The AI isn't smarter. The codebase is smarter."* — make conventions so explicit
(and machine-readable via MCP) that even basic models build features without drifting.

Target users: startups/agencies who fork the repo, rebrand, and own it forever (MIT, zero lock-in).

## Core mental model — three-layer cascade

```
apps/*        extends   →  YOUR product code (zero merge conflicts on upstream pull)
organization/ extends   →  brand: name, logo, colors, social, defaults
core/         (upstream) →  shared components, server, MCP, config service — DO NOT MODIFY
```

Merge semantics (`defu`): objects deep-merge, arrays concatenate, primitives override (higher wins).
Server middleware from ALL layers runs (additive, never overrides). `null` = "defer to lower layer".

## Signature pattern — Feature-Oriented Intelligence (ADR-009)

A kebab-case **slug** (e.g. `rate-limiting`) is the universal join key across dimensions:

| Dimension | Mechanism | Status |
| --------- | --------- | ------ |
| Knowledge | `core/docs/knowledge/{slug}.md` (frontmatter + H2 aspects) | ~14 slugs |
| Source | `// SEE: feature "slug" at path` (PEP 350 codetag) | ~50+ annotations |
| Runtime | `defineFeatureHandler/Composable/Plugin(slug, fn)` | core implemented |
| Tooling | MCP `explain`, `introspect`, `census`, `record`, `log-summary` | working |
| Config flags | feature flags | future / aspirational |
| Telemetry | OTel spans by slug | future / aspirational |

Production behavior of `defineFeature*` = pass-through (zero overhead). Dev = logs to SQLite + edge graph.

## Apps in the monorepo

| App | Port | Role |
| --- | ---- | ---- |
| docs | 3000 | documentation + MCP server (12 tools) |
| control | 3001 | control plane: agent chat, feature graph, live logs, config diff |
| apps/* | 3002+ | customer apps (empty upstream, scaffolded via launcher) |
| demos: dashboard / saas / landing / chat | 3010–3013 | reference implementations (copy, don't edit) |
| demos: characters | — | 5th demo, not in README |

## Stack & tooling

- Nuxt 4 (`app/` dir, compatibilityDate 2025-07-15) · Vue 3 · Nuxt UI v4 (Tailwind-based)
- Bun 1.2.15 pinned · Nitro preset `bun` · `bun:sqlite` local datasource
- Turborepo orchestration · TypeScript strict
- Tests: vitest (322) + bun:test for SQLite (56) — all green after `bun install`
- Auth: `nuxt-auth-utils`, 3-role RBAC, opt-in per app
- Config service (ADR-005): hot-reload runtime config, SQLite local / Supabase prod, `$meta.lock` governance
- Secrets: `multi-encrypt` → `encrypted.json` (committed); manifest in `.gitignore # Secrets`

## Current state (verified 2026-06-09)

- ✅ Clean clone via SSH; `bun install` + full test suite pass
- ✅ Local dev unblocked WITHOUT the team's vault password: SQLite + `.env` stubs created
  (`.env`, `control/.env`, `demos/{chat,dashboard,landing}/.env`, `apps/companions/.data/`)
- ✅ `bun run dev:docs` boots docs + MCP on :3000
- ⚠️ Agent chat / chat demo show "not configured" until `AI_PROVIDER_KEY` set

## Constraints / invariants to respect (from AGENTS.md)

- Do NOT modify `core/` as a customer; customer code lives in `apps/`
- `runtimeConfig` is startup-only; runtime config goes through the config service (ADR-005)
- Nuxt/Nitro versions pinned — no upgrades without reviewing `useRuntimeConfig()` mutability contract
- bun:sqlite tests MUST live in `core/tests/db/` (not vitest workers)
- Secrets: extend `# Secrets` in `.gitignore` + `bun run enc` when adding `.env`
- NEVER assume gate approval; PLANNER plans only, PM executes only

## Candidate backlog (for PLANNER to decompose — NOT yet approved)

1. **Security hygiene**: `temp.md` / `temp-product-context.md` in repo root contain API-key-like
   strings. Remove from git, add to `.gitignore`, rotate keys. (HIGH)
2. **README accuracy**: reflect control plane, characters demo, chat demo WIP, real ports;
   reconcile `todo-documentation-updates.md`.
3. **Feature knowledge coverage**: wire `bun run feature:health` as CI gate; create stubs so every
   `// SEE:` has a knowledge file.
4. **Chat demo + control-plane agent end-to-end**: config + smoke test with an AI provider.
5. **Tooling consistency**: remove stray `pnpm-lock.yaml` inside bun monorepo (demos/saas, landing).
6. **Naming cleanup**: finish context→feature migration follow-ups; relocate `NAMING-ISSUE.md`.

## Definition of "delivery" (Totem Quality Gates)

`git clone → bun install → bun run dev` works with zero manual steps; lint/typecheck pass;
console clean; each README command works on fresh clone; task committed `<task_id>: <desc>`.
