# S18 invariants (user data in Supabase)

- **User data:** Preferences (theme, last_instance_id, last_board_id) and integration_links (S16) are persisted in Supabase. Totem instance/sprint/task content stays file-based; user data lives in Supabase.
- **Identity:** S14 tenant id (X-Tenant-Id). No Supabase Auth for this path. API proxy: client calls GET/POST `/api/user-data`; API uses service_role and enforces tenant_id from header. When TOTEM_TENANT_ID is unset (dev), tenant defaults to `'default'`.
- **Tables:** `user_preferences` (tenant_id, key, value jsonb), `integration_links` (tenant_id, instance_id, task_id, provider, external_id, url). RLS enabled; no anon policies (API uses service_role). Schema and SQL: `sprints/18/S18-SUPABASE-SCHEMA.md`, `sprints/18/S18-RLS.md`, `totem-view/supabase/migrations/`.
- **Client:** User data is loaded on app init (`useUserData().load()` in App.vue). Theme is applied from preferences; theme toggle and route changes save via `savePreferences` / `savePreferencesNow`. Integration links are in `useUserData().integrationLinks`; use `getIntegrationLink(instanceId, taskId)` to merge into task context (e.g. "Open in Jira").
- **Load order:** App mount → load user data (GET /api/user-data) → apply theme → render. Empty or 503 (Supabase not configured) uses defaults; no block on load failure.
