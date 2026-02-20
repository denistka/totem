# S17: Realtime server architecture

## Role of the realtime server

1. **Watch** `TOTEM_INSTANCES_PATH` (or poll at a configurable interval). The server runs in an environment with persistent process and filesystem access (e.g. Node on Railway, Fly, or local dev).
2. **On change**, re-parse the affected instance/sprint/task using the existing totem parser (`parseProjectConfig`, `parseSprintFile`, `parseTaskFile`). Same response shapes as the REST API so totem-view can refetch from REST after a push, or apply delta if payload is defined.
3. **Push events** to connected clients over a long-lived channel (WebSocket or long-lived SSE). Each client receives events when instances list, sprints for an instance, or a single sprint/task change.
4. **Optional:** Expose `GET /api/instances` and `GET /api/instances/:id/sprints` on the same process so one server can replace serverless for that deploy. For S17 we keep REST on Vercel/Express and add only the push channel on the realtime server.

## Push mechanism: WebSocket vs SSE

| | WebSocket | Long-lived SSE |
|---|-----------|----------------|
| **Library** | `ws` | Native `EventSource` / write `event: X\ndata: {...}\n\n` |
| **Direction** | Bidirectional | Server → client only |
| **Reconnect** | Client must re-open | EventSource auto-reconnects with Last-Event-ID |
| **Complexity** | Slightly more (handshake, binary) | Simpler (HTTP, text stream) |

**Choice for S17:** **WebSocket**. One connection per client; server broadcasts JSON events when the parse pipeline emits. Bidirectional option is reserved for future use (e.g. client requests); for now only server→client push is used.

## When to use realtime server vs serverless

- **Vercel-only deploy:** Use serverless API only. No realtime server. Client uses one-shot SSE to `/api/events` if available, or no realtime.
- **Dev / self-hosted:** Run the realtime server alongside (or instead of) the main API. Client is configured with `VITE_REALTIME_WS_URL` (e.g. `ws://localhost:3001`). When set, client subscribes to the WebSocket and refetches on events; when not set, existing one-shot SSE or no realtime behavior is kept.

## Relation to REST

- **Existing REST** (Vercel `api/` or Express `server/`): unchanged. Same routes and response shapes.
- **Realtime server:** Separate long-lived process. It may optionally serve REST on the same port (e.g. `/api/instances`, `/api/instances/:id/sprints`) for a single-process deploy; for S17 the realtime server focuses on watch + push only. Clients continue to call the existing API base URL for REST; realtime URL is configured separately (`VITE_REALTIME_WS_URL`).

## Entry point and env

- **Entry:** `server/src/realtimeServer.ts`. Run: `pnpm run realtime` (root) or `pnpm run realtime` from `server/`.
- **Env:** `TOTEM_INSTANCES_PATH` (path to Totem instances), `REALTIME_PORT` or `PORT` (default **3001**). Prefer `REALTIME_PORT=3001` so it doesn’t conflict with Express on 3000 when both run.
- **Deploy:** Docker, Railway, Fly, or same host. Optional; production can stay Vercel-only.

## Summary

- Realtime server: watch Totem dir → parse on change → broadcast events over WebSocket.
- Push mechanism: WebSocket (ws library).
- Use realtime server in dev/self-hosted when `VITE_REALTIME_WS_URL` is set; production can stay Vercel-only and skip this server.
