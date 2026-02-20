# S17 invariants (realtime server)

- **Realtime server:** Optional long-lived Node process; watches `TOTEM_INSTANCES_PATH`, parses on change (via existing totemParser), pushes events over WebSocket. Runs on port **3001** by default; Express API remains on 3000. See `sprints/17/S17-REALTIME-ARCHITECTURE.md` and `sprints/17/S17-EVENT-SCHEMA.md`.
- **Client:** When `VITE_REALTIME_WS_URL` is set (e.g. `ws://localhost:3001`), totem-view subscribes to the WebSocket and refetches instances/sprints on events. When unset, keeps one-shot SSE to `/api/events` or no realtime.
- **Event schema:** `instances` | `sprints` (payload: `instanceId`) | `sprint` (payload: `instanceId`, `sprintId`). Refetch mode only; delta mode optional later.
- **Deploy:** Realtime server is optional. Vercel-only deploy uses serverless API only; no realtime server required.
