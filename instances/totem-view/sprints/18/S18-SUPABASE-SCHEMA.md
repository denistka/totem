# S18: Supabase user data schema

## Project and env

- Create a Supabase project at [supabase.com](https://supabase.com) (or use existing).
- **Project URL** and **Anon key** go in env (see S18-T3). For API proxy we also need **Service role key** server-side only (`SUPABASE_SERVICE_ROLE_KEY` in API env; never in client).
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (client, optional for user data when using API proxy); `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (API/server only).

## Tables

### 1. `user_preferences`

Key-value preferences per tenant. Used for theme, last_viewed (instance/board), and other UI state.

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | uuid      | PK, default gen_random_uuid() |
| tenant_id  | text      | S14 tenant id (e.g. from X-Tenant-Id). Scopes rows. |
| key        | text      | Preference key (e.g. 'theme', 'last_instance_id', 'last_board_id'). |
| value      | jsonb     | Value (string, number, or object). |
| updated_at | timestamptz | default now(). |

- Unique: `(tenant_id, key)` so we can upsert by tenant_id + key.

### 2. `integration_links`

Links from Totem tasks to external items (Jira, ClickUp, Notion). S16.

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | uuid      | PK, default gen_random_uuid() |
| tenant_id  | text      | S14 tenant id. |
| instance_id| text      | Totem instance id. |
| task_id    | text      | Task id (e.g. S16-T1-...). |
| provider   | text      | 'jira' \| 'clickup' \| 'notion'. |
| external_id| text      | Provider's id. |
| url        | text      | Open-in-browser url. |
| created_at | timestamptz | default now(). |

- Unique: `(tenant_id, instance_id, task_id, provider)` so one link per (task, provider).

## SQL (run in Supabase SQL editor or migration)

```sql
-- S18-T1: User data tables (no RLS yet)
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  key text not null,
  value jsonb not null default 'null',
  updated_at timestamptz not null default now(),
  unique (tenant_id, key)
);

create table if not exists public.integration_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  instance_id text not null,
  task_id text not null,
  provider text not null,
  external_id text not null,
  url text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, instance_id, task_id, provider)
);

create index if not exists idx_user_preferences_tenant on public.user_preferences (tenant_id);
create index if not exists idx_integration_links_tenant on public.integration_links (tenant_id);
create index if not exists idx_integration_links_lookup on public.integration_links (tenant_id, instance_id, task_id);
```

## Documented keys (user_preferences)

| key                 | value type | Description |
|---------------------|------------|-------------|
| theme               | string     | 'light' \| 'dark' \| 'system'. |
| last_instance_id    | string     | Last viewed instance id. |
| last_board_id       | string     | Last viewed board id (sprint id). |
