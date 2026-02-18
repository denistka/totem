# TapMap — Project Overview

**Stack**: React 18 + TypeScript + Supabase + Tailwind CSS  
**Source**: [Local TapMap Dir](../../TapMap)

---

## Architecture

| Layer    | Directory   | Responsibility                 |
| -------- | ----------- | ------------------------------ |
| UI Layer | `client/`   | React PWA (Vite + Tailwind)    |
| Backend  | `supabase/` | Database, Auth, Edge Functions |
| Scripts  | `scripts/`  | Sync and maintenance scripts   |

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

- `FRONTEND_DEV` (`stacks/react-ts/APP_UI_KIT.ti`)
- `SUPABASE` (`stacks/supabase/SUPABASE.ti`)
