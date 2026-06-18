# S01 Invariants — app-agent-io

Frozen after sprint S01 (Deep Investigation), 2026-06-18.  
Changes require explicit discussion — non-additive edits blocked.

---

## Architecture

1. **Three-layer cascade:** `core` → `organization` → `apps|demos|docs|control`. Higher layer wins on conflicts; arrays concatenate via `defu`.
2. **Upstream boundary:** `/core/` and `/core/docs/` are upstream-maintained. Customer work lives in `/apps/`, `/docs/content/`, `/organization/`.
3. **Server middleware:** All layers' `server/middleware/` execute — no override, only additive.
4. **Monorepo tool:** Bun + Turborepo. Package manager pinned in root `package.json`.

## Feature knowledge

5. **Slug is join key:** kebab-case identifier links knowledge file, `// SEE:` annotations, and `defineFeature*()` wrappers.
6. **Pull model:** Agents use MCP `explain(slug)` — ADRs are archived reference only.
7. **No ambient feature scope:** Logging inside a feature requires `defineFeatureHandler/Plugin/Composable` or `getFeature()`.
8. **Knowledge source of truth:** `core/docs/knowledge/{slug}.md` — git-tracked; `knowledge.db` / `logs.db` are rebuildable caches.

## Ports (do not reassign without updating all package.json dev scripts)

| Port | App |
|------|-----|
| 3000 | docs |
| 3001 | control |
| 3002 | apps/chat |
| 3010–3014 | demos |

## MCP

9. **Docs MCP endpoint:** `http://localhost:3000/mcp` — requires `bun run dev:docs`.
10. **Control plane agent** is separate from docs MCP — UI at control:3001, not a substitute for codebase tools.

## Investigation findings (frozen facts)

11. **Typecheck:** Not green — demo-saas/landing fail TS checks as of 2026-06-18.
12. **Tests:** 171 pass / 83 fail at root `bun test` — feature registry tests need harness fix.
13. **Feature health CLI:** 12/12 code slugs have knowledge; 3 orphaned knowledge files exist.
14. **Security:** `temp.md` in repo root contains plaintext API keys — treat as incident, rotate keys.

## Totem instance

15. **Agent entry:** `read totem/totem-v6/index.ti, load instance app-agent-io, read intel/TOTEM_INDEX.ti`
16. **External intel path:** `totem/totem-v6/instances/app-agent-io/intel/`
17. **Code path:** `/Users/denistka/Projects/app-agent-io/core`
