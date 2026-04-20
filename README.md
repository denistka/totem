# THAIT (Totem for Human AI Tandem)

The brain of your AI-driven team. Centralized, tech-agnostic, and project-aware.

> [!WARNING]
> **Not a traditional application:** Totem is not an application that you start with `npm start` or run as a server. There is no CLI. It is a shared protocol repository and knowledge graph used by AI coders (Human–AI tandem) via prompt injection.

---

## ⚠️ Important Observations / Realities

Before you dive in, please note the following about this repository:

1. **Zero-Runtime Environment**: This is not a Node application. There is no `package.json` with an `npm start` script, and no CLI. It relies entirely on being integrated into your AI agent's prompt process.
2. **Template Extensions**: When bootstrapping instances, use the regular Markdown template (`templates/PROJECT_README.template.md`), avoiding `.ti` extensions for purely structural readmes.
3. **Instance Diversity**: The `/instances` folder acts as a living portfolio. Projects inside vary widely in quality and scope—some are minimal drafts or experimental configurations, whereas others (like `totem-view`) are massive, active production applications.

---

## 🐒 How to use it, Monkeys! (Quick Start)

Deploying a new project takes 3 steps across 3 repositories:

### 1. Setup the Filesystem

You should have 2-3 folders (repos) side-by-side. The execution history (`prompt-machine`) can be standalone or stored within the project instance for better portability:

```bash
/Projects/
  ├── totem/          # (This Repo) Intelligence, Guardians, Core Protocol
  │     └── instances/your-project/sprints/  # (Integrated History)
  ├── project-code/   # The Source Code (React, Django, etc.)
```

## 👶 Onboarding: Joining a Running Project

If the project already has history and generated sprints, follow these steps to sync context:

