# TaskBoard — Project Overview

**Stack**: Vue 3 + Node.js + Supabase + Tailwind CSS  
**Source**: [Local TaskBoard Dir](../../taskboard-supabase)

---

## Architecture

| Layer        | Directory | Responsibility                 |
| ------------ | --------- | ------------------------------ |
| UI Layer     | `client/` | Vue 3 App (Vite + Tailwind)    |
| Server Layer | `server/` | Node.js API (tsx + vitest)     |
| Data Layer   | `db/`     | Database schema and migrations |
| Shared       | `shared/` | Common types and logic         |

---

## Sprints & History

- **History Root**: `./` (Instance Root)
- **Active Sprint**: **S01: Initial Setup**

---

## Key Docs (Instance)

| Doc           | Location               |
| ------------- | ---------------------- |
| Protocol Core | `totem/core/`          |
| Intel Index   | `intel/TOTEM_INDEX.ti` |
| Config        | `project.config.yml`   |

---

## Guardians Selection

Universal Process: `ROOT`, `PM`, `TEAM_LEAD`, `QA`, `DEVOPS`, `ARCHITECT`

Stack Adapters:

- `FRONTEND_DEV` (`stacks/vue3-vite-tailwind/FRONTEND_DEV.ti`)
- `BACKEND_DEV` (`stacks/node-express/BACKEND_DEV.ti`)
- `SUPABASE` (`stacks/supabase/SUPABASE.ti`)
