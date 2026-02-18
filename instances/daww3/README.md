# DAWW3 — Project Overview

**Stack**: Vue 3 + TypeScript + Turbo Monorepo + Web3 Monetization  
**Source**: [Local DAWW3 Dir](../../daww3)

---

## Architecture

| Layer           | Directory    | Responsibility                 |
| --------------- | ------------ | ------------------------------ |
| Mono Management | `/`          | Turbo, pnpm workspace          |
| Apps            | `packages/`  | Web UI (@daww3/web), etc.      |
| Contracts       | `contracts/` | Smart contracts and Web3 logic |
| E2E             | `e2e/`       | Integration and E2E tests      |

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
- `WEB3` (`stacks/web3/WEB3.ti`)
