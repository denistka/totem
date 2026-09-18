# S12 Invariants (RC freeze)

Date: 2026-09-18
Depends: S01-INVARIANTS.md (still authoritative for BLE UUIDs, FCS host, hub IA)

## Runtime mirror

`navitrack-config-app/src/config/invariants.ts` remains the code SSOT for:

- `PACKAGE_MANAGER = bun`
- FCS base + paths
- BLE service/characteristic UUIDs, name filters
- Protocol prefixes 0x31 / 0x3E, BLE net 0xFF
- Hub + sensor-session tab IDs
- Test mandate flags (co-located Vitest, no live FCS, FakeBle)

## Added by later sprints (do not regress)

| Invariant | Value / rule |
|-----------|----------------|
| Graduation → DUT | MAY write multi-point via `Command_47` (S15 amendment) |
| Advanced tab | Visible only if `isAdvancedModeTabEnabled` |
| Unit BLE | FakeBleAdapter only |
| Unit HTTP | MSW only vs `api.fcs.navitrack.com.ua` |
| CI | `bun run test` required; e2e on PR |

## RC stance

Feature-complete vs DUT inventory for configurator flows under Fake/MSW. Native radio + OS integrations remain adapter-backed stubs until device QA.
