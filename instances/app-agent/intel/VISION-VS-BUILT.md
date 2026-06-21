# Vision vs Built

**Audited:** 2026-06-18 (S03)  
**Sources:** ADRs 001–009, GitHub issues, `AGENTS.md`, organization config

## Thesis (built ✅)

> "The AI isn't smarter. The codebase is smarter."

| Capability | Status | Evidence |
|------------|--------|----------|
| Three-layer Nuxt cascade | ✅ Built | `defu` merge, extends chain |
| Feature slug join key | ✅ Built | SEE annotations, knowledge files, defineFeature* |
| MCP agent interface | ✅ Built | 12 tools on :3000 |
| Control plane ops UI | ✅ Built | Agent, graph, logs, config diff |
| Runtime config service | ✅ Built | SQLite local, Supabase prod path |
| Secrets encryption | ✅ Built | multi-encrypt + manifest |
| Dev launcher | ✅ Built | First-run wizard, port check |
| Test suite (vitest) | ✅ Green | 322 tests |
| Chat customer app | ✅ Built | apps/chat with DB, AI, uploads |

## Partially built 🟡

| Capability | Gap |
|------------|-----|
| Feature knowledge coverage | 12 code slugs vs ~50 SEE refs; 3 orphaned knowledge files |
| Auth product | nuxt-auth-utils works; no billing, orgs, SSO admin |
| AI integrations | Single env-based profile; #26 multi-profile not done |
| Demo configurability | #114 — hardcoded nav/footer in components |
| MCP `explain` analysis | #5 — aspect returns error |
| MCP `record` sub-agent | #10 — not implemented |
| Typecheck CI gate | Fails on demo-saas, control |
| i18n | `i18n-layers` slug exists; #24 scope extension open |
| Supabase integration tests | #4 — mock-only |

## Aspirational / not built 🔴

| Capability | Source |
|------------|--------|
| Feature flags runtime | `feature-flags.md` orphaned |
| OTel spans by slug | ADR-009 future |
| Client config hot-reload WS | #8 |
| Billing / multi-tenancy / compliance | Product vision docs |
| Raw PostgreSQL provider | #12 |
| Demo templates (editor, changelog, portfolio) | #17–19 |
| VoyceMe patterns in core | #103 |

## Product decisions needed

1. **Chat agent architecture** — extend control `/agent` vs dedicated chat MCP vs unified gateway
2. **i18n** — Nuxt built-in vs `@nuxtjs/i18n` module (already in deps)
3. **Demo config** — `app.config.ts` vs content YAML for #114

## Maturity assessment

**Platform skeleton:** Production-grade for forks wanting Nuxt 4 + MCP-guided AI dev.  
**SaaS product:** Not ready — auth/billing/tenancy are demo-level.  
**Agent tooling:** Best-in-class for its niche; MCP gaps are polish not blockers.
