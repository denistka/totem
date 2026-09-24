# S08 Smoke — In-Repo Accept

**Preconditions:** `:3000` docs MCP + `:3003` work-control; `bun run db:migrate` applied.

## Steps

1. Open work-control → new chat → send message (e.g. "ship auth feature")
2. Confirm epic shows `targetApp: work-control` badge
3. **Accept** epic
4. Verify files appear under `apps/work-control/planning/sprints/S<NN>-*.ptl` + `.pd` with `gate: OPEN`
5. Verify **no new** files in `totem/.../instances/app-agent/sprints/` (unless `WORK_CONTROL_TOTEM_PATH` set)
6. Board Totem panel shows in-repo sprint
7. **Open gate** → **Run** one task → `done` + WS activity

## Legacy fallback check (optional)

1. Temporarily rename `apps/work-control/planning/sprints` → `sprints.bak`
2. Set `WORK_CONTROL_TOTEM_PATH` to external totem instance
3. Accept → writes to external path; console warns deprecated
4. Restore `sprints/` directory

## Automated

`bun run test` — `planning-path.test.ts`, `planning-writer.test.ts`
