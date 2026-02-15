# NaviTrack — Project Overview

**Stack**: Tauri 2 + Vue 3 + TypeScript + Rust  
**Source**: [GitHub Repo](https://github.com/denistka/navitrack)

---

## Architecture

| Layer          | Directory                       | Responsibility             |
| -------------- | ------------------------------- | -------------------------- |
| App Shell      | `navitrack-apps/`               | Core Vue 3 PWA application |
| Graphics       | `wgpu/`                         | WebGPU/WASM components     |
| UI Components  | `navitrack-apps/src/components/`| Reusable Nt components     |
| Business Logic | `navitrack-apps/src/stores/`    | Pinia stores and state     |

---

## Epics

- **Epic 0 (E-00)**: Done — all completed work. See `intel/TOTEM_EPICS.ti`.
- **Epic 1 (E-01-TO-DO)**: To-Do — optional (S20, S21), backlog (S38–S40). S34–S37 and S27 done. See `intel/TOTEM_EPICS.ti`, `intel/TOTEM_SPRINTS.ti`.

---

## Key Docs (Instance)

| Doc           | Location                |
| ------------- | ----------------------- |
| Protocol Core | `totem/core/`           |
| Intel Index   | `intel/TOTEM_INDEX.ti`  |
| Config        | `project.config.yml`    |

## Guardians Selection

Universal Process: `ROOT`, `PM`, `TEAM_LEAD`, `QA`, `DEVOPS`, `ARCHITECT`

Stack Adapters:

- `FRONTEND_DEV` (Vue 3, TypeScript)
- `RUST_DEV` (Tauri, WGPU)
