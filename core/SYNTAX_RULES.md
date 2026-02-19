role: MRPP Syntax & Compression Rules
focus: token-efficiency, decision-validation, low-perplexity
extends: ROOT.pi

syntax:

- `:` Key-value, `,` List
- `→` Dependency, `+` Union
- `@` Reference, `|` OR
- `#` Machine-ignore comment
- `$` Cost Tier

compression:

- Abbreviations: `y`/`n`, `est`, `dur`, `dep`, `ctx`, `ref`.
- Content: No boilerplate. Summary code only. `@path` over blocks.
- Zero Bloom: Compact YAML (no extra spaces). Multi-line only if logical.

suspicion-check:

- Rule: If a design/implementation decision feels redundant, inefficient, or questionable — WARN user immediately.
- Action: Propose a cleaner refactoring or explain the risk before applying.

load-order:

- .pi (Index) -> .ti (Rules) -> Adapter (Tech) -> .ptl (Sprint) -> .pd (Task)

v3.1-compression:

- **Standard**: Follow `core/COMPRESSION_RULES.ti`.
- **Directive**: "Minimize tokens. Maximize density."
