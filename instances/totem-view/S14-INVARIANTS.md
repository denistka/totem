# S14 Invariants — Tenant encapsulation (SaaS)

**Sprint result:** Each client sees only instances they own. API filters by tenant; 403 for unauthorized instance access. Tenant context per request (header); UI shows only allowed instances and handles 403/401. S05/S06/S08 preserved.

---

## Frozen decisions

- **Tenant identity:** HTTP header `X-Tenant-Id` (string, uuid or slug). Documented in `sprints/14/S14-TENANT-IDENTITY.md`. Missing identity → 401 Unauthorized; valid identity but no access to instance → 403 Forbidden.
- **Ownership storage:** Per-instance optional `tenantId` in `project.config.yml` (top-level or under `project`). Central: env `TOTEM_TENANT_ID` (current tenant) and optional `TOTEM_TENANT_INSTANCES` (comma-separated instance ids). When `TOTEM_TENANT_ID` is unset, tenant is not enforced (dev-only; all instances visible).
- **Error bodies:** 401 → `{ "error": "Unauthorized" }`; 403 → `{ "error": "Access denied" }`. No instance id or tenant id in body.
- **Client:** `VITE_TENANT_ID` (build-time) is sent as `X-Tenant-Id` on all `/api/instances` and `/api/instances/:id/...` requests via `fetchWithTenant` (see `client/src/lib/apiClient.ts`).

---

## Env vars

| Var | Where | Purpose |
|-----|--------|--------|
| `TOTEM_TENANT_ID` | Server | When set, tenant enforcement is on; request must have matching `X-Tenant-Id`. When unset, no tenant check (dev). |
| `TOTEM_TENANT_INSTANCES` | Server | Optional. Comma-separated instance ids this tenant can see. When set, overrides per-instance `tenantId` from config. |
| `VITE_TENANT_ID` | Client (build) | Tenant id sent as `X-Tenant-Id` on API requests. When unset, header is omitted (dev with server `TOTEM_TENANT_ID` unset). |

---

## Invariants for next sprints

- S05 (glass), S06 (three-level display), S08 (Vercel, API shape) unchanged.
- No cross-tenant data in responses or UI. Do not log tenant id in plain text in production if sensitive.
