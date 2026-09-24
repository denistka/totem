# Sprint Roadmap — app-agent instance

> **PLANNER index.** Rewritten 2026-08-20 by QA against `intel/TOTEM_INDEX.ti` (re-synced the same
> day) and the in-repo planning tree. The previous version of this file was titled "S12–S26", listed
> `SDEMO-B` as the active sprint and marked S14/S15 "IN PROGRESS". **All of that was stale by roughly
> two months** — superseded by the build-loop direction (S36 onward) and by the move of the planning
> home into the repo. Nothing in the S12–S26 wave plan below survives as a commitment; it is recorded
> at the bottom as history so nobody re-derives it.

---

## 0. Where planning actually lives (read this before authoring anything)

Since **S36** the hand-authored ROOT→PLANNER chain lives **in the repo, next to the code**.

| Artifact | Location | Status |
|----------|----------|--------|
| Planning home | `<code>/apps/work-control/planning/` | **AUTHORITATIVE** |
| Sprints (`.ptl` / `.pd` / `S*-SUMMARY.md`) | `<code>/apps/work-control/planning/sprints/` | **AUTHORITATIVE** |
| Invariants | `<code>/apps/work-control/planning/S36-INVARIANTS.md`, `S41-INVARIANTS.md` | **AUTHORITATIVE** |
| Evidence packs | `<code>/apps/work-control/planning/evidence/S41/` | **AUTHORITATIVE** |
| Protocol redirect | `<code>/apps/work-control/planning/PROTOCOL.md` → `/company/totem-governance` | **AUTHORITATIVE** |
| This external instance's `../sprints/` | `totem/…/instances/app-agent/sprints/` | **HISTORY ONLY — do not author here** |
| Per-app generated plans | `<code>/apps/<targetApp>/planning/sprints/` | written by Accept |

`<code>` = `../../../../app-agent-io/DAWWWB-app-agent-dev` — the **dev worktree**, branch
`write-docs-in-auto`. Not `DAWWWB-app-agent`; not `test-app`. Verify with `git branch --show-current`
before trusting any path in any file, including this one.

Legacy fallback `WORK_CONTROL_TOTEM_PATH` still resolves to the external totem archive and the suite
still logs a deprecation line for it. Do not build on it.

---

## 1. Sprint corpus — hand-authored vs product-generated

`<code>/apps/work-control/planning/sprints/` holds **42** `.ptl`. They are not one series.

| Class | Sprints | Count | How to tell |
|-------|---------|-------|-------------|
| **Hand-authored meta** | **S36**, **S41** | 2 | `authored_by: ROOT→PLANNER chain (hand-authored, not Accept-generated)`; bespoke task names; own `S*-INVARIANTS.md` |
| **Hand-authored (legacy, demo branch)** | **S15** | 1 | `protocol: ../APP-AGENT-PROTOCOL.md` + `target_branch: vercel-demo`; six bespoke tasks; no `generated_by` |
| **Product-generated (dogfood)** | S01–S14, S16–S35, S37–S40, S42 | **39** | `generated_by: work-control (S05 orchestrator)` on the `.ptl` and all four `.pd` |

> **Correction to `TOTEM_INDEX.ti`.** It records `generated-sprints: S01-S35, S37-S40, S42` and "the
> other 40 are generated". **S15 is hand-authored**, so the generated count is **39**, not 40, and
> S15 must be excluded from the set. Verified by header field, task count and task naming.

Every one of the 39 generated sprints has **exactly four** tasks named `Design… / Build… / Test… /
Ship…`. That shape is *not* by itself proof of anything — `planner.llm.ts`'s system prompt asks a
real model for the same shape. What **is** conclusive is that all 156 generated `.pd` carry
`planner.mock.ts`'s verbatim interpolated sentences under `## Objective`. See §4 / `S41-F11`.

**Standing rule: never delete, edit, renumber or re-date a generated sprint.** S37, S38, S39, S40 and
S42 are additionally under an explicit do-not-touch instruction.

---

## 2. The current meta chain — S36 and S41

