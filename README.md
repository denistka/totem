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
5.  **Role Alignment**: Load the appropriate Guardian from `totem/guardians/`.

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

## 💡 Example Prompts (V4 Context Flow)

The V4 protocol uses **Just-In-Time (JIT) Context Loading** to keep the agent's memory clean. You should always start by loading the master protocol, the specific project instance, and then the required role.

**1. Sprint Planning (PLANNER)**

```text
read totem/index.ti, load instance navitrack, load PLANNER and plan sprint for [feature description].
```

_(The agent will load the core protocols, read the project config, and generate `.ptl` and `.pd` files. It will explicitly assign specific tech stacks to each `.pd` task using the `requires:` field)._

**2. Task Execution (PM)**

```text
read totem/index.ti, load instance navitrack, load PM and execute sprints/46/S46-T1-ServerAuth.pd
```

_(The agent will load the task file, see exactly which tech stacks are required via the `requires:` field, and load **ONLY** those specific rules before writing code)._

**3. Cleanup & Knowledge Extraction (OPTIMIZER)**

```text
read totem/index.ti, load instance navitrack, load OPTIMIZER and optimize totem (extract lessons from last 20 sprints).
```

_(The agent will audit recent work, abstract new "world best practices" into the global `/stacks/`, create a dense historical digest, and securely delete intermediate logs to keep the instance clean)._

---

## 📁 Repository Map

### 🏺 Totem (Central Repo)

_The shared intelligence across ALL your projects._

- **`/core`**: Protocol rules (MRPP 3.0), iteration flow, design sprint guide, invariant management. How the agents talk and protect prior decisions.
- **`/guardians`**: Universal roles (PM, Architect, TL, QA, DevOps, Root). How the agents think. Includes: component size limits, dedup enforcement, multi-track sprint management, touch target verification, invariant protection.
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

---

**Philosophy:** See [docs/HUMAN_AI_TANDEM_PHILOSOPHY.md](docs/HUMAN_AI_TANDEM_PHILOSOPHY.md) for the Human–AI tandem principles and "new way" tenets.

## 🚀 Why this way?

1.  **Shared Knowledge**: Improvements to `guardians/ARCHITECT.ti` in Project A automatically benefit Project B.
2.  **Clean History**: Code repo stays for code. `prompt-machine` stores the AI's "thought process".
3.  **Global Search**: Since `totem/instances` stores all project metadata, you can grep one folder to see your entire portfolio.

---

**Protocol**: MRPP v6.0 (SYSTEMATIC-EXCELLENCE)  
**Repo**: [denistka/totem](https://github.com/denistka/totem)

_Accumulate power, one project at a time._
