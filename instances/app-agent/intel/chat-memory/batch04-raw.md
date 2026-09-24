# batch04 — raw (thread: support/pricing)

- **Ingested:** 2026-07-10 (ingestion order #4)
- **Type:** Slack **thread** branching off Nick's support-tiers message (Wed ~2026-07-01, 5:50 PM). Newest content = Sam's `pricing-proposal.html` (draft v2, **2026-07-10**).
- **Participants:** Nick Steele, Sam, Vinay
- **Domain:** FOUNDERS / GTM (pricing + partner channel). Out-of-band business — ROOT logs to governance; not Totem-executable code (but has product hooks: metering, BYOK, OpenRouter routing, request-pack portal).
- **Fidelity:** thread messages verbatim; `pricing-proposal.html` captured as a structured digest of its substance (not every sentence).

---

## Thread messages

**Nick Steele (Wed 5:50 PM)** — support-tier proposal $500 / $750 / $1000 (uptime, engineering days, tokens, storage) — see [batch03](batch03-raw.md).
**Sam (Wed 6:05 PM)** — Lean toward **tiered pricing**: segments = Small Business / Medium Business / Enterprise-Government; channels = Direct customers / Resellers / Reseller's referrals.
**Vinay (Wed 6:22 PM)** — How do we **track / rate-limit token usage**? Don't we have a **BYOK** option?
**Nick Steele (Wed 7:39 PM)** — Plan: use **OpenRouter** so they can switch to anything; give token limits based on **oss-120b** if they don't want to manage it. 10M on oss-120b ≈ **$1.50**, 20M ≈ $3, 30M ≈ $4.50; then oss-120b **free** (zero tokens, spotty availability) unless **BYOK**. Goal: one-click install, no need to provide their own keys. @Sam thoughts on tiers + what we'd charge?
**Sam (Yesterday 2:07 PM)** — Yes, working on it.
**Sam (Yesterday 4:28 PM)** — Took a while — lots of research into what worked/failed with other AI app-building framework companies. → **`pricing-proposal.html`** (digest below).

---

## `pricing-proposal.html` — digest (draft v2, 2026-07-10, "for Sam & Nick's review")

> Header avatar "PF" (Platform Factory workspace). Comps verified 8–9 Jul 2026. Companion docs referenced but not ingested: `pricing-benchmarks.html`, `plan-for-review.html` (reward/ownership model).

**Thesis (3 lines):** (1) AI-platform self-serve tiers run ~$100–650/mo; enterprise $25k–3M+/yr (medians $100–400k). (2) Everyone meters AI in credits/assists/actions (MS ~$0.01/credit, Salesforce ~$0.10/action) and gates enterprise on self-hosting, SSO, SLA+named support, compliance. (3) Palantir prices support (~25–30% of licence) + per-app maintenance (£6–20k/mo) as line items → validates selling support + engineering as products, not perks.

**Positioning:** We sell a **service on our framework** (built + run + supported, SLA, bounded included engineering), not a DIY tool. Anchor answer to "why $500 vs Lovable $50": a $200/mo DIY app still needs a builder/maintainer → DIY costs more.

**Comps captured:** self-serve tools — Lovable ($25/$50/custom), Replit ($25/$100/custom), Vercel v0 ($30/$100/user), Bubble ($29–549/app), Superblocks ($100/builder), Dify ($0/$59/$159/custom; closest OSS analog, meters per app), LangChain/LangSmith ($0/$39/enterprise ~$100k self-host; "structural twin"). Enterprise cohort — CrewAI (enterprise incl. **50 dev-hrs/mo**), deepset/Haystack (4 advisory hrs/mo; cleanest structural match), ServiceNow (~$130k avg; "assists"; Prime = only tier allowing custom agents), Palantir (£3M/yr; support+maintenance as SKUs), C3 AI (~$1.4M avg).

**Proposed 4-level ladder** (per production app / mo, annual):
| Tier | Price | For | Uptime | Infra | Included eng (change requests) | AI (messages/mo) | Storage |
|---|---|---|---|---|---|---|---|
| **BUSINESS** | $500 | small biz | 99.5% | shared | 1/mo | 15,000 | 10 GB |
| **GROWTH** | $1,000 | growing | 99.9% | dedicated + failover, SSO | 2/mo | 40,000 | 25 GB |
| **SCALE** | $2,000 | revenue-critical | 99.95% | cluster + HA + CDN, custom agents, SOC 2 | 4/mo + priority | 80,000 | 100 GB |
| **ENTERPRISE / GOV** | custom, from ~$3,000/mo; **~$30k/yr acct min** | gov/regulated | custom SLA | self-host/VPC/on-prem, SSO/SCIM, HIPAA/BAA | custom blocks (Palantir £6–20k/mo model) | committed | custom |

Every tier: **unlimited app users (no per-seat)**, early-access channel (features up to 6 mo before free release), same-day security fixes. Additional apps ~50% off list, pooled allowances.

**Key model decisions:**
- Meter in **messages/actions, not tokens** (buyer-facing; tokens stay internal → margin grows as models cheapen). Agent actions = 10–100 messages weighted by complexity.
- Included engineering in **change requests, not hours** (scoped tweak/fix deliverable in a day; AI executes, human reviews; use-it-or-lose-it) → decouples promise from human time; unit cost falls as AI improves.
- **Request packs** (paid overage): single $250 · 5-pack $1,000 · 10-pack $1,750 · enterprise blocks custom.
- Kill-switch: if measured **human-minutes per change request** > ~$120 / >2 hrs, re-price. "The whole model lives on this ratio — measure from customer one." Target ~1 hr/request → 1 engineer services ~50–100 apps (managed-WordPress / WP Engine analogy).
- ~2× price steps (Red Hat/Ubuntu support multiplier); published overages (~$10–15 / extra 1k messages, ~$0.20/GB/mo).

**Partner channel (both tracks from launch):**
- **Referral ("affiliate"):** partner brings client (buys from us at list); earns **20% of subscription for 12 mo**, clawback on early churn; we support.
- **Reseller:** partner buys at **20% off list (→25–30% certified)**, bills/white-labels client, does first-line support + delivers included change requests; we're tier-2. Certification = 2 certified staff + 2 production apps + support capability + good standing + volume ($50k+/yr for 30%) + annual recert. Existing resellers = "Founding Partners" grandfathered yr 1.
- Conflict rules: one list price everywhere; deal registration (90-day protection + 5% kicker); price floor = max partner discount; registered-deal-closed-direct still paid. Enterprise/Gov defaults to direct/co-sell.

**Market findings:** nobody does our exact model (free framework + built/run/supported per subscription). Near-misses that died prove demand (Botpress Managed $1,495/mo retired; Databutton $1,999 human-devs withdrawn; Langflow hosted shut Apr 2026; Griptape acquired). The gap ($6k–24k/yr per app + one-time paid build) was unservable until AI cut human-hours-per-outcome — servable now under 4 conditions: one standardized framework, scope discipline, partial utilization, AI-first support.
