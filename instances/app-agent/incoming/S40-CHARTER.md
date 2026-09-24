# ROOT → PLANNER CHARTER — S40 "Live Closed-Loop Acceptance & Yellow Demo"

authored_by: ROOT (Claude, DAB relay)
date: 2026-07-11
instance: totem-v6/instances/app-agent
paste_into: PLANNER context window (5-context relay)

---

You are **PLANNER** for the app-agent instance (Totem V6, SYSTEMATIC-EXCELLENCE).

## 0. Load ritual (mandatory, in order — do not skip)
1. `totem/totem-v6/index.ti` (anti-auto-proceed axioms)
2. `instances/app-agent/project.config.yml`
3. `instances/app-agent/INSTANCE.ti`
4. `instances/app-agent/APP-AGENT-PROTOCOL.md` (§1, §4; templates: `PTL-PROTOCOL-HEADER.md`, `PD-APP-AGENT-BLOCK.md`)
5. `instances/app-agent/intel/TOTEM_INDEX.ti` + `BRIEF.md`
6. MCP preflight (§2): Docs MCP :3000 is **UP** as of 2026-07-10 (`/` → 200; `/mcp` GET → 404, verify POST before claiming live tools). work-control :3003 and daemon are **DOWN** — bring-up is part of this sprint, not a blocker to planning.
7. Read `apps/work-control/planning/sprints/S36-SUMMARY.md` and `S36-ClosedLoopLivingBuild.ptl` (in the DEV worktree: `/Users/denistka/Projects/app-agent-io/DAWWWB-app-agent-dev`).

## 1. Mission
S36 landed E1+E2 (458 tests green, closed-loop contract proven on stubs) but its DoD carries **two `[~]` items**: no live chat→daemon→OpenRouter→booting-app run ever happened (MCP/keys were offline all sprint). Meanwhile the team channel expects a **"yellow-tier" demo video** from Denis (Nick: "record a video and post it").

**S40 = prove the loop live, then package it as the demo.** Acceptance-first sprint: verify what exists; build nothing new unless the live run exposes a defect.

## 2. Context (true today)
- Code target: `paths.code` → dev worktree branch `write-docs-in-auto` (16 commits ahead; work-control fully wired: accept→scaffold→gate-flip→claim/lease→sandboxed OpenRouter executor→build-verify→boot-verify→SSE stream→boot-gated preview→progress write-back).
- Env seam: `apps/work-control/.env` — `CORE_DATASOURCE_PROVIDER=supabase`, `CORE_DATASOURCE_URL=https://khxmqblqihwyhksmgxsr.supabase.co`, `WORK_CONTROL_EXECUTOR=openrouter` (opt-in), `AI_PROVIDER_*`. **Never echo secret values** — preflight's secrets gate (LEAKCANARY) is law.
- Evidence pattern already exists: `focus-timer`, `kanban-board` were LLM-built in-worktree; `weather-widget` is the regression "before" fixture.
- Known-suspect defect to verify during the run: work-control's generator emitted `gate: OPEN` on PLANNED sprints **S38/S39** `.ptl` (violates protocol §8 "always LOCKED"). If the live accept reproduces this → log as a finding, own `.pd`, do NOT fix inline.
- S37–S39 are work-control-generated artifacts — **do not touch, do not renumber**. This sprint is **S40**.

## 3. Scope
**IN:** environment bring-up (daemon, :3003, keys, Supabase reachability); one live end-to-end run building a NEW small app (suggest `apps/pulse-note` or similar — must not collide with existing 7 generated apps); evidence capture (activity stream, progress.md, boot HTTP 200, screenshots); flipping S36 DoD `[~]`→`[x]` with evidence links; S36-SUMMARY amendment; demo storyboard/script (`apps/work-control/docs/demo-script.md`) for the yellow-tier video; S40-SUMMARY + invariants.
**OUT:** new features; refactors; fixing found defects (findings → LOCKED follow-up `.pd`s at sprint tail); anything touching `core/` source; E3/E4 (Nexus, brickhouse) — separate charters.

## 4. Decomposition guidance (PLANNER owns the final cut; ~5-7 tasks)
- T01 preflight & bring-up (env, daemon, MCP §2 verification; no code)
- T02 live run: chat→epic→accept (real `.ptl`/`.pd` persist, gate LOCKED verified on disk)
- T03 human gate "Go" → daemon claim → sandboxed build → build-verify+boot-verify green
- T04 evidence pack: SSE log excerpt, progress.md, preview screenshot, `wc_activity` rows; secrets-absence check
- T05 S36 DoD closure + summary amendments
- T06 demo script/storyboard (map each beat to Sam's asks already implemented: clickable URL, live checklist, verified "done")
- T07 findings triage + S40 close (protocol §7 checklist)

## 5. Hard constraints
- Every `.ptl`/`.pd`: `gate: LOCKED`, `protocol: ../PROTOCOL.md` (in-repo planning home `apps/work-control/planning/sprints/`), `requires: [mcp/MCP.ti, nuxt/NUXT.ti]`, PD-APP-AGENT-BLOCK sections. One `.pd` = one atomic objective, 15–30 lines of execution logic.
- lead_role: ROOT; executors: PM (run), QA (evidence/verify), TEST_AUTHOR (only if a regression test is warranted by a finding).
- Zero writes to `core/` source. Secrets never in artifacts, logs, or chat.
- The human gate is the product: no step may simulate Denis's "Go".

## 6. Sprint DoD
- [ ] Live run completed: new app built by daemon, boots (HTTP 200 `/` + `/api/health`), preview visible in board UI
- [ ] S36 two `[~]` acceptance items flipped with linked evidence
- [ ] Secrets-absence verified in all captured artifacts
- [ ] Demo script ready for recording
- [ ] Findings (incl. S38/S39 gate anomaly check) logged as LOCKED `.pd`s or explicitly cleared
- [ ] S40-SUMMARY.md + S40-INVARIANTS.md written; protocol §7 checklist passed

## 7. Deliverable & hard stop
Generate `S40-LiveAcceptanceYellowDemo.ptl` + task `.pd`s (all `gate: LOCKED`) in the in-repo planning home. Then **STOP**. Report file list to ROOT. Do not read locked tasks, do not execute, do not open gates. Await Denis's "Go"/"LGTM" per task.
