# CROP Composite — Cross-Repo Invariants

Frozen decisions that apply across two or more member repositories.
Per-repo invariants live in each sub-instance's own `INVARIANTS.md`.

## Conventions

- **Sprint numbering is composite-level.** S01, S02, ... live in `instances/crop/sprints/`. Member repos do NOT maintain independent sprint counters.
- **Every track and task declares `repos: [...]`** — an array of member ids (`crop-front`, `crop-parts-services`, `crop-search-hono`). Cross-repo tracks are allowed.
- **Out-of-scope issues are TRANSFERRED, never closed.** See `ROUTING.ti`. Past mistake: S01 closed 8 backend issues OOS from crop-front (#156, #524, #564, #570, #565, #970, #971, #972) — should have been transferred to `crop-parts-services`.

## Product contracts (cross-repo APIs)

- **Delivery API direct URL** (`DELIVERY_API_DIRECT_URL`) — crop-front calls crop-parts-services/services/delivery directly, bypassing gateway. Both repos must keep the contract schema in sync.
- **Address strings are PII** anywhere they travel between repos. No logs of raw address. Cache keys must be hashed. Retention controlled. (S02 invariant.)
- **CROP-search-hono boundary** — never called from checkout/shipping flow. Address validation belongs to `crop-parts-services/services/delivery`. Verified S02, 2026-05-29.
- **search-hono PII** — query strings in `/search` endpoint may contain user-entered free text; treat as PII for logging policy (no raw query logs).

## Triage & QA

- **Never auto-close without reproducible evidence.** Inherited from S01 ISSUE_TRIAGE_RULES.
- **"Not reproducible now" ≠ "fixed"** — classify as `NEEDS-HUMAN-VERIFY`.
- **Mobile-only findings → `NEEDS-HUMAN-DEVICE`**, never skip in triage.
- **Closure actions are proposal-only until `push issues to github` command.** (Per `project.config.yml`.)

## Git workflow (all member repos)

- **All branches must be cut from `dev`, never from `main`.** Before creating any branch: `git fetch origin dev && git checkout origin/dev -b <branch-name>`.
- **All PRs target `dev`, not `main`.** Vercel auto-deploys `main`; `dev` is the integration branch. PRs to `main` are rejected.
- **Check `dev` before starting any task.** Sprint work may already be merged to `dev` even if `main` is behind. A task listed as "planned" may already be done on `dev` — always check `git log origin/dev` first.
- **Past mistake (S04, 2026-06-02):** PR #1479 was opened against `main` instead of `dev` for the Clerk authz fix. It was closed and re-done correctly. The fix was already on `dev` (ef02d15c).

## Historical pointers

- S01 (2026-05-28) — Open bug backlog triage on `crop-front`. 25 issues closed under human approval; 8 backend closures should retroactively be revisited as transfer candidates.
- S02 (2026-05-29) — Address validation perf investigation; cross-repo (crop-front observation, crop-parts-services root cause). 4 tracks LOCKED awaiting impl approval for S03.
