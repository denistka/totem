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

## Sprints

- **Epic E-22**: PWA Views & Styles Polish (S38–S42) — ✅ Completed
- **Epic E-21**: Login Page WGPU + Slint (S31) — ✅ Completed
- **Epic E-20**: Slang Templates & WGPU Animations (S30) — ✅ Completed

---

## Key Docs (Instance)

| Doc           | Location                |
| ------------- | ----------------------- |
| Protocol Core | `totem/core/`           |
| Totem Model   | `legacy/TOTEM_MODEL.md` |
| Intel Index   | `intel/TOTEM_INDEX.ti`  |
| Config        | `project.config.yml`    |

## Guardians Selection

Universal Process: `ROOT`, `PM`, `TEAM_LEAD`, `QA`, `DEVOPS`, `ARCHITECT`

Stack Adapters:

- `FRONTEND_DEV` (Vue 3, TypeScript)
- `RUST_DEV` (Tauri, WGPU)
