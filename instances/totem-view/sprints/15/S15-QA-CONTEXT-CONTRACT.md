# S15 QA context contract

**Purpose:** Define the "QA context" the app exposes so a DevTools panel or extension can show current task, acceptance criteria, and steps for manual testers.

---

## Shape (JSON)

```ts
interface QaContext {
  instanceId?: string;
  instanceName?: string;
  boardId?: string;
  boardName?: string;
  taskId?: string;
  taskTitle?: string;
  objective?: string;
  steps?: string[];
  acceptanceCriteria?: string;
  taskUrl?: string;   // deep link to open this task in totem-view
  boardUrl?: string;  // deep link to board
}
```

- **Current** when: user has a task detail open, or has selected a task on the board. If no task selected, `boardId` / `instanceId` and board/instance names are still set when on a board or instance view. On dashboard only, context can be minimal (e.g. only `instanceId` if an instance is in context) or empty.
- All fields are optional; missing task → no `taskId`, `taskTitle`, `objective`, `steps`, `acceptanceCriteria`, `taskUrl`.

---

## Exposure method

- **Primary:** `window.__TOTEM_QA_CONTEXT__` is set to the current QA context object. The app updates it when route or selected task changes. DevTools or a content script can read it (e.g. poll or on panel open).
- **Optional:** The page can send `window.postMessage({ type: 'totem-qa-context', payload: context }, '*')` when context changes so extensions can subscribe without polling. Panel can use either `window.__TOTEM_QA_CONTEXT__` (via content script) or postMessage.

---

## Consumption

- **Chrome DevTools panel:** A content script injected into the totem-view tab reads `window.__TOTEM_QA_CONTEXT__` and sends it to the extension via `chrome.runtime.sendMessage`. The DevTools panel receives it and displays task, steps, acceptance criteria.
- **One-time query:** Any script in the page (or via `inspectedWindow.eval`) can read `window.__TOTEM_QA_CONTEXT__` at any time to get the current snapshot.

---

## Security / env

- No secrets in context. Optional: app only sets `__TOTEM_QA_CONTEXT__` when `import.meta.env.DEV` or `VITE_QA_DEVTOOLS=true` so production builds can leave it off. Document in S15-T2.
