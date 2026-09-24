# S12 Summary — Multi-User Presence

**Status:** CLOSED  
**Closed:** 2026-06-21  
**Gate:** OPEN (executed by PM)

## Delivered

- **Server:** `server/utils/presence.ts` — in-memory volatile registry (`joinRoom`, `leaveRoom`, `broadcastPresence`)
- **WS:** `_ws.ts` emits `presence.sync` on subscribe/unsubscribe/close with client `member` payload
- **Client:** `usePresenceId()` (sessionStorage UUID), `useRealtime()` returns `members` ref
- **UI:** `PresenceAvatars.vue` on board + chat headers (self ring, agent role colors, +N overflow)
- **Agents:** `run.ts` registers agent presence for task duration + 30 s safety timeout
- **Docs:** `apps/work-control/docs/collaboration.md`, knowledge slug + orchestrator updated

## Verification

- `bun run test` — 341 passed (presence registry + usePresenceId unit tests)
- `bun run feature:health` — green (`work-control` slug)
- MCP preflight: `:3000` reachable (406 on GET /mcp — expected)

## Invariants upheld

- §1 in-memory only (no DB)
- §3 awareness-no-lock (no edit locking added)
- §4 ephemeral tab IDs pre-auth
- §5 agent presence during task run
- §8 Nitro WS only (no Supabase realtime)

## Next

**S13:** Multi-agent task handoff (lead + helper roles per task)
