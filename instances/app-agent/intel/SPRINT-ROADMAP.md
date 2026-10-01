# Sprint Roadmap — app-agent instance

> **PLANNER index.** Rewritten 2026-08-20 by QA; **re-synced 2026-10-01** against the disk state on
> Denis's Mac (`DAWWWB-app-agent-dev`, branch `write-docs-in-auto`) and `intel/TOTEM_INDEX.ti`. The
> 2026-08-20 version still described a 42-`.ptl` corpus and a "never delete a generated sprint" rule —
> both superseded by S43-T11 (ruling R4). Do not revive deleted plan numbers from memory.

---

## 0. Where planning actually lives (read this before authoring anything)

Since **S36** the hand-authored ROOT→PLANNER chain lives **in the repo, next to the code**.

| Artifact | Location | Status |
|----------|----------|--------|
| Planning home | `<code>/apps/work-control/planning/` | **AUTHORITATIVE** |
| Sprints (`.ptl` / `.pd` / `S*-SUMMARY.md`) | `<code>/apps/work-control/planning/sprints/` | **AUTHORITATIVE** |
| Invariants | `<code>/apps/work-control/planning/S43-INVARIANTS.md` (active; supersedes S36/S41) | **AUTHORITATIVE** |
| Evidence packs | `<code>/apps/work-control/planning/evidence/` | **AUTHORITATIVE** |
| Decisions | `<code>/apps/work-control/planning/decisions/` | **AUTHORITATIVE** |
| Protocol redirect | `<code>/apps/work-control/planning/PROTOCOL.md` → `/company/totem-governance` | **AUTHORITATIVE** |
| This external instance's `../sprints/` | `totem/…/instances/app-agent/sprints/` | **HISTORY ONLY — do not author here** |
| Per-app generated plans | `<code>/apps/<targetApp>/planning/sprints/` | written by Accept |

`<code>` = `../../../../app-agent-io/DAWWWB-app-agent-dev` — the **dev worktree**, branch
`write-docs-in-auto`. Not `DAWWWB-app-agent`; not `test-app`. Verify with `git branch --show-current`
before trusting any path in any file, including this one.

Legacy fallback `WORK_CONTROL_TOTEM_PATH` still resolves to the external totem archive and the suite
still logs a deprecation line for it. Do not build on it.

---

## 1. Sprint corpus on disk — only five `.ptl` remain

As of **2026-10-01**, `<code>/apps/work-control/planning/sprints/` holds **5** `.ptl` only:

| Class | Sprints | Count | How to tell |
|-------|---------|-------|-------------|
| **Hand-authored meta** | **S36**, **S41**, **S43**, **S44** | 4 | `authored_by: ROOT→PLANNER chain (hand-authored, not Accept-generated)` |
| **Hand-authored (legacy, demo branch)** | **S15** | 1 | `protocol: ../APP-AGENT-PROTOCOL.md` + `target_branch: vercel-demo`; six bespoke tasks; no `generated_by` |

### What happened to the generated corpus (S43-T11 / ruling R4)

On **2026-08-24**, S43-T11 deleted the mock-generated dogfood corpus under ruling R4 (commit `8d8996c`:
195 files, 7,410 deletions). Before deletion the tree held dozens of product-generated sprints
(Accept/`planner.mock.ts` fingerprint — proven 39-for-39). **Those plans are gone from disk; do not
re-list or invent their numbers here.** Provenance evidence for the deleted set is preserved at
`<planning-home>/CORPUS-PROVENANCE-EVIDENCE.md`.

**Standing rule (updated 2026-10-01):**

- **Deletion of the mock-generated corpus already happened** under explicit ruling R4 (S43-T11). That
  was a one-time, human-authorized cleanup — not a standing license to prune plans.
- For anything that **survives** (the five `.ptl` above, their `.pd`, summaries, evidence): **do not
  edit, renumber, or re-date** without an explicit human instruction.
- Do **not** recreate deleted generated plans from memory or from old Totem indexes that still quote
  "42 `.ptl`" / "39 generated".

---

## 2. The current meta chain — S36 → S41 → S43 → S44

