# Required YAML header fields for every new `.ptl` (PLANNER)

Add to sprint frontmatter:

```yaml
---
id: S<NN>
name: ...
status: PLANNED
gate: LOCKED
protocol: ../APP-AGENT-PROTOCOL.md    # MANDATORY — all roles
invariants: ../S<NN>-INVARIANTS.md
requires: [mcp/MCP.ti, ...]
---
```

Body must include:

```markdown
## App-agent protocol
All tasks in this sprint follow `APP-AGENT-PROTOCOL.md`.
Code tasks use `templates/PD-APP-AGENT-BLOCK.md`.
```
