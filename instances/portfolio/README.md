# Portfolio Instance — Live Showroom

Totem V6 instance for **Denis Baranov's interactive portfolio PWA**.

## Concept: C — "Live Showroom"

Multi-room PWA where each room is a tangible interactive demo of one skill area. Visitor pokes around, sees the work in motion — no client questions left about "can he do X?".

### Rooms (skill ↔ room mapping)

| Room | Skill demonstrated | Tech showcase |
|---|---|---|
| **Hero Playground** | motion design, micro-interactions | GSAP + drag/throw/morph |
| **Project Wall** | UI craft, glass aesthetics | sdui glass-entity grid + hover telemetry |
| **Live Demos** | backend, real-time | Supabase real-time mini-taskboard |
| **Animation Lab** | timeline animation engineering | mini Flash-style editor (Life.io echo) |
| **Contact** | full-stack | Vue form → Supabase RLS insert |

## Layout

```
totem/totem-v6/instances/portfolio/  ← this dir (planning, sprints, invariants)
├── project.config.yml                 ← stack + paths + guardians
├── README.md                          ← you are here
├── sprints/                           ← .ptl + .pd files (history of plans)
│   ├── S01-FOUNDATION.ptl             ← 🔒 LOCKED
│   └── tasks/T01..T08.pd              ← 🔒 LOCKED
└── intel/                             ← (optional) research, screenshots, links

/Users/denistka/Projects/portfolio/   ← workspace (docs + future app code)
├── app/                                ← actual Vue app (created by T01)
├── Denis Baranov CV.pdf
├── TECH_STACK_ANALYSIS.md
├── JOB_MATCH_MILTECH.md
└── supabase/                           ← Supabase migrations (created by T04)
```

## Status

- ✅ Instance scaffolded
- ✅ S01-FOUNDATION drafted (8 tasks, 3 tracks) — `gate: LOCKED`
- ⏳ S02-LIVE-SHOWROOM (concept-specific) — not yet planned
- ⏳ Awaiting `LGTM` / `Go` to unlock S01 DEV-phase

## Sprint Index

| Sprint | Status | File |
|---|---|---|
| S01 — Foundation | 🔒 LOCKED | [sprints/S01-FOUNDATION.ptl](sprints/S01-FOUNDATION.ptl) |
| S02 — Live Showroom rooms | 📋 pending | _to be planned after S01 LGTM_ |

## Load Order (per index.ti)

1. `totem-v6/index.ti` (master)
2. `totem-v6/instances/portfolio/project.config.yml` (this instance)
3. Stack adapters from `stack_adapters` (vue, supabase, vercel, tailwind, etc.)
4. Sprint `.ptl` → tasks `.pd`
