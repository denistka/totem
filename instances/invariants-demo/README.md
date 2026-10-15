# invariants-demo

Worked example for Totem versioned invariants (`core/INVARIANTS.ti`).

- Structured current set: `S01-INVARIANTS.md`
- Append-only history: `INVARIANTS-LOG.md`
- Fake code root: `fixture/` (used by `scripts/verify-invariants --self-test`)

```bash
node scripts/verify-invariants --instance instances/invariants-demo
node scripts/verify-invariants --self-test
```
