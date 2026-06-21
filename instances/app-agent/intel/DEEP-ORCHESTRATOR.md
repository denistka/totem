# DEEP — Work Control Orchestrator (S05)

**Single source of truth** for S05. Every later task (T02–T12) implements a slice of
this doc. Frozen decisions live in [`S05-INVARIANTS.md`](../S05-INVARIANTS.md); this doc
shows *how* they fit together. Where this doc and a task `.pd` disagree, **the invariant
wins**, then this doc, then the `.pd` prose.

> ⚠️ **Known doc defect (do not propagate):** `S05-Orchestrator.ptl` Objective/DoD say
> PLANNER writes Totem files at `gate: OPEN`. That is wrong and contradicts its own tasks.
> **Canonical flow = write `gate: LOCKED` → human opens → `OPEN` → run** (invariant §3/§4,
> tasks T07/T08). Treat any "write at OPEN" phrasing as a typo.

---

## 1. The spine & lead-role map

```
chats ─┬─► chat ──► epics ──► epic (board) ──► tasks ──► task
       │     │         │           │              │         │
   (sidebar) │     (ROOT       (PLANNER       (per-task   (assigned
             │   proposes)    decomposes)     lead_role)  mock agent
             │                                            runs it)
        whole-context
        ROOT watch
```

Exactly **one lead role per layer** (invariant §1). Tasks may add helper roles later (S09).

| Spine layer            | Lead role | Responsibility                                                                 |
|------------------------|-----------|--------------------------------------------------------------------------------|
| `chat`                 | **ROOT**  | Watches *whole chat + project context* (not last msg), proposes epics (§2).    |
| `epics` (proposal col) | **ROOT**  | Emits/updates editable epic cards. User owns them fully (rename/edit/del/accept).|
| `epic → board`         | **PLANNER** | On accept: decompose into 3–6 tasks **and** write `gate: LOCKED` Totem files (§3). |
| `task`                 | *assigned `lead_role`* | After human opens gate, the task's mock agent runs `todo→in_progress→done` (§4/§10). **PM** owns the run state machine. |

Role enum (invariant §6, home = organization layer, T02):
`PLANNER · PM · ARCHITECT · QA · TEST_AUTHOR · DEVOPS · ROOT · OPTIMIZER`.

---

## 2. Anti-auto-proceed axiom — in-product (🔒 touchpoints)

The protocol's core rule (`index.ti`: *execution LOCKED until a literal human "Go"*) is
embodied as a product mechanic. Every 🔒 below is a place code MUST NOT shortcut:

- 🔒 **Accept ≠ run.** Accepting an epic only *plans*: it writes `.ptl`/`.pd` at
  `gate: LOCKED` and builds a board of `todo` tasks. No execution happens (T07).
- 🔒 **Humans open gates.** `POST /api/boards/[id]/open-gate` is the only path that flips
  `LOCKED → OPEN`. It is triggered by an explicit UI action == "Go". The app MUST NOT
  auto-open a gate anywhere (T08, invariant §4).
- 🔒 **Run is gated.** `POST /api/tasks/[id]/run` returns **423 Locked** if the board's
  gate is `LOCKED`. Only when `OPEN` may the mock agent advance status (T08).
- 🔒 **Write scope.** App writes ONLY under
  `totem-v6/instances/app-agent/sprints/`; ids `S<NN>-T<NN>-<Name>`, never colliding (§5).

---

## 3. Totem write-back flow (accept → plan → open → run)

