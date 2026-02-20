# S12 Invariants — Real-time collaboration (array of humans, array of agents)

**Sprint result:** totem-view supports multiple humans and multiple agents with visible presence (who is here), viewing context (who is on this board/task), and collaboration rules. S05/S06/S08 preserved.

---

## Frozen decisions

- **Actor model:** `Actor`: id, type ('human' | 'agent'), name, sessionId? (shared/types). TotemEvent.actor extended with id, sessionId. Human id placeholder: `human-{sessionId}`; agent id from env or name.
- **Presence contract:** See `totem-view/docs/PRESENCE_CONTRACT.md`. Scopes: instance, board, task. GET /api/presence?scope=…; POST /api/presence/join, POST /api/presence/leave. In-memory store with TTL (dev and best-effort on Vercel); for production scale use Vercel KV or external provider.
- **UI:** Presence strip (viewing this board) in board header; optional "Another user is viewing this task" in task detail when presence in task scope has others. No WebSockets in serverless (S08).
- **Collaboration rules:** See `instances/totem-view/COLLABORATION_RULES.md`: gate = any human; same-task = awareness (hint), last-write-wins; agents never open gate.

---

## For next sprints

- S05, S06, S08 unchanged. Activity feed (who did what) can be added with timeline API + Actor in events.
