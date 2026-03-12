# Architectural Memory (INVARIANTS.md)

Architectural Memory is the practice of formalizing and freezing decisions made during a sprint to ensure they are carried forward and protected in future work.

## The INVARIANTS.md Pattern

At the end of every sprint, once the goals are achieved, the Architect (or ROOT) should extract "frozen" decisions and record them in an `INVARIANTS.md` file within the project instance.

### What goes in INVARIANTS.md?
- **API Contracts**: Finalized endpoints and request/response shapes.
- **Design Tokens**: Colors, spacing, and typography choices.
- **Structural Decisions**: Library choices, directory structures, and naming conventions.
- **Logic Patterns**: How complex state or side effects are handled.

## Enforcement

1. **Pre-Sprint Audit**: Every new sprint (`.ptl`) must reference the existing invariants.
2. **Explicit Modification**: Any change to a previously established invariant requires a specific task and justification.
3. **Protection**: Guardians should be briefed to cross-reference `INVARIANTS.md` before suggesting changes that contradict prior decisions.
