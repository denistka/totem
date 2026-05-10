# Totem Engine (Totem V7 Backend) Invariants

> Core principles to uphold across the Totem Engine Node.js backend.

## 1. Ground Truth Responsibility
The `totem-v7` Node application is the EXCLUSIVE manager and processor of the project's state. It is the only entity allowed to read, write, or structure the JSON files (dag.json, invariants.json, chat.json) inside `totem-v7/instances/...`. It acts as the *Source of Truth*.

## 2. API & Real-time Synchronization
1. **HTTP REST** is used for delivering initial state (e.g. `GET /api/project/:id/dag`, `GET /api/project/:id/chat/:type/:id`).
2. **WebSockets (ws)** are mandatory for real-time bi-directional synchronization and task streaming.
3. Every operation that modifies state must broadcast an event (e.g., `DAG_UPDATED`, `CHAT_UPDATED`) to all connected UI clients.

## 3. Persistent Chat State
`ChatSession` and `ExecutionRun` models must be serialized entirely in `chat_[scopeType]_[scopeId].json` files. In-memory ephemeral storage is strictly prohibited to ensure that any UI or Antigravity restart does not wipe Orchestration context.

## 4. Antigravity Handshake
When an agent is requested to execute tasks (e.g. via `SUBMIT_TASK`), the Engine creates a prompt file (`instances/:id/prompts/run-xxx.md`). The Engine assumes that Antigravity (or another LLM runner) will consume this prompt, execute mutations on `dag.json`, and the Engine will catch these changes via `chokidar` file watchers to complete the async cycle.
