# S21 INVARIANTS — Field Feedback Bugs

Depends: [`S20-INVARIANTS.md`](S20-INVARIANTS.md). Epic **E18**. Date: 2026-10-13.

1. **A BLE scan never overlaps a GATT connect.** `ensureSession` stops the scan first.
2. **A connect failure is not an auth failure.** If no session came up, the status is `connectFail`. `authFail` is reserved for a sensor that answered and rejected the password.
3. **No compositing on text inputs.** Do not put `transform`, `will-change` or `contain` on `.glass-input` or any `<input>`. On mobile WebViews this draws the caret in the wrong place.
4. **User-facing copy says "сенсор/датчик", never "DUT", and never suggests the password 111.** Enforced by `src/locales/locale-copy.test.ts`. Internal ids and keys may still use `dut`.
5. **Home tiles are centered,** with a 56px icon badge and a 28px glyph.

S18, S19 and S20 stay closed. The S18-T0 live smoke is still deferred.

## Release (2026-10-14)

- The user approved a TestFlight build, which lifts S20's "no App Store upload" rule. `ios:build:appstore` is now allowed.
- 0.1.2 IPA: signed with Apple Distribution (team 872FTL4Y84), bundle id `com.navitrack.configurator`. The upload is done by hand (Transporter/Xcode) because there is no ASC API key on this host.
