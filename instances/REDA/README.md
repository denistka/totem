# REDA — Totem V6 Instance

Totem instance for **REDA** (Restaurant Efficiency Data Analysis) — a multi-role restaurant management PWA.

## Layout

```
totem/totem-v6/instances/REDA/     ← this dir (planning, sprints, invariants)
├── project.config.yml              ← stack + paths + guardians
├── README.md                       ← you are here
├── BRIEF.md                        ← project summary for planners
├── S01-INVARIANTS.md               ← frozen architectural decisions
├── sprints/                        ← .ptl + .pd files (created on demand)
└── intel/                          ← research, screenshots, links

/Users/denistka/Projects/REDA/      ← workspace
├── _app/reda/                      ← Nuxt 3 app (paths.code)
├── docs/                           ← system schema & feature docs
└── supabase/migrations/            ← PostgreSQL schema (24 migrations)
```

## Stack

| Layer | Path | Responsibility |
| ----- | ---- | -------------- |
| Frontend | `_app/reda/pages/`, `components/`, `composables/` | Vue 3 UI, role-based views |
| Server API | `_app/reda/server/api/` | Nitro routes via `api-helpers.ts` |
| Database | `supabase/migrations/` | PostgreSQL + RLS + Realtime |
| Deploy | Vercel | `pnpm build` → serverless |

## Roles

VISITOR · WAITER · CHEF · BARMAN · ADMIN — see `S01-INVARIANTS.md` and `docs/ROLE_PERMISSIONS_REFERENCE.md`.

## Key Docs

| Doc | Location |
| --- | -------- |
| Tech reference | `REDA/docs/REDA_TECH_REFERENCE.md` |
| Full schema | `REDA/docs/AGENTS.MD` |
| Role permissions | `REDA/docs/ROLE_PERMISSIONS_REFERENCE.md` |
| Chat system | `REDA/docs/CHAT_SYSTEM.md` |
| Feedback system | `REDA/docs/FEEDBACK_SYSTEM.md` |
| Payments | `REDA/docs/PAYMENT_FEATURES.md` |
| Instance config | `./project.config.yml` |
| Invariants | `./S01-INVARIANTS.md` |

## Status

- ✅ Instance scaffolded
- ✅ S02–S06 planned from the CRM/ERP article backlog (see `sprints/`) — **all `gate: LOCKED`**
- ⏳ Awaiting `LGTM` + answers to S02 open questions before any task may run

| Sprint | Pillars | Migrations | Tasks |
| ------ | ------- | ---------- | ----- |
| S02 Foundation — Contract Freeze & Risk Retirement | — | 025–030 | 17 `.pd` written |
| S03 Guest Identity, Loyalty, Referral | P1, P7 | 031–035 | manifest only (JIT) |
| S04 Event Ledger & Line Composition | P2 | 036–039 | manifest only (JIT) |
| S05 Stock, Recipes, Prep-Batch Waste | P4 | 040–046 | manifest only (JIT) |
| S06 Analytics, Forecast, Business Rules | P3, P5, P6 | 047–051 | manifest only (JIT) |

`.pd` files for S03–S06 are generated at sprint start per PLANNER JIT context mapping, so their
`requires:` reflect the codebase as it actually is by then.

## Load Order

1. `totem-v6/index.ti` (master)
2. `totem-v6/instances/REDA/project.config.yml` (this instance)
3. Stack adapters from `requires:` (JIT — nuxt, supabase, vue, tailwind, vercel)
4. Sprint `.ptl` → tasks `.pd`

## Dev Commands

```bash
cd /Users/denistka/Projects/REDA/_app/reda
pnpm dev          # localhost:8080
pnpm test:run     # vitest
```
