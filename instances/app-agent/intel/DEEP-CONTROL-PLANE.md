# Deep Dive: Control Plane

**Traced:** 2026-06-18 (S03)  
**Port:** 3001  
**Path:** `core/control/` (upstream layer app)

## Purpose

Operational UI for the platform — not customer-facing:

- AI agent chat with live tool access
- Feature dependency graph visualization
- SSE live logs stream
- Runtime config diff viewer
- Settings management

## Agent chat endpoint

**Route:** `core/control/server/api/control/agent/chat.post.ts`

### Preconditions

`validateIntegrations()` must pass — requires:

- `AI_PROVIDER_URL`
- `AI_PROVIDER_KEY`
- `AI_PROVIDER_MODEL` (+ optional `AI_PROVIDER_MODELS`)

Returns **503** with issue list if misconfigured.

### Architecture

Uses Vercel AI SDK (`ai` package):

- `streamText` + `createUIMessageStream` for SSE response
- `smoothStream({ chunking: 'word' })` for UX
- `stopWhen: stepCountIs(5)` — max 5 tool rounds
- System prompt embeds platform architecture (layer cascade, ADR-005, feature slugs)

### Inline tools (5)

| Tool | Data source |
|------|-------------|
| `listFeatures` | `queryFeatureRegistry()` + edges + file counts |
| `getFeatureDetail` | Registry + edges + mappings + logs + knowledge file check |
| `queryLogs` | `queryRecentLogs({ slug, level, limit })` |
| `getLogSummary` | `getLogSummary(since)` |
| `readKnowledge` | Direct filesystem read of `core/docs/knowledge/{slug}.md` |

These duplicate docs MCP capabilities but query **live dev state** (registry, logs.db).

## UI stack

Extends organization → core. Uses Nuxt UI v4 dashboard patterns.  
File upload components reference `~~/shared/utils/file` — typecheck errors when `@nuxt/ui` versions diverge between `core/` and app `node_modules` (see S03 typecheck autopsy).

## Relationship to docs MCP

| Question | Answer |
|----------|--------|
| Can control replace docs MCP? | No — different protocol, fewer tools |
| Can control debug runtime? | Yes — logs, registry, config |
| Should agents use both? | IDE → docs MCP; ops/debug → control |

## Issue #108 (SPIKE)

Chat endpoint factory may move from customer `storytech` to core — evaluate whether `apps/chat` server routes should share control's AI patterns.

## Local dev

```bash
cd control && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev
```

Requires `control/.env` with `NUXT_SESSION_PASSWORD` + AI provider vars for agent chat.
