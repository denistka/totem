# Deep Dive: Dev Launcher (`core/cli/dev.js`)

**Traced:** 2026-06-18 (S03)  
**Slug:** `developer-tools`

## Entry points

| Command | Behavior |
|---------|----------|
| `bun run dev` | Runs `node core/cli/dev.js` |
| `bun run dev:docs` | Turbo → docs only |
| `bun run dev:demos` | Turbo → all demos + docs + control |
| `bun run dev:control` | Turbo → control only |

## First-run wizard

When `apps/` is empty (only `.gitkeep`):

1. Prompts: copy demo vs explore demos first
2. `copyDemo(id)` — copies `demos/{id}` → `apps/{id}`
3. Warns to add new `.env` paths to `# Secrets` manifest

## Port pre-flight

Checks ports 3000–3002, 3010–3014 before launch ( **`3003` work-control not in `PORT_MAP`** — gap).  
Warns if occupied — Nuxt may assign alternate ports.

## Secrets auto-decrypt

`checkAndDecryptSecrets()`:

1. If `encrypted.json` exists
2. Parse `# Secrets` section from `.gitignore`
3. For each listed path missing on disk → prompt password → `multi-encrypt dec`

**Known regression (P0-6):** Upstream `.gitignore` lists `.data/` directories in `# Secrets` (`apps/chat/.data`, `apps/work-control/.data`, `demos/*.data`). Launcher treats them as encrypted secrets → **non-TTY crash**. Correct manifest: `.env` files only.

**Local workaround:** Ensure listed paths exist OR fix `.gitignore` upstream (S02 had correct fix, reverted).

## Turbo orchestration

When `apps/` non-empty, spawns `turbo run dev` for all workspaces.

**Critical bug:** Turbo runs `nuxt dev` under **Node**, but code imports `bun:sqlite` → HTTP 500 `Received protocol 'bun:'`.

**Fix:** Per-app direct launch:

```bash
cd <app-dir> && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev
```

Permanent fix = upstream PR to use `bun --bun nuxt dev` in all package.json dev scripts.

## Demo registry (in-script)

```javascript
const DEMOS = [
  { id: 'dashboard', port: 3010 },
  { id: 'saas', port: 3011 },
  { id: 'landing', port: 3012 },
  { id: 'chat', port: 3013 }
]
// characters (3014) in PORT_MAP but not in DEMOS wizard list
```

## Other CLI tools

| Script | File | Purpose |
|--------|------|---------|
| `feature:health` | `core/cli/feature-health.js` | SEE vs knowledge coverage |
| `enc` / `dec` | `multi-encrypt` | Secrets vault |

## Telemetry blocker

Interactive Nuxt telemetry prompt stalls parallel turbo dev.  
Always set `NUXT_TELEMETRY_DISABLED=1`.
