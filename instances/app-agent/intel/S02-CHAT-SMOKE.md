# S02 Chat Smoke Report

**Date:** 2026-06-18  
**App:** `apps/chat` (`@app-agent/chat`)

## Migrations

```bash
cd apps/chat && bun run db:migrate
```

Result: ✅ `Database migrations up to date` (SQLite / libsql, NuxtHub)

## Dev server (chat-only)

```bash
cd apps/chat && bun run dev
```

Result: ✅ `http://localhost:3002/`

## API smoke

```bash
curl http://localhost:3002/api/status
```

Response:

```json
{
  "app": "chat",
  "feature": "chat-status",
  "status": "ok",
  "time": "2026-06-18T19:25:10.121Z"
}
```

## Home page

`GET http://localhost:3002/` → **HTTP 200**

## Env

- `apps/chat/.env` exists (not read — secrets)
- Template: `apps/chat/.env.example` (updated S02)
- Setup guide: `apps/chat/SETUP.md` (new)

## AI streaming

Not automated in S02 (requires live `AI_PROVIDER_KEY`). Manual check: open UI, send a message, confirm stream.

## Related

- Demo reference: `demos/chat` on port **3013** (separate app)
- Shared AI utils: `core/server/utils/integrations.ts`
