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
- ⏳ No sprints planned yet — awaiting backlog / `LGTM` to plan S01

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
