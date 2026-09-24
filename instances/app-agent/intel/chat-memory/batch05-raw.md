# batch05 — raw (threads + feature matrix)

- **Ingested:** 2026-07-10 (ingestion order #5)
- **Type:** several Slack **threads** (Jun 30 – Jul 1) + the `features-flow.png` product/multitenancy matrix.
- **Participants:** Nick Steele, Sam, Vinay, Ayman.B, Ajay Kumar
- **Domain:** GTM/product (tiers, multitenancy, self-healing/Hermes) + org structure.

---

## 🔑 Org signal
> **"8 external people are from Platform-Factory"** (PF). Platform-Factory = an **external dev shop** sharing this channel (Slack Connect); Nick earlier: *"36 messages just from platform factory since Thursday."* Several of the engineers (likely **Vinay, Ayman.B, Dylan Grey, Ajay?**) appear to be **Platform-Factory** contractors, not app-agent employees. app-agent principals = **Nick, Sam, Angelica, Rachel**. Denis = **DAB** (own org). → to confirm in [../TEAM.ti](../TEAM.ti).

---

## Thread — meet Ajay Kumar (Wed)
- **Nick (12:43 AM)** — meet @Ajay Kumar, helping set up the **deployment process** (demo planned). Owns **pandastack.io**; for **blue** (managed cloud) accounts we can provision on **PandaStack** (static sites, containers, DBs, cron, edge functions from GitHub).
- **Ayman.B / Sam / Vinay** — welcome Ajay. **Ajay** — thanks.

## Thread — account types (Tue)
- **Sam (8:20 PM)** — So: Developer/Pro, Managed, Developer/Pro Reseller, Managed Reseller.
- **Nick (8:23 PM)** — Either **yellow or blue can resell; only green cannot**. Green limitations are **technical only** — not a product or artificial wall.

## Thread — Zing! Patio signed (Jul 1)
- **Nick (12:03 AM)** — **Zing! Patio official monthly customer**: $500/mo support contract (up to 5 hrs dev/support per month); will upgrade if needed. "Time to get more rigid with our processes."
- **Vinay (9:02 AM)** — Any new features they expect?
- **Nick (5:34 PM)** — Yes, sending over. **Phases 2–5 expected now**; they want a **quote for a website redesign**.

## Thread — self-healing / Hermes (Jun 30 – Jul 1)
- **Sam (Jun 30 11:03 AM)** — self-healing/improving system proposal (see [batch03](batch03-raw.md) for full text). [Karpathy YouTube link].
- **Nick (Jul 1 12:27 AM)** — Right direction. The Karpathy raw/wiki folder doesn't scale for customers (more personal-use); but our existing **Turbopuffer RAG** can work. Rest sounds good. @Sam want to **spec it out**? We plan a **Hermes agent** — want to take that on?
- **Sam (12:29 PM)** — Happy to; point me in the right direction. (12:31) I pointed to the video for the self-healing aspect, not his procedure.
- **Nick (12:47 AM)** — I'll have our **internal core deployed by tomorrow** — an agent with **RAG + prompt + tools**; we just have to give it **skills**.

---

## `features-flow.png` — product & multitenancy matrix

**Tenant hierarchy diagram:** purple **root (App Agent core / parent)** → **yellow** + **blue** direct customers → each can have **green** (resold SaaS) children; yellow/blue can also nest further. Visualizes the reseller multi-tenancy.

**Tier legend:** **Self-hosted = yellow (Developer/Pro)** · **Cloud-hosted = blue (Managed)** · **SaaS Client = green (Reseller / managed no-code)**. "Parent" = provided by the tenant above (the reseller/core); "Self" = the tenant owns it.

| Feature | Self-hosted (yellow) | Cloud-hosted (blue) | SaaS Client (green) |
|---|---|---|---|
| **Ownership · Source Code** | Self | Self | Parent |
| **Ownership · Infrastructure** | Self | Parent | Parent |
| **Ownership · AI Providers** | Self | Self or Parent | Self or Parent |
| **Security · Audit Trail** | ✓ | ✓ | ✓ |
| **Security · Compliance Monitoring** | ✓ | ✓ | ✓ |
| **Security · Governance** | ✓ | ✓ | Parent |
| **Security · Attestation** | ✓ | ✓ | Parent |
| **Security · Guardrails** | ✓ | ✓ | Self or Parent |
| **Security · Logs** | ✓ | ✓ | ✓ |
| **Agent · Vision / Audio / Voice** | ✓ | ✓ | ✓ |
| **Agent · Coding** | ✓ | ✓ | — |
| **Agent · Custom Tools** | ✓ | ✓ | — |
| **Agent · MCP Servers** | ✓ | ✓ | — |
| **Agent · Company Knowledge / PDF Parsing** | ✓ | ✓ | ✓ |
| **Agent · Document / Image / Audio / Video / Music Generation** | ✓ | ✓ | ✓ |
| **Integrations · Zoom / Slack / SMS** | ✓ | ✓ | ✓ |
| **Business · Multitenancy** | ✓ | ✓ | — |
| **Business · Custom Roles / Groups / Time Tracking / Backups / Projects / Tasks / Billing** | ✓ | ✓ | ✓ |
| **Business · Task Scheduling** | ✓ | ✓ | — |
| **Product · Users / White Labeling / API Management / Status Page / Issue API Keys / Custom Agents / Public Agents / Customer Admin Portal / Customer Notifications** | ✓ | ✓ | ✓ |
| **Product · Custom Apps** | ✓ | ✓ | — |
| **Product · Custom APIs** | ✓ | ✓ | — |
| **Product · Customer A/B Testing** | ✓ | ✓ | — |

**Reading:** green (resold SaaS) loses the *builder* capabilities — Coding, Custom Tools, MCP Servers, Custom Apps/APIs, Multitenancy, Task Scheduling, A/B Testing — and inherits Governance/Attestation from the Parent. Everything else (agent media abilities, knowledge, integrations, admin portal, white-label) is available at all three tiers. Matches Nick's "green limits are technical only."