| Sprint | Name | Status | Outstanding |
|--------|------|--------|-------------|
| **S36** | Closed Loop & Living Build | **CLOSED — PARTIAL** | DoD items 1 and 2 still `[~]`: no booting frontend observed, no in-product build watched |
| **S41** | Live Closed-Loop Acceptance & Yellow Demo | **CLOSED 2026-08-20 — T03 OUTSTANDING** | the live run itself never happened |

### S36 — task-level state (`.pd` `status:` corrected 2026-08-20)

| Task | Role | Status | Note |
|------|------|--------|------|
| S36-T01 FreezeInvariants | PLANNER | DONE | invariants frozen; MCP precondition recorded as **unavailable**, not satisfied |
| S36-T02 ScaffoldAtAccept | PM | DONE | proven **live** on `apps/pulse-note` (real Accept, `.ptl` + 4 `.pd`, all `gate: LOCKED`) |
| S36-T03 ScaffoldDocSkeleton | PM | DONE | proven **live** — doc skeleton seeded in the same write |
| S36-T04 GateFlipAndRealBrief | PM | DONE | E1 complete; the on-disk gate flip has never been *observed* live |
| S36-T05 RealFrontendAndBootVerify | PM | **IN_PROGRESS** | impl + regression green (8/8); **a real boot has never run** → `S41-F08` |
| S36-T06 LiveBuildStreamAndPreview | PM | **IN_PROGRESS** | impl + regression green (9/9); **never seen in a browser** → `S41-F08` |
| S36-T07 InProductSetupPreflight | PM | DONE | shipped; later found presence-only (`S41-F07`, fixed) — AI-provider check is **still** presence-only |
| S36-T08 RegressionFixture | TEST_AUTHOR | DONE | `closed-loop-contract.test.ts` + inversion test |
| S36-T09 SprintClose | QA | DONE | sprint closed with the verification posture recorded honestly |

### S41 — task-level state

| Task | Status | Note |
|------|--------|------|
| S41-T01 PreflightBringUpFreeze | DONE | readiness verdict; produced `S41-F07` |
| S41-T02 LiveChatAcceptRun | DONE | **the half that is real** — `apps/pulse-note` scaffolded by a genuine Accept |
| **S41-T03 GateGoDaemonBuildBoot** | **PLANNED — NEVER RAN** | gate → daemon → build → boot. The whole outstanding mission |
| S41-T04 EvidencePack | DONE | 10 files; 5 CAPTURED, 4 `PENDING-LIVE-RUN` by design |
| S41-T05 S36DoDClosure | DONE | annotated S36's DoD; both `[~]` items **stay** `[~]` |
| S41-T06 DemoScriptYellowTier | DONE | script written; not rehearsed against a live run |
| S41-T07 FindingsTriageAndClose | DONE | produced findings F01–F09 |

**S41 process deviation, on the record:** its charter was acceptance-first (findings become LOCKED
follow-ups, never inline fixes). Denis explicitly overrode that; `S41-F01` plus eighteen adversarial
findings were fixed in-sprint. Do not repeat the override without an equally explicit human
instruction.

---

## 3. Open findings docket

All at `<code>/apps/work-control/planning/sprints/S41-F*.pd`. As of 2026-08-20; other lanes may add
entries after this row was written.

| ID | Finding | Severity | State |
|----|---------|----------|-------|
| F01 | BootVerifyPortCollisionFalseGreen | HIGH | **FIXED** in-sprint (deviation) |
| F02 | DaemonLeaseNeverRenewedDoubleBuild | HIGH | **FIXED** |
| F03 | DaemonHeartbeatBlindDuringBuilds | MED | **FIXED** |
| **F04** | McpIntrospectionCwdRootFailsGreen | MED | **OPEN** — cwd-relative root + bare `catch {}` ⇒ a confident empty tree |
| F05 | ScaffoldedDevScriptBreaksBunInvariant | MED | **FIXED** |
| F06 | AcceptHandlerStepNumberingStale | NIT | **FIXED** |
| F07 | PreflightDatasourceIsPresenceOnly | MED | **FIXED** — AI-provider half deliberately carried forward |
| **F08** | LiveClosedLoopRunNeverExecuted | HIGH | **OPEN — the blocking item.** Blocks 3 S41 DoD items, both S36 `[~]` items and the demo recording |
| F09 | TestSuiteWritesIntoRealApps | MED | **FIXED** |
| **F10** | DatasourceProbeColdSchemaCache404 | MED-HIGH | **OPEN** — a transient startup 404 is reported as a definitive `fail`, whose fix text then recommends DDL at a live database |
| **F11** | GeneratedSprintProvenanceUnverified | HIGH | **OPEN — INVESTIGATION.** Who actually authored the 39 dogfood sprints |

