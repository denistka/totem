# S11 — Time-Machine Scrubber · Summary

**Status:** CLOSED (2026-06-21) · **Codebase:** `app-agent-io/core`

## Delivered

| Task | Outcome |
|------|---------|
| T02 | `docs/history-replay.md` design (totem-view pattern) |
| T03 | `history-snapshot.ts` + `GET /api/boards/:id/history` |
| T04 | `HistoryScrubber.vue` |
| T05 | Board page Live/Replay integration; Run disabled in replay |
| T06 | `work-control.md` + `orchestrator.md` updated |
| T07–T08 | Unit tests + this summary |

## Verify

- `bun run test` — `history-snapshot.test.ts` passes
- Replay toggles on board `:3003`; activity filtered by scrubber index
- WS indicator shows disconnected during replay (no live mutations)

## Next

S12: Multi-user presence + collaboration rules
