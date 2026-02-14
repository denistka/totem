# Tour Search App — Project Overview

**Stack**: React 18+, TypeScript 5, Vite, Vanilla CSS  
**Source**: `incoming/hr-letter.md`, `incoming/tech-task.md`, `incoming/api/`

---

## Architecture

| Layer   | Directory         | Responsibility                            |
| ------- | ----------------- | ----------------------------------------- |
| UI      | `src/components/` | Presentational, < 100 lines, no API calls |
| Logic   | `src/hooks/`      | State, side effects, orchestration        |
| Network | `src/services/`   | API wrappers, pure async, no React        |
| Types   | `src/types/`      | Shared interfaces                         |
| Utils   | `src/utils/`      | Pure helpers, formatters                  |
| API     | `src/api/`        | Mock API                                  |

---

## Sprints

### S00 — Project Setup (3 pts)

- T1-init-project: Scaffold project (G0)

### S01 — Tour Search (13 pts)

- T1-search-form: Geo-autocomplete (G1)
- T2-price-engine: Async polling (G2)
- T3-result-cards: Hotel cards (G3)
- T4-cancel-search: Race protection (G4)

---

## Key Docs

| Doc           | Location                                             |
| ------------- | ---------------------------------------------------- |
| Core Protocol | `totem/core/`                                        |
| Config        | `totem/instances/tour-search-app/project.config.yml` |
| Commit Gates  | `sprints/COMMIT_GATES.md`                            |
| Role Dispatch | `sprints/ROLE_DISPATCH.md`                           |

---

## Guardians Selection

**Universal**: ROOT, PM, TEAM_LEAD, QA, DEVOPS, ARCHITECT  
**Stack Adapters**: `stacks/react-ts/FRONTEND_DEV`, `stacks/react-ts/UI_UX`, `stacks/react-ts/BUILD`