### The finding that has no number yet — the silent mock fallback

Discovered live on 2026-08-20 during a real `chat → Accept` run: the provider returned
**HTTP 402, insufficient credits**, and all four LLM agents swallowed it with a bare `catch` and
returned mock output — while `/api/preflight` said `ai-provider: ok`, `wc_agents.kind` recorded
`llm`, and the UI presented the result as AI-authored. Denis's decision is **honest degradation, not
loud failure**: the mock stays as the no-key demo path, but it must announce itself every time,
everywhere. The fix is landing in the 2026-08-20 agent-honesty batch; `S41-F11` exists because that
defect puts the whole generated corpus in question retroactively.

---

## 4. What is actually proven, and what is not

The single most important table in this file. Do not soften a row.

| Claim | State | Evidence |
|-------|-------|----------|
| chat → epic → Accept scaffolds a real app | **PROVEN LIVE** | `apps/pulse-note/`, 2026-07-11 |
| the plan persists at `gate: LOCKED` (anti-auto-proceed) | **PROVEN LIVE** | 5 gate lines, 5 LOCKED, 0 OPEN — grepped, not assumed |
| the app gets its own `docs/` + `progress.md` | **PROVEN LIVE** | nine files, one shared mtime, never edited |
| human gate → daemon claim → model build | **NEVER RUN** | no `wc_activity` build row; `progress.md` has zero entries |
| the built app boots on its port | **NEVER RUN** | `:3009` refused; no `node_modules/`, no `.nuxt/` |
| live build stream + preview in-product | **NEVER SEEN** | no SSE frame captured, no screenshot exists |
| epics are proposed by a model | **PROBABLE, UNVERIFIED** | no generated epic title matches `rootMock`'s fixed nine |
| **task decomposition is done by a model** | **FALSE for all 39 generated sprints** | all 156 `.pd` carry `planner.mock.ts`'s verbatim sentences |
| `wc_agents.kind` records what actually ran | **FALSE** | written from `resolveAgentKind()` (env presence) before the call; never revised on failure |

---

## 5. Environment facts that keep biting

| Fact | Consequence |
|------|-------------|
| Docs MCP `:3000` is squatted by a foreign Next.js app | `POST /mcp` 404s. Probe the port before trusting `explain()`; label fallbacks `[static fallback]` and read knowledge from disk |
| `project.config.yml` pointed at the wrong worktree and branch until 2026-08-20 | corrected; the other worktree (`DAWWWB-app-agent`, `vercel-demo`) still exists for the Vercel demo |
| Port window is `3002–3099`, not `3002–3009` (post-`S41-F01`) | `AGENTS.md` still documents the old window and omits 3014 — **code is authoritative** |
| `pulse-note` / `focus-timer` / `habit-tracker` / `kanban-board` all declare **3009** | boot-verify now *refuses* an occupied port. Free 3009 before any live run; the refusal is correct behaviour, not a new bug |
| Invariant #5 broken on disk | 7 of 14 apps declare plain `nuxt dev` with no `bun --bun`, including the app S41 itself scaffolded |
| `bun run feature:health` exits 1 | ONE pre-existing broken ref (`core/docs/knowledge/work-control.md` — the slug is app-local by design). Expected, not a regression |
| Supabase project pauses between sessions | on restore, PostgREST answers before Postgres is ready → transient 404s. See `S41-F10` |

**Test command is `bun run test` (vitest), never bare `bun test`.** Baseline at the opening of the
2026-08-20 agent-honesty batch: **67 files / 869 tests, all passing** (S41 closed at 62/687; S36 at
45/458).

