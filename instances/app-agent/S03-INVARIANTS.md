# S03 Invariants — app-agent-io

> **Binding:** All roles follow `APP-AGENT-PROTOCOL.md` (see `INSTANCE.ti`).

Extends `S02-INVARIANTS.md`. Frozen 2026-06-18 after S03 Deep Code Understanding.

## Investigation facts (frozen)

1. **Vitest is green** — `bun run test` passes 322 tests. Raw `bun test` is wrong runner.
2. **Typecheck is not green** — demo-saas Locale type + control `@nuxt/ui` dedup issues.
3. **Config service** reads `CORE_DATASOURCE_*` from process.env, not runtimeConfig.
4. **Feature registry** is dev-only; production defineFeature* is pass-through.
5. **Docs MCP** (12 tools) and **control agent** (5 inline tools) are separate interfaces.

## Deep doc canonical paths

6. Cross-cutting flows: `intel/DEEP-FLOWS.md`
7. Subsystem dives: `intel/DEEP-*.md` (see `TOTEM_INDEX.ti`)
8. Vision honesty: `intel/VISION-VS-BUILT.md`

## Test commands (do not confuse)

9. Unit/server/dev tests: `bun run test` (vitest)
10. SQLite tests: `bun run test:db` (bun:test in `core/tests/db/`)

## Dev runtime (unchanged from S02)

11. Per-app: `cd <app> && NUXT_TELEMETRY_DISABLED=1 bun --bun nuxt dev`
12. Turbo `bun run dev:*` boots but HTTP 500 on bun:sqlite routes under Node.

## Agent entry (updated)

```text
read totem/totem-v6/index.ti, load instance app-agent, read intel/TOTEM_INDEX.ti
```
