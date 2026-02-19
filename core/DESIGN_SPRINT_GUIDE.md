role: Design & UI Sprint Implementation Guide
focus: reuse, atomic-pattern, ref-first, invariant-safety
extends: ARCHITECT.ti

principles:
reuse: "Don't multiply. Extend existing components/tokens. ❌ Inline Glass -> ✅ GlassCard."
context: "Analyze base entities (tokens, wrappers) before changes. No partial updates."
ref-first: "Build ONE reference screen (e.g. Login) end-to-end; replicate pattern."
order: "Tokens -> Components -> Compose. No screen-level hardcoding."
safety: "INVARIANTS.md gates all changes. Block regressions."
atomic: "File limit: 100 lines. `splitIf > 100`. Parent (State) -> Child (UI)."

implementation-gates:

- Audit: `npm run lint` + Dedup Audit (find repeats).
- Design: Extract new tokens to `index.css :root` or `tailwind.config`.
- Polish: Apply visual tweaks ONE by ONE. Build + theme check after each.
- Motion: `motion-safe:` only. Respect `prefers-reduced-motion`.

checklists:
pre-sprint: - [ ] `INVARIANTS.md` exists. - [ ] Reference screen identified. - [ ] Duplicates cataloged for extraction.
active: - [ ] Max 100 lines per component. - [ ] One-handed mobile ergonomics. - [ ] Chrome + Safari cross-check.

common-mistakes:

- ❌ Ad-hoc styles -> ✅ Create @/components/ui first.
- ❌ Hardcoded colors -> ✅ index.css variables.
- ❌ Batch CSS tweaks -> ✅ Single change + Build + Reset.
- ❌ Fragmented UI -> ✅ Audit (T1) before applying (T4).
- ❌ God components -> ✅ Split at 100 lines.

track-patterns:
Compound Sprint: Track A (Sizing) -> Track B (Dedup) -> Track C (Polish).
Rule: Final QA MUST cover ALL tracks.
