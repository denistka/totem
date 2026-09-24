# batch10 — raw (branch-protection rulesets + framework-feedback)

- **Ingested:** 2026-07-10 (ingestion order #10)
- **Type:** Angelica's branch-protection delivery + Sam's `APP-AGENT-FRAMEWORK-FEEDBACK-2026-06-12.md` (~Jun 11–12). Grounds branch-protection + adds the multi-agent STATUS-board pattern.
- **Note:** a re-pasted `SECURITY_HANDOFF.md` in the same burst = **duplicate of [batch09](batch09-raw.md)** (already captured).
- **New:** Sam's GitHub handle **`samdeskin`** (fork `samdeskin/app-agent-io-core-OpenJurist`).

---

## Angelica — branch-protection rulesets (Jun 11 9:49 PM)
- Rules set at `core/settings/rules`. Non-standard restrictions (only **develop→main**, only **feature→develop**) enforced via **required GitHub Action pass**: `.github/workflows/only-develop-to-main.yml` + `branch-name-rules.yml`.
- **"Can't attach these until we upgrade, but they're ready to go."** → confirms the branch-protection config exists but is **inert on the free private plan** (needs GitHub Teams, [batch06](batch06-raw.md)).
- Asked what other Actions should be required checks before merge.

## Sam — `APP-AGENT-FRAMEWORK-FEEDBACK-2026-06-12.md`
Context: *"After I asked Fable to make the rules, it still did not follow them"* → asked it to clean up MD files + write feedback for core devs. Learnings from running many AI context windows on one app for weeks:

1. **State rot** — "where the project is now" scattered across CLAUDE.md/RELEASE.md/HANDOFF + private agent memory, drifted independently (one stale note nearly caused re-planned prod work; a count ~10× stale copied into 5+ docs). **Fix: `STATUS.md` — one shared state board per app**; read-first every session; **update in the SAME PR as any state-changing work** (so "current" = whatever main says; other windows inherit on fetch); every fact dated+sourced or `[TODO-VERIFY]`; a merge conflict in STATUS.md is a *feature* (two streams reconciling).
2. **Rules without gates don't hold** — the doc-standard was violated within a day by the same kind of agent it was written for. **Fix: `scripts/ci/docs-lint.ts`** (~150 lines, bun, no deps) — pre-push + CI + full-tree-strict. Rules: **F1** logs carry `status: snapshot` · **F2** INDEX "stale" table entries actually carry a superseded banner (lint parses INDEX live) · **F3** living docs contain no in-flight language · **W1** new import/ doc gets an INDEX row · **W2** comma-grouped numbers in CLAUDE.md (volatile counts) · **W3** taxonomy.
3. **Non-Claude agents enter via `AGENTS.md`** (CLAUDE.md is Claude-only; Codex/Cursor read AGENTS.md) → apps need both, cross-referenced, routing to STATUS.md first.

**4 bug classes to guard in the template:** unanchored gitignore dir rules (`logs/` ate `import/logs/`) → anchor `/logs/`; stale-base branching → `git fetch` before every `checkout -b` (release-protocol stage 1); registry-claims-vs-reality → mechanical checker (lint F2); same-fact-in-N-docs → structural fix (one board + pointers).

**Recommendations (priority):** scaffold `STATUS.md`+`AGENTS.md` into the app template; lift `docs-lint` into core; adopt the two standards upstream + add STATUS-board rule + fetch-before-branch + anchored-gitignore; template the `import/` taxonomy. Honest limit: "update STATUS.md in same PR" needs **server-side branch protection + required reviews** to stick — "treat that as part of the pattern, not optional."

Reference impl: `apps/openjurist` (PRs **#20–#26**, 2026-06-12) on `samdeskin/app-agent-io-core-OpenJurist`.

---

## Significance
- Angelica's rulesets + Sam's "gates make rules stick" both point at the **same unmet dependency: GitHub Teams for enforceable branch protection** — the missing control behind the ~650-commit accident and the fork data-leak.
- The **STATUS.md shared-state-board** pattern is essentially what Totem's `INVARIANTS.md` + `S*-SUMMARY.md` + gate flow already do → strong convergence; reinforces the "adopt vs Totem-canonical" ROOT decision.
