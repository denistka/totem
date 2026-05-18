# S04 · AI intent router

**Phase:** P1 · Core MVP
**Window:** M3–M4
**Status:** planned
**Depends on:** S01, S03
**Blocks:** S07, S10

## Objective

Every chat message is automatically classified into an intent and linked to
zero or more project entities. This is the heart of "chat as a graph node":
without the router the chat is just chat.

## Acceptance criteria

- [ ] Server endpoint `POST /api/router/classify` accepts a message + project
      context, returns `{ intent, links, suggestedActions, confidence }`
- [ ] Intents: `bug`, `feature`, `discussion`, `approval`, `question`,
      `decision`, `command`
- [ ] Links: task ids extracted from `T-NNN` mentions + semantic search hits
- [ ] Approval intent (`lgtm`/`go`/`approve`/`апрув`) flips a gate from
      `locked` to `open` if the target is unambiguous, otherwise asks back
- [ ] Confidence threshold: < 0.6 → ask back as a chat reply instead of acting
- [ ] Telemetry: every classification stored as `event:router.classify`

## Out of scope

- Cross-project memory retrieval (S11)
- Embeddings index (S11) — local TF-IDF is fine for MVP

## Engineering notes

- Provider-agnostic: implement against MCP `tools/run` so future
  Claude/GPT/Gemini swap is trivial
- Pure-JS heuristic baseline ships first (regex + keyword), LLM call layered
  on top with a feature flag — keeps demo cheap
- Result caching keyed on message hash for 24h

## Risks

- False positives flipping gates → mitigated by requiring an unambiguous
  task reference for `approval` intent until confidence is calibrated on
  100+ real messages
