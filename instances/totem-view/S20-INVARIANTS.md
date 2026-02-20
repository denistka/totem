# S20 invariants (prompts and run from UI)

- **Prompt model:** id, name, body, instanceId, guardian?, targetType? (sprint | task | custom), targetRef?, requires?, createdAt, updatedAt. Body may contain {{instanceId}}, {{guardian}}, {{targetRef}}, {{sprintId}}, {{taskId}}. Contract: `sprints/20/S20-PROMPT-CONTRACT.md`; type `TotemPrompt` in `shared/types.ts`.
- **Storage:** Supabase table `prompts` (tenant_id, instance_id, name, body, guardian, target_type, target_ref, requires, created_at, updated_at). RLS enabled. Migration: `totem-view/supabase/migrations/20260223000000_s20_prompts.sql`.
- **API:** GET/POST `/api/instances/:id/prompts`, PATCH/DELETE `/api/instances/:id/prompts/:promptId`. Tenant and instance access per S14.
- **Run prompt:** Task: `read totem/index.ti, load instance X, load PM and execute sprints/N/TaskId.pd`. Sprint: `... execute sprints/N/SN.ptl`. Generator: `client/src/lib/runPrompt.ts` (buildTaskRunPrompt, buildSprintRunPrompt, resolvePromptBody).
- **UI:** Instance page has Prompts section (list, Add, Edit, Delete, Run). Task detail has Run button → modal with generated prompt and Copy. Run on saved prompt resolves template and shows same modal. Human-in-loop: paste in Cursor; gate reminder in modal.