```
[user clicks Accept on epic E]
        │  POST /api/epics/[E]/accept                         (T07, role PLANNER)
        ▼
  mock PLANNER.decompose(E) → 3–6 {title, lead_role, position}
        ▼
  create wc_boards row (epic_id=E, ptl_file, gate='LOCKED')
  create wc_tasks rows (status='todo', epic_id=E, lead_role)
        ▼
  totem-writer.ts writes to instance sprints/:
     S<NN>-<EpicSlug>.ptl            (gate: LOCKED)
     S<NN>-T<NN>-<TaskName>.pd  ×N   (gate: LOCKED)        🔒 LOCKED, never OPEN
  store each .pd path on wc_tasks.totem_pd_file
        ▼
  epic.status='accepted'; emit epic.accepted + board.created  (WS, §8)
        │
        │      ……… human reviews board, then clicks "Open gate" …………
        ▼
[user clicks Open gate on board B]
        │  POST /api/boards/[B]/open-gate                     (T08, role PM, == "Go")
        ▼
  rewrite the board's .ptl on disk: gate: LOCKED → OPEN       🔒 only human path
  wc_boards.gate='OPEN'; emit gate.opened
        ▼
[user/agent runs task T]
        │  POST /api/tasks/[T]/run
        ▼
  if board.gate != 'OPEN' → 423 Locked                        🔒 hard gate
  else mock agent: status→in_progress (emit task.moved + agent.activity steps)
       … deterministic timed steps … status→done (emit task.moved)
```

`totem-writer.ts` reuses the existing `totem-reader.ts` path resolution
(`WORK_CONTROL_TOTEM_PATH`, default `../../totem/totem-v6/instances/app-agent`).
Next free `S<NN>` is computed by scanning existing `S*.ptl` in `sprints/`.

---

## 4. WS event contract (the single realtime contract — T09 implements, T10 consumes)

Transport: **Nitro WebSocket via `crossws` / `defineWebSocketHandler`** at
`server/routes/_ws.ts`. No Supabase realtime (invariant §8). Writes still go over REST;
the WS is broadcast-only. Rooms keyed by `chatId` or `boardId`. Types in `shared/ws.ts`.

```ts
type ScopeType = 'chat' | 'epic' | 'board' | 'task'
type ActorKind = 'human' | 'agent'

type WcEvent =
  | { type: 'epic.proposed';  chatId: string;  epic: WcEpic }
  | { type: 'epic.updated';   chatId: string;  epic: WcEpic }
  | { type: 'epic.accepted';  chatId: string;  epicId: string; boardId: string }
  | { type: 'board.created';  chatId: string;  board: WcBoard; tasks: WcTask[] }
  | { type: 'gate.opened';    boardId: string; ptlFile: string; by: string; ts: string }
  | { type: 'task.created';   boardId: string; task: WcTask }
  | { type: 'task.moved';     boardId: string; taskId: string; from: TaskStatus; to: TaskStatus; ts: string }
  | { type: 'agent.activity'; scopeType: ScopeType; scopeId: string; actor: string; role: AgentRole; kind: ActorKind; event: string; payload?: unknown; ts: string }
  | { type: 'presence.sync';  scopeType: ScopeType; scopeId: string; members: PresenceMember[] }

interface PresenceMember { id: string; kind: ActorKind; role?: AgentRole; label: string }

// server helper used by T05 (epic.*), T07 (accepted/board.created), T08 (gate/task.moved)
function broadcast<E extends WcEvent>(room: string, event: E): void
```

Client: `useRealtime(room)` (T09) reconnects with backoff and exposes a typed stream;
`useWorkControl` (T10) folds events into board/epic/timeline state.

---

## 5. Data model (Supabase via ADR-005 datasource; `bun:sqlite` dev fallback)

Persistence = **Supabase**, reached through `CORE_DATASOURCE_{URL,KEY,PROVIDER}` read from
`process.env` (NOT `runtimeConfig`, per ADR-005). A `bun:sqlite` repo behind the **same
repository interface** is the dev fallback (invariant §9, T03). Six `wc_*` tables:

```
wc_chats(id pk, title, owner_id, ts)
   └─< wc_messages(id pk, chat_id→wc_chats, role, parts json, ts)
   └─< wc_epics(id pk, chat_id→wc_chats, title, summary, lead_role,
                status['proposed'|'accepted'|'rejected'], position, ts)
            └─1 wc_boards(id pk, epic_id→wc_epics, title, owner_id,
                          ptl_file, gate['LOCKED'|'OPEN'], ts)     ← gate lives on the board
                   └─< wc_tasks(id pk, board_id→wc_boards, epic_id→wc_epics,
                                title, description, status['todo'|'in_progress'|'done'],
                                position, lead_role, agent_state,
                                totem_pd_file, totem_task_id, totem_sprint_id, owner_id, ts)
wc_agents(id pk, scope_type, scope_id, role, kind['mock'|'llm'], status)
wc_activity(id pk, scope_type, scope_id, actor, kind['human'|'agent'], event, payload json, ts)
```

