# MRPP - Multi-Role Prompt Protocol (Universal Schema)

**Version**: 3.0  
**Purpose**: Machine-optimized prompt format; universal schema rules.  
**Active Roles (Process)**: ROOT, TEAM_LEAD, ARCHITECT, QA, PM, DEVOPS.  
**Hierarchy**: Universal Protocol → Stack Adapters → Project Instance.

---

## File Types (.v3)

| Pattern             | Role           | Scope   | Focus                           |
| ------------------- | -------------- | ------- | ------------------------------- |
| `PROTOCOL_INDEX.pi` | Protocol Index | Project | Entry point, navigation         |
| `S*.po`             | Team Lead      | Sprint  | Orchestration, execution        |
| `S*-T*.po`          | Developer      | Task    | Code execution, tests           |
| `.ppm`              | PM             | Both    | Schedule, deps, risks           |
| `.pqa`              | QA             | Both    | Tests, acceptance, verification |
| `.pcto`             | Architect      | Both    | Architecture, decisions         |
| `*.ti`              | Totem          | Project | Machine-only totem context      |

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
