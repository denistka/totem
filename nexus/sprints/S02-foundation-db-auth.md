# S02 · Foundation — DB + auth scaffold

**Phase:** P0 · Foundation
**Window:** M1–M2
**Status:** planned
**Depends on:** S01 (schemas inform DB columns)
**Blocks:** S05, S06, S07

## Objective

Extend `taskboard-supabase` schema with Nexus-specific tables and wire up
GitHub OAuth alongside existing email auth. Establish migrations workflow.

## Acceptance criteria

- [ ] Migrations directory `db/migrations/` with Supabase CLI conventions
- [ ] New tables: `epics`, `sprints`, `invariants`, `stack_adapters`,
      `stack_adapter_log`, `scripts`, `agents`, `events`
- [ ] Existing `boards` / `tasks` tables aliased / mapped (no destructive rename)
- [ ] RLS policies for org-level isolation
- [ ] `events` is append-only (constraint + trigger)
- [ ] GitHub OAuth via Supabase Auth provider, JWT claims include org id
- [ ] Seed script populates demo data matching the prototype mocks

## Out of scope

- Vector embeddings (S11)
- pgvector index (S11)

## Engineering notes

- Reuse `db/dump.sql` baseline; new migrations stack on top
- Keep `tasks.id` as UUID — agents reference tasks by id, not code
- Event types named `chat:*`, `task:*`, `gate:*`, `handoff:*`, `presence:*`

## Risks

- Renaming existing prod tables breaks deployed instances. Strategy:
  add new columns, leave old ones, deprecate over phases
