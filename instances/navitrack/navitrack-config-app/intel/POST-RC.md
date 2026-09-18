# Post-RC epic E12 — planned gaps

After S12 RC: feature-complete under FakeBle/MSW. This epic closes documented gaps.

| Sprint | Focus | Amends |
|--------|--------|--------|
| **S13** Native Device Stack | Real Tauri BLE, OS permissions, wake-lock, system share | — (adapters already exist) |
| **S14** Advanced Stubs Completion | 46 / Advanced-47 / 5A / Response_52 | S10 `DECISION-STUBS.md` |
| **S15** Graduation Multi-Point DUT Write | Graduation → device via Command_47 | S09 `DECISION.md`, S12 invariant “never write” |

**Hard rules unchanged:** `TEST-COVERAGE-MANDATE.md`, `CODE-QUALITY-MANDATE.md`, bun, Fake/MSW in unit tests.

All S13–S15: `gate: CLOSED` (executed 2026-09-18).
