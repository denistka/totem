# S19 invariants (AI feedback for human)

- **Feedback model:** id, scope (instanceId?, sprintId?, taskId? — at least one), type (status | block | suggestion | message), body, actor { id, name, type: 'agent' }, createdAt. Contract: `sprints/19/S19-FEEDBACK-CONTRACT.md`; shared type `Feedback` in `shared/types.ts`.
- **Storage:** Supabase table `ai_feedback` (tenant_id, instance_id, sprint_id, task_id, type, body, actor_id, actor_name, created_at). RLS enabled. Migration: `totem-view/supabase/migrations/20260222000000_s19_ai_feedback.sql`.
- **API:** GET `/api/feedback?instanceId=&sprintId=&taskId=` (at least one required), POST `/api/feedback` with body (scope, type, body, actor). Auth: X-Api-Key (TOTEM_VIEW_API_KEY) or X-Tenant-Id. Agent doc: `sprints/19/S19-AGENT-FEEDBACK.md`.
- **UI:** Task detail shows "AI feedback" section (type badge, body, actor, relative time). Board task cards show feedback count badge when > 0. S05/S06 preserved.
