# Knowledge Gaps & Documentation Drift

**Audited:** 2026-06-18  
**Source:** `todo-documentation-updates.md`, README, ADR archive notices

## README gaps (from internal checklist)

| Item | Current README | Should be |
|------|----------------|-----------|
| Organization layer | Mentioned briefly | Full 3-layer diagram with `/organization/` |
| ADR location | Says `/documentation/` in temp-product-context | Actually `core/docs/adr/` |
| Customer docs path | Implies `core/docs/content/` for customer docs | Customer writes in `/docs/content/` |
| Port table | Demos 3010–3012 | Add docs 3000, control 3001, chat 3002, characters 3014 |
| MCP tools | Generic mention | List all 12 tools (see FEATURE_CENSUS.md) |
| Chat demo | Not in README port table | Port 3013 demo, 3002 customer app |

## ADR archive policy

All ADRs 001–009 have archive notices pointing to:

- `core/docs/knowledge/{slug}.md`
- MCP `explain` / `record`
- GitHub Issues for remaining work

**Gap:** New contributors may still read ADRs first (1,300+ lines). Totem + onboarding should steer to `explain("feature-knowledge")` first.

## Orphaned knowledge files

These exist but have no `// SEE:` references in code:

| Slug | Action |
|------|--------|
| `feature-flags` | Implement or mark `status: planned` in frontmatter |
| `secrets-management` | Add SEE refs to `multi-encrypt` usage or merge into developer-tools |
| `sync-adr-tickets` | Keep as meta-doc; optional SEE from ADR index page |

## temp-product-context.md drift

| Claim | Reality (Jun 2026) |
|-------|-------------------|
| "6 MCP tools" | 12 tools now |
| `documentation/` for ADRs | `core/docs/adr/` |
| Only 3 demos | 5 demos (+ characters) |
| Auth/billing "planned" | Partial auth via nuxt-auth-utils; no billing layer |

## Content not in knowledge slugs

Topics in ADRs without dedicated knowledge file:

- Monorepo workspace specifics (partially in `layer-cascade`)
- Testing strategy (ADR-007 — issue #83)
- Naming context vs feature (ADR-008 — covered by `feature-knowledge`)

## Recommended doc fixes (future sprint, not S01)

1. Update root README per `todo-documentation-updates.md` sections 1.1–1.4
2. Add `getting-started/mcp.md` with Cursor + Claude setup (addresses #117 partially)
3. Sync `temp-product-context.md` or replace with link to Totem BRIEF
4. Remove/redact `temp.md` from repo

## Totem as canonical external knowledge

For Denis's workspace, **this instance** (`totem/.../app-agent-io/intel/`) is the agent-oriented knowledge hub. App Agent's internal knowledge remains slug files + MCP for in-repo agents.
