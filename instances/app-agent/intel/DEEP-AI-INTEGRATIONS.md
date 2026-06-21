# Deep Dive: AI Integrations

**Traced:** 2026-06-18 (S03)  
**Slug:** `integrations`  
**File:** `core/server/utils/integrations.ts`

## Environment contract

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_PROVIDER_URL` | Yes* | OpenAI-compatible API base URL |
| `AI_PROVIDER_KEY` | Yes* | API key |
| `AI_PROVIDER_MODEL` | Yes* | Default model ID |
| `AI_PROVIDER_MODELS` | No | Comma-separated list for model picker |

*Required only for apps using AI (chat, control agent). Other apps skip silently.

## Profile system

```typescript
getProfile(name?) → IntegrationProfile { url, key, model, settings? }
```

Currently single `default` profile from env. `defu` merge supports named profiles (future multi-provider).

## Model creation

```typescript
createModelForId(modelId, profileName?)
```

Uses `@ai-sdk/openai` with:

- `baseURL: profile.url` — works with OpenRouter, local proxies
- `provider.chat(modelId)` — explicitly uses Chat Completions API (not Responses API v3 default)

**Why `.chat()`:** OpenRouter and compatible proxies don't support OpenAI Responses API.

## Validation (`validateIntegrations`)

Returns `{ ok, issues[] }`. Used by:

- `04.integrations.ts` plugin — logs ready / warns partial / silent skip
- Control agent `chat.post.ts` — 503 if not ok
- Chat app status/UI — "not configured" states

### Plugin behavior (`04.integrations.ts`)

| State | Behavior |
|-------|--------|
| `ok` | Log model count |
| 3+ missing vars | Silent skip ("app doesn't use AI") |
| 1–2 missing | Warn each issue |

## API route

`GET /api/integrations/models` — `defineFeatureHandler('integrations', ...)`  
Returns `listModels()` for client model selectors (`useModels` composable in chat apps).

## Consumers

| Consumer | Path | AI usage |
|----------|------|----------|
| Control agent | `control/.../agent/chat.post.ts` | streamText + tools |
| Customer chat | `apps/chat/server/api/chats/[id].post.ts` | Chat completion + tools |
| Demo chat | `demos/chat/...` | Same pattern |
| Docs MCP | None | Knowledge only |

## Issue backlog

- **#26** — model profiles, multi-provider config
- **#5** — MCP `explain` analysis aspect (sampling)
- **#10** — `record()` sub-agent

## Recommended local setup (OpenRouter)

```env
AI_PROVIDER_URL=https://openrouter.ai/api/v1
AI_PROVIDER_KEY=sk-or-...
AI_PROVIDER_MODEL=anthropic/claude-haiku-4.5
AI_PROVIDER_MODELS=anthropic/claude-haiku-4.5,openai/gpt-4o-mini
```

Never commit keys — add to `# Secrets` manifest.
