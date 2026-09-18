# Testing strategy — navitrack-config-app

Reference pattern: `quintagroup/fintech-dashboard`  
Adaptations: **React** (not Vue) · **bun** (not pnpm) · BLE/protocol unit tests for DUT domain

---

## Pyramid (same shape as fintech-dashboard)

| Layer | Tool | What |
|-------|------|------|
| Unit / component | **Vitest** + **happy-dom** + **@testing-library/react** | Utils, UI primitives, hooks, protocol encode/decode/CRC |
| Integration (HTTP) | Vitest + **MSW** | FCS API (`GetUserSettings`, `SendLogMessage`) mocked via handlers |
| E2E | **Playwright** | Critical UI journeys in Chromium (web/dev shell) |

Fintech uses `@vue/test-utils` — config-app uses **Testing Library** because the shell is React 19.

---

## Fintech reference (what we mirror)

**Unit (frontend):**
- `vitest` + `happy-dom`, `globals: true`
- Co-located `src/**/*.test.ts` (and `.spec.ts`)
- `vite.config` via `defineConfig` from `vitest/config`
- Script: `"test": "vitest run"`
- Component example: mount + assert text/classes (`Badge.test.ts`)
- Integration example: MSW `setupServer(...handlers)` around composable/fetch (`useTransactions.test.ts`)

**E2E:**
- Root `playwright.config.ts` → `testDir: './e2e'`
- Chromium project, `baseURL` local Vite, trace on-first-retry
- Specs assert page title, filters, visible table/UI (`e2e/dashboard.spec.ts`)

---

## Target layout in `navitrack-config-app`

```text
navitrack-config-app/
├── package.json          # bun scripts below
├── vite.config.ts        # vitest block (happy-dom)
├── playwright.config.ts
├── e2e/
│   └── smoke.spec.ts     # home logo + shell chrome
├── src/
│   ├── mocks/
│   │   ├── handlers.ts   # FCS API MSW
│   │   └── data.ts
│   ├── protocol/         # (when ported) *.test.ts for CRC/frames
│   ├── ui/**/*.test.ts
│   └── ...
```

### Scripts (bun)

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

### Vitest block (mirror fintech)

```ts
import { defineConfig } from 'vitest/config'
// ...
test: {
  environment: 'happy-dom',
  globals: true,
  include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  exclude: ['e2e/**/*', 'node_modules/**/*'],
}
```

### DevDependencies (scaffold with shell)

- `vitest`, `happy-dom`, `msw`
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `@playwright/test` (+ root/e2e config)

---

## What to test by phase

| Phase | Tests |
|-------|--------|
| Empty shell | Home renders logo; theme toggle; i18n smoke; Playwright smoke on `/` |
| Protocol port | CRC8 table golden vectors; command/response round-trips; password pad length 8 |
| BLE (mocked) | Scanner store/list with fake adapter; connection state machine / watchdog |
| FCS API | MSW handlers for GetUserSettings flags + config params |
| Sensor session | Standard-mode form enablement after password; settings read/write orchestration (mock characteristic) |

**Out of scope for CI initially:** real device BLE, store signing, native Tauri plugin E2E (optional later via device farm).

---

## Agent rules

- Every new domain module ships with co-located `*.test.ts` (fintech style).
- HTTP boundaries use MSW — never hit live `api.fcs.navitrack.com.ua` in unit/integration.
- E2E covers happy-path UI only; protocol edge cases stay in Vitest.
- Run with **bun**: `bun run test`, `bun run test:e2e`.

## HARD MANDATE (DUT port)

See **`intel/TEST-COVERAGE-MANDATE.md`**.

- No sprint/task is complete without tests for the new behavior.
- `bun run test` is a done-gate on every `.pd`.
- S01–S12 all reference this mandate in their headers.
