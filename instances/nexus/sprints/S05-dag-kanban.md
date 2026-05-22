# S05 · Visual DAG + kanban

**Phase:** P1 · Core MVP
**Window:** M4
**Status:** partial — prototype structure layer renders mocks
**Depends on:** S01, S02, S03
**Blocks:** S08

## Objective

Replace the mocked structure layer with a real DAG that reads from the
backend, supports zoom semantics (epic → sprint → task), cascade highlighting
on `depends_on`, and drag-and-drop between sprints.

## Acceptance criteria

- [ ] 2D canvas (`vue-flow` or custom SVG) replacing the current grid mock
- [ ] Zoom-driven density: epics at far → sprints mid → tasks close
- [ ] Cascade highlight on click (BFS over `depends_on` edges)
- [ ] Drag-and-drop task between sprints (`useTaskDragAndDrop` already exists)
- [ ] Kanban view as alternative (`Todo / Doing / Review / Done / Blocked`)
- [ ] View state (zoom, viewport, selection) persisted per user per project
- [ ] Layer colours match prototype: foundation=emerald, walls=amber, roof=sky

## Out of scope

- Real-time multi-cursor on the DAG (S08)
- Time-travel scrubber (P4)

## Engineering notes

- Reuse `useTaskDragAndDrop` from existing taskboard
- Keep `NexusStructureLayer.vue` as the dumb presentational shell;
  data comes from a new `useNexusProject(projectId)` composable

## Risks

- Performance with 500+ tasks at full zoom → virtualise + culling outside
  viewport
