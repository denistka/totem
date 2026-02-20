# S09 Invariants — Real Totem data on boards

**Sprint result:** Boards list and board view use real Totem data. Board = Sprint; task = parsed .pd task. No mock data on `/boards` and `/board/:id`.

---

## Frozen decisions

- **Board = Sprint:** One Totem sprint → one Board (id, name from sprint; description from goal).
- **Task = parsed .pd:** One .pd file → one Board Task with status. Status normalized to `todo` | `in_progress` | `done` (parser + client mapping).
- **Instance context:** Boards list and board view use `?instance=<id>` (default `totem-view`). Route: `/boards?instance=totem-view`, `/board/:sprintId?instance=totem-view`.
- **Task detail:** Panel shows parsed .pd content: title, description/objective, steps, acceptance criteria, gate, requires. Status editable in UI; create/delete board are informational (sprints managed in Totem).

---

## For next sprints

- S05 + S06 (and S07/S08) invariants unchanged. Mapping lives in `client/src/lib/boardMapping.ts`; parser in server and `api/lib/parser.ts` returns normalized status and body fields (objective, steps, acceptanceCriteria, gate).
