# S17: Realtime event types and payload

Client and server use this schema for WebSocket (or SSE) messages.

## Event types (refetch mode)

Events are JSON objects with at least `type` and optional `payload`. Client reaction: **refetch** the corresponding REST resource.

| Event type   | Payload | Client reaction |
|-------------|---------|------------------|
| `instances` | `{}` or `{ ts }` | Refetch `GET /api/instances` (e.g. `useInstances().refresh()`). |
| `sprints`   | `{ instanceId: string }` (optional `ts`) | Refetch sprints for that instance: `GET /api/instances/:id/sprints` / `useSprints(instanceId).fetchSprints()`. |
| `sprint`    | `{ instanceId: string, sprintId: string }` (optional `ts`) | Refetch sprints for that instance (or that sprint only if API supports it). Simplest: refetch full sprints for `instanceId`. |

All payloads are JSON-serializable. `ts` is an optional ISO timestamp or number for ordering.

## Payload shape (TypeScript)

```ts
type RealtimeEvent =
  | { type: 'instances'; payload?: { ts?: string | number } }
  | { type: 'sprints'; payload: { instanceId: string; ts?: string | number } }
  | { type: 'sprint'; payload: { instanceId: string; sprintId: string; ts?: string | number } }
```

## Delta mode (optional, future)

For delta mode the server can send the new data in the event, e.g.:

- `{ type: 'sprints', instanceId, sprints: [...] }`

Client may then merge instead of refetching. S17 implements refetch-only; delta can be added later.

## Client contract

- On **`instances`**: call refresh for instances list (e.g. `useInstances().refresh()`).
- On **`sprints`**: call `useSprints(payload.instanceId).fetchSprints()` (and update UI if current route is that instance).
- On **`sprint`**: refetch sprints for `payload.instanceId` (same as `sprints` for simplicity).

Reconnection: on new connection the server may send a single `sync` or repeat the last `instances` / `sprints` events so the client is up to date; otherwise the client refetches on first event after connect.
