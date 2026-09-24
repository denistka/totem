# S12 Invariants — Multi-User Presence

> work-control feature (extends S11). Ratified at plan time 2026-06-21.

Frozen at plan time. Execution authorized separately per task gate.

## Scope

Real-time presence awareness across chat + board rooms. Humans and agents
appear as live avatars/badges. **No edit-locking** — read-only awareness only
(S05 roadmap: "awareness-no-lock"). Auth is NOT in S12 (→ S15): anonymous
presence uses a per-tab ephemeral session ID stored in sessionStorage.

## Invariants

### §1 — Presence is volatile
`wc_presence` is **in-memory only** on the server (Map on the Nitro instance).
No DB table for presence. On server restart, presence clears. This is correct:
presence is ephemeral by nature. DB presence → S15/S23.

### §2 — Broadcast model unchanged
`presence.sync` fans out via the same `realtime.ts` broadcast hub already in
place (S05/T09). The WS route emits `presence.sync` on join, leave, and role
change. No new transport — just a new emitter in `_ws.ts`.

### §3 — awareness-no-lock
S12 MUST NOT introduce edit-locking or pessimistic concurrency. Multiple users
on the same board can all hit "Run task" — last write wins. Locking is S-future.

### §4 — Anonymous identity (pre-auth)
Each browser tab generates a random `presenceId` (UUID v4, sessionStorage).
The `PresenceMember` label shows "User #1234" (last 4 chars of ID).
After S15 auth, the real user identity replaces this.

### §5 — Agent presence
When a mock/LLM agent runs a task, it MUST appear in the board-room presence
for the duration of the run. `kind: 'agent'`, role = task's `lead_role`.
Agent registers on run start, unregisters on run end (or timeout 30 s).

### §6 — Room mapping
Presence tracks two room types (matching existing WS rooms):
- `chat:<id>` — users viewing the chat page
- `board:<id>` — users viewing the board page

### §7 — Self in presence
A user MUST see their own entry in the presence list. The UI marks it with
"(You)" or a distinct ring. This helps users verify their connection is live.

### §8 — Scope guard
- **IN**: `presence.sync` event wire-up, in-memory server registry, ephemeral ID,
  AvatarStack UI on chat + board header, agent auto-registration on task run.
- **OUT**: DB-backed presence (→ S15), auth real identity (→ S15),
  typing indicators (→ future), operational transforms / edit-lock (→ future),
  todo app presence (→ future), Supabase presence channel (invariant §8 = Nitro WS only).

## References

- S05-INVARIANTS.md §8: Realtime = Nitro WS, NOT Supabase Realtime
- S11-INVARIANTS.md: S12 = presence, OUT of S11
- intel/DEEP-ORCHESTRATOR.md §4: `presence.sync` WcEvent type
- apps/work-control/shared/ws.ts: `PresenceMember`, `presence.sync`
