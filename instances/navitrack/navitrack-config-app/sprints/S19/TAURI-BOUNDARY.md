# S19-T5 Tauri BLE factory boundary

No live radio. S18-T0 stays deferred. This note does not compile or upload a release (that is T10).

## Verified (unit selection only)

`resolveUseFakeBle` in `src/ble/factory.ts`, asserted by `src/ble/factory.test.ts`:

| Environment | Adapter |
| --- | --- |
| Vitest (`import.meta.env.VITEST` or `MODE=test`) | FakeBleAdapter |
| Web (`isTauri()` false) | FakeBleAdapter |
| `VITE_FORCE_FAKE_BLE=1` | FakeBleAdapter, including if Tauri were present |
| Inside Tauri, not Vitest, force flag off | TauriBleAdapter |

`createBleAdapter()` follows that matrix. `createDemoFakeAdapter()` seeds the web demo devices and is not the Tauri path.

## Still needs a DUT

- Hardware scan, connect, and read/write on a real sensor
- `macos:dev` smoke against a radio
- iOS and Android BLE permission and scan on a device

Selection was not changed. The matrix already matches the rule above.
