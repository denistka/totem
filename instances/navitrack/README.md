# NaviTrack — Project Overview

**Stack**: Tauri 2 + Vue 3 + TypeScript + Rust  
**Source**: [GitHub Repo](https://github.com/denistka/navitrack)

---

## Architecture

| Layer          | Directory                       | Responsibility             |
| -------------- | ------------------------------- | -------------------------- |
| App Shell      | `navitrack-app/`                | Core Vue 3 PWA application |
| Graphics       | `wgpu/`                         | WebGPU/WASM components     |
| UI Components  | `navitrack-app/src/components/` | Reusable Nt components     |
| Business Logic | `navitrack-app/src/stores/`     | Pinia stores and state     |

---

## Epics

- **Epic 0 (E-00)**: Done — all completed work. See `intel/TOTEM_EPICS.ti`.
- **Epic 1 (E-01-TO-DO)**: To-Do — refactoring (S34–S37), optional (S20, S21), release (S27), backlog (S38–S40). See `intel/TOTEM_EPICS.ti`, `intel/TOTEM_SPRINTS.ti`.

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
