# batch11 — raw (sqlite PR #110, expansion plans, verbalspeech.ai)

- **Ingested:** 2026-07-10 (ingestion order #11)
- **Type:** Vinay/Nick threads (~Jun 11–16) on the sqlite fix + deployment expansion.
- **Grounds:** E07 (PR #110 lazy require). **New venture:** verbalspeech.ai.

---

- **Vinay 8:52** — Adjusted the **sqlite imports in core to make the app work on node**: `core/pull/110`. *(= the lazy-require fix the repo-scan CONFIRMED for E07.)*
- **Nick (Jun 11 9:10 AM)** — Great work Vinay! **DMG wants to sign a contract for their own copy** too, while Zing Patio reviews the POC next week. **Zing also wants their website rebuilt using the core.** "Things are taking off."
- **Nick 9:17 AM** — Next steps: (1) add you to **CloudFlare** to deploy to **Pages** (CI/CD via GitHub Actions already at VoyceMe: dev deploy on develop push, prod deploy on main push); (2) add you to **GCP** to deploy the API app. Also **3 more copies** needed:
  1. **Our own core copy** — landing page + internal app, with CI/CD.
  2. **DMG copy** — they'll provide DNS + a GitHub account (goes on their GitHub).
  3. **verbalspeech.ai** — "a startup I'm getting off the ground. We just got funding to buy an internal AI server (**RTX 6000 pro**), and they're working on **$3m in funding**, just transferred the domain to CloudFlare. Convert their **Vue Quasar 2 app to Nuxt + the core format**?"
- **Vinay** — Sure, starting on ours first. (Jun 15) When can I expect access? Do you prefer **GCP for our core API**? Do we have a domain for app agent?
- **Nick (Jun 15 11:02 PM)** — Yes, **app-agent.io**. Rachel's to-do to set up on CloudFlare; it was on **Digital Ocean**, disabled for the move. Familiar with CloudFlare? Take it on?
- **Vinay (Jun 16 7:20 AM)** — Yes. Building a **marketing-platform-style app using our core** with CI/CD. (7:23) **Forked a repo from core, like we do for each customer** — a showcase a prospect visits to see the platform, what app-agent can do for their business, maybe a pricing list. (7:24) Should have an **AI chat agent that talks about app agent**, fed the full marketing material.
- **Nick 3:57 PM** — Awesome, similar to what **Rachel** is doing — swap notes / she can give you her code to feed to Claude. I'll ask her to reach out.
- **Vinay 6:33 PM** — Can show a working copy in a day or two, temporarily hosted; move to Cloudflare/GCP when ready.

---

## Significance
- **PR #110** = the E07 lazy-require fix (grounding CONFIRMED). Timeline: better-sqlite3 crash reported → `bun:sqlite` migration (#102) → lazy `require()` for Node compat (#110).
- **New entity: `verbalspeech.ai`** — a separate Nick startup (RTX 6000 pro, raising ~$3m, Vue Quasar 2 → Nuxt/core port) — another app-agent "yellow" fork target. Add to org map.
- **Deployment model crystallizing:** every copy (internal, DMG, verbalspeech, marketing demo) = a **fork of core** with Cloudflare Pages (front) + GCP (API), dev→develop / prod→main. Reinforces the **fork-per-customer** model that makes the [batch07](batch07-raw.md) data-leak risk systemic.
- **`app-agent.io`** infra migration: Digital Ocean → Cloudflare (Rachel).
