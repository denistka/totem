# App Agent × Totem — Instance Protocol

**Instance:** `totem-v6/instances/app-agent`  
**Workspace:** `app-agent-io/core` (`paths.code`)  
**Status:** Active from S05 close — applies to **all** future sprints until superseded.

> **Authority:** This file is **mandatory for every role** in this instance (ROOT, PLANNER, PM,
> ARCHITECT, QA, DEVOPS, OPTIMIZER, and any executing agent). Loaded via `INSTANCE.ti` +
> `project.config.yml`. No guardian or agent may plan, execute, review, or close work without it.

> The codebase is smarter than the model. Totem plans *what*; app-agent conventions govern *how*.
> This file is the binding contract between them.

---

## 0. Role matrix (all roles → this file)

| Role | Must read protocol | Primary sections |
|------|-------------------|------------------|
| **ROOT** | Before intake & sprint lifecycle | §1, §3, §7 |
| **PLANNER** | Before every `.ptl`/`.pd` | §1, §4, `templates/PTL-PROTOCOL-HEADER.md` |
| **PM** | Before executing any `.pd` | §2, §5, §7 |
| **ARCHITECT** | Before design gates / `.pa` | §3, §5 |
| **QA** | Before sprint close / smoke | §2, §7 |
| **DEVOPS** | Before dev/CI changes | §2, `intel/LOCAL-DEV-RUNBOOK.md` |
| **OPTIMIZER** | Before knowledge cleanup | §4 close, MCP `census`/`record` |
| **Any agent** (Cursor, control, work-control) | Session start | §1, §2, §6 |

---

## 1. Load ritual (every session)

```text
1. totem/totem-v6/index.ti
2. instances/app-agent/project.config.yml
3. instances/app-agent/INSTANCE.ti
4. instances/app-agent/APP-AGENT-PROTOCOL.md   ← this file
5. instances/app-agent/intel/TOTEM_INDEX.ti
6. instances/app-agent/BRIEF.md + active S*-INVARIANTS.md
7. MCP preflight (§2) — WARN if unavailable
```

**PLANNER** must set `protocol: ../APP-AGENT-PROTOCOL.md` in every new `.ptl` YAML header.
**Every `.pd`** must include the same `protocol:` field + sections from `templates/PD-APP-AGENT-BLOCK.md`.
**PM / Developer** must run §2–§5 before executing any `.pd` with code changes.

---

## 2. MCP preflight (MANDATORY — warn if down)

Before planning or coding, verify Docs MCP is reachable.

