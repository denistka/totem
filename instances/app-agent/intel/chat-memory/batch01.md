# batch01 — parsed / analyzed

**Event:** 🚀 **Production milestone** — DMG (Doherty Marketing Group, first paying customer) went live serving *their* first end-customer, **Zing! Patio**, with full multi-tenant isolation (agent knowledge, tasks, files, documents, user management all separated).

**Why it matters (ROOT):** This is the technical proof of the whole business model — *"our customers can sell to their own customers."* The Red Hat / open-source-enterprise thesis (E03) now has a working 2-level tenancy in production, and it de-risks the DMG contract (E04). This is the single biggest de-risking event in the channel so far.

## Role routing
| Role | What / where | Action | Status |
|------|-------------|--------|--------|
| **ROOT** | Log milestone; update north-star evidence; the "Monday core merge" is an intake event | Track the merge; decide fork-isolation posture (ties E17) before code lands upstream | OPEN |
| **ARCHITECT** | Multi-tenant isolation design (per-tenant knowledge/files/users) built in the DMG deploy | Capture the isolation architecture before merge; verify it fits the core→org→apps cascade | OPEN |
| **DEVOPS** | *"bring all this back into the core on Monday"* = upstream integration (~Mon 2026-07-13, tentative) | Plan/verify the merge of multi-tenant work from DMG deploy into `app-agent-io/core` | UPCOMING |
| **QA/PLANNER** | Regression risk on tenant isolation during the merge | Decompose a merge+verify sprint once ROOT rules on isolation | HOLD (gate:LOCKED) |

## Product intel captured (from screenshot)
- **Admin portal IA:** Home / Projects / Files / Agent Knowledge / System(Accounts, Status, Logs, Security[Guardrails, Audit, Compliance, Governance, Attestation], Testing, Backups) / Settings(Defaults, API, Keys). The enterprise Security/Governance/Compliance/Attestation suite grounds Sam's AI_OPERATIONS_CHARTER (E13) and Vinay's admin-portal work (E09).
- **Integrations:** Replicate (image gen), `text-embedding-3-small` (RAG embeddings), Cloudflare Pages (`*.dmg-admin.pages.dev`).
- **Tenancy:** DMG (owner) ⊃ Zing! Patio (end-customer). Per-tenant document sets + isolated agents.

## Cross-refs
- E03/E04 (business model + DMG customer) — this is their live realization.
- E13/E09 (guardrails / admin portal) — Security nav confirms the governance suite shipped.
- **E17 (fork data-leak)** — multi-tenant *data* isolation and repo *fork* isolation are the same concern at two layers; the Monday core-merge must not cross tenant/client boundaries.

## New person / open questions
- **Tim** — logged-in user on the Zing! Patio tenant. Internal teammate or customer-side (Doherty/Zing)? → see [TEAM.ti]. Likely a *tenant account*, not necessarily a Slack member.
- Exact "Monday" date (tentative 2026-07-13) — confirm.
- What exactly "bring back into core" touches (does it hit the upstream Denis's fork tracks?).
