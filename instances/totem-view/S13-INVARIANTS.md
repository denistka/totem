# S13 Invariants — Time Machine view

**Sprint result:** User can open a Time Machine view, pick a date via timeline slider, and see boards/tasks as of that time. Read-only; "As of [date]" labeling. S05/S06/S08 preserved.

---

## Frozen decisions

- **Time-slice API:** Request via `GET /api/instances/:id/sprints?at=ISO8601` (or `?commit=SHA`). Response shape: same as current sprints; when `at`/`commit` present, response may be `{ sprints, asOf }`. Contract: `sprints/13/S13-TIME-SLICE-CONTRACT.md`.
- **Timeline/history:** Optional `GET /api/instances/:id/history` returns `{ times: string[] }` (ISO commit dates) for slider range. Fallback: last year to now, no marks.
- **Slider:** Horizontal timeline component (S13-T3); min/max and optional marks from history API or defaults. Emits selected time (ISO8601).
- **Entry:** Route `/instances/:id/time-machine`; entry from instance detail ("Time Machine" link) and from boards header. Exit returns to boards or instance.

---

## Invariants for next sprints

- S05 (glass, modal), S06 (three-level display), S08 (Vercel, API) unchanged.
- Time Machine is read-only: no create/edit/delete; TasksBoard and TaskDetails receive `readOnly` when in Time Machine mode.
