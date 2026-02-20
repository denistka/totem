# Totem QA — Chrome DevTools extension

The extension adds a **Totem QA** panel in Chrome DevTools. When you have totem-view open, the panel shows the current task (from the board/task you have open), including objective, steps, and acceptance criteria.

## Install (unpacked)

1. Build and run totem-view (e.g. `pnpm run dev`).
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `extension` folder inside the totem-view repo (e.g. `totem-view/extension`).
5. The **Totem QA** extension will appear in the list.

## Use

1. Open totem-view in a tab (e.g. `http://localhost:5173`).
2. Open DevTools (F12 or right‑click → Inspect).
3. In the DevTools top bar, open the **Totem QA** panel.
4. Select a board and open a task (or open task detail). The panel will show that task’s objective, steps, and acceptance criteria.
5. Use **Refresh** to re-read context from the page.

## How it works

- The totem-view app sets `window.__TOTEM_QA_CONTEXT__` with the current instance, board, and task (see S15-QA-CONTEXT-CONTRACT.md).
- The extension’s panel reads that object via DevTools (or a content script) and renders it.
- Context is updated when you change route or selected task in the app.

## Optional: QA badge in the app

Add `?qa=1` to the URL (e.g. `http://localhost:5173/board/13?instance=totem-view&qa=1`) or set `VITE_QA_HINTS=true` to show a small QA badge in the bottom-right with the current task id and a hint to open the DevTools panel.