| Sprint | Name | Status | Outstanding |
|--------|------|--------|-------------|
| **S36** | Closed Loop & Living Build | **CLOSED — PARTIAL** | DoD residue tracked under S43-T02 bookkeeping |
| **S41** | Live Closed-Loop Acceptance & Yellow Demo | **CLOSED 2026-08-20** | Live-run half answered in substance by S43-T02; `.pd` closure + evidence links still owed |
| **S43** | Claude CLI Overlay / closed loop | **CLOSED 2026-08-24** | Loop proven live (`apps/app2` on :3007). T02 residue + S43-F01..F08 docket |
| **S44** | Perfect Upstream PR | **CLOSED 2026-08-25** | Branch built; **`pushed: false`**. Base now stale — see TOTEM_INDEX post-S44 |

### S43 — one-line proof (do not soften)

Human gate → daemon → `claude-cli` build → boot-verify → `apps/app2` serving `:3007`, observed
2026-08-24. First non-mock decomposition-and-build in this repository. Details:
`<planning-home>/sprints/S43-SUMMARY.md` and `intel/TOTEM_INDEX.ti`.

### S44 — one-line status

Upstream PR prepared on `feat/work-control-base-app` @ `880f16f3` against develop base `bd1d8199`
(fetched 2026-08-25). **Not pushed.** After the 2026-09-02 upstream fetch, develop is **643** commits
ahead of main (was 317 at S44 close) — the PR base is stale. See TOTEM_INDEX `upstream_pr` + post-S44.

---

## 3. Open findings docket (carry-forward)

Still live under `<code>/apps/work-control/planning/sprints/` unless a later session closed them.
Authoritative list: `intel/TOTEM_INDEX.ti` `open-findings`. Headline carry-forwards as of 2026-10-01:

| ID | Finding | Severity | State |
|----|---------|----------|-------|
| **S41-F08** | LiveClosedLoopRunNeverExecuted | HIGH | **Answered in substance by S43-T02**; `.pd` still PLANNED/LOCKED pending closure + evidence |
| **S41-F10** | DatasourceProbeColdSchemaCache404 | MED-HIGH | **OPEN** |
| **S41-F11** | GeneratedSprintProvenanceUnverified | HIGH | Corpus deleted; fingerprint evidence preserved; provenance-at-write still a standing requirement |
| **S41-F15** | WorktreeIsolationForBuildAgentWrites | — | **OPEN** |
| **S43-F01..F08** | (guardian schema, metrics, lease scope, boot badge, …) | various | All **LOCKED**, none fixed in-sprint |

---

## 4. What is actually proven, and what is not

| Claim | State | Evidence |
|-------|-------|----------|
| chat → epic → Accept scaffolds a real app | **PROVEN LIVE** | `apps/pulse-note/` (2026-07-11); later runs |
| the plan persists at `gate: LOCKED` (anti-auto-proceed) | **PROVEN LIVE** | gate lines on Accept-written plans |
| human gate → daemon → **claude-cli** build → boot | **PROVEN LIVE** | S43-T02, 2026-08-24 — `apps/app2` on :3007 |
| live build stream + preview in-product | see S43 proof ledger | do not claim beyond `S43-SUMMARY.md` |
| pre-S43 generated corpus was model-authored | **FALSE** | 39-for-39 `planner.mock.ts` fingerprint; corpus deleted S43-T11 |

---

## 5. Environment facts that keep biting

| Fact | Consequence |
|------|-------------|
| Port window is `3002–3099` (post-`S41-F01`) | docs/MCP `3000`, control `3001`, work-control `3003`, demos `3010–3014` reserved |
| Build plane default is `claude-cli` (R1); OpenRouter demoted | mock is honesty-fallback only — must announce itself |
| `project.config.yml` invariants must point at **S43-INVARIANTS.md** | not `./S12-INVARIANTS.md` (historical only in this Totem tree) |
| Upstream `origin/develop` re-fetched 2026-09-02 | **643** ahead of main — S44 PR base `bd1d8199` is stale |
| Dev worktree carries large uncommitted / unpushed work | see TOTEM_INDEX post-S44 (2026-10-01) |