| Check | Command / action |
|-------|------------------|
| Docs HTTP | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → expect `200` |
| MCP endpoint | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/mcp` → any response ≠ connection refused (406 on GET is OK) |
| Cursor MCP | Settings → MCP → `app-agent.io` / `user-app-agent-docs` must be **green** |

**If MCP is unavailable — agent MUST:**

1. **Stop claiming** registry/census/list-apps/explain results from live MCP.
2. **Warn the user explicitly:**
   ```
   ⚠️ Docs MCP (:3000) not reachable. Feature knowledge and codebase tools degraded.
   Start: cd app-agent-io/core/docs && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev
   Fallback: read core/docs/knowledge/{slug}.md directly; do not guess architecture.
   ```
3. Continue only with **read fallback** (knowledge files, AGENTS.md, totem intel) — label answers as *static*, not *live*.
4. Do **not** close a task that required MCP without noting the gap in the sprint summary.

**Chrome DevTools MCP** (`chrome-devtools`) — optional; warn only if the task needs browser verification.

See also: `intel/MCP-PREFLIGHT.ti`, `intel/MCP_SETUP.md`.

---

## 3. Three documentation layers (do not conflate)

| Layer | Path | Audience | Update when |
|-------|------|----------|-------------|
| **Feature knowledge** | `core/docs/knowledge/{slug}.md` | AI (MCP `explain`, control `readKnowledge`) | New/changed platform or app feature slug |
| **Org / human docs** | `docs/content/` (DAWWWB handbook) | People on :3000 | Sprint close doc-sync task |
| **Per-app rules** | `apps/<app>/docs/*.md` | Devs + AI for that app only | App-specific behavior (see `work-control/docs/orchestrator.md`) |
| **Totem intel** | `totem/.../intel/`, `sprints/` | PLANNER, PM, gates | Each sprint |

Organization (`organization/`) = brand + `app.config.ts` + i18n — **not** auto-synced to docs or knowledge.

---

## 4. Planning contract (PLANNER → every `.pd` with code)

Every implementation `.pd` MUST include:

```yaml
requires: [mcp/MCP.ti, nuxt/NUXT.ti, ...]   # MCP adapter mandatory for code tasks
```

And these sections (copy from `templates/PD-APP-AGENT-BLOCK.md`):

**Preflight:** `explain("layer-cascade")`, `explain("<slug>")`, read `AGENTS.md` constraints.  
**Implementation:** `defineFeatureHandler`, `// SEE: feature "slug"`, code only in `apps/*` or `organization/`.  
**Close:** `bun run feature:health`, `bun run test`, MCP `census()` if new slug, `record()` if behavior changed.

PLANNER does **not** execute MCP — but must **require** PM/Developer to do so in `.pd` text.

---

## 5. Execution contract (PM / Developer)

| Phase | Action |
|-------|--------|
| **Gate** | Verify `gate: OPEN` on target `.pd` + human `Go`/`LGTM` in latest message |
| **Preflight** | §2 MCP check → `explain` relevant slugs → `list-apps` / `get-app-structure` if new surface |
| **Code** | Match layer cascade; never modify upstream `core/` except allowed knowledge slug |
| **Instrument** | `defineFeatureHandler("<slug>")` on new API routes; SEE on touched files |
| **Verify** | `bun run test`, `feature:health`, app-specific smoke |
| **Knowledge** | Update `knowledge/{slug}.md` or `apps/<app>/docs/`; org page in `docs/content/` if user-facing |
| **Commit** | `<task_id>: <description>` in `paths.code` repo only |

---

## 6. Which agent for which question

| Need | Tool |
|------|------|
| Architecture, code, slugs, apps | **Docs MCP** `:3000` (`explain`, `list-apps`, `get-file`, `census`) |
| Live registry, dev logs, config debug | **Control plane** `:3001` (Features, Logs, Settings UI; agent has read-only tools) |
| Work orchestration, Totem write-back | **work-control** `:3003` (not control plane) |
| Sprint planning, gates | **Totem** `sprints/*.ptl`, `.pd` |

Control agent **cannot** see work-control runtime or write Totem — do not ask it those questions.

---

## 7. Sprint close checklist (add to last `.pd` of each sprint)

- [ ] MCP was up for verify, or gap documented
- [ ] `feature:health` green for touched slugs
- [ ] Knowledge + per-app docs updated
- [ ] `docs/content/` org page if DAWWWB-facing change
- [ ] `intel/TOTEM_INDEX.ti` + `S*-SUMMARY.md` updated
- [ ] `APP-AGENT-PROTOCOL.md` still accurate (amend if process changed)

---

## 8. work-control generated `.pd` files

When Accept epic writes `S<NN>-*.pd` via `totem-writer`, generated tasks should inherit
§4 blocks (future: inject in `totem-writer.ts`). Until then, PM adds the block manually
when opening a generated gate.

---

## Related

- `INSTANCE.ti` — instance hub; role bindings; mandatory load gate
- `BRIEF.md` — product context
- `intel/MCP-PREFLIGHT.ti` — machine preflight rules
- `templates/PD-APP-AGENT-BLOCK.md` — paste into new `.pd` files
- `templates/PTL-PROTOCOL-HEADER.md` — required `.ptl` YAML fields
- `AGENTS.md` (in repo) — authoritative code conventions
