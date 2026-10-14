# S21 TQ — Quality notes

- `bun run test`: 79 files, 340 tests pass. `tsc -b` is clean.
- Five tests were already failing on HEAD (left stale by commits e47a5d4 and 1b8990c), fixed in this sprint:
  - GraduationTab, 3 tests: the soft re-enter auth (unlocked + password) used up the queued frames. The tests now open the BLE session first.
  - MobileShell "Sensors → catalog": an empty catalog jumps to Scan by design. The test now saves a sensor first.
  - MobileShell "sensor-session tablist": the session tabs are hidden until unlock by design. The test now unlocks first.
- Lint: the repo-wide `eslint .` already fails (175 errors) and is not a gate. The one error in a changed file (`_mtu` unused in tauri-adapter.ts) predates S21.
- UI reuse: home tiles keep their existing classes; no new primitive was needed. The caret fix lives in the shared glass.css, so every `glass-input` field gets it.
- Debt to keep tracking: SensorSessionScreen has cognitive complexity 24 (limit 15). MobileShell.test has no `beforeEach` store reset.
