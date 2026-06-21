# Deep Dive: Apps Map

**Traced:** 2026-06-18 (S03)

## Layer inheritance (all apps)

```
apps/* | demos/* | docs | control  →  organization/  →  core/
```

Each app's `nuxt.config.ts` has `extends: ['../../organization']` (or similar relative path).

---

## Docs app (`core/docs/` + customer `docs/`)

| | Upstream docs | Customer docs |
|--|---------------|---------------|
| Path | `core/docs/` | `docs/` |
| Port | 3000 | (customer choice) |
| Role | Knowledge CMS + **MCP server** | Customer-facing documentation |
| Key dirs | `content/`, `knowledge/`, `server/mcp/` | `content/` only |

Upstream docs is the **agent interface** — 12 MCP tools, ADR archive, feature knowledge files.

---

## Control app (`core/control/` + `control/`)

| Port | 3001 |
| Role | Ops UI — agent chat, feature graph, logs, config diff |
| Extends | organization → core |

See `DEEP-CONTROL-PLANE.md`.

---

## Demos (reference — copy, don't edit)

| Demo | Port | Package | Key patterns |
|------|------|---------|--------------|
| dashboard | 3010 | `@app-agent/demo-dashboard` | Sidebar, teams, shortcuts, cookie consent |
| saas | 3011 | `@app-agent/demo-saas` | Auth pages, pricing, marketing |
| landing | 3012 | `@app-agent/demo-landing` | Hero, features, footer columns |
| chat | 3013 | `@app-agent/demo-chat` | AI chat UI, model select, file upload |
| characters | 3014 | `@app-agent/demo-characters` | Character personas (5th demo, omitted from README) |

### Demo hardcoding (#114)

Much UI content is in `organization/app/app.config.ts`:

- `header.navigation`, `footer.columns`, `auth.login/signup` fields
- `dashboard.sidebar`, `dashboard.teams`, `dashboard.userMenu`

Demos **read** via `useAppConfig()` but many components still hardcode labels/links.  
Issue #114 proposes centralizing configurable items.

### Stray lockfiles

`demos/saas/pnpm-lock.yaml`, `demos/landing/pnpm-lock.yaml` — violate bun-only monorepo policy.

---

## Customer apps (`apps/`)

| App | Port | Package | Status |
|-----|------|---------|--------|
| `apps/chat` | 3002 | `@app-agent/chat` | AI chat — see `DEEP-CHAT-APP.md`, `apps/chat/SETUP.md` |
| `apps/work-control` | 3003 | `@app-agent/work-control` | Totem kanban + sprint reader — see `DEEP-WORK-CONTROL.md` |

Upstream may ship empty `apps/`; launcher `copyDemo()` or manual scaffold populates customer apps.

### work-control (S04)

- Reads Totem `.ptl`/`.pd` from `totem/totem-v6/instances/app-agent/sprints/` (read-only)
- SQLite via NuxtHub; `POST /api/totem/sync` imports pending tasks
- Override path: `WORK_CONTROL_TOTEM_PATH`

---

## Organization layer (`organization/`)

Single file drives brand for **all** apps: `organization/app/app.config.ts`  
**Instance brand:** DAWWWB (2026-06-21)

Sections: `brand`, `ui.colors`, `seo`, `header`, `footer`, `links`, `auth`, `dashboard`

Customer edits here — zero merge conflicts with upstream `core/`.

See organization section in this doc + `DEEP-CHAT-APP.md` for app-specific overrides.

---

## Port assignment

Ports set in each package's `package.json` dev script — **not** in `nuxt.config.ts`.  
Direct `nuxt dev` without script may bind wrong port.

| Port | Service |
|------|---------|
| 3000 | docs + MCP |
| 3001 | control |
| 3002 | apps/chat |
| 3010–3014 | demos |