**Test command is `bun run test` (vitest), never bare `bun test`.**

---

## 6. Next, in order (post-S44 — 2026-10-01)

Authoritative open-item list lives in `intel/TOTEM_INDEX.ti` § post-S44. Headline order:

| # | Item | Why |
|---|------|-----|
| 1 | Rebase / refresh S44 upstream PR base (develop now 643 ahead) and decide push | `pushed: false`; base stale since 2026-09-02 fetch |
| 2 | Deal with unpushed `feat/work-control-base-app` + 184 uncommitted / 7 unpushed on `write-docs-in-auto` | largest structural risk on the live checkout |
| 3 | Commit or discard S43 UI deletions (FleetGrid, BrickHouse, dashboard) | present on disk, not in history |
| 4 | Record `apps/todo-app` (created 2026-09-23) in planning / dogfood story | exists; not in prior Totem state |
| 5 | Fix README `packages/` reference (folder absent; upstream develop already fixed) | docs drift vs disk |
| 6 | S43-T02 residue + S43-F* / S41-F10 / S41-F15 docket | still owed from S43 close |

---

## 7. MCP rule (every sprint)

PM preflight: `explain("<slug>")` → implement → `census()` → `feature:health`.
Probe `:3000` before trusting live MCP; label disk reads `[static fallback]`.

Key slugs: `layer-cascade`, `feature-knowledge`, `organization-planning`, `in-repo-planning`,
`runtime-config`, `authentication`, `integrations`, `work-control`, `todo`.

Live equivalents for the build plane (prefer over stale Totem deep-dives):

- `<code>/apps/work-control/docs/build-loop.md`
- `<code>/apps/work-control/docs/agent-runtime.md`

---

## 8. History — the superseded S12–S26 wave plan

Kept so it is not accidentally revived. **None of the below is a commitment.** It was authored
2026-06-21 against the external-instance planning home and the `vercel-demo` demo push, both of which
the S36+ in-repo chain replaced.

| Sprint | Name | Then | Now |
|--------|------|------|-----|
| S01–S11 | Deep investigation → time-machine scrubber | CLOSED | historical; summaries in `../sprints/S07–S11-SUMMARY.md` |
| S12 | Multi-User Presence | CLOSED | shipped (WS presence, AvatarStack) |
| S13 | Multi-Agent Task Handoff | CLOSED | shipped (`helper_roles`, sequential handoff) |
| S14 | Platform Hygiene + CI | "IN PROGRESS" | **SUPERSEDED** — never completed as scoped |
| S15 | Work-Control Auth / Nick Demo Polish | "IN PROGRESS" | **PARKED** — the surviving `.ptl` is `vercel-demo` demo-polish, not auth |
| S16–S26 | LLM chat, memory, notes, analytics, palette, onboarding, todo auth, Supabase prod, deploy, PWA, launch | PLANNED | **SUPERSEDED** — numbers later occupied by product-generated dogfood sprints, then those generated plans were **deleted** in S43-T11 |
| SDEMO | Quick Deploy (Railway) | ABORTED | abandoned — blocked by `hub:db` |
| SDEMO-B | Vercel Demo Branch | "IN PROGRESS" on `vercel-demo` | **PARKED** — superseded by the in-repo S36+ chain. The worktree still exists |

> **Numbering warning.** New meta sprints continue from **S45** upward. Do not reserve ranges, and do
> not restore deleted generated sprint numbers.

---

## Summaries

In-repo (current): `<code>/apps/work-control/planning/sprints/S36-SUMMARY.md`, `S41-SUMMARY.md`,
`S43-SUMMARY.md`; `<code>/apps/work-control/planning/S44-SUMMARY.md`.
External (historical): `../sprints/S07-SUMMARY.md` … `S13-SUMMARY.md`.

*Last verified 2026-10-01 against the analysis of Denis's Mac (`DAWWWB-app-agent-dev` /
`write-docs-in-auto`) and this Totem instance — facts from that machine, not from GitHub alone.*
