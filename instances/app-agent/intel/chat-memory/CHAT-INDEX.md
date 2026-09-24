# Chat Memory — Index

Instance chat memory for **app-agent** (Slack #app-agent, private). Maintained by ROOT.
Denis feeds batches **newest→oldest**; batch number = **ingestion order**, NOT time order (see dates).

## Batches

| # (ingest) | Slack span | Participants | Raw | Parsed |
|---|---|---|---|---|
| 01 | ~2026-07-08/09 (go-live) | Nick | [batch01-raw](batch01-raw.md) | [batch01](batch01.md) |
| 02 | 2026-03-13 → ~mid-Jun (genesis; **was truncated**) | Rachel, Nick, Sam, Vinay, Ayman, Angelica, Dylan | [batch02-raw](batch02-raw.md) | → CHAT-INTEL |
| 03 | ~mid-Jun → 2026-07-09 (**contiguous** w/ 02; ends at 01) | Sam, Nick, Vinay, Rachel, Angelica, Ayman, **Ajay (new)**, **denistka** | [batch03-raw](batch03-raw.md) | → CHAT-INTEL |

**Coverage:** batch02 + batch03 = the full channel arc **2026-03-13 → 2026-07-09** (batch01 is a preview of batch03's tail). The batch02 truncation gap is closed by batch03.

## Chronological reading order
`batch02-raw` (genesis) → `batch03-raw` (through go-live). Cross-batch analysis lives in [CHAT-INTEL](CHAT-INTEL.md); team roster in [../TEAM.ti](../TEAM.ti).

## Conventions
- **Raw files** = source of truth, verbatim — **secrets redacted** (see 🔴 below).
- **Parsed/analysis** consolidated in `CHAT-INTEL.md` (rolling, cross-batch) rather than per-batch, since the history is one continuous arc.
- Grounding evidence (repo-verified) from workflow `wmca6it0x` is folded into CHAT-INTEL.

## 🔴 Redactions / security (do not restore)
- **batch03** — Nick posted a live `sk-proj-…` OpenAI key (redacted). **ROTATE.**
- Grounding also found an `sk-or-v1` key committed in `core/temp.md`. **ROTATE.**
- See [CHAT-INTEL § Security & Governance](CHAT-INTEL.md).

## Known gaps
- Attachments (Word doc, meeting `.mp4`, `features-flow.png`, OpenJurist screenshot PDFs, `SECURITY_HANDOFF.md`, `app-agent-capabilities.md`) referenced but not ingested as files — only described.
- Exact calendar dates: Slack showed times not always dates; anchored to `GMT20260512` (DMG meeting) + `pre-reset-2026-06-25` tag + channel-created 2026-03-13.
