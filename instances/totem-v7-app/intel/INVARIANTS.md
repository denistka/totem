# Totem V7 App (UI Client) Invariants

> Core principles to uphold across the Totem V7 App UI client.

1. **Thin Client Philosophy**: The React app in `totem-v7-app` is strictly a "thin client". It must not perform heavy parsing of raw files, CLI execution, or prompt generation. It communicates exclusively via WebSockets to the `totem-v7` Node engine.
2. **WebSocket Hydration**: All DAG updates and Agent planning states are pushed from the `totem-v7` Engine via WS (`DAG_UPDATED`, `AGENT_THINKING_COMPLETE`). UI components should simply listen and re-render.
3. **Execution Transparency**: Every chat interaction that delegates to the Orchestrator MUST expose the `ExecutionRun` details in the UI (Model used, tokens, raw prompt, injected context) via the Orchestrator Inspector modal.
4. **Cascade Highlighting**: If a change impacts multiple layers (e.g. `Foundation` affecting `Roof`), the UI must visually pulse those layers on the `BrickHouse` DAG view.
