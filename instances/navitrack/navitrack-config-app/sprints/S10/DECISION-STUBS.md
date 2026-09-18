# Decision: Legacy Advanced stubs (46 / 47 UI, 5A, Response_52)

Date: 2026-09-18
Sprint: S10-T3

## Inventory (legacy)

| Item | Legacy behavior | Rebuild stance |
|------|-----------------|----------------|
| Advanced **Command_46** send | UI send commented out | Encode ported; picker marks **stub**; send still works for tests |
| Advanced **Command_47** send | UI send commented out | Same — Standard mode owns real 47 UX |
| **Command_5A** | `Command_5A.cs` missing; `SendCommand_5A` / handle TODO empty | Header-only `encodeCommand5A`; stub label |
| **Response_52** | Parser exists; Advanced handler unwired in places | Encode 52 available; response registry already parses 52 |

## Product decision

Keep encode/parse parity for future enablement. Do **not** pretend Advanced 46/47/5A are production-complete. Surface stub note in Advanced picker UI.

## Out of scope

Firmware OTA, USB host — still absent (DUT inventory).
