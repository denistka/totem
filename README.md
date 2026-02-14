# Totem: Universal AI Agent Orchestration

The brain of your AI-driven team. Centralized, tech-agnostic, and project-aware.

---

## 🐒 How to use it, Monkeys! (Quick Start)

Deploying a new project takes 3 steps across 3 repositories:

### 1. Setup the Filesystem

You should have 3 folders (repos) side-by-side:

```bash
/Projects/
  ├── totem/          # (This Repo) Intelligence, Guardians, Core Protocol
  ├── project-code/   # The Source Code (React, Django, etc.)
  ├── prompt-machine/ # Execution History (.pd, .ptl, .ppm, .pqa files)
```

## 👶 Onboarding: Joining a Running Project

If the project already has history and generated sprints, follow these steps to sync context:

1.  **Repo Initialization**: Clone `totem`, `prompt-machine`, and the `code` repo.
2.  **Context Sync**: Point the AI to `totem/instances/{your-project}/README.md`.
3.  **Ground Truth**: Run the build/dev command (e.g., `npm run build`) to verify current state.
4.  **History Check**: Review the latest `.ptl` (Sprint) and `.pd` (Task) files in `prompt-machine/sprints/`.
5.  **Role Alignment**: Load the appropriate Guardian from `totem/guardians/`.

### 2. Register the Instance (The "Class vs Instance")

**Difference between /templates and /instances:**

- **`/templates`**: The empty forms. You don't write here. (Like an empty Excel file).
- **`/instances`**: THE REAL DATA. You copy a template here and fill it with your project's soul.

**Execution:**

1.  Go to `totem/instances/` and create folder `your-project-name`.
2.  Copy `totem/templates/PROJECT_README.template.md` → `totem/instances/your-project-name/README.md`.
3.  Fill the `README.md` and `project.config.yml` with your stack and goals.

### 3. Start the Machine

1.  Tell the AI: _"Read totem/instances/your-project-name/README.md and start S01 in prompt-machine/"_.
2.  The AI will pull **Intel** from `totem`, write **History** to `prompt-machine`, and commit **Code** to `project-code`.

---

## 📁 Repository Map

### 🏺 Totem (Central Repo)

_The shared intelligence across ALL your projects._

- **`/core`**: Protocol rules (MRPP 3.0). How the agents talk.
- **`/guardians`**: Universal roles (PM, Architect, TL). How the agents think.
- **`/stacks`**: Tech-specific adapters (React, Go, Python). What the agents know.
- **`/templates`**: Blueprints for new projects.
- **`/instances`**: **Registry of active projects.** (One folder per project).

### 🤖 Prompt-Machine (Project-Specific)

_The immutable history of work._

- **`/sprints`**: Where `.ptl` (Sprint) and `.pd` (Task) files live.
- **`/reports`**: Verification results and QA checks (`.pqa`).
- **`/analysis`**: Architectural decisions (`.pa`) and PM planning (`.ppm`).

### 💻 Project Code (Project-Specific)

_The binary output._

- `src/`, `tests/`, `dist/`, etc.

---

## 🚀 Why this way?

1.  **Shared Knowledge**: Improvements to `guardians/ARCHITECT.ti` in Project A automatically benefit Project B.
2.  **Clean History**: Code repo stays for code. `prompt-machine` stores the AI's "thought process".
3.  **Global Search**: Since `totem/instances` stores all project metadata, you can grep one folder to see your entire portfolio.

---

**Protocol**: MRPP v3.0  
**Repo**: [denistka/totem](https://github.com/denistka/totem)

_Accumulate power, one project at a time._
