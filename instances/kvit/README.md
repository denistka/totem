# KVIT Military Draft Project

## 🛡️ Operational Status: STRICT-MODE ACTIVE

This project is a military-grade test task implementation. It follows the **Multi-Role Prompt Protocol (MRPP) v3.0** with maximum strictness for analysis and development.

---

### 📁 Project Architecture & Directories

To maintain stability and strict separation of concerns, the project is physically divided into operational scopes:

| Scope                  | Physical Directory      | Responsibility                                                                                                  |
| ---------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Totem Intelligence** | `totem/instances/kvit/` | Protocol management, Sprints (S01, S02, etc.), Guardians (`ARCHITECT.pa`, `ROOT.pi`) and Incoming requirements. |
| **Active Development** | `kvit/draft/`           | The active workbench where features are developed, tested, and iterated upon (e.g., active React PWA).          |
| **Stable Code**        | `kvit/clear/`           | High-integrity, completed deliverables that have passed QA and Architectural gates.                             |

### 🕹️ Operational Protocol

1. **Materials Ingestion**: All raw requirements and specifications provided by the USER are placed in `incoming/`.
2. **Analysis**: Automated and manual analysis to map requirements into active Sprints.
3. **Dispatch**: Modular task execution via `.pd` (Developer) and `.ptl` (Team Lead) files within specific Sprint folders.
4. **Development**: Code changes are exclusively made in the `kvit/draft` directory.
5. **Verification**: Mandatory QA gates (`QA.pqa`) must clear before any task is marked done, and before any code is promoted to `kvit/clear`.

---

_Authorized access only. Working in maximum complexity mode._
