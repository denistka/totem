# S01 · Foundation — protocol + schema

**Phase:** P0 · Foundation
**Window:** M1–M2
**Status:** planned
**Blocks:** S02, S03, S04, S07

## Objective

Establish the protocol engine that defines Nexus objects (Project, Epic,
Sprint, Task, Step, Event, Invariant, Stack adapter, Script, Agent) as
JSON Schemas, with bidirectional conversion to Totem V6 markdown.

## Acceptance criteria

- [ ] JSON Schema files (Ajv-compatible) for: Project · Epic · Sprint · Task ·
      Step · Invariant · StackAdapter · Script · Event · AgentProfile
- [ ] TypeScript types auto-generated from schemas (`json-schema-to-typescript`)
- [ ] `protocol-export <projectId>` CLI dumps a valid V6 repo (`.ptl`/`.pd`)
- [ ] `protocol-import <path>` reads V6 repo back into JSON
- [ ] Gate state machine: `locked → open → closed`, `auto` as side branch
- [ ] All transitions audit-logged as Events
- [ ] Round-trip test: import V6 reference repo, export, diff = empty

## Out of scope

- Database schema (S02)
- API endpoints (S06)
- UI (S03)

## Engineering notes

- Monorepo package: `packages/protocol/` (publishable to npm later)
- Zero runtime deps for the engine (Ajv as peer)
- Event types are an enum sealed at the schema level — adding new ones
  requires a migration test

## Risks

- V6 markdown has implicit conventions not captured in current docs;
  mitigate by writing a fixture pack from `totem-v6/` reference and
  asserting round-trip on every CI run
