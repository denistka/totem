# S19: AI feedback for human — contract

## Feedback type

- **id:** string (uuid from storage).
- **scope:** At least one of `instanceId`, `sprintId`, `taskId` must be set. Task-level feedback should set all three for context.
- **type:** `status` | `block` | `suggestion` | `message`
  - **status:** Informational (e.g. "Task completed", "Step 2 done").
  - **block:** Human action needed (e.g. "Waiting for LGTM", "Waiting for gate OPEN").
  - **suggestion:** Optional improvement (e.g. "Consider adding X").
  - **message:** Free-form short message.
- **body:** string (plain text or markdown).
- **actor:** `{ id: string, name: string, type: 'agent' }` (S12 Actor; feedback is from agent to human).
- **createdAt:** ISO8601 string.
- **Optional:** `priority` (number/enum), `dismissed` (boolean); UI may support later.

## Scope rules

- At least one of `instanceId`, `sprintId`, `taskId` is required so feedback can be filtered.
- Task-level: set `taskId` (and usually `sprintId`, `instanceId`).
- Sprint-level: set `sprintId` and `instanceId`.
- Instance-level: set `instanceId` only.

## Agent submission

- Agent sends payload: `{ instanceId?, sprintId?, taskId?, type, body, actor: { id, name, type: 'agent' } }`.
- `createdAt` is set by the server. Agent may omit it.

## API consumption

- GET returns array of feedback; sort by `createdAt` desc.
- UI may style by type: e.g. block = warning, suggestion = info, status = neutral.
