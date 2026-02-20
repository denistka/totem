# S15 Invariants — Manual QA & DevTools

**Sprint result:** QA engineers can use a custom Chrome DevTools panel (Totem QA) that shows current task, acceptance criteria, and steps. Optional in-page QA badge when `?qa=1` or `VITE_QA_HINTS=true`. S05/S06/S08 preserved.

---

## Frozen decisions

- **QA context:** Shape and exposure in `sprints/15/S15-QA-CONTEXT-CONTRACT.md`. App sets `window.__TOTEM_QA_CONTEXT__` (when `DEV` or `VITE_QA_DEVTOOLS=true`). Context includes instanceId, boardId, taskId, taskTitle, objective, steps, acceptanceCriteria, taskUrl, boardUrl.
- **Extension:** Lives in `totem-view/extension/`. Manifest v3; devtools_page; panel reads context via `inspectedWindow.eval` or content script. Install as unpacked; see `sprints/15/README-EXTENSION.md`.
- **Test IDs:** Prefix `totem-`. List in `sprints/15/S15-TESTIDS.md`. Key elements: board card, task card, column, task detail, create board/task buttons.
- **QA badge:** Shown when `?qa=1` or `VITE_QA_HINTS=true`; fixed bottom-right; shows current task id and "Open DevTools → Totem QA". Off by default.

---

## Invariants for next sprints

- S05 (glass), S06 (three-level display), S08 (Vercel, API) unchanged.
- Extension is a separate artifact; it does not change the production build of totem-view.
