# batch06 — raw (threads: Peabody, infra/accounts, typecheck-handoff)

- **Ingested:** 2026-07-10 (ingestion order #6)
- **Type:** Slack threads, **Jun 16 – Jun 25**. Fills detail behind voice/Peabody, infra accounts, and the Bun typecheck saga. **Grounds** several items the repo-scan couldn't (TYPECHECK-HANDOFF.md, branch-protection blocker, Bun root-cause commit).
- **Participants:** Nick Steele, Vinay, Sam, Angelica Steele, Rachel Feather

---

## Thread — PlayEngine (Jun 25)
- **Nick 5:09 AM** — PlayEngine demo (see [batch03](batch03-raw.md)): 450M distilled model, 10 agents on a 2080, Roblox/Do Big Studios (`dobig.com/games`), "built 100% with app agent."
- **Sam 8:41 AM** — Amazing! Great work!

## Thread — Peabody Lawfirm POC (Jun 19)
- **Nick 3:09 AM** — New POC **Peabody Lawfirm** (like Zing but ingest **estate laws** + **voice assistance**). @Vinay set up another core for Peabody; next week add **voice support** (build on VoyceMe agent stuff). Added you to the **UCC core fork** (DMG owns it — **contract approved!**).
- **Vinay 11:52 AM** — Peabody POC set up: `github.com/app-agent-io/peabody-lawfirm`. Send estate-law docs to load the RAG.
- **Vinay 3:02 PM** — Voice: anything in mind? Start with **OpenAI Whisper**? See ticket `core/issues/122`.
- **Nick 5:23 PM** — OK. I noticed **OpenRouter has OpenAI audio** now — will that work?
- **Vinay 6:22 PM** — Haven't tried, looks like best choice; if pricing's a problem we research alternatives.
- **Nick 6:58 PM** — **They pay for everything** — we just provide software; once they demo it, we stop paying for credits. Checking the POC.
- **Vinay (Jun 22 4:37 PM)** — Starting on voice support.

## Thread — company accounts / infra (Jun 17–18)
- **Rachel 11:39 PM** — Set up @Vinay access: **Cloudflare** (domain migrated to company account under **nick@app-agent.io**; you're Super Admin), **Google Workspace** (**vinay@app-agent.io**). Nameservers moved in **Squarespace** → Cloudflare (propagating). @Angelica @Sam have invites.
- **Angelica 11:44 PM** — No invite yet; what's the email for — tool access or comms too? (11:47) Got one but link is broken [image].
- **Rachel** — resending; sent password-reset emails.
- **Nick (Jun 18 1:09 AM)** — Emails let you join App Agent accounts: **Cloudflare = CDN = front-end for demo apps; GCP = cloud provider = back-end APIs (+ Hermes agent); Turbopuffer = AI storage = knowledge bases.**
- **Vinay 6:18 PM** — What about **GitHub** — personal vs app-agent emails? Tie to app-agent IDs?
- **Angelica 6:21 PM** — Adds account-switching (already juggle the **steeleupwork** GitHub account 🫠), plus per-contributor we'd pay seat + email; GitHub is a dev's public **portfolio** — tying to org email makes contributions invisible.
- **Angelica 6:34 PM** — Maybe clearer **team structure in the org for security — "core team" vs outside contributors**? I set up **branch protections** but they **don't work on private repos until we pay** — @Rachel follow up with Nick (he asked me to protect develop + main; won't take effect until **GitHub Teams**).
- **Rachel 7:03 PM** — It's **$48/mo, min 12 seats**. I'll talk to Nick; if you think we need it he won't mind.
- **Nick 7:35 PM** — For GitHub, keep personal — it bumps your personal stats (commit credit); "GitHub is social media for smart developers."

## Thread — TYPECHECK-HANDOFF (Jun 16–19)  ← grounds E18
- **Sam (Jun 16 2:42 PM)** — Handoff doc at **`C:\Users\samde\app-agent-io-core\TYPECHECK-HANDOFF.md`** (his fork; dated **2026-06-16**). Root cause: the **bun 1.2.15 → 1.3.13 bump (commit `53fa346`, 2026-06-07)** changed the default workspace linker; `bun.lock` has `configVersion: 0` so Bun 1.3 keeps it **hoisted**, but this monorepo only works under **isolated**. Hoisted → nuxt unresolvable from workspaces → `DefineNuxtConfig has no call signatures`. Isolated → nuxt works but exposes undeclared cross-layer deps. Doc covers exact versions (nuxt 4.3.0, vue-tsc 3.2.4…), a 9-row attempts table (dead ends: `--force`, `--ignore-scripts`), the 2 real masked type errors, the A/B decision. Left `node_modules` as a manual isolated install (typecheck GREEN), 2 uncommitted changes (`PermalinkBar.vue`, `core/package.json` +drizzle-orm); **`bun.lock` unchanged so green isn't reproducible by fresh/CI install**. **Recommendation: Option A — revert Bun pin to 1.2.15** (the surgical undo). Nothing committed (a handoff).
- **Vinay 8:31 PM** — Let me check, need some time.
- **Sam 10:05 PM** — But I feel it's not figuring it out because **Opus isn't working like it used to** — lots of online chatter.
- **Vinay (Jun 17 11:08 AM)** — Is **Fable** not working in the US anymore? It's disabled in India.
- **Sam 11:08 AM** — They **turned it off a few days ago. Everywhere.** "Trump is punishing Anthropic" 😂
- **Sam (Jun 19 12:37 AM)** — [Claude] "you're good to go — the 'huge typecheck issue' was a false alarm; the real parts are fixed + merged (**PR #97**, CI green)."
- **Vinay 7:27 AM** — Oh wow! Let me check the PR.

---

## Grounding reconciliations (fold into CHAT-INTEL)
- **TYPECHECK-HANDOFF.md** — grounding said "does not exist in any repo"; **now grounded**: it's on **Sam's Windows machine** (`C:\Users\samde\…`), fork-only. Not a discrepancy — confirms fork-local.
- **Bun saga** — root cause is commit **`53fa346` (bun 1.2.15→1.3.13, 2026-06-07)**; the in-repo `bun@1.2.15` pin = **Option A already taken**. Matches grounding.
- **Branch protection (E14/E17)** — concrete blocker identified: private-repo branch protection needs **GitHub Teams ($48/mo, 12-seat min)**; Angelica configured develop+main but they're inert until paid. This is why the ~650-commit accident wasn't prevented.
- **Infra role map** — Cloudflare=CDN/front-end · GCP=back-end APIs+Hermes · Turbopuffer=RAG storage · Squarespace=registrar · shared **steeleupwork** GitHub org.
- **Model availability** — Fable was **globally disabled ~mid-June** then "coming back" (batch03); reconciles the Fable-love vs Opus-complaints timeline.
