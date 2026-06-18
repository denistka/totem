# GitHub Issues Sync

**Synced:** 2026-06-18  
**Repo:** [app-agent-io/core](https://github.com/app-agent-io/core/issues)

## Open issues summary (21 shown)

| # | Title | Labels | Totem priority | Maps to |
|---|-------|--------|----------------|---------|
| 117 | Docs gap: Supabase MCP setup for downstream forks | — | P1 | `integrations`, docs |
| 115 | Control Plane — Open Ideas | — | P2 | `core/control` |
| 114 | Configurable Items in Demo Apps | — | P1 | demos, `organization` |
| 111 | CoreUserMenu: login buttons truncated | — | P1 | `authentication`, UI |
| 108 | SPIKE: chat endpoint factory storytech → core | — | P1 | `apps/chat`, `integrations` |
| 104 | Zing! Patio RAG Agent POC | — | — | external POC |
| 103 | feat: bring VoyceMe patterns back to core | high, infrastructure | **P1** | core patterns |
| 101 | refactor: extract data layer to package | medium, infrastructure | P2 | `packages/` |
| 83 | Expand unit test coverage | medium, dx | P1 | tests |
| 26 | AI Integrations — model profiles | high, infrastructure, feature | P1 | `integrations` |
| 24 | Feature-scoped DX: i18n, config, enabled | infrastructure, feature, dx | P1 | `feature-knowledge` |
| 19 | demo-portfolio | medium, feature | P2 | demos |
| 18 | demo-changelog | medium, feature | P2 | demos |
| 17 | demo-editor | medium, feature | P2 | demos |
| 13 | Redesign config introspection MCP (query-based) | low, dx | P2 | MCP tools |
| 12 | Raw PostgreSQL ConfigProvider | low, infrastructure | P2 | `runtime-config` |
| 11 | Auto-generate knowledge frontmatter | medium, dx | P2 | `feature-knowledge` |
| 10 | record() sub-agent via MCP sampling | medium, dx | P1 | `record` tool |
| 8 | Client-side hot-reload WebSocket | medium, feature | P2 | `runtime-config` |
| 5 | MCP sampling emulation (analysis aspect) | high, feature | P1 | `explain` tool |
| 4 | Integration test live Supabase DB | high, infrastructure | P1 | `runtime-config` |

## ADR → issue traceability

| ADR topic | Issues |
|-----------|--------|
| ADR-005 runtime config | #4, #7, #8, #9, #12 |
| ADR-006 agent context / knowledge | #5, #6, #10, #11 |
| ADR-004 layer/i18n | #13, #24 |
| ADR-009 feature intelligence | #5, #10, #11 |

*(Issues #6, #7, #9 referenced in ADRs but not in latest open list — may be closed or renumbered.)*

## Suggested Totem sprint mapping

| Sprint | Issues |
|--------|--------|
| S02 Chat working | P0-1, #108 |
| S03 Demo configurability | #114, P0-3 |
| S04 Test & CI health | #4, #83, P0-4 |
| S05 MCP/knowledge completion | #5, #10, #11, #13 |
| S06 VoyceMe patterns | #103 |
| S07 Control plane polish | #115, #111 |

## CLI refresh

```bash
gh issue list --repo app-agent-io/core --state open --limit 50
```
