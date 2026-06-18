# S01 Investigation Summary

**Sprint:** S01 Deep Investigation  
**Date:** 2026-06-18  
**Status:** Complete (read-only recon + Totem documentation)

---

## Executive summary

App Agent is a **mature Nuxt 4 monorepo skeleton** with a distinctive **feature-knowledge + MCP** system that makes AI agents effective without dumping ADRs into context. The architecture (layer cascade, 12 MCP tools, 15 knowledge slugs) is sound and largely implemented.

**Gaps:** Chat app needs env to run; demo typecheck fails; test suite partially broken; product layers (billing, multi-tenancy) remain vision; demo apps have extensive hardcoding (issue #114); 21 open GitHub issues.

---

## What we documented

| Artifact | Location |
|----------|----------|
| Repo inventory | `intel/REPO_INVENTORY.md` |
| Architecture map | `intel/ARCHITECTURE_MAP.md` |
| Feature census | `intel/FEATURE_CENSUS.md` |
| Problems (P0–P2) | `intel/PROBLEMS_REGISTER.md` |
| GitHub sync | `intel/GITHUB_ISSUES_SYNC.md` |
| MCP setup | `intel/MCP_SETUP.md` |
| Docs drift | `intel/KNOWLEDGE_GAPS.md` |
| Agent hub | `intel/TOTEM_INDEX.ti` |
| Invariants | `S01-INVARIANTS.md` |

---

## Top 5 findings

1. **Feature health is good** — 100% slug coverage in code; `feature:health` passes.
2. **CI-local health is not green** — typecheck fails on demos; 83 test failures at root.
3. **MCP is the agent interface** — start `dev:docs`, connect Cursor/Claude to `:3000/mcp`.
4. **Chat is blocked on config** — AI Gateway key, OAuth, DB migrations required.
5. **`temp.md` is a security issue** — API keys in plaintext; rotate immediately.

---

## Recommended next sprints

| Sprint | Focus |
|--------|-------|
| S02 | Chat app runnable (env template, migrations, smoke test) |
| S03 | Fix demo typecheck + start demo configurability (#114) |
| S04 | Fix test harness + Supabase integration tests (#4) |
| S05 | MCP analysis/record completion (#5, #10) |

---

## How to use this knowledge

```
read totem/totem-v6/index.ti, load instance app-agent, read intel/TOTEM_INDEX.ti
```

Then MCP `explain("layer-cascade")` when touching code.
