# S18: RLS for user data tables

## Approach: API proxy with tenant_id

- **Identity:** S14 tenant id (X-Tenant-Id header). No Supabase Auth for user data in this path.
- **Access:** Client never calls Supabase directly for user data. Client calls totem-view API (`GET/POST /api/user-data`). API uses **service_role** server-side, validates tenant from request header, and filters all reads/writes by `tenant_id`. So RLS is bypassed by the API; security is enforced by the API (only allowed tenant gets their rows).
- **RLS still enabled:** We enable RLS on all tables and do **not** grant anon any policies. So if anon key were ever used for these tables, no rows would be visible. service_role bypasses RLS, so the API (using service_role) can read/write. This keeps "RLS on all tables" and prevents accidental anon access.

## Policies

- **user_preferences:** RLS enabled. No policy for `anon` or `authenticated` → deny all for non–service_role.
- **integration_links:** Same.

## SQL (run after table creation)

```sql
-- S18-T2: Enable RLS; no policies for anon (API uses service_role)
alter table public.user_preferences enable row level security;
alter table public.integration_links enable row level security;

-- No SELECT/INSERT/UPDATE/DELETE policies for anon or authenticated.
-- API uses service_role and bypasses RLS; API enforces tenant_id from header.
```

## Verification

- User A (tenant_id = 'a') cannot read user B's rows: API only returns rows where tenant_id = header value; client cannot change header to another tenant if tenant is enforced by backend (e.g. VITE_TENANT_ID or server-side validation).
- No service_role key in client bundle; only in API env.
