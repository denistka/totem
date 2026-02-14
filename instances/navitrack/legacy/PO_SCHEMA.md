# MRPP - Multi-Role Prompt Protocol (Conversion Rules)

**Version**: 3.0  
**Purpose**: Machine-optimized prompt format; conversion rules only.  
**Active Roles (v3.0)**: ROOT, TEAM_LEAD, CTO, QA, PM, DEVOPS (6 consolidated from 11).  
**New in v3.0**: Iteration flow, context control, role consolidation.

---

## File Types (5 Roles + 1 Index + .ti)

| Pattern | Role | Scope | Focus |
|---------|------|-------|--------|
| `PROTOCOL_INDEX.pi` | Protocol Index | Project | Entry point, navigation |
| `S01.po` | Team Lead | Sprint | Orchestration, execution |
| `S01-T*.po` | Developer | Task | Code execution, tests |
| `.ppm` | PM | Both | Schedule, deps, risks |
| `.pqa` | QA | Both | Tests, acceptance, verification |
| `.pcto` | CTO | Both | Architecture, decisions |
| `*.ti` (v2.0) | Totem | Project | Machine-only totem context |

**File structure**: Root → `PROTOCOL_INDEX.pi`; Sprint → `S01.po`, `S01.ppm`, `S01.pqa`, `S01.pcto`; Task → `S01-T1-init.po`, `.ppm`, `.pqa`, `.pcto`. Totem (v2.0) → `prompt-machine/totem/TOTEM_INDEX.ti` + content `.ti`.

---

## S01.po (Team Lead) — Structure Rules

```yaml
v:1
c:$$ m:sn4t
mode:agent test:y
role:lead
x:team-lead
stack:[tech,stack]
sprint:S01-Name
objective:one-line goal
pts:18 dur:1w team:1-2dev

phase-1:name
  tasks:[T1-task]
  dur:4h blocker:y
  verify:[check1,check2]
  gate:must-pass-before-phase-2

phase-2:name
  tasks:[T2-task]
  dep:phase-1

dispatch:
  T1-task:
    po:S01-T1-task.po
    model:expensive|average|inexpensive
    critical:y|n
    exec-order:1
    timeout:4h
    dep-wait:none|T0.verify.pass
    output:[files]
    verify:[cmd1,cmd2]
    recovery:if-fail→action

checkpoint-*: desc, test, fail-action
ext-deps: []
blockers: []
fallback: scenario
qa-gates: per-task, per-sprint
schedule: d1-am, ...
done: []
handoff: artifacts, ready-for, known-issues
cmd-ref: action:command
```

---

## S01-T*.po (Developer/Task) — Structure Rules

```yaml
v:1
c:$|$$|$$$ m:alias
mode:agent|ask|review|plan
test:y|n
x:expertise-key
stack:[lib1,lib2]
task:one-line summary
spec: key:value
out: [path/to/file]
cmd: [shell commands]
done: [criterion1,criterion2]
math-model: path/to/math-model-artifact | N/A   # owner: strong math model per step (S25)
flags: [flag1,flag2]
verify: [checks]
```

**Math model (owner, S25):** Each task that has measurable behavior or state should deliver a math-model artifact (path to doc following `prompt-machine/totem/MATH_MODEL_TEMPLATE.md`) or set `math-model: N/A` with short rationale. Template: `prompt-machine/totem/MATH_MODEL_TEMPLATE.md`. Pilot: `prompt-machine/totem/MATH_WEBGL_FLOWER.md`.

**Cost tier (`c:`)**: `$` Budget | `$$` Moderate | `$$$` Premium.  
**Model (`m:`)**: `op4t` Opus 4.5 thinking | `sn4` Sonnet 4.5 | `gx5f` GPT Codex Fast | `auto` Agent chooses.  
**Mode**: `agent` | `ask` | `review` | `plan`.  
**Expertise (`x:`)**: e.g. `tauri-rust`, `architect`, `ui-css`, `api`, `team-lead`.  
**Flags**: e.g. `dry`, `solid`, `docs`, `typed`, `responsive`.

---

## .ppm (PM) — Structure Rules

```yaml
v:1
role:pm
task:T1-init   # or sprint:S01
ref:S01-T1-init.po
meta: pts, est, priority, model, owner
deps: in:[], out:[], blocks:[]
schedule: start, end, buffer
resources: []
risks: []
checkpoints: {}
escalation: if-blocked, if-delayed
handoff: to, artifacts
parallel-with: []
```

---

## .pqa (QA) — Structure Rules

```yaml
v:1
role:qa
task:T1-init
ref:S01-T1-init.po
verify: category: [checks]
test: auto: unit,e2e; manual: []
pass-criteria: []
fail-actions: []
report: path
```

---

## .pcto (CTO) — Structure Rules

```yaml
v:1
role:cto
task:T1-init   # or sprint:S01
ref:S01-T1-init.po
decision: main-decision
rationale: []
model: expensive|average|inexpensive
why: string
config-requirements: {}
anti-patterns: []
review-checklist: []
tech-debt: avoid: []
next: []
```

---

## Syntax Rules

- **Arrays**: `stack:[a,b,c]`  **Key-value**: `key:value` or `nested.key:value`
- **Flow**: `order:[T1→T2→T3]`  `basic→jwt`  **References**: `ref:S01-T1-init.po`  `@file`
- **Conditional**: `if-blocked:action`  `if-delayed:action`

---

## Compression Rules

