# S07 — Totem Organization Layer · Summary

**Status:** CLOSED (2026-06-21, T07 verified) · **Codebase:** `app-agent-io/core`
**Deliverable:** Totem header rules moved into organization docs layer — knowledge slug,
company handbook pages, organization README planning section. Zero per-app instance dirs created.

## What shipped (T01–T07)

| Task | Outcome |
|------|---------|
| T01 | `S07-INVARIANTS.md` ratified — org-level scope only; S08/S09 explicitly deferred. |
| T02 | Knowledge slug `organization-planning.md` — layer map + MCP workflow table. |
| T03 | `docs/content/2.company/2.totem-governance.md` — axioms, roles, MCP preflight. |
| T04 | `docs/content/2.company/3.documentation-layers.md` — four-layer table + cross-links. |
| T05 | `organization/README.md` — **Planning & governance** section (header vs instance). |
| T06 | `0.index.md` updated; `3.work-control.md` → `4.work-control.md` for sort order. |
| T07 | This summary + `TOTEM_INDEX.ti` → S07 CLOSED. |

## Scope guard (invariants)

- **No** `apps/todo/` or `apps/*/planning/` directories created.
- **No** `totem-reader.ts` / `totem-writer.ts` path changes.
- S01–S06 artifacts untouched.

## MCP verify log (T07 close)

| Tool / check | Result |
|--------------|--------|
| MCP preflight `:3000/` | ✅ 200 |
| MCP preflight `:3000/mcp` | ✅ 406 |
| `explain("organization-planning")` | ✅ full knowledge file |
| `explain("layer-cascade")` | ✅ (T01 preflight) |
| `census(undocumented)` | ✅ all features documented |
| `record("organization-planning", "history", …)` | ✅ history aspect created |
| `list-pages` | ✅ returned internal docs index (company pages not in cached list yet) |
| `get-page("/company/totem-governance")` | ⚠️ MCP index cache miss — **HTTP 200** via curl |
| `get-page("/company/documentation-layers")` | ⚠️ same — **HTTP 200** via curl |
| `get-page("/company/work-control")` | ⚠️ same — **HTTP 200** via curl |
| `list-apps` | ⚠️ returned empty from docs MCP context (filesystem confirms no new apps) |
| `bun run feature:health` | ✅ 100% referenced slug coverage; `organization-planning` orphaned (knowledge-only, expected) |

**Note:** New company pages render on `:3000` (HTTP 200). MCP `get-page` uses `queryCollection` with 1h cache — restart docs dev server or wait for cache if MCP `get-page` must resolve new paths in-tool.

## Verification

| Check | Result |
|-------|--------|
| `bun run feature:health` | ✅ 13/13 referenced features documented |
| Company pages HTTP | ✅ totem-governance, documentation-layers, work-control |
| `organization/README.md` planning section | ✅ |
| External totem sprint home unchanged | ✅ |

## Backlog (post-S07 — NOT delivered here)

- **S08:** In-repo instance planning (`apps/<app>/planning/`) + work-control path migration
- **S09:** TODO app scaffold (:3004) + dogfood via work-control Accept
