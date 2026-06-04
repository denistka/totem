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

## V2 PR review workflow (S06, frozen 2026-06-02)

Team decision, confirmed by Vova's message 2026-06-03 and applied in practice.

- **`dev` is the V2 base (confirmed Vova, 2026-06-03).** The foundation (PR#1533) is already merged into `dev`. No separate `v2` integration branch — everything integrates into `dev` step by step.
- **Branch base rule:** cut from `dev` by default. If a task builds on an in-review redesign PR, branch off that working branch directly (e.g. `feat/ct-1527-diagrams-brand-redesign` for diagrams tasks, `feat/ct-1529-brand-hub-v2` for hub tasks). This avoids waiting for the base PR to merge.
- **PR chain:** Dev (Oleg/Daniil) opens PR on branch cut from `dev` (or working branch above) → Denis runs locally + verifies acceptance criteria → Vova does final UI/UX review → Vova merges to `dev` → deploy to `crop-dev.app` → smoke → prod.
- **Denis's PASS comment is Vova's merge signal.** Do not merge without it.
- **Stacked PR pattern (Vova):** foundation PR first (purely additive, all CI green) → feature PRs stacked on foundation branch. Stacked PRs auto-retarget to `dev` after foundation merges. Full CI suite only runs after retarget — Socket/Vercel/soft-404 running on a stacked PR is expected and not a concern.
- **Denis's local checklist:** `gh pr checkout N` → `bun run type-check` → `bunx vitest run {changed-paths}` → `git diff origin/{base} -- {key-files}` → check style violations manually → comment PASS/FAIL with file:line → `gh pr review N --approve`.
- **Impact statement required** on every issue and PR body — one paragraph explaining why, not what. John reads 10 issue titles in 2 minutes.
- **Small bugs found during scope:** fix inline + note in PR body. Never create separate issues (issue-sprawl rule).

## Brand code invariants (verified against live code, 2026-06-03)

- **Ferris is `FRR`, never `FER`.** `FER` exists only as a lowercase alias in `brand-registry.ts`. All tests, registry entries, and unit assertions must use `FRR`.
- **Carried whitelist (`STATIC_CARRIED_WHITELIST` in vocabulary-cache.ts)** must include `VNT`, `FRR`, `MCH`, `MAR` — cold-start fallback before PG `brand_vocabulary` loads. As of 2026-06-03 only CNH-family codes were present; all four added in S06-A1.
- **Activating a new brand in CROP-front** requires changes in **4 files**, not 1: `brand-registry.ts` (flip `available: false → true`) + `manufacturer-config.ts` (add config entry) + `manufacturer-config.test.ts` (update invariant snapshots) + `brand-registry.test.ts` (update EXPECTED snapshot + parity block).
- **`seoIndexed` stays `false`** for all non-NH brands until John gives explicit approval. Never flip to `true` autonomously.
- **Equipment-type imagery** (`lib/equipment/type-image.ts` + `public/images/equipment-types/`) is already shipped and wired into `TypeCard`. Do not re-implement.

## V2 style conventions to enforce on PR review (S06)

Recurring violations in new brand components — CI does not catch these; Denis flags them:
- `bg-white` hardcoded → `bg-background` or DS token
- `transition-colors` → `transition-all`
- v3 focus ring `ring-2 ring-oem ring-offset-2` → v4 `focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`
- Issue numbers in JSDoc/CSS comments → strip; belong in PR description

These are non-blocking for purely additive PRs (no page consumers yet) but must be resolved before components are wired into live pages.

## Historical pointers

- S01 (2026-05-28) — Open bug backlog triage on `crop-front`. 25 issues closed under human approval; 8 backend closures should retroactively be revisited as transfer candidates.
- S02 (2026-05-29) — Address validation perf investigation; cross-repo (crop-front observation, crop-parts-services root cause). 4 tracks LOCKED awaiting impl approval for S03.
