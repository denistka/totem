# Deep Dive: Test Analysis

**Audited:** 2026-06-18 (S03)

## Correct test commands

| Command | Runner | Result (2026-06-18) |
|---------|--------|---------------------|
| `bun run test` | **vitest** | ✅ **322 passed** (20 files) |
| `bun run test:db` | **bun:test** | ✅ 56 passed (SQLite tests) |
| `bun test` (raw) | bun's runner | ❌ 171 pass / 83 fail — **wrong command** |

## Root cause of `bun test` failures

`bun test` at repo root discovers all `*.test.ts` files and runs them with **bun's test runner**, which:

1. Does **not** load `vitest.config.ts` project setup
2. Does **not** run `tests/setup-server.ts` stubs
3. Fails immediately on `feature.test.ts`:

```
TypeError: undefined is not an object (evaluating 'getWriteLogMock().mockClear')
```

Because `globalThis.writeLog` stub from vitest setup never runs.

## Vitest project structure

```typescript
// vitest.config.ts
projects: [
  { name: 'core:unit', include: 'tests/unit/**', no setup },
  { name: 'core:server', include: 'tests/server/**', setupFiles: ['tests/setup-server.ts'] },
  { name: 'core:dev', include: 'tests/dev/**', setupFiles: ['tests/setup-dev.ts'], import.meta.dev: true },
]
```

## SQLite test isolation

Tests importing `bun:sqlite` **must** live in `core/tests/db/` and use `bun:test`.  
Vitest runs in Node workers — `bun:sqlite` unavailable.

Files affected: `feature-registry-db.ts`, `logs-db.ts`, `provider-sqlite.ts`, `knowledge-db.ts`.

## Recommendations (S04 backlog)

1. **Document:** README should say `bun run test`, not `bun test`
2. **Guard:** Add root `bunfig.toml` or script alias to prevent accidental `bun test`
3. **CI:** Ensure workflow uses `bun run test` + `bun run test:db`
4. Issue **#83** — expand coverage (separate from harness bug)

## P0-4 status update

**Downgrade:** P0-4 "83 test failures" was a **false alarm** from wrong runner.  
Real status: vitest green, bun:test green. Update `PROBLEMS_REGISTER.md`.
