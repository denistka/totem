# personal-ai-bankir — Project Overview

**Stack**: Vue 3, Node.js, Express, Supabase, PWA, Vite, Claude API, Tauri 2 (Future).  
**Source**: `personal-ai-bankir/files/bankir-vision.md`, `bankir-master-doc.md`
**Distribution**: Universal (PWA/Telegram → Tauri 2 Mobile/Desktop)

---

## Architecture

| Layer | Directory | Responsibility |
| ----- | --------- | -------------- |
| Frontend | `/client` | Vue 3 PWA with Chat, Debt Destroyer, Scanner tools |
| Backend | `/server` | Node.js Express API, Claude API proxy, Auth |
| Database | Supabase | PostgreSQL for users, conversations, debts, rates |
| Bot | `/bot` | Telegram Bot for Mini App entry and alerts |

---

## Sprints

- **S01**: Foundation & Chat (Vue 3 + Vite, Node.js + Claude, Supabase Setup)
- **S02**: Tools & Telegram (Debt Destroyer, Scanner, Bot integration)
- **S03**: Polish & Launch (Monetization, UX for 55+, Notifications)

---

## Key Docs (Instance)

| Doc           | Location             |
| ------------- | -------------------- |
| Protocol Core | `totem/core/`        |
| Config        | `project.config.yml` |
| Vision        | `./docs/bankir-vision.md` |
| Master Doc    | `./docs/bankir-master-doc.md` |
| Epics & Tasks | `./docs/bankir-epics-tasks.md` |

---

## Guardians Selection

Universal Process: `ROOT`, `PM`, `QA`, `DEVOPS`, `ARCHITECT`

Stack Adapters (Categorized for JIT Loading):

- UI_Adapters: `vue/VUE.ti`, `vite/VITE.ti`, `pwa/PWA.ti`, `tauri/TAURI.ti`
- Server_Adapters: `node/NODE.ti`, `supabase/SUPABASE.ti`

_Note: When creating Sprints (.ptl) or Tasks (.pd), the Planner MUST use the `requires:` field to select only the necessary adapters from this list for the given objective._
