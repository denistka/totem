# S82 — API client & errors (TA1)

## Single HTTP entry

- **Transport:** `getApiClient()` / `ApiClient` in `src/api/client.ts` (uses `httpFetch` from `http-adapter.ts`).
- **Domain calls:** `src/api/domains/*.ts` — all network paths should live here (or store adapters that call these domains).

## Centralized errors

- **`ApiError`** (`client.ts`) — status + body; thrown on non-OK responses.
- **UI surfaces** — use domain try/catch + `toast` / `useToast` at screen boundary; avoid silent `console.error` only (existing code tightened incrementally).

## Screen imports (policy)

- Prefer **`@/api/domains/<domain>`** for functions + types when the domain is known (e.g. reports: `ReportHistoryView`, `ReportCustomManagement`).
- **`import type` from `@/entities/vehicle/model`** for vehicle types in UI (TM2 pilot) to avoid scattering `@/api` type imports.

## Domains using the stack (≥2)

Examples: `vehicles`, `reports`, `tracking` (via store adapters + domains) — all ultimately `ApiClient.request`.
