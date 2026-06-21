# Deep Dive: Chat App (`apps/chat`)

**Traced:** 2026-06-18 (S03)  
**Port:** 3002  
**Slug:** `chat-status`

## Stack

```typescript
// nuxt.config.ts highlights
extends: ['../../organization']
modules: ['@nuxt/ui', '@nuxthub/core', 'nuxt-auth-utils', 'nuxt-charts', ...]
hub: { db: 'sqlite', blob: true }
nitro: { preset: 'bun' }
```

## Database (NuxtHub)

- **Schema:** `server/db/schema.ts` — chats, messages tables
- **Migrations:** `bun run db:migrate` in `apps/chat`
- **Local:** SQLite via NuxtHub — no `DATABASE_URL` required
- **Blob:** File uploads enabled (`hub.blob: true`)

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/status` | GET | Feature demo endpoint (`chat-status` slug) |
| `/api/chats` | GET/POST | List/create chats |
| `/api/chats/[id]` | GET/POST/DELETE | Chat CRUD + message streaming |
| `/api/upload/[chatId]` | PUT | Upload attachment |
| `/api/upload/[...pathname]` | GET/DELETE | Blob serve/delete |
| `/auth/[provider]` | GET | OAuth popup handler |

## AI chat flow

1. Client `useChats` composable manages chat list/state
2. `useModels` fetches `/api/integrations/models` from core layer
3. `POST /api/chats/[id]` streams AI response via `@ai-sdk` + tools:
   - `shared/utils/tools/weather.ts`
   - `shared/utils/tools/chart.ts`
4. Requires `AI_PROVIDER_*` env vars (see `DEEP-AI-INTEGRATIONS.md`)

## vs `demos/chat` (3013)

| | `apps/chat` | `demos/chat` |
|--|-------------|--------------|
| Purpose | Customer-owned product app | Reference copy source |
| Port | 3002 | 3013 |
| Customize | Yes — your code | Copy via launcher, then edit copy |
| Structure | Same patterns | Nearly identical scaffold |

Launcher `copyDemo('chat')` copies demo → `apps/chat` for new forks.

## Onboarding docs

- `apps/chat/SETUP.md` — canonical setup (S02)
- `apps/chat/.env.example` — env template
- `apps/chat/README.md` — quick start

## Env requirements

```env
NUXT_SESSION_PASSWORD=...        # 32+ chars
AI_PROVIDER_URL=...
AI_PROVIDER_KEY=...
AI_PROVIDER_MODEL=...
# Optional OAuth:
# NUXT_OAUTH_GITHUB_CLIENT_ID=...
# NUXT_OAUTH_GITHUB_CLIENT_SECRET=...
```

## Feature instrumentation

`status.get.ts` demonstrates full loop:

```typescript
defineFeatureHandler('chat-status', (feat, event) => {
  feat.getFeature('feature-knowledge')  // records uses-edge in dev
  feat.log('status checked', { method: event.method })
  return { app: 'chat', feature: feat.slug, status: 'ok', time: ... }
})
```

Query via MCP `introspect("chat-status")` when dev server running.

## Open questions (#108)

Should chat endpoint factory move to core for reuse across customer apps?
