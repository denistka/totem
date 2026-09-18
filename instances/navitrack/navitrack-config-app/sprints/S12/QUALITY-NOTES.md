# S12 Quality Notes

Review date: 2026-09-18

## Checklist

| Item | Verdict |
|------|---------|
| E2E | `e2e/s12-journeys.spec.ts` + existing sensors-scan |
| CI | `.github/workflows/ci.yml` — unit then e2e |
| Parity | Checklist filled honestly |
| Freeze | S12-INVARIANTS.md + RC-NOTES.md |

## Smells / actions

- Playwright webServer uses HTTPS URL with ignoreHTTPSErrors — matches vite basicSsl
- Totem docs committed in totem-v6 repo separately from app CI