`wc_boards` + `wc_tasks` **extend the existing S04 schema** (S04 had `wc_boards`,
`wc_tasks`); T03 adds `epic_id, lead_role, agent_state, totem_pd_file` to tasks and
`epic_id, ptl_file, gate` to boards. The repository layer exposes one interface; provider
selection is `CORE_DATASOURCE_PROVIDER` (default `supabase`, `sqlite` for local dev).

---

## 6. Mock-agent interface (the S06 swap seam)

Mock agents are **deterministic stubs, no LLM, no `AI_PROVIDER_KEY`** (invariant §11).
They implement the exact interface real agents will in S06, so callers never change:

```ts
interface AgentContext {
  chat: WcMessage[]                     // whole conversation (ROOT reads all of it)
  project: ProjectContext               // brief + invariants + current sprint state
  scope: { type: ScopeType; id: string }
}

interface EpicProposal { title: string; summary: string; leadRole: AgentRole; position: number }
interface TaskPlan     { title: string; leadRole: AgentRole; position: number; description?: string }

interface Agent {
  role: AgentRole
  kind: 'mock' | 'llm'
  proposeEpics?(ctx: AgentContext): Promise<EpicProposal[]>        // ROOT
  decompose?(epic: WcEpic, ctx: AgentContext): Promise<TaskPlan[]> // PLANNER
  runTask?(task: WcTask, emit: (a: AgentActivityStep) => void): Promise<void> // task lead
}

interface AgentActivityStep { event: string; payload?: unknown; delayMs?: number }
```

S06 replaces the mock factory (`server/utils/agents/mock.ts`) with an LLM-backed factory
(`llm.ts`) behind `createAgent(role, kind)`; routes/state machine stay untouched.

---

## 7. Task → guardian-role realization map (build order)

| Task | Role     | Builds                                                            | Depends on |
|------|----------|------------------------------------------------------------------|------------|
| T01  | ARCHITECT| this doc                                                         | —          |
| T02  | —        | role enum in `organization/app/app.config.ts`                    | —          |
| T03  | ARCHITECT| schema + datasource + repo interface                             | T02        |
| T04  | —        | chat surface (`wc_chats`/`wc_messages`, chat UI)                 | T03        |
| T05  | ROOT     | mock ROOT `proposeEpics` → `epic.proposed`                       | T03,T04,T09|
| T06  | —        | editable epics right column                                      | T05        |
| T07  | PLANNER  | accept → decompose → **LOCKED** write-back (`totem-writer.ts`)   | T03,T06,T09|
| T08  | PM       | open-gate (LOCKED→OPEN) + gated run state machine                | T07,T09    |
| T09  | DEVOPS   | Nitro WS + `shared/ws.ts` + `useRealtime`                        | T03        |
| T10  | —        | live board + activity timeline (folds WS events)                 | T08,T09    |
| T11  | —        | `work-control` knowledge slug + instance docs                    | all        |
| T12  | QA       | e2e smoke + `S05-SUMMARY.md` + freeze invariants                 | all        |

**Effective sequencing:** T02 → T03 → T09 (contract) → T04 → T05 → T06 → T07 → T08 →
T10 → T11 → T12. T09 lands early because its typed contract (§4) is referenced by T05/07/08.

---

## 8. Open architectural questions

None blocking. Resolved during T01:

1. *Where does gate state live?* → on `wc_boards` (`gate`, `ptl_file`); the board owns the
   `.ptl`, tasks own their `.pd`. T08 flips the board's `.ptl` only.
2. *LOCKED vs OPEN on write-back?* → **LOCKED** (see top-of-doc defect note).
3. *One WS or per-feature channels?* → one channel, room-scoped by `chatId`/`boardId` (§8).
4. *Mock vs real boundary?* → `createAgent(role, kind)` factory; mock now, llm in S06 (§6).
