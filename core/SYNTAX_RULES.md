# MRPP Syntax & Compression Rules

## Syntax Symbols

| Symbol | Meaning                                        |
| ------ | ---------------------------------------------- | ---------------- |
| `:`    | Key-value separator                            |
| `,`    | List item separator                            |
| `[]`   | Array/List                                     |
| `→`    | Logical flow / dependency                      |
| `+`    | Combination / union                            |
| `@`    | File reference                                 |
| `$`    | Cost tier ($ Budget, $$ Moderate, $$$ Premium) |
| `      | `                                              | Alternative (OR) |
| `#`    | Comment (ignored by machine)                   |

## Compression Rules

To avoid context bloat and optimize token usage:

1. **Abbreviations**:
   - `y`/`n` instead of `true`/`false`
   - `pts` (points), `est` (estimate), `dur` (duration)
   - `dep` (dependency), `ctx` (context), `ref` (reference)
   - `d1-am` (Day 1 morning)
2. **Omissions**:
   - No boilerplate markdown if not required.
   - Summarize code; use file references (`@path`) instead of inline blocks.
   - Remove repeated headers in task sequences.
3. **Formatting**:
   - Use compact YAML (no extra spaces).
   - Multi-line only when logical (phases, dispatch).

## Load Order (Machine)

1. `PROTOCOL_INDEX.pi` (or `TOTEM_INDEX.ti`)
2. `ARCHITECT.ti` (Universal architecture)
3. `Stack Adapters` (Tech specifics)
4. `S*.po` (Current task context)