---

## 6. Next, in order

| # | Item | Why it is first |
|---|------|-----------------|
| 1 | **`S41-F08` — the live run** | chat → Accept → **human** gate → daemon → build → boot. Unblocks 3 S41 DoD items, both S36 `[~]` items and the demo. Preconditions: `:3003` up, **exactly one** runner daemon, 3009 free, a human opens the gate — never simulated |
| 2 | Ship the honest-degradation fix for the mock fallback | until it lands, every "the AI did this" claim in the product is unfalsifiable |
| 3 | **`S41-F11`** — settle the provenance of the 39 dogfood sprints | decides whether the dogfooding story is true, half-true, or needs retracting |
| 4 | **`S41-F10`** — stop the probe recommending DDL from an ambiguous signal | fires on every un-pause of the Supabase project |
| 5 | **`S41-F04`** — MCP introspection fails green | an advisory tool that confidently returns an empty tree |
| 6 | Correct `S41-INVARIANTS.md` | two claims in it are falsified (the S38/S39 gate anomaly is a *legitimate human open-gate*, not a generator defect; "config reassignment is INEFFECTIVE" is no longer true — `resolveBootPort` reads it) |
| 7 | Correct `AGENTS.md` port window + the S15 miscount in `TOTEM_INDEX.ti` | documentation drift that misleads every new session |

---

## 7. MCP rule (every sprint)

PM preflight: `explain("<slug>")` → implement → `census()` → `feature:health`.
**`:3000` is currently NOT the app-agent docs server** — read `core/docs/knowledge/<slug>.md` (or
`apps/<app>/docs/`) from disk and label the claim `[static fallback]`.

Key slugs: `layer-cascade`, `feature-knowledge`, `organization-planning`, `in-repo-planning`,
`runtime-config`, `authentication`, `integrations`, `work-control`, `todo`.

---

## 8. History — the superseded S12–S26 wave plan

Kept so it is not accidentally revived. **None of the below is a commitment.** It was authored
2026-06-21 against the external-instance planning home and the `vercel-demo` demo push, both of which
the S36/S41 in-repo chain replaced.

| Sprint | Name | Then | Now |
|--------|------|------|-----|
| S01–S11 | Deep investigation → time-machine scrubber | CLOSED | historical; summaries in `../sprints/S07–S11-SUMMARY.md` |
| S12 | Multi-User Presence | CLOSED | shipped (WS presence, AvatarStack) |
| S13 | Multi-Agent Task Handoff | CLOSED | shipped (`helper_roles`, sequential handoff) |
| S14 | Platform Hygiene + CI | "IN PROGRESS" | **SUPERSEDED** — never completed as scoped |
| S15 | Work-Control Auth / Nick Demo Polish | "IN PROGRESS" | **PARKED** — the `.ptl` on disk is the `vercel-demo` demo-polish sprint, not auth |
| S16–S26 | LLM chat, memory, notes, analytics, palette, onboarding, todo auth, Supabase prod, deploy, PWA, launch | PLANNED | **SUPERSEDED** — those numbers are now occupied by product-generated dogfood sprints |
| SDEMO | Quick Deploy (Railway) | ABORTED | abandoned — blocked by `hub:db` |
| SDEMO-B | Vercel Demo Branch | "IN PROGRESS" on `vercel-demo` | **PARKED** — superseded by the in-repo S36/S41 chain. The worktree still exists |

> **Numbering warning.** The old plan assumed S12–S26 were reserved for hand-authored sprints. They
> are not: the product generated its own S16–S35 into the same directory. New meta sprints continue
> from **S43** upward, and the roadmap no longer reserves ranges.

---

## Summaries

In-repo (current): `<code>/apps/work-control/planning/sprints/S36-SUMMARY.md`, `S41-SUMMARY.md`.
External (historical): `../sprints/S07-SUMMARY.md` … `S13-SUMMARY.md`.

*Last verified 2026-08-20 against the dev worktree on branch `write-docs-in-auto`, by direct disk
reads and `git` — MCP was unavailable, so nothing here is MCP-introspected.*
