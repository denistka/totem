# MRPP - Multi-Role Prompt Protocol (Universal Schema)

**Version**: 3.0  
**Purpose**: Machine-optimized prompt format; universal schema rules.  
**Active Roles (Process)**: ROOT, TEAM_LEAD, ARCHITECT, QA, PM, DEVOPS.  
**Hierarchy**: Universal Protocol → Stack Adapters → Project Instance.

---

## File Extensions (Role-Linked)

| Extension | Role          | Scope   | Focus                                     |
| --------- | ------------- | ------- | ----------------------------------------- |
| `.pi`     | **ROOT**      | Project | Index, hub, and cross-role navigation.    |
| `.ptl`    | **TEAM_LEAD** | Sprint  | Sprint orchestration and dispatch.        |
| `.pd`     | **DEVELOPER** | Task    | Task execution and implementation logic.  |
| `.pa`     | **ARCHITECT** | Project | Decisions, patterns, and design gates.    |
| `.ppm`    | **PM**        | Both    | Schedule, risks, and business analysis.   |
| `.pqa`    | **QA**        | Both    | Testing, verification, and quality gates. |
| `.pdo`    | **DEVOPS**    | Both    | Build, deploy, and infrastructure.        |
| `.ti`     | **TOTEM**     | Tech    | Machine-only internal context.            |
| `.po`     | _GENERAL_     | Legacy  | General objectives or legacy v1 support.  |

---

## S\*.po (Team Lead) — Structure Rules

```yaml
v:1
c:$$ m:sn4t
mode:agent test:y
role:lead
x:team-lead
stack:[abstract,layer,names]
sprint:S*-Name
objective:one-line goal

phase-*: name
  tasks:[T*-task]
  dur:time-estimate
  verify:[checks]
  gate:pass-condition

dispatch:
  T*-task:
    po:S*-T*-task.po
    model:tier
    critical:y|n
    exec-order:int
    dep-wait:ref
    output:[files]
    verify:[commands]
```

---

## S*-T*.po (Developer/Task) — Structure Rules

```yaml
v:1
c:$|$$|$$$ m:alias
mode:agent|ask|review|plan
x:expertise-key
stack:[lib1,lib2]
task:summary
spec: key:value
out: [paths]
cmd: [shell]
done: [criteria]
math-model: path | N/A
verify: [checks]
```

---

## Role Definitions (Universal)

1. **ROOT**: Project Orchestrator. Owns knowledge hub and documentation.
2. **TEAM_LEAD**: Sprint Orchestrator. Owns task dispatch and commit gates.
3. **ARCHITECT**: System Design. Owns architecture patterns and quality principles.
4. **PM**: Planning & Risk. Owns schedule, dependencies, and business analysis.
5. **QA**: Verification. Owns testing strategy and quality gates.
6. **DEVOPS**: Release. Owns CI/CD, build, and deployment concepts.

---

## Extension Mechanism

Projects MUST combine **Universal Roles** with **Stack Adapters**:

- `ARCHITECT` (Universal) + `FRONTEND_DEV` (Stack)
- `DEVOPS` (Universal) + `BUILD` (Stack)
- `QA` (Universal) + `VERIFY_SCRIPTS` (Stack)
