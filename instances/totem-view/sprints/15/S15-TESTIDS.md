# S15 Test IDs and selectors (data-testid)

**Convention:** Prefix `totem-`. Use for QA and automation; no visual or behavior change.

| Element | data-testid | Notes |
|--------|-------------|--------|
| Board card | `totem-board-card-{boardId}` | BoardCard.vue |
| Task card (kanban) | `totem-task-card-{taskId}` | TaskCard.vue |
| Column | `totem-column-{status}` | status: todo, in_progress, done |
| Task detail panel | `totem-task-detail` | TaskDetails.vue modal |
| Create board button | `totem-create-board-btn` | Header (boards list) |
| Create task button | `totem-create-task-btn-{status}` | Per column: todo, in_progress, done |

**Selector examples:** `[data-testid="totem-board-card-13"]`, `[data-testid^="totem-task-card-"]`, `[data-testid="totem-column-done"]`.

**Future:** New components that are key for QA (e.g. modals, nav items) should add a stable `data-testid` with the `totem-` prefix.
