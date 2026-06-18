# MCP Setup & Agent Integration

**Updated:** 2026-06-18

## Docs MCP server

| Property | Value |
|----------|-------|
| Host app | `@app-agent/docs` (`/docs`) |
| Layer implementation | `@app-agent/docs-layer` (`/core/docs`) |
| Dev URL | `http://localhost:3000` |
| MCP endpoint | `http://localhost:3000/mcp` |
| Transport | HTTP (`@nuxtjs/mcp-toolkit`) |

### Start server

```bash
cd /Users/denistka/Projects/app-agent-io/core
bun install
bun run dev:docs
```

### Register in Claude Code

```bash
claude mcp add --transport http app-agent-docs http://localhost:3000/mcp
```

### Register in Cursor

1. Start docs dev server (above)
2. Cursor Settings → MCP → add HTTP server `http://localhost:3000/mcp`
3. Or use project MCP config pointing at the running server

**Note:** The workspace MCP `user-app-agent-docs` was errored at investigation time — typically means the docs server was not running.

## Tool catalog

### Knowledge tools (feature-oriented)

| Tool | Use when |
|------|----------|
| `explain` | Before editing code for a feature — `explain({ slug: "runtime-config" })` |
| `record` | After implementing — write reasoning/history to knowledge file |
| `introspect` | Inspect runtime registry for a slug |
| `census` | Coverage audit — orphaned slugs, missing knowledge |
| `log-summary` / `recent-logs` | Debug slug-tagged server logs |

### Codebase tools (structure-oriented)

| Tool | Use when |
|------|----------|
| `list-apps` | Discover apps, demos, ports |
| `get-app-structure` | Tree view of an app |
| `list-components` | Find components/pages/composables |
| `get-file` | Read source without local grep |
| `list-pages` / `get-page` | Documentation content |

## Control plane agent (separate from docs MCP)

| Property | Value |
|----------|-------|
| App | `@app-agent/control` |
| Port | 3001 |
| UI | `/agent` page |
| API | `POST /api/control/agent/chat` |
| Wrapper | `defineFeatureHandler` on chat endpoint |

The control plane provides a **browser UI** for agent chat and operational dashboards. It is not the same as the docs MCP server — agents in Cursor/Claude should use docs MCP for codebase knowledge.

## Recommended agent load order

```
1. read totem instance app-agent-io → intel/TOTEM_INDEX.ti
2. MCP explain("layer-cascade") + explain("feature-knowledge")
3. MCP list-apps → get-app-structure for target app
4. MCP get-file for specific files
5. After changes: census() + feature:health CLI
```

## Chat app + MCP (future — issue #108, temp.md)

**Current state:** `apps/chat` is a customer app with AI SDK + persistence; docs app has MCP for codebase introspection.

**Product direction (not implemented):** A chat agent that combines:

- Docs MCP tools (explain, get-file, census)
- Streaming chat UX from demo-chat template
- Possibly control plane agent API

Track in S02+ after env setup for chat works.

## Limitations (known)

| Limitation | Issue |
|------------|-------|
| `explain` aspect `analysis` not implemented | #5 |
| `record` does not spawn sub-agent | #10 |
| Config dump introspection deferred | #13 |
| No Supabase MCP docs for customer forks | #117 |
