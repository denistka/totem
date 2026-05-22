# S06 · Real-time backbone + gates

**Phase:** P1 · Core MVP
**Window:** M4–M5
**Status:** planned
**Depends on:** S02 (events table), S03, S04
**Blocks:** S08, S09

## Objective

Wire the prototype to the existing WebSocket server so chat messages,
task updates, gate transitions and presence are real-time across clients.

## Acceptance criteria

- [ ] `useNexusMocks` replaced by `useNexusProject(projectId)` that reads
      via Supabase + subscribes via WS
- [ ] SSE fallback (already present in `totem-view`) for serverless envs
- [ ] Optimistic updates on chat send + rollback on server reject
- [ ] Presence: shared cursor positions in DAG, online list synced
- [ ] Gate UI: approve / reject buttons emit `gate:*` events to server,
      audit-logged
- [ ] Reconnect-with-backoff + offline queue for messages

## Out of scope

- CRDT sync of arbitrary content (deferred to later)
- Push notifications (S14)

## Engineering notes

- Reuse `useWebSocket` composable and server `MessageHandler`
- Add message types: `nexus:chat.send`, `nexus:gate.set`, `nexus:task.move`
- Event sourcing: every mutation writes to `events` first, then projects

## Risks

- Ordering bugs between optimistic UI and server echo — guard by
  client-generated message ids and dedup on echo
