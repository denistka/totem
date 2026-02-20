# S10 Invariants — PM practice (gates, phases, invariants, hints)

**Sprint result:** totem-view surfaces protocol for the Human–AI tandem: gate (LOCKED/OPEN), phase, role, invariants, requires, and next-step hints. No automatic gate change; file remains source of truth.

---

## Frozen decisions

- **API:** Sprints expose `gate`, `phase`, `invariants` (from .ptl). Tasks expose `gate`, `requires` (from .pd). Gate normalized to `LOCKED` | `OPEN`; phase optional; invariants parsed from **Invariants:** list.
- **UI:** Task card and board card show gate badge; LOCKED shows "Waiting: open gate". Board view header shows sprint gate, phase, owner (from phase), invariants. Task detail shows gate, requires (tags). Boards list shows hint when any sprint is LOCKED: "N sprint(s) LOCKED — change gate to OPEN in .ptl to run."
- **Phase → role:** PLAN → PLANNER/PM, DESIGN → ARCHITECT, DEVELOP → DEV, VERIFY → QA, CLOSE → ROOT/PM (from ITERATION_FLOW).

---

## For next sprints

- S05, S06, S09 unchanged. Hints are guidance only; no automatic actions from UI.
