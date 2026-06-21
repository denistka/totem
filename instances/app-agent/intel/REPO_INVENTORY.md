# Repository Inventory

**Scanned:** 2026-06-18  
**Root:** `/Users/denistka/Projects/app-agent-io/core`

## Top-level tree

```
core/                          # @app-agent/core — shared Nuxt layer (upstream)
├── app/                       # Shared components, composables, layouts
├── server/                    # Middleware, plugins, utils, API routes
├── cli/                       # dev.js (smart launcher), feature-health.js
├── docs/                      # @app-agent/docs-layer — docs app + MCP server
│   ├── content/               # App Agent reference docs
│   ├── knowledge/             # 15 feature knowledge files (slug = filename)
│   ├── adr/                   # 9 ADRs (archived — knowledge is successor)
│   └── server/mcp/tools/      # 12 MCP tool definitions
├── control/                   # @app-agent/control-layer — control plane UI/API
organization/                  # @app-agent/organization — branding layer
docs/                          # @app-agent/docs — customer docs app (port 3000)
control/                       # @app-agent/control — control app shell (port 3001)
apps/
├── chat/                      # @app-agent/chat — AI chat (port 3002)
└── work-control/              # @app-agent/work-control — Totem kanban (port 3003)
demos/
├── dashboard/                 # @app-agent/demo-dashboard (3010)
├── saas/                      # @app-agent/demo-saas (3011)
├── landing/                   # @app-agent/demo-landing (3012)
├── chat/                      # @app-agent/demo-chat (3013)
└── characters/                # @app-agent/demo-characters (3014)
packages/                      # (empty / optional shared packages)
```

## Workspace packages

| Package | Path | Role |
|---------|------|------|
| `app-agent` | `/` | Root workspace, turbo scripts |
| `@app-agent/core` | `core/` | Base Nuxt layer |
| `@app-agent/organization` | `organization/` | Branding; extends core |
| `@app-agent/docs-layer` | `core/docs/` | Docs infrastructure + MCP |
| `@app-agent/docs` | `docs/` | Customer-facing docs site |
| `@app-agent/control-layer` | `core/control/` | Control plane implementation |
| `@app-agent/control` | `control/` | Control app entry |
| `@app-agent/chat` | `apps/chat/` | Customer chat application |
| `@app-agent/work-control` | `apps/work-control/` | Totem sprint kanban (S04) |
| `@app-agent/demo-dashboard` | `demos/dashboard/` | Admin pattern |
| `@app-agent/demo-saas` | `demos/saas/` | SaaS pattern |
| `@app-agent/demo-landing` | `demos/landing/` | Marketing pattern |
| `@app-agent/demo-chat` | `demos/chat/` | AI chat template |
| `@app-agent/demo-characters` | `demos/characters/` | Characters demo |

## Layer extends chain

All apps/demos extend **organization**, which extends **core**:

```
apps/chat, apps/work-control, demos/*  →  organization  →  core
docs                →  core/docs (docs-layer)  →  organization  →  core
control             →  core/control (control-layer)  →  organization  →  core
```

## Port allocation

| App | Port | Package |
|-----|------|---------|
| Docs | 3000 | `@app-agent/docs` |
| Control | 3001 | `@app-agent/control` |
| Chat (customer) | 3002 | `@app-agent/chat` |
| Work Control (customer) | 3003 | `@app-agent/work-control` |
| Demo dashboard | 3010 | `@app-agent/demo-dashboard` |
| Demo SaaS | 3011 | `@app-agent/demo-saas` |
| Demo landing | 3012 | `@app-agent/demo-landing` |
| Demo chat | 3013 | `@app-agent/demo-chat` |
| Demo characters | 3014 | `@app-agent/demo-characters` |

## Tooling

| Command | Purpose |
|---------|---------|
| `bun run dev` | Smart launcher (`core/cli/dev.js`) |
| `bun run dev:docs` | Docs only |
| `bun run dev:control` | Control plane |
| `bun run dev:demos` | Docs + control + all demos |
| `bun run typecheck` | Turbo typecheck all packages |
| `bun test` | Vitest (root) |
| `bun run feature:health` | SEE annotation / knowledge coverage |

## Key config files

| File | Purpose |
|------|---------|
| `turbo.json` | Monorepo task graph |
| `organization/app/app.config.ts` | Brand name, logo, footer links |
| `core/nuxt.config.ts` | Core modules, i18n, auth |
| `docs/nuxt.config.ts` | MCP name, port 3000 |
| `core/docs/nuxt.config.ts` | Content collections, MCP tools |

## Scratch / internal files (not production docs)

| File | Note |
|------|------|
| `temp-product-context.md` | Product vision snapshot (Feb 2026) |
| `temp.md` | **Contains API keys — rotate and remove from repo** |
| `todo-documentation-updates.md` | README/docs drift checklist |
