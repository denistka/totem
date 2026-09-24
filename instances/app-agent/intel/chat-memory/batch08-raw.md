# batch08 — raw (pre-push gate, doc-audit, AGENT_WORKING_STANDARD)

- **Ingested:** 2026-07-10 (ingestion order #8)
- **Type:** Sam's OpenJurist-fork governance work (~Jun 11–15). **Grounds** E14 (pre-push), E10/E12 (standards + doc taxonomy). All **fork-only** (Sam's `app-agent-io-core` fork / OpenJurist), consistent with the repo-scan finding them absent from core/dev-fork/totem.
- **Participants:** Sam (via Fable/Claude output)

---

## Fable pre-push gate (grounds E14)
- Local pre-push gate now active on **Sam's machine**: `git config core.hooksPath .githooks` → every push runs **typecheck + tests**, blocks on failure (~2–3 min). Per-clone; each machine/CI runner needs the one-time config.
- **Knowledge layer verified:** every session auto-loads CLAUDE.md + AGENTS.md → point to all three standards (Work/Ship/Operate) + SECURITY + docs INDEX; no broken pointers.
- **Enforcement layer partial (the real gap):** ✅ local pre-push gate; ❌ **branch protection still off** (GitHub free-private-repo limit) — "the big one" that makes no-direct-push-to-main / no-merge-on-red / human-approval-for-prod *unbypassable* vs honor-system; 🟡 CI exists (typecheck/build) but **lint + tests aren't gates yet** and **CI bun is unpinned**.
- **Two-models rule:** never run two AI models (Opus + Fable) editing the same working tree — uncommitted edits clobber each other ("partly how the stale-doc mess happened"). Rule: one model per repo at a time, or give each its own **git worktree**.
- Config doc: `BRANCH_PROTECTION_SETUP.md`. Offered to wire CI lint/test + pin CI bun (#3, optional).

## Sam's doc-audit → AGENT_WORKING_STANDARD (grounds E10/E12)
- Committed `aaf3729` + `a67820f`, tree clean, dev server 200.
- **Audit:** 8 agents over **129 docs + ~770 scripts**. Found: no "where things go" rule (`import/analysis/` = 92-file catch-all mixing specs, session logs, business emails, generated output, a misfiled ADR); no rigor discipline (froze point-in-time facts as truth — e.g. CLAUDE.md "645,757 opinions" when DB holds ~7.65M; landmark feature marked "not yet committed" when it is; plans showing 0-of-N when shipped).
- **Built:** `core/docs/AGENT_WORKING_STANDARD.md` (framework standard) + `apps/openjurist/import/INDEX.md` (doc map w/ load-bearing "do not move without updating refs" registry).
- **Cleaned safely:** reference-gated every move (`git grep` first); 14 clean renames (session logs → `import/logs/`, Justia drafts → `import/comms/`, root scripts → `scripts/one-off|migrate/`); fixed stale CLAUDE.md facts; superseded banners; untracked `__pycache__`.
- **Deliberately did NOT:** the bigger reorg (split analysis→specs/audits, renumber ADR→`010-…`, archive shipped plans) needs atomic ref-updates across 80+ `// SEE:` sites → documented as human-approved follow-ups in `HANDOFF.md`.
- **Standards-to-share map:** `core/docs/AGENT_WORKING_STANDARD.md` (how to work) + `core/docs/RELEASE_PROTOCOL.md` (how to ship); OpenJurist state in `apps/openjurist/HANDOFF.md`.

---

## `AGENT_WORKING_STANDARD.md` — digest (reference candidate)

> Companion to `RELEASE_PROTOCOL.md`. Written from a real audit (the 645,757-vs-7.65M stale-fact case). **Overlaps heavily with Totem V6** → feeds the ROOT decision "adopt into fork vs keep Totem canonical."

**Part A — File & documentation organization.** A file's home = its TYPE + LIFESPAN, not the folder you're in. Taxonomy: living protocol (app root, evergreen, no volatile counts) · durable spec (`import/specs/`) · dated audit (`import/audits/`, date-prefixed snapshot) · plan (`import/plans/` → `done/`) · runbook (`import/runbooks/`) · session log (`import/logs/`, non-living) · business comms (`import/comms/`) · generated output (`import/run-artifacts/` or gitignore) · ADR (`core/docs/adr/0NN-…`, immutable) · feature knowledge (`core/docs/knowledge/{slug}.md`) · dir-convention README (co-located) · source data (with its ingest folder, prefer `.jsonl/.csv`) · scripts (`scripts/<intent>/`, none at root). Scripts routing: migrate/audit/one-off/sync/cron/maintenance/sql/ci/admin; `_`-prefix = helper; archive-don't-delete. **Load-bearing rule:** before `git mv` any doc/script, run `git grep -lI "<basename>"`; update all refs in the same commit or leave + tag in INDEX.

**Part B — Knowledge discipline (keep it TRUE).** Date+cite every fact; never inline a volatile count/status in a durable doc (point to live source); mark `[verified <date> via <how>]` vs `[ASSUMPTION]` vs `[TODO-VERIFY]`; one source of truth per fact (link don't duplicate); no in-flight language in specs; update the canonical doc in the SAME PR as the change; supersede ADRs with bidirectional links (immutable once Accepted); status must match reality on completion; snapshots/logs quarantined + non-living; end every change with a "what did I just make false?" `git grep` sweep.

**Part C — Verification rigor (verify, don't guess).** Verify before you assert (run `git ls-files`/`SELECT count(*)`/Read/`git grep`/hit dev server); if you can't verify, label ASSUMPTION out loud; evidence before "done" (paste command output; a green dev server ≠ typecheck); report true X-of-N progress; double-check the REAL system not a prior note (DB ≠ git); cross-check partial-truth tools; surface contradictions + reconcile same-turn; prefer just-in-time retrieval over memory.

**Adoption:** add `import/INDEX.md` (STATUS / FRESHNESS / STABLE-PATH columns + load-bearing section), point CLAUDE.md/AGENTS.md at the standard + index, migrate existing docs only via the reference gate.
