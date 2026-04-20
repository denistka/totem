# S82 — Quality gates & metric_lock (TW1)

**Sprint ref:** `sprints/82/S82-ARCHITECT-V4-FULL-OPTIMIZATION.ptl` (`metric_lock`, `quality_gates`, `post_sprint_guards`).

## metric_lock (definitions frozen for S82)

| Key | Definition | How to measure |
|-----|------------|----------------|
| `duplication_metric` | jscpd **duplicated lines** ratio | Run `pnpm dupes:jscpd` from `navitrack-apps/src-client`; table “Duplicated lines / Total lines” |
| `dependency_metric` | **madge** cycle count | `pnpm deps:cycles` (madge `--circular` on `src`) — target **0** |
| `api_metric` | Endpoint/type coverage | Table in `S82_API_TYPE_SSOT_AUDIT.md` (P0/P1 rows) |

## Repo commands (reviewers / CI)

```bash
cd navitrack-apps/src-client
pnpm lint
pnpm exec tsc -b
pnpm dupes:jscpd
pnpm deps:cycles
pnpm codemap
```

## LOC policy (new/changed code)

- Target **≤150 LOC** per new file where practical; legacy files grandfathered until touched.
- Large additions should split by feature/module.

## Lint (SonarJS)

- Baseline warnings tracked in `S82_ARCHITECT_V4_BASELINE.md` §2 (`S82-TL0`).
- **TW1 snapshot (2026-04-08):** 40 warnings, 0 errors (`pnpm lint`).

## Duplication (jscpd)

- **Post–TS0:** 0 clones (`pnpm dupes:jscpd`).

## CI snippet (optional)

Add a job that runs: `pnpm lint`, `pnpm exec tsc -b`, `pnpm dupes:jscpd` (fail if clones > 0), `pnpm deps:cycles` (fail on cycles). Unit tests are out of scope until a dedicated test task adds a runner.

## Related intel

- `S82_API_CLIENT_SSOT.md` — TA1 entry + errors
- `S82_ARCHITECT_V4_BASELINE.md` — immutable seed + changelog
