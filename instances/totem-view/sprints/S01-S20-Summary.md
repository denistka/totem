# totem-view S01–S20 — Historical digest

**Instance:** totem-view  
**Sprints covered:** 1–20  
**Digest date:** 2026-02-20  
**Role:** OPTIMIZER (optimization-sprint-flow)

---

## 1. Arc summary

| Phase | Sprints | Theme |
|-------|---------|--------|
| Foundation | S01–S03 | Monorepo, API, instances/sprints/tasks data pipeline, dashboard and instance/sprint/task UI |
| UI parity | S04–S07 | Premium Glass from taskboard-supabase; three-level display (boards → board → task); pixel and logic parity |
| Platform | S08–S10 | Vercel deploy, serverless API, SSE realtime; real Totem data (Board=Sprint); gate/phase/invariants in API and UI |
| Philosophy & collaboration | S11–S12 | Human–AI tandem philosophy; multi-actor presence and activity |
| Features | S13–S20 | Time Machine, tenant encapsulation, QA DevTools, Jira/ClickUp/Notion, realtime server, Supabase user data, AI feedback, prompts & run from UI |

---

## 2. Frozen invariants (carried forward)

- **S05:** Glass tokens (--glass-primary/accent/...), shadow tokens, Safari `-webkit-backdrop-filter`, modal/overlay pattern (`.modal-glass`), glass buttons and cards.
- **S06:** Three-level display (boards list → board view → task detail); routes `/boards`, `/board/:id`; shared UI layer; types in `types/board.ts` and `shared/types.ts`; plan by flow, not by single component.
- **S08:** Vercel layout (client static + serverless API); API shape; realtime = SSE one-shot or external provider (no WebSockets in serverless).
- **S10:** Gate (LOCKED/OPEN), phase, invariants, requires in API and UI; phase → role (PLAN→PLANNER/PM, etc.); hints only, no auto gate change.

Later sprints (S12, S13, …) add optional INVARIANTS (presence, time-slice, tenant, etc.) when those features are adopted.

---

## 3. Recurring patterns

- **Source of truth:** One reference (e.g. taskboard-supabase for UI; Totem API for data). Copy/align to that; avoid ad-hoc divergence.
- **Invariants chain:** Each sprint links prior INVARIANTS (e.g. S05, S06); new frozen decisions get their own Sxx-INVARIANTS.md and are linked in the next .ptl.
- **Tracks:** Backend/API first, then types and client, then UI; optional “continuation” track (e.g. S08-T6 UI/server parity).
- **Gate:** Explicit `Gate: LOCKED | OPEN` in .ptl; execution follows index.ti (no auto-proceed; LGTM/Go in user message).

---

## 4. Anti-patterns observed

- **Narrow task scope:** “Copy component X” without parity goal and full stack (types, styles, routes) led to rework (see S05 result: parity not reached in-sprint).
- **@apply on custom classes:** Tailwind v4 + custom class names in `@apply` caused build issues; fix: `@apply` only Tailwind utilities.
- **Planning in isolation:** Task-level focus without flow/screen scope increased dependency surprises; S06 clarified “plan by flow, scope by scenario.”

---

## 5. Stack and protocol alignment

- **Stack:** Vue 3, Vite, Tailwind; Vercel serverless; optional Supabase (user data, feedback); optional realtime server (separate from Vercel).
- **Protocol:** index.ti (anti–auto-proceed, gating); ITERATION_FLOW (phases, gates); PLANNER/PM/QA/ARCHITECT; .ptl/.pd as contracts.

---

## 6. Lessons backfilled (OPTIMIZER phase-2)

- **TAILWIND.ti:** Tailwind v4 — use `@apply` only for utility names, not custom/component classes.
- **VUE3_VITE_TAILWIND.ti:** Optional glassmorphism: tokens (RGB in :root), Safari backdrop-filter pair, modal overlay pattern.
- **OPTIMIZER.ti:** Planning lessons — scope by flow; invariants before next sprint; anti-pattern “narrow task scope.”

---

## 7. Phase 4 — Prune recommendations

**Keep:** All `.ptl`, `.pd`, `.pa`, every `Sxx-INVARIANTS.md`, `project.config.yml`, this digest.

**No action:** No `.po` files found in instance; no chat logs under totem/ tracked.

**Optional (reduce noise):** Per-sprint design/contract `.md` files (e.g. `S13-TIME-SLICE-CONTRACT.md`, `S17-EVENT-SCHEMA.md`, `S18-SUPABASE-SCHEMA.md`, `S19-FEEDBACK-CONTRACT.md`, `S20-PROMPT-CONTRACT.md`, `COLLABORATION_RULES.md`, sprint READMEs like `S15/README-EXTENSION.md`) are design artifacts. If content is fully captured in INVARIANTS or this digest, they can be archived or removed; otherwise keep if still referenced by tasks or API.

---

*Essential artifacts to retain: .ptl, .pd, .pa, Sxx-INVARIANTS.md, this digest.*
