# Human–AI Tandem Philosophy

*Why we work this way (THAIT — Totem for Human AI Tandem).*

---

## Principles

1. **Human holds the gate.** Only the human can open a gate (e.g. change `gate: LOCKED` to `gate: OPEN` in a file) or give explicit approval (e.g. "LGTM", "Go"). The agent never assumes that the human has approved.

2. **Agent never assumes approval.** The agent is forbidden from simulating or inferring human consent. Execution stays locked until a literal human signal is present. No "I'll assume you're fine with it."

3. **Plan and execute are separate.** The role that plans (PLANNER) does not execute. The role that executes (e.g. PM) follows the plan and checks gates. Separation prevents the same mind from both defining and running work without human checkpoints.

4. **Gates are external human signals.** A gate is not a suggestion; it is a hard checkpoint. When a task or sprint has `gate: LOCKED`, the agent must stop and wait. The implementation of this is in protocol (index.ti, PM, PLANNER).

5. **Shared context: Totem + code + history.** The tandem shares one source of truth: Totem (instances, sprints, tasks, invariants), the codebase, and the history of what was done. Context is loaded just-in-time by scope (`requires:`) so the agent does not carry irrelevant context.

6. **Invariants protect past decisions.** Frozen decisions (e.g. S05-INVARIANTS, S06-INVARIANTS) are linked and respected. Changing an invariant requires explicit human discussion; auto-approve is blocked.

7. **Human stays in the loop.** The human is not a rubber stamp. They open gates, confirm scope, and direct what runs. The agent proposes and executes within that frame.

8. **Clean history, clear ownership.** Code lives in the code repo; planning and task definitions live in Totem (e.g. .ptl, .pd). Who decided what is visible. No hidden automation that bypasses the human.

---

## The "new way" tenets

1. **No blind automation.** We do not optimize for "AI does everything." We optimize for clarity: the human knows what is blocked, what is ready, and what the agent will do next. Automation is scoped and gated.

2. **Human in the loop by design.** Gates, phases, and roles exist so the human has clear moments to decide. The product (e.g. totem-view) surfaces gate state and next-step hints so the tandem can follow protocol from the UI.

3. **Invariants protect the baseline.** Once a decision is frozen (tokens, APIs, layout), it is documented and linked. New work must not break it without explicit discussion. This reduces drift and rework.

4. **JIT context keeps scope clear.** The agent loads only what is needed for the current task (`requires:`). This keeps prompts focused and reduces scope creep.

5. **One source of truth.** Totem is the brain: instances, sprints, tasks, invariants. Code is the output. History is traceable. The tandem shares the same picture.

---

## Protocol alignment

This philosophy is implemented by Totem protocol. Key references:

- **index.ti** — Anti-auto-proceed axioms: no simulated approval; PLANNER does not execute; execution locked until LGTM/Go; gate LOCKED = unexecutable.
- **ITERATION_FLOW.ti** — Phases (PLAN → CLOSE); gates as external human signal; rollback on failure; invariant protection.
- **Guardians (PLANNER, PM)** — PLANNER only creates .ptl/.pd and stops; PM verifies gate and human signal before execution.

The philosophy does not replace protocol; it explains why the protocol is as it is.

---

*Location: `totem/docs/HUMAN_AI_TANDEM_PHILOSOPHY.md`. Single canonical document for all instances.*
