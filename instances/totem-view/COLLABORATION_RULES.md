# Collaboration rules (S12)

Multiple humans and multiple agents in the same instance/sprint/board. Protocol and conflict rules.

## Gate

- **Who may set gate OPEN:** Any human. Protocol (index.ti): only the human can open a gate; the agent must not assume approval. With multiple humans, the rule is **any human** may change `gate: LOCKED` to `gate: OPEN` in the file. No assignee-only restriction in this setup.
- Agents never open the gate; they wait for a human to do it or to say "LGTM" / "Go".

## Same-task conflict

- **Rule:** Awareness, no lock. When two or more actors (humans or agents) are viewing or editing the same task, the UI may show a hint: "Another user is viewing this task." No automatic locking of the task; no merge UI in this sprint.
- **Conflict resolution:** Last-write-wins if two actors edit the same field; or the human decides after being made aware. No built-in "lock while editing" in S12; document or add in a later sprint if needed.

## Agent vs human

- Agents never open the gate; humans approve.
- Activity and presence show type (human | agent) so the tandem sees who did what and who is here.
- Human stays in the loop; agents execute within gated, human-approved scope.

---

See also: `totem/index.ti` (anti-auto-proceed), `docs/PRESENCE_CONTRACT.md` (presence scope and API).
