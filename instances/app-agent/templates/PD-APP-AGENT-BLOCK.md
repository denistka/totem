# Paste block for PLANNER — App Agent sections in `.pd` files

**Required YAML:** `protocol: ../APP-AGENT-PROTOCOL.md` in every `.pd` header.

Copy into every implementation task (code changes in `paths.code`).

---

## App-agent preflight (MANDATORY before code)

- [ ] Run MCP preflight per `APP-AGENT-PROTOCOL.md` §2 — **warn user if :3000 down**
- [ ] `explain("layer-cascade")` + `explain("<slug>")` via Docs MCP (or read knowledge files if MCP offline)
- [ ] Read `AGENTS.md` constraints for this change
- [ ] `list-apps` / `get-app-structure` if new app or unfamiliar surface

## Implementation (app-agent conventions)

- [ ] Code only under `apps/*` or `organization/` — no upstream `core/` except allowed knowledge slug
- [ ] `defineFeatureHandler("<slug>", ...)` on new API routes
- [ ] `// SEE: feature "<slug>" at path` on new/changed source files
- [ ] Match organization brand / `useAgentRoles()` — no hardcoded agent enums

## Done when (app-agent)

- [ ] `bun run test` (vitest) — NOT bare `bun test`
- [ ] `bun run feature:health` — slug green, no broken SEE refs
- [ ] MCP `census()` if new slug added (skip with note if MCP was offline)
- [ ] Knowledge: update `core/docs/knowledge/<slug>.md` OR `apps/<app>/docs/` as appropriate
- [ ] Org docs: `docs/content/` page if DAWWWB-facing (sprint doc-sync task)
