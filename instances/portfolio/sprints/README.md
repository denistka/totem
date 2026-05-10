# Portfolio Sprint Hub — Totem V6 instance

Sprints folder for the **portfolio** Totem instance. See [../project.config.yml](../project.config.yml) for stack + paths.

- **App code target:** `/Users/denistka/Projects/portfolio/app/` (created by S01/T01)
- **Concept:** C — Live Showroom (locked in via project.config.yml)

## Status

| Sprint | State | Notes |
|---|---|---|
| **S01-FOUNDATION** | ✅ **DONE** (2026-05-10) | Invariants frozen — see [S01-INVARIANTS.md](S01-INVARIANTS.md) |
| **S02-LIVE-SHOWROOM** | 🔒 LOCKED | Awaiting `LGTM` to start (Room SDK + 5 rooms) |
| **S03 — pitch ops** | 📋 deferred | Pitch analytics, auto-deploy, theming overrides, archival |

## Sprints

| Sprint | File | Scope |
|---|---|---|
| S01 | [S01-FOUNDATION.ptl](S01-FOUNDATION.ptl) | Vue 3 + Vite + TS + Tailwind + Supabase + Vercel + glass-stack port + motion system |
| S02 | [S02-LIVE-SHOWROOM.ptl](S02-LIVE-SHOWROOM.ptl) | Room SDK (extensible) + Project Wall + Hero + 3 demo rooms |
| S03 | _deferred — pitch ops_ | Pitch analytics, auto-deploy script, theming overrides, archival |

## S01 Tracks

### Track A — Bootstrap (sequential)
- [T01](tasks/T01-init-vue-vite-ts.pd) Vue 3 + Vite + TS skeleton
- [T02](tasks/T02-design-tokens-glass.pd) Design tokens + 3 themes
- [T03](tasks/T03-glass-entity-port.pd) Glass-entity Vue SFC port

### Track B — Backend & Deploy (parallel with A)
- [T04](tasks/T04-supabase-client.pd) Supabase client + schema
- [T05](tasks/T05-vercel-pwa-deploy.pd) Vercel + PWA manifest

### Track C — App Shell (after A)
- [T06](tasks/T06-app-shell-router.pd) Router + transitions + bottom-nav
- [T07](tasks/T07-gsap-motion-system.pd) GSAP motion architecture
- [T08](tasks/T08-loader-screen.pd) Loader screen port

## S02 Tracks — Live Showroom

### Track A — Room SDK (extensibility, sequential)
- [T09](tasks/T09-room-manifest-schema.pd) Manifest schema + zod validation
- [T10](tasks/T10-room-registry-discovery.pd) Auto-discovery registry
- [T11](tasks/T11-room-scaffolder-cli.pd) `pnpm room:new` CLI (incl. `--pitch` mode)
- [T12](tasks/T12-room-dynamic-routes.pd) Dynamic lazy routes `/rooms/<slug>`

### Track B — Showroom Surface (after A)
- [T13](tasks/T13-project-wall.pd) Project Wall (reads registry)
- [T14](tasks/T14-hero-playground-room.pd) Hero Playground room

### Track C — Demo Rooms (parallel with B after A)
- [T15](tasks/T15-live-demos-room.pd) Live Demos (Supabase real-time taskboard)
- [T16](tasks/T16-animation-lab-room.pd) Animation Lab (mini timeline editor)
- [T17](tasks/T17-contact-room.pd) Contact (form + edge fn + RLS)

## Pitch Flow (enabled by S02 Track A — no extra sprint needed)

```
pnpm room:new miltech-2026 --pitch \
  --jd-role "Frontend Engineer" \
  --jd-company "ACME" \
  --jd-link "https://..."
```

→ scaffolds `app/src/rooms/miltech-2026/` (visibility:`pitch`, JD callout, analytics tag)
→ `pnpm dev` shows it at `http://localhost:5173/rooms/miltech-2026`
→ git push branch → Vercel preview URL → share with recruiter
→ does NOT appear on public Wall (visibility:pitch hidden)

Target lead-time: scaffold + first deploy < 30 min (excluding actual demo content).

## Hard Stops

- ❌ Agent will NOT read or execute these tasks until `gate: OPEN`.
- ❌ Agent will NOT amend frozen tokens after S01 close without explicit invariant-modification request.
