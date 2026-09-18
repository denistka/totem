# TEST COVERAGE — HARD RULE (navitrack-config-app)

**NON-NEGOTIABLE.** Applies to every epic, sprint, and `.pd` for the DUT port.

1. **Every new module / screen / protocol opcode / BLE behavior ships with tests in the same task.**
2. **Done criteria MUST include** `bun run test` green for co-located `*.test.ts(x)` covering the change.
3. **HTTP:** MSW only — never live `api.fcs.navitrack.com.ua` in unit/integration.
4. **BLE:** Fake adapter / recorded frames in Vitest; real-device checks are optional out-of-band.
5. **UI flows:** Playwright e2e for hub journeys; protocol edge cases stay in Vitest.
6. **No merge / no sprint close** if new code lacks tests or `bun run test` fails.
7. Pattern SSOT: `intel/TESTING.md` (fintech-dashboard pyramid + React Testing Library).

Agents: if a `.pd` omits test `done:` items, treat the task as incomplete and add them before coding.