1.  **Repo Initialization**: Clone `totem` and the `code` repo.
2.  **Context Sync**: Point the AI to `totem/instances/{your-project}/README.md`.
3.  **Ground Truth**: Run the build/dev command (e.g., `npm run build`) to verify current state.
4.  **History Check**: Review the latest `.ptl` (Sprint) and `.pd` (Task) files in the configured history path.
5.  **Role Alignment**: Load the appropriate Guardian from `totem/guardians/` (see [How to call Totem](#how-to-call-totem)).

### 2. Register the Instance (The "Class vs Instance")

**Difference between /stacks, /templates and /instances:**

- **`/stacks`**: **RUNTIME PATTERNS**. Tech-specific adapters (React, Vue, Rust). These provide the "how-to" rules for the AI during implementation.
- **`/templates`**: **SCAFFOLDING/BLUEPRINTS**. The empty forms for project configuration. You don't write here. (Like an empty Excel file).
- **`/instances`**: **THE REAL DATA**. You copy a template here and fill it with your project's soul.

**Execution:**

1.  Go to `totem/instances/` and create folder `your-project-name`.
2.  Copy `totem/templates/PROJECT_README.template.md` → `totem/instances/your-project-name/README.md`.
3.  Fill the `README.md` and `project.config.yml` with your stack and goals.
4.  Select appropriate stack adapters from `/stacks` (e.g., `vue3-ts-tauri2`).

### 3. Start the Machine

1.  Tell the AI: _"Read totem/instances/your-project-name/README.md and start S01 in prompt-machine/"_.
2.  The AI will pull **Intel** from `totem`, write **History** to `prompt-machine`, and commit **Code** to `project-code`.

---

## How to call Totem

Totem has **no CLI**. You “call” it by instructing the AI (or using editor references) so the right files are in context.

### Load order (recommended)

1. **Master index** — `totem/index.ti`  
   Establishes protocol axioms, includes core schema and `ROOT` orchestration. In Cursor you can use `@totem/index.ti` in the chat input to attach it.

2. **Project instance** — `totem/instances/<your-project>/`  
   Point the model at `README.md` and **`project.config.yml`** there. That file defines `paths.code`, default **guardians**, and **stack adapters** (e.g. `FRONTEND_DEV`). Example: `navitrack` → `totem/instances/navitrack/`.

3. **Role / guardian** — `totem/guardians/<NAME>.ti` (or a core module under `totem/core/` when applicable).  
   Replace `<your-project>` and paths in prompts with your real instance folder and file locations.

### Critical protocol gates (read `index.ti`)

- **Planning vs execution**: The planner role is not supposed to execute implementation; generated `.ptl` / `.pd` often ship with `gate: LOCKED` until you change it.
- **User approval for execution**: Treat execution as **blocked** until your **latest** message contains an explicit **`LGTM`** or **`Go`** (per `index.ti`). Do not assume approval.
- **Tasks with `gate: LOCKED`**: Unexecutable until the human opens the gate in the file.

### `project.config.yml` (per instance)

- **`guardians.default`**: Roles loaded for general project work (e.g. `ROOT`, `PM`, `QA`, `DEVOPS`, `ARCHITECT`). Instances may add **`CODEMAP_QUALITY_ADVISOR`** for codemap-driven structural verdicts and refactor roadmaps (see NaviTrack `project.config.yml`).
- **`guardians.stack_adapters`**: Tech-specific stacks from `totem/stacks/`; individual `.pd` tasks list what they need via `requires: [FRONTEND_DEV, …]`.

### Guardian files (universal roles)

| Prompt name   | File |
|---------------|------|
| `ROOT`        | `guardians/ROOT.ti` |
| `PM`          | `guardians/PM.ti` |
| `PLANNER`     | `guardians/PLANNER.ti` |
| `ARCHITECT`   | `guardians/ARCHITECT.ti` |
| `QA`          | `guardians/QA.ti` |
| `CODEMAP_QUALITY_ADVISOR` | `guardians/CODEMAP_QUALITY_ADVISOR.ti` |
| `DEVOPS`      | `guardians/DEVOPS.ti` |

Other protocol modules live under `totem/core/` (e.g. `OPTIMIZER.ti`).

#### `CODEMAP_QUALITY_ADVISOR` (codemap verdict + optional refactor roadmap)

**Codemap-first advisor** for generated JSON under the client package (e.g. `navitrack-apps/src-client/codemap/`, see `AGENT-GUIDE.md` there). Produces a short structural quality verdict and **3–7 ordered refactor steps** unless the prompt asks for **report only** (then verdict without roadmap). Grounded in surface/path/import metrics; **no** training datasets or scoring grids as formal deliverables.

### Where `.ptl` / `.pd` sprints live

Sprints and tasks can live **inside the instance** (e.g. `totem/instances/navitrack/sprints/<n>/`) or in a separate **history** repo pointed to by `paths.history` in `project.config.yml`. Check the instance config before assuming `prompt-machine/` paths.

---

## 💡 Example prompts (JIT context flow)

Use **Just-In-Time (JIT) context**: load index → instance → one role → concrete goal. Swap `navitrack` and paths for your instance.

**1. Sprint planning (`PLANNER`)**

```text
Read totem/index.ti, load instance navitrack, load PLANNER, and plan a sprint for: [feature description].
```

The agent should read `project.config.yml`, emit `.ptl` / `.pd`, and set `requires:` on tasks. Expect `gate: LOCKED` until you open it.

**2. Task execution (`PM` or role named in the task)**

```text
Read totem/index.ti, load instance navitrack, load PM. LGTM — execute <paths.history>/sprints/46/S46-T1-ServerAuth.pd
```

(`paths.history` is in `totem/instances/<project>/project.config.yml`—often a `prompt-machine` repo or a folder under the instance.) Include **`LGTM`** or **`Go`** in the same message when you want implementation to proceed. The agent should load only the stacks listed in that `.pd`’s `requires:`.

**3. Codemap quality + refactor roadmap (`CODEMAP_QUALITY_ADVISOR`)**

```text
Read totem/index.ti, load instance navitrack, load CODEMAP_QUALITY_ADVISOR. Using codemap JSON under [path from paths.code to your codemap folder], produce a structural quality verdict and ordered refactor steps (or report-only if asked).
```

**4. Cleanup and knowledge extraction (`OPTIMIZER`)**

```text
Read totem/index.ti, load instance navitrack, read totem/core/OPTIMIZER.ti and optimize totem (extract lessons from the last 20 sprints).
```

Audits recent work and may update global stacks and digests; path to `OPTIMIZER.ti` is `totem/core/OPTIMIZER.ti`.

---

## 📁 Repository Map

### 🏺 Totem (Central Repo)

_The shared intelligence across ALL your projects._

- **`/core`**: Protocol rules (MRPP 3.0), iteration flow, design sprint guide, invariant management. How the agents talk and protect prior decisions.
- **`/guardians`**: Universal roles (ROOT, PM, PLANNER, ARCHITECT, QA, CODEMAP_QUALITY_ADVISOR, DEVOPS). How the agents think—planning, architecture, quality, codemap verdict + refactor roadmap (ADVISOR, optional per instance), DevOps. Stack-specific behavior is layered from `/stacks` via `requires:` on tasks.
- **`/stacks`**: Tech-specific adapters (React+TS, Vue+Tauri, Rust+WGPU). What the agents know about specific technologies. These extend universal guardians with stack-specific rules.
- **`/templates`**: Blueprints for new projects.
- **`/instances`**: **Registry of active projects.** (One folder per project).
  - _Note: Projects in this folder range from minimal draft configs to large, active production apps._
- **`STACK_INDEX.ti`**: Global registry of all available Totem stacks and templates.
- **`KNOWLEDGE_SOURCES.ti`**: Global index of the external sources of truth (conferences, deep-dive docs) that power the stacks.

### 🤖 Prompt-Machine (Project-Specific)

_The immutable history of work._

- **`/sprints`**: Where `.ptl` (Sprint) and `.pd` (Task) files live.
- **`/reports`**: Verification results and QA checks (`.pqa`).
- **`/analysis`**: Architectural decisions (`.pa`) and PM planning (`.ppm`).

### 💻 Project Code (Project-Specific)

_The binary output._

- `src/`, `tests/`, `dist/`, etc.

### NaviTrack (example instance)

Path: **`totem/instances/navitrack/`**.

- **Config**: `project.config.yml` — `paths.code` → `navitrack-apps`, `intel` → `./intel`.
- **Sprints (in-repo)**: `sprints/84/` (constrained FSD / architectural repair).
- **Intel**: `intel/*.md`, `*.json`, `TOTEM_SPRINTS.ti` (machine-oriented sprint index for this instance).
- **Codemap** (generated): under `navitrack-apps/src-client/codemap/` — see `AGENT-GUIDE.md` there for levels and `pnpm codemap`.

---

**Philosophy:** See [docs/HUMAN_AI_TANDEM_PHILOSOPHY.md](docs/HUMAN_AI_TANDEM_PHILOSOPHY.md) for the Human–AI tandem principles and "new way" tenets.

## 🚀 Why this way?

1.  **Shared Knowledge**: Improvements to `guardians/ARCHITECT.ti`, `CODEMAP_QUALITY_ADVISOR.ti`, and other universal guardians in Project A automatically benefit Project B.
2.  **Clean History**: Code repo stays for code. `prompt-machine` stores the AI's "thought process".
3.  **Global Search**: Since `totem/instances` stores all project metadata, you can grep one folder to see your entire portfolio.

---

**Protocol**: MRPP v6.0 (SYSTEMATIC-EXCELLENCE)  
**Repo**: [denistka/totem](https://github.com/denistka/totem)

_Accumulate power, one project at a time._
