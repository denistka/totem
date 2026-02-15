# PowMr Inverter Dashboard — Project Overview

**Stack**: Vue 3 + Node.js + Express + Modbus-TCP  
**Source**: [Local Apps Dir](../../apps/)

---

## Architecture

| Layer        | Directory      | Responsibility                             |
| ------------ | -------------- | ------------------------------------------ |
| UI Layer     | `apps/client/` | Vue 3 PWA Frontend (Vite + Tailwind)       |
| Server Layer | `apps/server/` | Node.js Express API & Modbus Communication |
| Data Layer   | `apps/data/`   | Persistence and CSV logging                |
| Docs         | `apps/docs/`   | System documentation                       |

---

## Sprints & History

- **History Root**: `./` (Instance Root)
- **Active Sprint**: **S03: eWeLink Refinement**
- **S01/S02**: Registration & Analysis (Completed)

---

## Key Docs (Instance)

| Doc         | Location                 |
| ----------- | ------------------------ |
| Intel Index | `intel/TOTEM_INDEX.ti`   |
| Config      | `project.config.yml`     |
| Sprint Log  | `intel/TOTEM_SPRINTS.ti` |

**Note:** MRPP protocol sprints are in `sprints/` (SPRINTS.pi, S03.ptl, S04.ptl, .pd tasks). Role briefs remain in `intel/sprints/S03/`, `intel/sprints/S04/`.

---

## Guardians Selection

Universal Process: `ROOT`, `PM`, `TEAM_LEAD`, `QA`, `DEVOPS`, `ARCHITECT`

Stack Adapters:

- `FRONTEND_DEV` (`stacks/vue3-vite-tailwind/FRONTEND_DEV.ti`)
- `BACKEND_DEV` (`stacks/node-express/BACKEND_DEV.ti`)
