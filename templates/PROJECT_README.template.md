# {{PROJECT_NAME}} — Project Overview

**Stack**: {{STACK_SUMMARY}}  
**Source**: {{SOURCE_DOCS}}

---

## Architecture

| Layer | Directory | Responsibility |
| ----- | --------- | -------------- |

{{ARCHITECTURE_LAYERS}}

---

## Sprints

{{SPRINTS_SUMMARY}}

---

## Key Docs (Instance)

| Doc           | Location             |
| ------------- | -------------------- |
| Protocol Core | `totem/core/`        |
| Totem Model   | `TOTEM_MODEL.md`     |
| Config        | `project.config.yml` |

{{PROJECT_SPECIFIC_DOCS}}

---

## Guardians Selection

Universal process: `ROOT`, `PM`, `QA`, `DEVOPS`, `ARCHITECT`. Add `CODEMAP_QUALITY_ADVISOR` to `guardians.default` or task `requires:` when you want codemap-driven structural verdicts and refactor roadmaps (see `guardians/CODEMAP_QUALITY_ADVISOR.ti`).

Stack Adapters (Categorized for JIT Loading):

- UI_Adapters: {{UI_STACK_ADAPTERS}}
- Server_Adapters: {{SERVER_STACK_ADAPTERS}}

_Note: When creating Sprints (.ptl) or Tasks (.pd), the Planner MUST use the `requires:` field to select only the necessary adapters from this list for the given objective._