**Abbreviations**: `y`/`n` (not true/false), `ts`, `pts`, `est`, `dep`, `ctx`, `ref`, `d1-am`.  
**Omissions**: No markdown, no prose, no inline example code (use refs), no repeated context.  
**Symbols**: `:` key-value | `,` list | `[]` arrays | `→` flow | `+` combination | `@` file ref | `$` cost | `|` alternative | `#` comment.  
**Do**: Abbreviate when unambiguous; use symbols for flow; compress arrays.  
**Don't**: Over-abbreviate; drop deps/verify; use undocumented symbols; make unreadable.

---

## Cross-Reference

Same base name per task: `S01-T1-init.po`, `S01-T1-init.ppm`, `S01-T1-init.pqa`, `S01-T1-init.pcto`. Link from .ppm/.pqa/.pcto: `ref:S01-T1-init.po`.

---

## PROTOCOL_INDEX.pi — Structure Rules

```yaml
v:1.1
protocol:MRPP
created: date
updated: date
status: validated

name: Multi-Role Prompt Protocol
version: 1.1
purpose: machine-optimized prompts
compression: 70-90% token reduction

roles:
  team-lead: pattern, scope, focus, example
  developer: pattern, scope, focus, example

sprints:
  S01: name, status, path, lead, tasks, points, epic

stats: total-sprints, complete, total-files, total-points, progress
epics: E-01: name, sprints, status, points
docs: schema, readme, guardians
nav: current-sprint, next-sprint, critical-path
```

---

## MRPP 2.0 — Totem Machine-Only (.ti)

**Purpose**: Compressed totem context for prompt-machine; reading-only.  
**Human hub**: `totem/README.md`, `totem/PO_SCHEMA.md`, `totem/TOTEM_MODEL.md`.  
**Location**: `prompt-machine/totem/`.  
**Rules**: Same syntax/compression as v1.1; no prose; paths/keys only.

**File type**: `TOTEM_INDEX.ti` = entry point; content = project, docs refs, sprints refs, guardians refs, `content:` map to other `.ti` files.

**Structure (.ti)**: `v:2`, `format:totem-index`, `purpose:machine-only reading`, `human-hub:[...]`. Sections: `project:` (name, app, stack, scope, status, next), `docs:` (totem-existing, content, removed), `sprints:` (mrpp-root, content, reports-content, removed), `guardians:` (index, rules-dir, removed), `prompt-machine:` (root, readme, totem-index, flow-example), `content:` (paths to TOTEM_*.ti), `machine-only:` (spec, human-hub, load-order, full-totem list).

**Content files (load after index)**: TOTEM_PROJECT, TOTEM_EPICS, TOTEM_SPRINTS, TOTEM_STORE, TOTEM_GUARDIANS_CONTEXT, TOTEM_BACKLOG, TOTEM_DECISIONS, TOTEM_BREAKING_FIXES, TOTEM_CONTACTS, TOTEM_HEALTH, TOTEM_NEXT_STEPS, TOTEM_TESTING, TOTEM_DOCS, TOTEM_REPORTS, TOTEM_GETTING_STARTED.

**Load order**: `TOTEM_INDEX.ti` → then any `content:` file as needed.

---

## MRPP 3.0 — Iteration Flow

**Purpose**: Define structured phases for each iteration with optimal role assignments.  
**Location**: `prompt-machine/totem/ITERATION_FLOW.ti`

| Phase | Roles | Duration | Gate |
|-------|-------|----------|------|
| **1-PLAN** | PM | 0.5d | scope-approved |
| **2-DESIGN** | CTO | 0.5d | design-reviewed |
| **3-DEVELOP** | TEAM_LEAD, DEV | 2-5d | build-passes |
| **4-VERIFY** | QA, DEVOPS | 0.5-1d | tests-pass |
| **5-CLOSE** | PM, ROOT | 0.5d | iteration-complete |

**Flow rules**: Sequential phases; parallel tasks within DEVELOP; rollback if gate fails.

---

## MRPP 3.0 — Context Control

**Purpose**: Prevent context bloat; keep only relevant files loaded.  
**Location**: `prompt-machine/totem/TOTEM_INDEX.ti` (context-control section)

```yaml
context-control:
  max-active: 8              # Max .ti files in memory
  ttl-days: 14               # Stale after 14 days
  always-load: [TOTEM_INDEX, TOTEM_PROJECT, ITERATION_FLOW]
  load-on-demand: [tech-specific, archived]
  pruning: archive-completed-after-7d
```

---

## MRPP 3.0 — Role Consolidation

**11 roles → 6 active**:

| Active Role | Merged From | Focus |
|-------------|-------------|-------|
| **ROOT** | +DOCMAN, +POSTMAN | Orchestration, docs, intake |
| **CTO** | +VISIONARY, +UI_UX | Architecture, design, protocol |
| **PM** | +BA_OWNER | Planning, business analysis |
| **TEAM_LEAD** | — | Task dispatch, execution |
| **QA** | — | Testing, verification |
| **DEVOPS** | — | CI/CD, infrastructure |

Deprecated files in `prompt-machine/guardians/`: VISIONARY.ti, UI_UX.ti, BA_OWNER.ti, DOCMAN.ti, POSTMAN.ti (marked with `status:DEPRECATED-v3.0`).

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v3.0 | 2026-02-XX | Iteration flow, context control, role consolidation (11→6) |
| v2.0 | 2026-02-01 | Totem machine-only (`.ti`), prompt-machine/totem/, human hub 3 files |
| v1.1 | 2026-01-28 | Team Lead role, Protocol Index (`.pi`) |
| v1.0 | 2026-01-28 | Initial (4 roles: Developer, PM, QA, CTO) |

---

*Conversion rules only. Examples, validation, troubleshooting, and file locations are omitted; see git history or TOTEM_MODEL.md for structure.*
