# S20: Prompt model and Totem rules

## Prompt type

- **id:** string (uuid from storage).
- **name:** string (required).
- **body:** string (required); may contain placeholders `{{instanceId}}`, `{{guardian}}`, `{{targetRef}}`, `{{sprintId}}`, `{{taskId}}`.
- **instanceId:** string (required; scoped to instance).
- **guardian?:** string — e.g. PM, PLANNER, ARCHITECT, QA, DEVOPS, ROOT.
- **targetType?:** `sprint` | `task` | `custom`.
- **targetRef?:** path (e.g. `sprints/7/S07.ptl`) or task id (e.g. `S07-T1-PixelBoardsList.pd`).
- **requires?:** string[] (optional JIT adapters).
- **createdAt,** **updatedAt:** ISO8601.

## Totem rules

1. **Reference index:** Runnable prompt should reference `totem/index.ti` (e.g. "read totem/index.ti").
2. **Load instance:** "load instance {instanceId}" (e.g. totem-view).
3. **Load guardian:** "load PM" or "load PLANNER", etc.
4. **Target:** Either a concrete path (e.g. "execute sprints/7/S07-T1-PixelBoardsList.pd") or a clear intent. No execution inside the app; prompt is for Cursor or external runner.
5. **Execution:** Gated (gate OPEN, LGTM); agent runs in Cursor/runner, not inside totem-view.

## Run prompt generation

- **Task run:** `read totem/index.ti, load instance {{instanceId}}, load PM and execute sprints/{{sprintId}}/{{taskFileName}}.pd`  
  Example: `read totem/index.ti, load instance totem-view, load PM and execute sprints/7/S07-T1-PixelBoardsList.pd`
- **Sprint run:** `read totem/index.ti, load instance {{instanceId}}, load PM and execute sprints/{{sprintId}}/S{{sprintId}}.ptl`  
  Or per-task: generate one prompt per task in the sprint. Prefer per-task run for clarity.
- **Task filename:** From task id (e.g. task id `S07-T1-PixelBoardsList` → file `S07-T1-PixelBoardsList.pd`).

## Template resolution

- Replace `{{instanceId}}`, `{{guardian}}`, `{{targetRef}}`, `{{sprintId}}`, `{{taskId}}` in body with current context when "Run" is used.
