# S08 Invariants — Vercel hosting, API, realtime

**Sprint result:** totem-view is deployable on Vercel with client static output and serverless API. Optional realtime refresh via SSE; full realtime can use an external provider.

---

## Frozen decisions

- **Vercel layout:** Root `vercel.json`: build = `pnpm run build`, output = `client/dist`. SPA fallback rewrite for non-`/api` routes. No persistent local file storage; instance data path from `TOTEM_INSTANCES_PATH` env.
- **API:** Serverless under `api/`: `GET /api/instances`, `GET /api/instances/[id]/sprints`, `GET /api/events` (SSE). Node runtime; error responses `{ error: string }` with appropriate status codes.
- **Realtime contract:** SSE endpoint `/api/events` sends one `refresh` event then closes (serverless duration limits). Client `useRealtime(onRefresh)` subscribes and calls `onRefresh`. For push-style realtime (e.g. board/task CRUD), use external provider (Supabase Realtime, Pusher, Ably).

---

## For next sprints

- S05 + S06 + S07 invariants unchanged (glass, three-level display, pixel/logic parity).
- Env: document and use `TOTEM_INSTANCES_PATH`; no secrets in repo.
