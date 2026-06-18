# S02 Dev Smoke Report

**Date:** 2026-06-18

## `bun run dev` (full monorepo)

| Check | Result |
|-------|--------|
| Launcher starts | ✅ After fixing `.gitignore` secrets manifest |
| Turbo packages | 12 packages in dev |
| Blocker (before fix) | ❌ `apps/companions/.data` in `# Secrets` caused failed interactive decrypt in CI/non-TTY |

### Fix applied (S02)

Removed `.data/` paths from `# Secrets` in root `.gitignore`; added `./apps/chat/.env`.

## Service status (full turbo, warm)

| Port | Expected | Observed |
|------|----------|----------|
| 3000 | docs + MCP | ✅ HTTP 200 |
| 3001 | control | ⚠️ Port shift when conflict (see below) |
| 3002 | apps/chat | ⚠️ May shift to 3001 if 3002 occupied |
| 3003 | — | control landed here when 3001 taken |
| 3010 | demo-dashboard | ✅ starts |
| 3011 | demo-saas | ✅ starts |
| 3012 | demo-landing | ✅ starts |
| 3013 | demo-chat | ✅ starts |
| 3014 | demo-characters | ✅ starts |

### Port conflict scenario

Standalone `apps/chat` on 3002 was running when full `bun run dev` started:

- `@app-agent/chat` → **3001** (fallback)
- `@app-agent/control` → **3003** (fallback)

**Mitigation:** Stop existing dev servers before full turbo, or use filtered turbo (see `apps/chat/SETUP.md`).

## Console warnings (non-blocking)

- `[runtime-config] Failed to initialize config service require is not defined` — on docs/demos/control when `CORE_DATASOURCE_*` not set; static config only
- `[integrations] AI integrations not configured` — on docs/demos without `AI_PROVIDER_*` in their cwd (expected)

## MCP

`[@nuxtjs/mcp-toolkit] ✔ /mcp enabled with 12 tools` on docs app.
