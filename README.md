# Totem: Universal AI Agent Orchestration

This repository contains the **project-agnostic** core of the Totem system, designed for high-performance AI-assisted development across any technology stack.

## 📁 Repository Structure

- **`/core`**: The **MRPP 3.0** (Multi-Role Prompt Protocol) standard. Universal syntax, compression rules, and iteration flows.
- **`/guardians`**: Process-oriented AI roles (`ROOT`, `ARCHITECT`, `PM`, `QA`, `TEAM_LEAD`, `DEVOPS`) that handle logic and orchestration.
- **`/stacks`**: Technology-specific adapters (e.g., `react-ts`, `go-fiber`, `django`). These provide the deep technical knowledge for different environments.
- **`/templates`**: Reusable benchmarks for starting new projects.
- **`/instances`**: Specific project configurations.

## 🚀 Getting Started

1. **Select a Stack**: Choose or create a stack in `/stacks`.
2. **Configure Instance**: Create a directory in `/instances` with a `project.config.yml`.
3. **Dispatch Sprints**: Use the roles in `/guardians` following the `/core` protocol.

## 🛠 Project Status

- **Protocol**: MRPP v3.0 (Active)
- **Repo**: [denistka/totem](https://github.com/denistka/totem)
- **Current Instance**: Tour Search App

---

_Created with ❤️ by Antigravity for denistka._
