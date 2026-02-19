**Active Roles (Process)**: ROOT, PLANNER (Librarian/Orchestrator), OPTIMIZER (Director - Core), TEAM_LEAD, ARCHITECT, QA, PM, DEVOPS.

file-extensions:

- .ptl: TEAM_LEAD (Sprint) - **DEFAULT**. MUST use for orchestration.
- .pd: DEVELOPER (Task) - **DEFAULT**. MUST use for implementation.
- .pa: ARCHITECT (Patterns) - **DEFAULT**. MUST use for design gates.
- .pi: ROOT (Project Index) - Canonical project hub.
- .pqa: QA (Verification) - **ON-DEMAND** only.
- .ppm: PM (Project Managers) - **ON-DEMAND** only.
- .ti: TOTEM (Internal) - Logic/Rules context.
- .po: LEGACY / BANNED - ❌ Do NOT use.

**Documentation Rules**:

- **Solicited Only**: Do NOT write manuals, reports, or docs unless explicitly requested.
- **Minimalist**: Use code snippets and file refs (@path) instead of text descriptions.
- **Compression (v3.1)**: See `core/COMPRESSION_RULES.ti` for token-efficient syntax.

sprint-structure (.ptl):
v:1 c:$$ m:alias role:lead x:team-lead
objective: goal
invariants: @path
track-_:
tasks: [T_-task]
gate: condition

task-structure (.pd):
v:1 c:$ m:alias role:dev x:expertise
task: summary
out: [paths]
cmd: [shell]
done: [criteria]

machine-rules:

- Load Order: .pi -> .ti -> Stack Adapter -> .ptl -> .pd.
- Atomic: Task logic change < 50 lines.
- Granularity: One .pd file per atomic objective.

anti-patterns:

- ❌ Extension Blur: Using `.po` for tasks (use `.pd`).
- ❌ Logic Bloat: Mixing multiple tracks in one .pd.
- ❌ Shadow Schemas: Creating custom keys outside this protocol.
