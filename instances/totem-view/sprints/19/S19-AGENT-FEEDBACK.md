# S19: How agents submit feedback to totem-view

## Method: POST to API

The agent submits feedback by **POSTing to the totem-view API**. No file write in the Totem repo; works for remote agents and Cursor.

## Env and auth

- **TOTEM_VIEW_API_URL** — Base URL of the totem-view API (e.g. `http://localhost:3000/api` for local, or your Vercel API URL).
- **TOTEM_VIEW_API_KEY** — Optional. If set on the server, the agent must send this in the `X-Api-Key` header to authenticate. When not set, POST is allowed with tenant only (X-Tenant-Id).
- **X-Tenant-Id** — Optional. Same as S14; use when multi-tenant. When API key is used, tenant defaults to `default` if header is missing.

Agent should read these from env (no secrets in prompts).

## Endpoint

- **POST** `{TOTEM_VIEW_API_URL}/feedback`

Body (JSON):

```json
{
  "instanceId": "totem-view",
  "sprintId": "17",
  "taskId": "S17-T1-RealtimeServerArchitecture",
  "type": "block",
  "body": "Waiting for LGTM to execute.",
  "actor": {
    "id": "cursor-agent",
    "name": "Cursor",
    "type": "agent"
  }
}
```

- At least one of `instanceId`, `sprintId`, `taskId` is required.
- **type:** `status` | `block` | `suggestion` | `message`.
- **actor.type** must be `agent`.

## Example (curl)

```bash
export TOTEM_VIEW_API_URL="${TOTEM_VIEW_API_URL:-http://localhost:3000/api}"
export TOTEM_VIEW_API_KEY="${TOTEM_VIEW_API_KEY:-}"

curl -X POST "$TOTEM_VIEW_API_URL/feedback" \
  -H "Content-Type: application/json" \
  $([ -n "$TOTEM_VIEW_API_KEY" ] && echo "-H \"X-Api-Key: $TOTEM_VIEW_API_KEY\"") \
  $([ -n "$VITE_TENANT_ID" ] && echo "-H \"X-Tenant-Id: $VITE_TENANT_ID\"") \
  -d '{
    "instanceId": "totem-view",
    "sprintId": "19",
    "taskId": "S19-T1-FeedbackModelAndContract",
    "type": "message",
    "body": "Contract documented. Ready for T2.",
    "actor": { "id": "agent", "name": "PM", "type": "agent" }
  }'
```

## Guardian note (PM / PLANNER)

After executing a task, you may submit feedback for the human via **POST** to `{TOTEM_VIEW_API_URL}/feedback` with scope (instanceId/sprintId/taskId), type, body, and actor. Use env `TOTEM_VIEW_API_URL` and optionally `TOTEM_VIEW_API_KEY`.
