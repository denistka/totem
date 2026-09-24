# batch07 — raw (threads: docs-cleanup PR #116, RAG/MCP, 🔴 fork data-leak disclosure)

- **Ingested:** 2026-07-10 (ingestion order #7)
- **Type:** Slack threads, **Jun 15 – Jun 19**. Contains the **definitive E17 data-leak disclosure** from Angelica.
- **Participants:** Sam, Nick Steele, Angelica Steele, Vinay

---

## Thread — Sam's PR (Jun 15)
- **Sam 10:48 PM** — You don't have to read any of it. Angelica showed me how to do a PR; it's in GitHub.
- **Nick 10:53 PM** — You made a PR with all of the above? Ask Vinay to review your work.
- **Sam 10:54 PM** — Yes, sir!

## Thread — RAG / MCP retrieval design (Jun 17)
- **Nick 1:21 AM** — (numbered) 1 — **MCP for retrieval** exists in the VoyceMe core already; Vinay did a version for **Zing! Patio** (Nick demoing Friday). 2 — docs location: agreed. 3 — sync runs: fine for now — done by customers once at install (by us) + once per API pull; should run on a **trigger based on repo config**. 4 — **chunking + embedding model** already set up in VoyceMe core, Vinay cloned it — **don't duplicate; talk to Vinay.** "I agree with everything, just check in with Vinay first."
- **Angelica 1:22 AM** — @Vinay time to meet this week?

## Thread — docs cleanup PR #116 + 🔴 data-leak (Jun 17–19)
- **Angelica (Jun 17 4:18 AM)** — PR for **docs cleanup** (`core/pull/116`); Turbopuffer separate commit later.
- **Angelica 4:31 AM** — Did it from **main instead of dev**, need to revise — went ~80 → **500+ changed files**. Ignore until tomorrow.
- **Angelica 7:56 PM** — Nvm switching to dev — **dev is empty** 🤨. @Nick since it's just docs cleanup, approve my PR to main? I'll catch develop up to main (branch-protection plan), clean stale branches after meeting Vinay.
- **Nick (Jun 19 5:23 PM)** — Angelica, your PR **deletes a lot of defaults for agents**? Did a review, got questions.
- **Angelica 6:04 PM** — Gist: redundancy/discrepancies between **AGENTS.md** and `/core/docs`. Claude recommended making **AGENTS.md a table of contents** directing to docs, keeping content in separate `/docs` files → single source of truth (table in PR maps each removed section to its docs home). **Let's not merge yet** either way —

  > **🔴 "I learned after accidentally opening a new PR from downstream last night that there may be a DATA LEAK from my repo into yours that I'm trying to figure out first.**
  > When forks of core (like **Continuum**) open a PR, it **defaults to sending it back to core** instead of their own repo — if you click 'open PR' on a branch in your own repo without specifying, it sends back to core.
  > I have a ticket with support. Are you aware that **all forked repositories commit to a single shared object pool that can see into each other if an accidental upstream PR is made — even if that PR is closed and never merged**?
  > E.g. if **Upper Cervical Care** accidentally creates a PR back to core, it exposes their code to all other clients that forked from core — someone like **RYP** could browse all their repo files from that snapshot.
  > GitHub support told me that due to a PR I didn't even realize I made **3 months ago**, a **side door into my repo leaked into: Upper Cervical Care, OpenJurist, Rachel's repo, and 2 app-agent repos.**
  > This is a security risk, especially if we service clients that are **direct competitors** of each other. I'll give a more detailed report as I learn more. Maybe it's less of an issue than it's being made out to be right now."

---

## 🔴 Security significance (fold into CHAT-INTEL — HIGH priority)
This is the **concrete, GitHub-support-confirmed** version of E17, and it is worse than "hazard": an **actual cross-fork exposure** is reported.
- **Mechanism:** GitHub fork networks share a single object pool; a PR opened from a fork toward the parent (the default base) can leave that fork's commit snapshot reachable across the network — **even after the PR is closed/unmerged**.
- **Reported blast radius (per GitHub support):** a stray PR (~3 months prior) exposed a "side door" into **Upper Cervical Care, OpenJurist, Rachel's repo, + 2 app-agent repos.** New client/fork names surfaced: **Continuum, RYP.**
- **Why it's existential for this business:** the entire model is "every customer **forks** core." If Client A's fork is browsable from Client B's fork, the "customer owns everything, fully isolated" promise breaks at the **source-control layer** — distinct from (and beneath) the app-level tenant isolation demoed at go-live (batch01).
- **Compounding:** branch protection is **inert** (private-repo → needs GitHub Teams $48/mo, [batch06](batch06-raw.md)); the ~650-commit accident ([batch03](batch03-raw.md)) shows the same fork/base-default class of mistake already happened.
- **ROOT action items:** (1) confirm whether Denis's own `DAWWWB-app-agent` fork is in this shared network (grounding said yes — shares root commit `9a9309d`); (2) track Angelica's GitHub-support outcome; (3) the real fix is likely **separate repos per client, not forks of core** (or private mirrors) — a governance decision for Nick/Angelica.
