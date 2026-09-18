# CODE QUALITY — POST-SPRINT MANDATE (navitrack-config-app)

**NON-NEGOTIABLE.** After **every** sprint (S01–S12), before the sprint is closed:

## Required review

1. **Shared UI only** — Prefer `src/ui/*` primitives (Button, Input, Switch, BottomModal, Logo, ThemeToggle, etc.). Do **not** invent one-off styled controls when an existing kit component fits. Extract repeated patterns into `src/ui` when they appear twice+.
2. **React best practices** — Composition over god-components; hooks for side effects; no unnecessary re-renders on BLE/telemetry paths; typed props; file size / modularity aligned with Totem quality gates (split oversized files).
3. **Tauri best practices** — Thin `src-tauri` surface; capabilities least-privilege; native work behind adapters (`src/ble`, share, keep-awake); no secrets in frontend; plugin permissions only when needed.
4. **Design-system consistency** — Tokens from `src/styles/theme.css` / Tailwind semantic colors; glass/touch utilities; same visual identity as `navitrack-mobile-apps`.
5. **Refactor when needed** — If the sprint introduced duplication, leaky boundaries, dead code, or anti-patterns, **refactor in the same sprint closeout** (or a locked follow-up `.pd` opened immediately). Do not bank tech debt across sprints without an explicit task.
6. **Tests still green** — Refactors must keep `bun run test` passing (`TEST-COVERAGE-MANDATE.md`).

## Closeout ritual (every sprint)

| Step | Action |
|------|--------|
| 1 | Diff sprint outputs vs UI kit / architecture |
| 2 | List smells (dup UI, fat components, Tauri/plugin sprawl) |
| 3 | Refactor or open atomic cleanup `.pd` **before** next sprint starts |
| 4 | Optional: invoke `CODEMAP_QUALITY_ADVISOR` for structural verdict |
| 5 | Confirm `bun run test` (+ lint if configured) |

## Roles

- **QA / ARCHITECT / CODEMAP_QUALITY_ADVISOR** own the gate.
- PM does not mark sprint done until quality closeout is recorded (note in sprint folder or next `S*-INVARIANTS.md` if decisions freeze).
