# S82 — Hooks normalization (TS3)

**Aligns with:** `S82-ARCHITECT-V4-FULL-OPTIMIZATION.ptl` `architecture_rules` (hooks domain-scoped or shared).

## Guidelines

1. **Shared / agnostic** — Effects and formatters used by multiple features live under `src/hooks/` or `src/lib/` with no screen imports. Examples: `useFormatDurationFromMs`, `useSortedItems`, `useLocalSettings`.
2. **Feature-scoped** — `use*Screen`, `use*Form` stay under `src/screens/<feature>/hooks/` and may call shared hooks; they must not import sibling feature hooks.
3. **Naming** — Prefer `use<Feature><Concern>` for screen orchestrators (`useTrackingState`, `useReportsFormState`). Avoid “hybrid” hooks that mix unrelated domains without an explicit shared name (`useFormatDurationFromMs` is explicit).
4. **Merges** — When two hooks encode the same policy (e.g. duration formatting), extract to one shared hook and keep feature hooks thin.

## Changes this sprint

| Item | Action |
|------|--------|
| Duration i18n formatting | **Merged** into `useFormatDurationFromMs` (used by `useHistoryTimeline`, `useTrackingState`) |
| Date range initial state | **Shared** helpers `initialRangeStartMidnight` / `initialRangeEndEndOfDay` (reports vs tracking forms) |

## Follow-up

- Audit `use*Screen` hooks for cross-feature imports (pair with TM4).
- Document any exception with owner in this file if a hybrid hook is intentionally retained.
