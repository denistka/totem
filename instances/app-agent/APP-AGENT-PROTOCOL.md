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

## §0.0 Working principle — quality over pace (binding, all roles)

**Мы делаем хорошо и качественно — не гоним лошадей.** Set by Denis, 2026-08-20. This governs every
section below; where speed and correctness conflict, correctness wins, and the schedule moves.

Operationally, for every role:

- **Verify before claiming.** A statement of fact must be backed by something checked this session —
  a file read, a command run, a query. "Should be" is not evidence. The agent's own confidence is
  not evidence. An external agent's report is a claim, not a result.
- **Root-cause, don't patch around.** A defect gets traced to the line that causes it. A workaround
  that hides a cause is a future false "done".
- **Architecture before implementation.** Design, get it attacked, then build. A wrong foundation
  costs more than the round trip that would have caught it.
- **Fewer, correct changes beat many fast ones.** Volume is not progress, and neither is test count
  (Denis, 2026-08-20: *"забудь пока про тесты — важно иметь рабочий функционал а не покрытие"*).
  Runtime verification is the product — the gate, `build-verify`, `boot-verify`, the containment
  guard, the honest preflight; unit coverage is developer hygiene. The measure is whether the loop
  runs end to end, and whether the knowledge graph stayed intact (`bun run feature:health`).
- **Momentum never overrides the gate.** No urgency justifies simulating a human "Go" (index.ti
  axioms 1–4). The gate is the product, not an obstacle to it.
- **Context grows in quality, not like weeds.** Closing a sprint means consolidating what was learned
  into durable knowledge and removing what it supersedes — not appending another document. Ephemeral
  sprint artifacts are scaffolding; the slug graph is the building.

### Why this is binding, not aspiration — evidence from 2026-08-20

Every real defect that day was found by slowing down and checking, never by moving faster:

| Found | How | What rushing would have produced |
|---|---|---|
| Provider returning HTTP 402 (no credit) | direct probe of the provider | a demo recorded on regex output |
| All four LLM agents silently falling back to mock while `wc_agents.kind` said `llm` and preflight said `ok` | reading the `catch` blocks after the output looked wrong | a product that lies about doing AI work |
| Supabase project paused, not deleted | asking the provider instead of trusting NXDOMAIN | recreating a live project |
| A transient 404 during DB startup reported as "tables are missing" | cross-checking one tool against another | running `db-setup.sql` against live customer data |
| A build that "succeeded" writing zero files | the post-build self-check | a false "done" — the exact failure this chain exists to kill |

### Note on knowledge storage (2026-08-20)

Totem is **currently the only knowledge storage system** in use, which is why working principles are
recorded here. The intended destination is the platform's slug graph —
`core/docs/knowledge/{slug}.md` joined to code by `// SEE: feature "slug"` annotations and to runtime
by `defineFeature*()` (upstream ADR-009, ADR-006: *"ADR fate: historical artifacts... decomposed into
slug-based knowledge"*). Until work-control's own knowledge lands there, Totem holds this. When it
does, this principle moves with it and Totem keeps only what is genuinely Totem's: roles, gates,
sprint lifecycle.

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
| **Org handbook (Totem header)** | `docs/content/2.company/` | People + all agents | Governance / process (S07) |
| **Feature knowledge** | `core/docs/knowledge/{slug}.md` | AI (MCP `explain`) | Platform or app capability |
| **Per-app rules** | `apps/<app>/docs/*.md` | Devs + AI for that app | App-specific behavior |
| **Instance planning** | `apps/<app>/planning/sprints/` | PLANNER, PM, gates (S08+) | Accept write-back per epic |
| **Meta planning (archive)** | `totem/.../instances/app-agent/sprints/` | Cursor PLANNER | Sprint meta `.ptl` S01–S11 |

Key MCP slugs: `organization-planning`, `in-repo-planning`, `work-control`, `todo`.

Organization (`organization/`) = brand + `app.config.ts` — **not** auto-synced to handbook or knowledge.

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

When Accept epic writes `S<NN>-*.pd` via `planning-writer.ts` (S08+):

- **Default path:** `apps/{epic.targetApp}/planning/sprints/` (`targetApp` default `work-control`)
- **Legacy:** `WORK_CONTROL_TOTEM_PATH` → external totem archive
- Generated tasks inherit protocol + PD block from `planning-writer.ts` (S06-T03 pattern)
- Always `gate: LOCKED` until human opens gate

Meta sprint plans (S07–S11 `.ptl` in external totem) are PLANNER artifacts — not Accept targets after S08.

---

## Related

- `INSTANCE.ti` — instance hub; role bindings; mandatory load gate
- `BRIEF.md` — product context
- `intel/MCP-PREFLIGHT.ti` — machine preflight rules
- `templates/PD-APP-AGENT-BLOCK.md` — paste into new `.pd` files
- `templates/PTL-PROTOCOL-HEADER.md` — required `.ptl` YAML fields
- `AGENTS.md` (in repo) — authoritative code conventions
