# Deep Dive: MCP Tools (Docs Layer)

**Traced:** 2026-06-18 (S03)  
**Endpoint:** `http://localhost:3000/mcp`  
**Location:** `core/docs/server/mcp/tools/`

## Tool catalog

| Tool | File | Purpose | Key inputs |
|------|------|---------|------------|
| `explain` | `explain.ts` | Read knowledge by slug/aspect | `slug`, `aspect?` |
| `record` | `record.ts` | Write/update knowledge during sessions | `slug`, `aspect`, `content` |
| `introspect` | `introspect.ts` | Runtime feature profile from registry | `slug` |
| `census` | `census.ts` | Coverage report (SEE vs knowledge) | — |
| `log-summary` | `log-summary.ts` | Aggregate dev logs by slug/level | `since?` |
| `recent-logs` | `recent-logs.ts` | Filtered recent log entries | `slug?`, `level?`, `limit?` |
| `list-apps` | `list-apps.ts` | All apps/demos with ports | — |
| `list-components` | `list-components.ts` | Components/composables/routes in app | `app`, `type?` |
| `get-app-structure` | `get-app-structure.ts` | Directory tree for app/demo | `app` |
| `get-file` | `get-file.ts` | Read source file from monorepo | `path` |
| `list-pages` | `list-pages.ts` | Docs content pages | `category?` |
| `get-page` | `get-page.ts` | Full docs page content | `path` |

## `explain` aspects

Valid: `description`, `overview`, `faq`, `reasoning`, `details`, `history`  
Omit `aspect` → returns full markdown file.

**Known gap (#5):** `aspect: analysis` returns error — "not yet implemented" (MCP sampling planned).

## Agent workflow (recommended)

1. `list-apps` — discover what exists
2. `explain("layer-cascade")` — load architectural context
3. `get-file` / `list-components` — examine code
4. `introspect("authentication")` — check runtime registration
5. `census` — verify knowledge coverage before adding SEE annotations

## vs Control Plane agent

| | Docs MCP (:3000) | Control agent (:3001) |
|--|------------------|----------------------|
| Interface | MCP protocol (Cursor/Claude) | HTTP SSE chat UI |
| Tools | 12 static MCP tools | 5 inline tools (listFeatures, queryLogs, etc.) |
| Knowledge | Reads `knowledge/*.md` | Reads same files + live registry |
| Use case | Coding in IDE | Runtime debugging, ops |

**Do not conflate** — docs MCP is for codebase intelligence; control agent is for live system state.

## Startup requirement

```bash
cd docs && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev
```

Cursor MCP config: see `intel/MCP_SETUP.md`. Server must be running before IDE connects.

## `record` tool status

Writes knowledge aspects to `core/docs/knowledge/{slug}.md`.  
Issue #10: sub-agent via MCP sampling for richer `record` not implemented.
