# CHAT-INTEL — app-agent cross-batch analysis

*Rolling ROOT intelligence over Slack #app-agent (private, Slack Connect), 2026-03-13 → 2026-07-10, **batches 01–11 (complete)**, grounded against real repos `app-agent-io/core`, `denistka/DAWWWB-app-agent(-dev)`, `totem` (grounding task `wmca6it0x`). Batches 06–11 are Slack threads ~Jun 11–25 (ingested newest→oldest) that back-fill/deepen the same window 01–05 summarized, plus add later-June expansion plans; they carry the channel's most important security and productization content.*

*Confidence tags: **CONFIRMED** (repo-verified file:line) · **PARTIAL** (structure verified, specifics Slack-only) · **UNCONFIRMED** (Slack-only, no repo artifact) · **NOT_IN_SCOPE** (0 in-repo hits, fork/CRM memory) · **[SLACK]** governance memory. Gate-discipline: every proposed epic is `gate:LOCKED` — ROOT logs & routes, never auto-executes.*

---

## 1. Executive snapshot

app-agent is a **no-moat, Red-Hat-style OSS-enterprise** play: give the framework away, sell **built+run+supported service per app** (setup fee + retainer), let customers **fork & own everything** across **yellow/blue/green** tiers with a referral+reseller partner channel. In ~4 months it went from an empty channel to a **live multi-tenant production go-live** (DMG → Zing! Patio, ~Jul 8-9), and by Jun 11 the founders declare **"things are taking off"** — a wave of new forks (DMG own-copy, Zing website rebuild, Peabody, verbalspeech.ai, app-agent's own copy, a marketing-demo showcase).

The **single most important structural fact**: three legal entities share one channel — app-agent (founders Nick/Sam/Angelica/Rachel), **Platform-Factory** (external dev shop ~8, where the *lead engineer Vinay* actually sits), vendors (PandaStack/Ajay), and DAB (Denis). Nearly all code is authored by an *external contractor* (`vinay-atomcx`, `samdeskin`).

The **strongest-grounded** body of work is Vinay's CI/test hardening (232→378 tests CONFIRMED; HARD feature-health gate live). The **weakest-grounded** are all business facts (pricing/equity/customers = 0 code hits). The **most urgent** items escalate materially in 06-11:
- **Two leaked secrets** (both ROTATE) — unchanged from 01-05.
- **🔴 The cross-fork data-leak is no longer just a precondition — batch07 supplies the actual, GitHub-support-confirmed incident**: a stray PR ~3 months prior leaked snapshots across **Upper Cervical Care + OpenJurist + Rachel's repo + 2 app-agent repos**, with new forks **Continuum** and **RYP** surfacing. This upgrades S5/E17 from PARTIAL-hazard toward **CONFIRMED-actual-exposure**, and because *every new copy is a fork of core*, the leak risk is now **systemic and growing**, not a one-off. Likely real fix = **separate repos per client, not forks of core** — which would unwind the entire fork-per-customer GTM model.

A second cross-cutting theme in 06-11: **Sam's standards trio + framework-feedback now have real content** (previously NOT_IN_SCOPE / fork-only). They converge strongly on Totem V6 (STATUS.md ≈ INVARIANTS.md; docs-lint ≈ feature-health gate; "model proposes, gate disposes" ≈ gate:LOCKED) — sharpening ROOT decision #2 (adopt vs keep Totem canonical).

---

## 2. Master timeline (phases)

| # | Phase | Dates | One-line | Driver |
|---|---|---|---|---|
| 0 | Genesis & Team Formation | Mar 13 → ~14 | Rachel creates channel; core team + first PF engineers join | Rachel, Nick |
| 1 | CI / Test / Docs Foundation | ~Mar 14 → mid-Apr | Vinay: lint→typecheck→tests→feature-health; 232→378; 100% knowledge gate | Vinay |
| 2 | First Customer & Business Model | late Apr → May 12 | DMG discovered; $500 estimate paid; OSS-enterprise manifesto; Zing intro | Nick |
| 3 | Field-Testing Crucible (OpenJurist) | May → mid-Jun | Sam's 80-hr port → agent-behavior spec + TS/sqlite saga; standards trio authored in OJ fork | Sam (fb), Vinay (fix) |
| 4 | Infra, Accounts & 650-Commit Incident | mid-Jun → Jun 25 | Accounts stood up; core main clobbered; reset `974e43b` + branch-protection; **Bun 1.3 linker root-cause (b06)** | Rachel, Vinay, Angelica |
| 4.5 | **🔴 Fork data-leak disclosure** | **Jun 15–19 (b07)** | **Angelica: GitHub-support-confirmed cross-fork leak; PR #116 held; "separate repos not forks?"** | **Angelica** |
| 4.6 | **Standards / gate hardening** | **~Jun 11–15 (b08/09/10)** | **Pre-push gate, AGENT_WORKING_STANDARD, RELEASE_PROTOCOL, SECURITY_HANDOFF, STATUS.md + docs-lint** | **Sam** |
| 5 | Voice, Equity & Denis Onboarding | Jun 25 → Jun 26 | Voice STT/TTS live; Denis joins; 1%-equity offer; **Peabody voice via Whisper, issue #122 (b06)** | Vinay, Nick |
| 6 | Productization: Tiers/Pricing/Multitenancy | Jun 30 → Jul 1 | yellow/blue/green defined; Zing signs $500/mo; PandaStack; Hermes | Nick, Sam, Angelica |
| 6.5 | **"Things are taking off" — fork-per-copy expansion** | **~Jun 11–16 (b11)** | **DMG own-copy + Zing website rebuild + 3 more core copies + verbalspeech.ai + marketing-demo; app-agent.io DO→Cloudflare** | **Nick, Vinay** |
| 7 | Go-Live | ~Jul 8-9 | DMG→Zing! Patio live, multi-tenant proven | Nick, Angelica |
| 8 | Pricing Formalization (ongoing) | Jul 10 | Sam's 4-tier `pricing-proposal.html` v2 + partner channel | Sam |

**Hard date anchors:** `2026-03-13` channel created · `2026-05-12` DMG intro recording (`GMT20260512`) · `2026-06-07` **Bun 1.2.15→1.3.13 bump commit `53fa346`** (breaking linker change, b06) · `2026-06-11` **Angelica's branch-protection rulesets authored (b10); Nick's "things are taking off" expansion (b11); OpenJurist HANDOFF.md (b09)** · `2026-06-12` **Sam's APP-AGENT-FRAMEWORK-FEEDBACK doc + OJ PRs #20–#26 (b10)** · `2026-06-15/16` **TYPECHECK-HANDOFF.md dated (Sam's Windows fork, b06)** · `2026-06-15–19` **fork data-leak disclosure (b07)** · `2026-06-25` tag `pre-reset-2026-06-25` + reset to `974e43b` + voice #124 · `~2026-06-26` equity offer + Denis onboarded · `2026-07-01` Zing signs $500/mo (catalog docs dated 7/1) · `~2026-07-08/09` go-live · `2026-07-10` pricing-proposal.html v2.

---

## 3. Customer / GTM / Pricing ledger

> **Grounding headline:** every named-customer / pricing-tier / equity / partner / venture fact is **[SLACK]** governance memory with **zero code footprint**. Only the *philosophy* (zero-lock-in / customer-owns-everything) survives, thematically, in `core/temp-product-context.md`. All of it routes to **EPIC-FOUNDERS-GTM-LOG** (FOUNDERS out-of-band) — ROOT logs, no PLANNER decomposition. **Systemic note (b07/b11):** the GTM growth engine (more forks = more customers) is the *same axis* as the security blast radius — see §5 S5.

### 3a. Customer ledger

| Customer / venture | Tier | Status | $ / commercial | Grounding |
|---|---|---|---|---|
| **Doherty Marketing Group (DMG)** | yellow (forks & owns) | **Paying** — $500 estimate paid; **UCC-fork contract APPROVED (b06)**; **wants a 2nd contract for its OWN copy (b11)** on DMG's own DNS + own GitHub | ~**$2m/yr** projected through app-agent | **[SLACK]** `Doherty` → 0 files (E04 NOT_IN_SCOPE) |
| **Zing! Patio** (`shopatzing.com`) | green (SaaS/reseller managed) | **Signed** (Jul 1) — DMG's first end-customer; **also wants website rebuilt on the core (b11)** | **$500/mo** (≤5 hrs dev/support); phases 2-5 + redesign quote + website-rebuild scope | **[SLACK]** `Zing Patio` → 0 files; RAG lives in zing-patio fork (#104/#107) |
| **Peabody Lawfirm** | yellow (own core fork) | **POC** | not priced; **POC funding rule (b06): "they pay for everything; once they demo it, we stop paying for credits"** | **[SLACK]** repo `app-agent-io/peabody-lawfirm` CONFIRMED-named (b06); voice CONFIRMED (#124/#127, issue #122) |
| **UCC** (uppercervicalcare.com) | funnel inside DMG's fork | **contract APPROVED (b06)** — DMG owns the UCC core fork | 3,000+ chiropractors × $499-999/mo upsell | **[SLACK]** — no footprint; fork named in leak blast radius (b07) |
| **🆕 verbalspeech.ai** | yellow (another core fork) | **NEW — separate Nick venture (b11)** | Raising **~$3m**; bought internal AI server **RTX 6000 pro**; domain moved to Cloudflare | **[SLACK]** — port Vue Quasar 2 → Nuxt + core format |
| **🆕 app-agent (own copy)** | internal core fork | **NEW deploy plan (b11)** | Landing page + internal app, CI/CD; Vinay takes "ours first" | **[SLACK]** — domain `app-agent.io` |
| **🆕 Marketing-demo / showcase** | internal core fork | **NEW (b11, Vinay)** | Prospect-facing showcase forked from core "like we do for each customer," with pricing list + **AI chat agent that talks about app-agent itself** (fed full marketing material); parallels Rachel's build | **[SLACK]** — Vinay + Rachel swap code/notes |
| **🆕 Continuum / RYP** | forks of core | **surfaced only in leak disclosure (b07)** | — | **[SLACK]** — named as forks in the shared object pool; RYP the illustrative "competitor who could browse UCC's files" |
| *(context)* **Tim** | Zing tenant end-user | — | — | screenshot login; not a channel member |
| *(prior art)* **Brand-e** (`brande.ai`) | — | template | — | Nick's earlier build; DMG "same but for doctors/lawyers" |

**Value chain (updated):** core → **DMG (yellow, owns UCC fork ~$2m/yr, + 2nd own-copy contract)** → **Zing! Patio (green, $500/mo, + website rebuild)**; parallel yellow forks **Peabody** (estate-law RAG + voice), **verbalspeech.ai** (Nick's separate startup), **app-agent's own copy**, and a **marketing-demo showcase**; plus the **UCC 3,000-chiropractor funnel**. DMG is simultaneously customer, reseller, and demand engine. **New topology fact (b11):** DMG's own copy will live on **DMG's own GitHub account** — the first customer-hosted fork *outside app-agent's GitHub network*, which materially changes the fork-network/data-leak surface.

### 3b. Business model — "Red Hat for agents" (E03 PARTIAL)

No moat by doctrine ("our moat is that we don't have one; we open our borders"). Model = Red Hat/Mattermost OSS-enterprise, **not** SaaS, **not** an app. Customer owns EVERYTHING (code/cloud/DB/keys/domain). Revenue = **setup fee + monthly retainer**; cancel anytime; paid customers get features 3-6mo early, everyone eventually gets everything free. **POC economics now concrete (b06):** app-agent fronts API credits only through the demo, then the customer's own keys/billing take over — reinforcing "customer owns everything" at the POC-funding level. **Grounding:** the *ownership/zero-lock-in* theme is in `temp-product-context.md:41-52,155-164,243-248`; the tokens *Mattermost / Red Hat / setup fee / retainer* return **0 hits**.

### 3c. 3-tier client model (yellow/blue/green)

| Color | Name | Owns | Resell? |
|---|---|---|---|
| 🟡 Yellow | Self-hosted / Developer-Pro | Everything (source+infra+AI) | Yes |
| 🔵 Blue | Cloud-hosted / Managed | Source (Self); infra=Parent (PandaStack) | Yes |
| 🟢 Green | SaaS / Reseller (no-code) | Nothing (source+infra=Parent) | **No** |

"Either yellow or blue can resell; only green cannot." Green's limits are **"technical only — not a product or artificial wall."** Live: DMG=yellow, Peabody=yellow, Zing=green; verbalspeech.ai + app-agent-own + marketing-demo = yellow internal forks. `features-flow.png` — green loses builder capabilities (Coding, Custom Tools, MCP, Custom Apps/APIs, Multitenancy, Task Scheduling, A/B) and inherits Governance/Attestation from Parent; all agent-media/knowledge/integrations/white-label available at every tier. **Fork model structurally CONFIRMED (E17)** and now **operationally explicit (b06/b11)** — see 3g; tier logic itself has no core footprint (fork-only).

### 3d. Pricing — two artifacts, evolving

- **Nick's early support tiers (~Jul 1, superseded):** $500/$750/$1000-mo — SLA 24h/8h/1h, ½/1/1.5 free eng-days, 99/99.5/99.9% uptime, 10/20/30M tokens, 10/25/50 GB.
- **Sam's `pricing-proposal.html` v2 (Jul 10, 4-tier):** BUSINESS $500 → GROWTH $1,000 → SCALE $2,000 → ENTERPRISE/GOV custom (~$30k/yr min). Key shifts: **meter in messages/actions not tokens**; **included eng = "change requests" not hours**; **request-packs** ($250 single / $1,000 5-pack / $1,750 10-pack); unit-economics kill-switch (>~$120 or >2 hrs/request → re-price); ~2× price steps. Comps benchmarked (Dify "closest OSS analog", LangChain "structural twin", Palantir "support+maintenance as SKUs", plus dead near-misses Botpress/Databutton/Langflow proving latent demand). **Grounding (E21 NOT_IN_SCOPE):** `$500/$750/$1000` → 0 files; only "Contact for pricing" placeholder exists.
- **Marketing-demo showcase (b11)** ships with a **published pricing list** in-app — the first customer-visible pricing surface (still fork-only, no core footprint).

### 3e. Metering & routing (the productized hooks)

Meter in **messages not tokens** (margin grows as models cheapen). **OpenRouter** for routing + **BYOK**; voice is the carve-out (**direct OpenAI**, "can't use OpenRouter for that") — **but now under re-evaluation (b06):** Nick floats **OpenRouter's new OpenAI-audio** endpoint for Peabody's Whisper path; Vinay agrees it "looks like best choice if pricing isn't a problem." So the audio path is *under evaluation*, not ruled out. Default budget priced off `oss-120b`. **Grounding (E09 PARTIAL):** routing exists only as single-env-var in dev-fork `openrouter.ts:25`; **no user-facing model selector**; message-metering not implemented.

### 3f. Partner channel + equity

- **Referral:** 20% of subscription for 12mo, clawback on early churn. **Reseller:** 20% off list (→25-30% certified), white-label + first-line support. Deal-registration (90-day + 5% kicker); Enterprise/Gov defaults to direct. Existing resellers grandfathered as "Founding Partners."
- **Equity (E19 NOT_IN_SCOPE):** 1% to all channel members, 1-yr vest; 10M shares → 100k each; 50% internal / 50% investors; merit-based; seed in 90 days. `10,000,000`/`vesting`/`merit-based` → 0 files.
- **🆕 verbalspeech.ai (b11)** is a *separate* Nick startup raising ~$3m — cap-table/equity relationship to app-agent is an open question (§10).

### 3g. 🆕 Fork-per-customer deployment topology — now explicit & operational (b06/b11)

01-05 grounded the fork model only as a *data-leak precondition*. Batches 06/11 make the deployment topology explicit:
- **Front + API split (CONFIRMED via Slack):** every copy = **Cloudflare Pages** (front-end) + **GCP** (API app). Infra role-map (b06): Cloudflare=CDN/front · GCP=back-end APIs + Hermes agent · Turbopuffer=RAG/knowledge storage.
- **Branch→env mapping (NEW concrete, b11):** **dev deploy on `develop` push, prod deploy on `main` push**, CI/CD via GitHub Actions — the pattern already running at **VoyceMe** and now the template for every fork. Ties the `only-develop-to-main` branch-flow (§5 S4) to actual **deploy triggers**.
- **Every copy is a fork of core** (internal, DMG own-copy, Peabody, verbalspeech, marketing-demo). b11 explicitly says this **reinforces the batch07 data-leak systemic risk**.

### 3h. 🆕 Infra migration — app-agent.io Digital Ocean → Cloudflare (b11)

`app-agent.io` was on **Digital Ocean**, currently **disabled for the move**; Rachel's to-do to stand it up on **Cloudflare** (Vinay, familiar, takes it on). GCP for the core API. New infra line item not in 01-05.

---

## 4. Technical / PR / Feature ledger (grounded)

### 4a. PR / commit roll-up (all Vinay unless noted)

| PR/commit | What | Grounding |
|---|---|---|
| #72 | ADR⇄GitHub sync skill | skill present (`sync-adr-tickets`); merge unverified |
| #76 / #78/#79 | lint + typecheck (~120 errs; docs tsconfig bypass) | CI typecheck `ci.yml:28` CONFIRMED-intent |
| #80 | port pre-flight (3000-3014) | Slack-confirmed merge |
| #81 / #97 | feature-health CLI; 7 knowledge files; **HARD gate** 36%→100%; **#97 = TYPECHECK-HANDOFF "false alarm" resolved, CI green (b06)** | **CONFIRMED (E02)** `caa79c5`, `ci.yml:36-37`, `feature-health.js:249` |
| #84 | vitest in CI (232 tests) | **CONFIRMED (E01)** `3f74c6b` |
| #85/#92-96 | tests → **378** (auth/settings/plugins/supabase/mcp/composables) | **CONFIRMED (E01)** merge commits `a5da055`,`0c9ab5c`,`3e27ce4`,`6d2de45`,`29b3c18` |
| #102 | better-sqlite3 → **bun:sqlite** (better-sqlite3 removed from source) | **CONFIRMED (E07/E08)** `b227f00`,`04c764b`; 0 source hits |
| **#110** | lazy `require('bun:sqlite')` for **Node/turbo dev compat** — **"adjusted the sqlite imports in core to make the app work on node" (Vinay, b11)** | **CONFIRMED (E07)** `04c764b`; actor now attributed |
| #116 (HELD) | **docs-cleanup: AGENTS.md ↔ /core/docs redundancy → AGENTS.md as table-of-contents; opened from main not dev → ~80→500+ files; dev branch empty; held pending leak (b07)** | **NEW (b07)** — the exact PR that surfaced the data-leak |
| #124 / #127 + peabody#10 | **Voice** STT/TTS (OpenAI-direct), 2-gate flag; **Peabody voice via OpenAI Whisper, issue #122 (b06)** | Slack-confirmed; not line-grounded this pass |
| GH #104 / #107 | Zing RAG POC (fork core) + RAG modules from voyceme-core; **MCP-for-retrieval + chunking/embedding cloned from VoyceMe core — "don't duplicate, talk to Vinay" (b07)** | **NOT_IN_SCOPE (E09)** fork-only |
| issue #111 (OPEN) | CoreUserMenu login-button overflow | **CONFIRMED (E09)** `vinay-atomcx`, `CoreUserMenu.vue:171-180` |
| issue #122 (OPEN) | **Peabody voice: OpenAI Whisper starting point; OpenRouter OpenAI-audio alternative under eval (b06)** | **[SLACK]** — driving voice issue |
| **OJ #20–#26** | **STATUS.md + docs-lint reference impl on `samdeskin/app-agent-io-core-OpenJurist` (b10)** | **NOT_IN_SCOPE** (fork-only) |

### 4b. Cross-cutting technical ledger (grounded statuses)

| Item | Grounded status | Disposition |
|---|---|---|
| 232→378 unit tests | **CONFIRMED** (`3f74c6b`) | Done |
| "24%→64% statement coverage" | **UNCONFIRMED** (no lcov/badge; vitest-only Δ=90 not 146) | `EPIC-QA-COVERAGE-TRUTH` |
| 7 knowledge files + HARD feature-health gate | **CONFIRMED** (`caa79c5`) | Done |
| better-sqlite3 → bun:sqlite + lazy require | **CONFIRMED** (#102/#110; #110=Vinay, b11) | **RESOLVED, not open** — Sam's literal lazy-load-better-sqlite3 REJECTED; ordered timeline: crash → #102 bun:sqlite → #110 lazy require for Node/turbo |
| Windows node-gyp/VS fresh-install crash | **CONFIRMED** (migration doc:9-11, adr-007:81) | Resolved by migration |
| 5 pre-existing TS errors (really 3 codes) | **PARTIAL** — `feature.ts` TS2769, `paths.ts` TS2538/TS18048 deferred | `EPIC-DEVOPS-INSTALL-HARDEN` (2 remain; 3 cleared by `053a51b`) |
| **Bun typecheck root cause** | **PARTIAL→ mechanism now CONFIRMED-fork-local (b06)** — bump `53fa346` (2026-06-07) changed default workspace linker; `bun.lock configVersion:0` → 1.3 keeps **hoisted**, monorepo needs **isolated**; hoisted→nuxt unresolvable→`DefineNuxtConfig has no call signatures`; isolated→exposes undeclared cross-layer deps | See §4c |
| Bun pin `bun@1.2.15` (opt A) | **PARTIAL→ Option A = the LANDED outcome (b06)** — pin CONFIRMED (`package.json:48`); TYPECHECK-HANDOFF.md exists at `C:\Users\samde\app-agent-io-core\` (Sam's Windows fork, dated 2026-06-16) — **fork-local, NOT a repo discrepancy** | ROOT decision #1: ratify pin (recommended) |
| **Handoff reproducibility gap (b06)** | **NEW** — Sam left `node_modules` as manual isolated install (typecheck GREEN) but **`bun.lock` unchanged → green NOT reproducible by fresh/CI install**; 2 uncommitted (`PermalinkBar.vue`, `core/package.json` +drizzle-orm) | `EPIC-DEVOPS-INSTALL-HARDEN` (real CI gap) |
| Agent-behavior asks (URLs/intake/watchdog/dashboard) | **CONFIRMED in dev-fork** work-control | `EPIC-AGENT-UX-CHARTER` |
| Model-selector UI | **OPEN** (single env var only) | Charter |
| Proactive/autonomous execution | **CONTRADICTED** (`chat.llm.ts` "humans gate execution") | ROOT governance line |
| Self-healing beyond `retry.ts` | **PARTIAL** — only `retry.ts` (bounded build self-heal); rest ABSENT | Hermes = proposal only |
| **Standards trio + doc cleanup (E10-13)** | **NOT_IN_SCOPE (fork-only, 0 hits) — CONTENT now supplied by b08/09/10 (§4d)**; naming correction: the "operate/security" doc is **`SECURITY_HANDOFF.md`**, not the grounding-guessed `AI_OPERATIONS_CHARTER.md` | ROOT decision #2: adopt vs Totem-canonical |
| AGENTS.md (E16) | **CONFIRMED** exists (270 ln) — satisfies ask; **b10: AGENTS.md = cross-vendor entry point (Codex/Cursor read it; CLAUDE.md Claude-only)** | Verify pass only |
| Root .md pruning + stock README (E15) | **CONFIRMED un-applied** (`temp.md`, `todo-*`, `NAMING-ISSUE.md`) | `EPIC-REPO-HYGIENE-SEC` |
| RAG/admin-portal (E09) | **PARTIAL** — #111 + chat endpoint in core; RAG pipeline fork-only (#104/#107); MCP-retrieval cloned from VoyceMe, sync on repo-config trigger (b07) | `EPIC-ZING-RAG-INTAKE` |
| **Pre-push git hook (E14)** | **UNCONFIRMED→ grounded fork-local (b08)** — `git config core.hooksPath .githooks` → typecheck+tests (~2-3 min) per-clone; config doc `BRANCH_PROTECTION_SETUP.md`; CI still the real gate | Note only; feeds §4d |
| Voice (STT/TTS) | Slack-confirmed live in core; direct OpenAI; 2-gate flag; Whisper for Peabody | Done (Slack) |
| Multi-tenant isolation | Live at go-live (batch01); isolation code fork-only | `EPIC-ZING-RAG-INTAKE` (S6) |
| PlayEngine demo (450M model, 10 agents/2080) | Slack-only demo | Out of scope |

**Feature-family BUILT-vs-OPEN (dev-fork work-control, E05):** BUILT — clickable full URLs (`preview-info.ts`, header literally "(Sam's lesson)"), one-question intake (`chat.llm.ts:10` + S34/S35), verify/boot/retry watchdog (`runner/{build-verify,boot-verify,retry}.ts`), dev dashboard (`MetricsDashboard.vue`). OPEN — user model-selector UI. CONTRADICTED-BY-DESIGN — proactive execution (human-gated).

### 4c. Bun typecheck saga — closed & fork-local (b06)

`TYPECHECK-HANDOFF.md` (dated 2026-06-16, `C:\Users\samde\app-agent-io-core\` — Sam's Windows fork, **confirms grounding's "fork-only" prediction, not a discrepancy**):
- **Root cause:** the bun **1.2.15 → 1.3.13 bump, commit `53fa346` (2026-06-07)** changed the default workspace linker. `bun.lock` has `configVersion: 0` → Bun 1.3 keeps it **hoisted**, but the monorepo only resolves under **isolated**. Hoisted → nuxt unresolvable → `DefineNuxtConfig has no call signatures`. Isolated → nuxt works but exposes undeclared cross-layer deps.
- **Doc contents:** exact versions (nuxt 4.3.0, vue-tsc 3.2.4…), a **9-row attempts table** (dead ends incl `--force`, `--ignore-scripts`), the **2 real masked type errors**, and the A/B decision.
- **Landing state:** manual isolated `node_modules` install (typecheck GREEN locally) but **`bun.lock` unchanged → green NOT reproducible by fresh/CI install**; 2 uncommitted changes. **Recommendation: Option A — revert Bun pin to 1.2.15** = the pin grounding already found in-repo, so **Option A is the landed outcome**.
- **Coda (b06):** the "huge typecheck issue" was later declared a **false alarm** — real parts fixed + merged as **PR #97** (CI green). E18 is effectively **closed**, not open.

### 4d. 🆕 Sam's standards trio + framework-feedback — content digest (b08/09/10, all fork-only)

Grounding rated E10/E11/E12/E13 NOT_IN_SCOPE (fork-only, 0 hits). Sam pasted the actual contents into Slack; all authored in the OpenJurist fork (`samdeskin/app-agent-io-core-OpenJurist`). **Naming correction:** the third standard is **`SECURITY_HANDOFF.md`** (not the grounding-guessed `AI_OPERATIONS_CHARTER.md`). Trio = **Work / Ship / Operate**.

**(1) `AGENT_WORKING_STANDARD.md` — "Work" (b08; grounds E10/E12; commits `aaf3729`+`a67820f`).** Authored from a real audit: **8 agents over 129 docs + ~770 scripts**; found no "where things go" rule (`import/analysis/` = 92-file catch-all) and no rigor discipline (froze point-in-time facts). Three parts:
- **A. File/doc organization** — home = TYPE + LIFESPAN; full `import/{specs,audits,plans,runbooks,logs,comms,run-artifacts}` taxonomy; ADRs immutable at `core/docs/adr/0NN-…`; feature knowledge at `core/docs/knowledge/{slug}.md`. **Load-bearing rule:** `git grep -lI "<basename>"` before any `git mv`, update refs same commit.
- **B. Knowledge discipline** — date+cite every fact; never inline a volatile count in a durable doc; `[verified <date>]` vs `[ASSUMPTION]` vs `[TODO-VERIFY]`; end each change with a "what did I just make false?" grep sweep. Motivating bug: **CLAUDE.md said "645,757 opinions" when the DB held ~7.65M** (~10× stale, copied into 5+ docs).
- **C. Verification rigor** — verify before assert; evidence before "done" (green dev server ≠ typecheck); DB ≠ git. Also built `apps/openjurist/import/INDEX.md`; did 14 reference-gated renames; deferred bigger reorg to `HANDOFF.md`.

**(2) `RELEASE_PROTOCOL.md` — "Ship" (b09; grounds E11).** Thesis: *"models are confident and fast → replace 'trust the model' with 'verify the artifact behind a gate the model can't reach around'; the model proposes, the gate disposes."*
- **9 model rules** (one `feat/` branch per change; blast-radius first; pasted evidence; expand/contract migrations; independent review; never self-promote to prod; **never two agents on one tree**; run security checklist; extend controls never remove).
- **10 gated stages:** local change → impact analysis → **verify gate (stage 3, "where most model mistakes die")** → PR → CI → staging → smoke → human-approved prod → post-deploy verify → rollback.
- **4 enforcement layers in authority order:** ① branch protection (server-side, unbypassable) ② CI required checks (typecheck·migration-safety·build·lint·test) ③ human prod approval (required reviewers + OIDC, no long-lived keys) ④ local pre-push hook (*bypassable — never the gate*).
- **App Instantiation Contract** per app; reference instance `apps/openjurist/RELEASE.md`. **Documented gaps:** branch protection off (GitHub 403 free-private); CI lint/test not required + lint baseline broken (~13k errors from a gitignored Drupal dump); deploy stages dormant until AWS (`OJ_DEPLOY_ENABLED`).

**(3) `SECURITY_HANDOFF.md` — "Operate" (b09; re-pasted b10, dedup; grounds the E13 security dossier).** OpenJurist = public, **unauthenticated** legal-research site with **untrusted ingest** (CourtListener bulk, archive.org OCR, scraped Wikipedia, Shopify); only privileged role = admin.
- **7-layer defense-in-depth:** Cloudflare edge → HTTP security headers (XCTO/XFO/HSTS/Referrer/Permissions/CSP) → authn/authz (sealed cookie + per-request `OJ_ADMIN_EMAILS` re-check) → input boundary (per-IP throttle on `cf-connecting-ip` + honeypots + `urlSafety`) → output boundary (`sanitizeRichHtml` allowlist before every v-html + `safeJsonLd`) → data (Drizzle parameterized SQL + least-privilege) → config/boot (security-preflight fail-fast, openAPI off in prod).
- **12 findings**, mostly fixed; headline ongoing = full **CSP enforcement** (report-only shipped). Confirmed-not-exploitable: SQLi, command injection, SSRF, cart tampering, SMTP header injection, mass-assignment.
- **Method (notable):** multi-agent audit, **10 dimensions in parallel, each finding handed to adversarial verifiers instructed to refute it** → only real issues survive. Same finder→adversarial-refuter→synthesis shape this Totem instance's own workflows use — convergence worth flagging to ROOT.

**(4) Pre-push gate (b08; grounds E14).** `git config core.hooksPath .githooks` → every push runs **typecheck + tests (~2-3 min)**, blocks on failure; **per-clone** (each machine/CI needs the one-time config) — which is exactly why the repo-scan can't see it. Enforcement reality: ✅ local pre-push gate; ❌ **branch protection still off** ("the big one"); 🟡 CI exists but **lint + tests aren't gates yet** and **CI bun unpinned**. Config doc `BRANCH_PROTECTION_SETUP.md`.

**(5) `HANDOFF.md` — OpenJurist RDS cutover (b09; NEW deploy-path).** `apps/openjurist/HANDOFF.md` (2026-06-11), branch `feat/oj-historical-state-reporters`, tree clean. Commits: security `aca9f3e`/`da68f33`/`3af67f2`; release-protocol+pre-push `01663fe`; **Opus 4.8 UI refactor + parity `058122d`/`bd49201`** (reviewed GO + 4 typecheck fixes). **Committed, NOT pushed/deployed** (deploy dormant). **RDS cutover PENDING:** Justia provisioned RDS `db.openjurist-pg.justiapro.com` → AWS `friends-openjurist-prod`, us-west-2 (likely loaded the 2026-06-05 dump). **New external contacts: Esteban, Phil (Justia).** Blocked on out-of-band endpoint verification (**`justiapro.com` ≠ `justia.com`** — a connect attempt was **blocked by the safety classifier** pending verification) + creds/connectivity, then RELEASE.md stages 6-9.

**(6) `APP-AGENT-FRAMEWORK-FEEDBACK-2026-06-12.md` + STATUS.md pattern (b10; reference impl OJ PRs #20–#26).** Sam's feedback after *"I asked Fable to make the rules, it still did not follow them"*:
- **State rot → `STATUS.md`**, one shared state board per app, read-first each session, **updated in the SAME PR as any state-changing work** (a merge conflict in STATUS.md is a *feature*).
- **Rules without gates don't hold → `scripts/ci/docs-lint.ts`** (~150 lines, bun, no deps; pre-push + CI + full-tree-strict; rules F1 logs carry `status: snapshot`, F2 INDEX "stale" entries carry live-parsed superseded banner, F3 no in-flight language in living docs, W1-W3).
- **Non-Claude agents enter via `AGENTS.md`** (Codex/Cursor read it; CLAUDE.md is Claude-only) → apps need both, cross-referenced, routing to STATUS.md first.
- **4 bug classes to template-guard:** unanchored gitignore (`logs/` ate `import/logs/` → anchor `/logs/`); stale-base branching (`git fetch` before every `checkout -b`); registry-vs-reality (mechanical checker, lint F2); same-fact-in-N-docs (one board + pointers).
- **Honest limit:** "update STATUS.md in same PR" only sticks with **server-side branch protection + required reviews** — "part of the pattern, not optional" (again the GitHub-Teams dependency).
- **Convergence (ROOT decision #2):** STATUS.md ≈ Totem's `INVARIANTS.md`/`S*-SUMMARY.md`; docs-lint ≈ feature-health gate; "model proposes, gate disposes" ≈ `gate:LOCKED`. Strengthens "Totem V6 already covers this space."

**(7) NEW governance rule — two-models (b08, re-stated as RELEASE rule #7 b09).** Never run two AI models (Opus + Fable) editing the same working tree — uncommitted edits clobber each other ("partly how the stale-doc mess happened"). One model per repo at a time, or give each its own git worktree. Directly connects to the ~650-commit / stale-doc incidents.

---

## 5. 🔴 Security & Governance ledger

| # | Item | Type | Grounding | Owner | Priority | Action |
|---|---|---|---|---|---|---|
| S1 | **`sk-proj-…` live OpenAI key** pasted by Nick in Slack (batch03:46, auto-recharge) | Leaked secret (chat) | [SLACK] redacted | FOUNDERS→DEVOPS | **P0** | **ROTATE** + spend cap + secret-manager + audit billing |
| S2 | **`sk-or-v1-…` OpenRouter key** committed in `core/temp.md:2` (506-ln file) | Leaked secret (git) | **CONFIRMED** (E15) | DEVOPS | **P0** | **ROTATE + scrub history** (BFG/filter-repo) across fork network + delete `temp.md` |
| S3 | **~650-commit accident** — `internal-private-core` merge landed on `core` **main** ("Claude got confused"); reset to `974e43b`, tag `pre-reset-2026-06-25` | Incident (root of fork-leak concern) | **PARTIAL** (mechanism CONFIRMED) | DEVOPS+FOUNDERS | **P1** | Post-mortem; verify reset holds on live remote; wall off internal-private-core from agents |
| **S4** | Branch protection + GitHub **Teams-plan** need; reviewer rule relaxed on **main** | Governance gap | **UNCONFIRMED→ concrete (b06/b10)**: private-repo branch protection needs **GitHub Teams = $48/mo, min 12 seats**; **Angelica's rulesets EXIST as-code but are INERT** — `core/settings/rules` + required Actions `only-develop-to-main.yml` + `branch-name-rules.yml`, "can't attach until we upgrade, but ready to go"; grounding corroborates the workflow files exist (`deploy.yml` "Forks cannot access secrets", `ci.yml` "Safe for forks") | DEVOPS | **P1** | Buy Teams; attach rulesets; do NOT relax main; add CODEOWNERS — this is the missing control behind BOTH the ~650-commit accident AND the fork leak |
| **S5** | **🔴 E17 cross-fork data-leak — now a GitHub-support-CONFIRMED actual exposure (b07)** | **Incident (was structural hazard)** | **PARTIAL structure + REPORTED INCIDENT** — mechanism: all forks share one GitHub **object pool**; a fork PR's base **defaults to parent (`core`)**; snapshot stays **reachable across the whole network even after the PR is closed/unmerged**. Precondition grounded: `core` + `denistka/DAWWWB-app-agent` share root commit `9a9309d` = true fork | ROOT→DEVOPS | **P1 (escalated)** | See disclosure below; decide **separate-repos-per-client vs forks-of-core** |
| S6 | Multi-tenant isolation (runtime analog of S5) — Zing go-live; isolation code fork-only | Product-risk | **PARTIAL** | PLANNER/ARCHITECT | **P2** | Tenant-isolation test harness; resolve "Ask Zing!"/"DMG Agent" cross-branding (cosmetic vs bleed) |
| S7 | **Two-models-on-one-tree hazard** (b08) — uncommitted edits clobber; root of stale-doc mess | Agent-hygiene | [SLACK] | ROOT/ARCHITECT | **P2** | Encode "one model per repo / worktree each" as governance rule |
| S8 | **Shared/ambiguous GitHub identity (b06)** — team juggles shared **`steeleupwork`** account; policy = keep contributor GitHub **personal, not org-tied**; Angelica counters with org "core team" vs outside-contributor team-structure for security | Governance tension | [SLACK] | FOUNDERS/ROOT | **P3** | Resolve org-vs-personal identity + team structure |
| X | Systemic: agent puts secrets in context window (root cause of S1/S2) | Agent-hygiene | Slack (batch02:84) | ROOT/ARCHITECT | **P1** | Host-side credentials guardrail (EPIC-AGENT-UX-CHARTER) |

### S5 — 🔴 The full cross-fork data-leak disclosure (b07)

This is the channel's most important security content and the definitive, worse-than-hazard version of E17. Grounding rated E17 **PARTIAL** ("structural precondition CONFIRMED, specific incident undocumented in scope, lives in the operational/Slack layer or the openjurist fork"). **Batch07 is that missing incident half — not a contradiction:**
- **Mechanism (concrete):** GitHub fork networks share a **single object pool**; a PR opened from a fork toward the parent (the default base) leaves that fork's commit snapshot **reachable across the whole network — even after the PR is closed and never merged** (Angelica, b07 Jun 17–19). Clicking "open PR" on a fork branch without specifying a base sends the snapshot back to core.
- **Reported blast radius (per GitHub support):** a stray PR Angelica **"didn't even realize" she made ~3 months prior** opened a "side door" that leaked into **Upper Cervical Care (UCC) + OpenJurist + Rachel's repo + 2 app-agent repos** (b07). Illustrative: if UCC accidentally PRs back to core, **RYP could browse all their repo files** from that snapshot.
- **New fork/client names surfaced:** **Continuum** and **RYP** (b07) — beyond the 01-05 roster.
- **Why existential:** breaks the "customer owns everything, fully isolated" promise **at the source-control layer**, *beneath* the app-level tenant isolation demoed at go-live. Acute because app-agent services **direct competitors** (Peabody-law vs a future legal client; two chiropractic funnels). Because *every new copy is a fork of core* (§3g), the risk is **systemic and growing**.
- **Trigger:** docs-cleanup **PR #116** (opened from main not dev → ~80→500+ files; dev empty) is the "accidentally opening a new PR from downstream last night" that led Angelica to the discovery. Held unmerged pending investigation.
- **Angelica's stance:** open GitHub-support ticket; hedged — *"Maybe it's less of an issue than it's being made out to be."* Unresolved as of b07.
- **ROOT action items:** (1) confirm whether **Denis's own `DAWWWB-app-agent` fork** is in this shared network — grounding says **YES** (shared root `9a9309d`); (2) track Angelica's GitHub-support outcome; (3) likely real fix = **separate repos per client, not forks of core** (or private mirrors) — a Nick/Angelica governance decision that would **reshape the entire fork-per-customer GTM model** (§3g). Grounding's own recommendation aligns: add **CODEOWNERS** (absent — only `node_modules/@mapbox`) + repo-level PR base-branch restriction; no fork-isolation guardrail exists in core today beyond `deploy.yml` secret hardening.

**Two keys — both REDACTED here, both ROTATE.** S2 is the higher-radius (in shared git history across every fork; deletion alone insufficient). **No guardrail exists** in core — grounding confirms no CODEOWNERS, no SECURITY.md, no PR-base rule, no dependabot/secret-scanning; only branch-flow workflows (`only-develop-to-main.yml`, `branch-name-rules.yml`, now known to be Angelica's inert rulesets) + `deploy.yml` fork-secret hardening. **GTM read:** tenant isolation is currently a *process promise, not an enforced one* — and b07 shows a real cross-fork leak has already occurred at the source-control layer, falsifying the "everything separated / customer owns 100%" trust claim beneath the app. Bundled into `EPIC-REPO-HYGIENE-SEC` (S1-S5, S7-S8, escalated priority) + `EPIC-ZING-RAG-INTAKE` (S6). All `gate:LOCKED`.

---

## 6. Model & product-philosophy signals

**Model-name reality check** (verified vs Anthropic lineup): "4.8"=Claude Opus 4.8 (`claude-opus-4-8`, the model these agents run on); "Fable 5"=`claude-fable-5` (most capable, above-Opus pricing); "Mythos"=`claude-mythos-5` (Glasswing sibling, invite-only); "Ultracode mode"=a harness/mode, NOT a model ID.

- **"4.8 got dumb" (batch03:16-19):** Sam ties it to the typecheck rabbit-hole ("going in circles"). Nick's two theories — (1) **context poisoning** (actionable → fresh-context + "trace your own mistake"); (2) "**Anthropic dumbs down under load**" (unfalsifiable folklore — record as *motivation for switchability*, do NOT encode). Note: the model wasn't wrong — TS drift E18 + sqlite E07/E08 were real & are now fixed — it was bad at *routing around* a broken build. **b06 attributes the recurrence to Sam mid-saga:** *"I feel it's not figuring it out because Opus isn't working like it used to — lots of online chatter."* No new theory.
- **🆕 Fable globally disabled ~mid-June (b06):** disabled in India (Vinay) *and* the US — Sam: *"They turned it off a few days ago. Everywhere,"* + a joke attribution (*"Trump is punishing Anthropic 😂"* — pure folklore, do NOT encode; record only as **another data point for model-access fragility = product risk**, reinforcing the switchability argument). Reconciles the Fable-love-vs-Opus-complaints timeline.
- **Strong Fable 5 preference:** "Fable is a game changer. Opus sucks compared to Fable" (b02:142); "I miss Fable" when gated (access-fragility = product risk). Meta-pattern worth adopting: **use the ceiling model to author the protocol once, run cheaper models against the frozen protocol** — now with a concrete security instance (`SECURITY_HANDOFF.md` multi-agent adversarial audit, §4d).
- **🆕 Opus 4.8 for OpenJurist UI refactor (b09):** commits `058122d`/`bd49201` (Opus 4.8 UI refactor + parity scripts), reviewed **GO + 4 typecheck fixes** — a concrete positive Opus-4.8 datapoint against the "got dumb" folklore.
- **🆕 Safety-classifier blocked a live DB connect (b09):** Claude's safety classifier **refused to connect to `justiapro.com` pending human verification** it wasn't a typosquat of `justia.com` — a real-world model-guardrail intervention on the OpenJurist RDS cutover path. Notable as guardrails *helping*, not "dumbing down."
- **🆕 Multi-agent adversarial method = same shape as this instance (b09):** Sam's security audit ran a multi-agent finder across **10 dimensions in parallel → each finding handed to adversarial verifiers instructed to refute it → only real issues survive.** b09 flags this as "the same shape as the workflows this instance runs" — convergence for the ceiling-model-authors-protocol / cheaper-models-execute pattern.
- **Per-task model selection** (b02:81): elevate single `AI_PROVIDER_MODEL` env var → `{taskKind→tier}` policy + user override picker, riding the extant OpenRouter+BYOK substrate; hide model choice behind message-metering so escalating a hard task to Fable is *economically invisible*. **No new per-task-selection ask in 06-11** beyond this.
- **No-moat philosophy → behavioral constraint on the agent:** defaults must never create lock-in (BYOK, external DB connectors, customer-owned repos/keys by default); green's limits are honest capability checks, never nag-walls. "Opinions as infrastructure" is the real product — the agent-behavior charter *is* the moat-free product surface.
- **The one hard contradiction (proactive execution):** Sam wants "if it has permission, just do it" but the system is deliberately human-gated (`chat.llm.ts` + Totem `gate:LOCKED`). Even Sam wants *bounded* autonomy. **Proposed resolution:** default human-gated + per-app/per-risk **auto-approve flag** (auto for reversible/in-scope/low-risk; ask for scope/destructive/security/infra). This is a ROOT decision, not a bug — and RELEASE_PROTOCOL's "model proposes, gate disposes" (§4d) is the same principle framed by Sam.

---

## 7. Role-map (condensed from grounding synth)

| Guardian | Mandate | Signals (status) |
|---|---|---|
| **ROOT** | intake/governance/gate; logs org-adjacent, routes code to PLANNER | E10-13 standards-trio (**content now in-hand; DECISION-NEEDED P2**); E17 fork-leak (**escalated to CONFIRMED-incident; DECISION-NEEDED P1**) |
| **ARCHITECT** | design/robustness; reconcile agent-behavior fb with work-control | E05/E20 (IN-FLIGHT P1) → EPIC-AGENT-UX-CHARTER; two-models rule (S7); RELEASE_PROTOCOL layering |
| **PLANNER** | decompose chartered epics; fork-intake sequencing | E09 Zing RAG/#111 (OPEN P2) → EPIC-ZING-RAG-INTAKE; fork-per-copy expansion sequencing (b11) |
| **DEVOPS** | build/CI/install/version/secret hygiene | E07/E08 sqlite (DONE P2; #110=Vinay); E06/E18 TS+Bun (**closed fork-local via Option-A; handoff reproducibility gap OPEN**); E15/E16 hygiene (OPEN P1); E14 prepush (**grounded fork-local**); **S4 branch-protection (Teams $48/mo, rulesets ready-inert)** |
| **QA** | tests/coverage/feature-health gate | E01/E02 (IN-FLIGHT P2) → EPIC-QA-COVERAGE-TRUTH |
| **FOUNDERS (out-of-band)** | business/org — logged, never decomposed | E03/E04 (OPEN P2); E19/E21 (OPEN P3); **verbalspeech.ai + fork-per-copy expansion + Peabody/UCC/DMG contracts (b06/b11)** → EPIC-FOUNDERS-GTM-LOG |

*Actor→guardian (functional reality):* Vinay=DEVOPS+QA (all PRs; `vinay-atomcx`); Sam=ARCHITECT-feedback-source (non-dev; `samdeskin`, OJ fork standards); Nick=FOUNDERS+ROOT; Angelica=ROOT/DEVOPS-gov (branch-protection rulesets, leak disclosure); Rachel=FOUNDERS-ops (app-agent.io migration, marketing-demo); Denis=ROOT-dogfood. **New external contacts:** Esteban, Phil (Justia RDS, b09). Full roster in `intel/TEAM.ti` v2.

---

## 8. ROOT decisions pending (gate:LOCKED — decide, do not execute)

| # | Decision | Options (grounding synth) |
|---|---|---|
| 1 | **Bun install strategy** — keep `bun@1.2.15` pin (opt A, LANDED — b06 confirms root cause `53fa346` + Option A recommendation) or add isolated-install config (opt B) | (a) **ratify pin & close** (recommended — E18 effectively closed via PR #97 false-alarm resolution); (b) charter DEVOPS to prototype opt B; (c) defer — **plus** address the b06 reproducibility gap (`bun.lock` unchanged) regardless |
| 2 | **Sam's standards trio + STATUS.md/docs-lint** — pull into fork or keep OpenJurist-only | (a) pull + reconcile with Totem V6; (b) **Totem V6 canonical, cite as prior art** (b10 convergence: STATUS.md≈INVARIANTS.md, docs-lint≈feature-health gate, model-proposes-gate-disposes≈gate:LOCKED); (c) adopt selectively (AGENTS.md cross-vendor entry + docs-lint) while keeping Totem gate model |
| 3 | **🔴 E17 cross-fork guardrail / fork-vs-separate-repo** — now a CONFIRMED incident (b07); applies to Denis's DAWWWB fork (in-network via `9a9309d`) | (a) **charter DEVOPS now** (CODEOWNERS + PR-base pin + base-branch CI check + SECURITY.md); (b) **decide separate-repos-per-client vs forks-of-core** — governs the D5/D7 growth model; (c) wait for Angelica's GitHub-support outcome |
| 4 | **Proactive execution** — feature or governance line? | (a) hold human-gated, decline; (b) **bounded per-app auto-approve flag**; (c) route to EPIC-AGENT-UX-CHARTER as open design |
| 5 | **`sk-or-v1` key remediation** | (a) **rotate + delete + scrub history** (BFG/filter-repo) — full scrub given multi-fork blast radius, now compounded by the b07 shared-object-pool finding; (b) rotate + delete only; (c) rotate now + fold scrub into E15 |
| 6 | **🆕 GitHub-Teams purchase ($48/mo, min 12 seats)** — gates branch-protection AND the STATUS.md-in-same-PR pattern AND the leak fix | (a) **buy now** (unblocks S4/S5/b10 at once); (b) defer, accept process-only enforcement; (c) negotiate seat count |
| 7 | **🆕 GitHub identity/org structure (S8)** — personal handles vs org-tied; shared `steeleupwork` | (a) keep personal (Nick's stance, preserves commit credit); (b) Angelica's "core team vs outside-contributor" team structure for security; (c) hybrid — personal identity + enforced team-membership boundaries |

**ROOT recommendation notes (non-binding):** #3 → (a)+(b), the S3 incident and now the b07 *actual* leak prove the risk is live — the fork-vs-separate-repo call is the pivotal one; #5 → (a); #4 → (b); #6 → (a), it is the single unlock behind three separate P1 gaps.

---

## 9. Proposed epics (all `gate:LOCKED` — decompose only after ROOT rules)

| Code | Lead | Source | Thrust |
|---|---|---|---|
| **EPIC-DEVOPS-INSTALL-HARDEN** | DEVOPS | E06,E07,E08,E18 | Ratify bun:sqlite in fork; ratify Bun Option-A pin (`53fa346` root cause understood); **fix b06 reproducibility gap (commit `bun.lock` so isolated-green survives fresh/CI install)**; clear 2 remaining TS errors (`feature.ts` TS2769, `paths.ts` TS2538/TS18048) |
| **EPIC-REPO-HYGIENE-SEC** | DEVOPS | E15,E16,E17,**b07** | **Rotate keys** (S1/S2); **buy GitHub Teams + attach Angelica's inert rulesets** (S4); **cross-fork leak remediation (S5): decide separate-repos-vs-forks, add CODEOWNERS + PR-base guardrail + base-branch CI check + SECURITY.md; confirm/remediate Denis's DAWWWB fork; track Angelica's GH-support ticket**; prune root .md; verify AGENTS.md; carries S1-S5, S7-S8 |
| **EPIC-QA-COVERAGE-TRUTH** | QA | E01,E02,E14 | Commit reproducible coverage summary/badge (make 24%→64% verifiable); reconcile 322-vitest vs 378-all; keep gate green across fork; **evaluate adopting docs-lint (b10) as a QA gate** |
| **EPIC-ZING-RAG-INTAKE** | PLANNER | E09 | Fix #111 now; decide whether RAG groundwork pulls upstream vs stays fork-isolated (ties E17); **sequence Peabody voice (Whisper/#122) + fork-per-copy expansion**; carries S6 |
| **EPIC-AGENT-UX-CHARTER** | ARCHITECT | E05,E20 | Lock 6 BUILT behaviors; surface proactive-execution governance Q; scope model-selector UI; host-side secrets guardrail; bound self-healing; **encode two-models-one-tree rule (S7)** |
| **EPIC-FOUNDERS-GTM-LOG** | FOUNDERS (out-of-band) | E03,E04,E19,E21,**b06/b11** | No code footprint — log pricing/equity/customers/partner-channel **+ Peabody POC funding rule, DMG own-copy + UCC contracts, Zing website rebuild, verbalspeech.ai (~$3m/RTX 6000), 3-more-copies + marketing-demo, app-agent.io DO→Cloudflare** to governance; hand to Nick/Angelica; no PLANNER decomposition |

---

## 10. Open questions / data gaps

- **~5 Platform-Factory contributors unnamed** — signal is "8 external from PF" but only Vinay/Ayman/Dylan named. Do not invent names.
- **Internal/external line is porous** — Vinay (external PF) holds `vinay@app-agent.io` + Super-Admin Cloudflare (**confirmed b06**), commits as `vinay-atomcx`; a business/pricing doc carries the "PF" workspace avatar. b06 policy ("keep GitHub personal") explains *why* commits are authored under personal handles (`vinay-atomcx`, `samdeskin`) not org identities — relevant to attributing the PR ledger.
- **🆕 verbalspeech.ai** — separate cap-table/equity from app-agent? Is Vinay's work billed to app-agent or verbalspeech? (b11)
- **🆕 Continuum / RYP** — which clients/tiers, and are they in the leaked blast radius? (b07)
- **🆕 Angelica's GitHub-support ticket outcome** — did the 5-repo leak get remediated, and does Denis's `DAWWWB-app-agent` fork sit in the same shared network (grounding says yes via `9a9309d`)? (b07)
- **🆕 Esteban / Phil** — Justia-side contacts; org relationship (Justia partner vs contractor)? RDS creds/connectivity still unverified as of b09; `justiapro.com` ≠ `justia.com`.
- **🆕 "645,757 vs 7.65M" stale-fact (b08)** — cosmetic audit example or a real data-integrity issue in a live client DB?
- **Nick's "CTO" title** — evidence says CEO/founder; confirm whether "CTO" is real anywhere.
- **Angelica co-founder status / GitHub handle** (baseline `974e43b` author) — confirm surname relationship to Nick; **Sam's handle = `samdeskin` (resolved, b10)**.
- **Coverage %** (24%→64%) has no artifact — truth-hole.
- **650-commit reset** cited from Slack, not verified against live remote; `internal-private-core` not in scope.
- **Multi-tenant isolation implementation** unverified against core (RAG/tenant code is fork-only #104/#107).
- **"Ask Zing!"/"DMG Agent" cross-branding** in go-live screenshot — cosmetic label mix-up or tenant-context bleed? Flag for verification.
- **PandaStack readiness** ("still to set up") and Ajay's contract/equity vs pure vendor.
- **S1 paste-date unknown** — pending Nick's confirmation.

---

## 11. Provenance

**Raw corpus:** `/Users/denistka/Projects/totem/totem-v6/instances/app-agent/intel/chat-memory/batch01-raw.md` … **`batch11-raw.md`** (cited inline as `bNN`/`batchNN`). REDACTED at ingest: batch03 live `sk-proj-` OpenAI key; `sk-or-v1-` OpenRouter key (`core/temp.md:2`). **No new keys appear in 06-11.**
**Grounding:** `/private/tmp/claude-501/-Users-denistka-Projects/4d6d1eb4-8981-4f0f-aca0-af1b1116ceb9/tasks/wmca6it0x.output` (`.result.grounded` per-claim CONFIRMED/PARTIAL/UNCONFIRMED/NOT_IN_SCOPE; `.result.synth.roleMap/discrepancies/rootDecisions/proposedEpics`; `.result.events` E01-E21).
**Grounded repos:** `app-agent-io/core`, `denistka/DAWWWB-app-agent(-dev)`, `totem/totem-v6/instances/app-agent`.
**Key file anchors:** leaked key `core/temp.md:2`; philosophy echo `core/temp-product-context.md:41-52,155-164,243-248`; agent-behavior code `DAWWWB-app-agent-dev/apps/work-control/` (`preview-info.ts`, `chat.llm.ts:10`, `runner/{build-verify,boot-verify,retry}.ts`, `MetricsDashboard.vue`, `openrouter.ts:25`); fork root `9a9309d`; reset target `974e43b`; tag `pre-reset-2026-06-25`; Bun bump commit `53fa346` (2026-06-07); branch-flow workflows `only-develop-to-main.yml` + `branch-name-rules.yml`; `deploy.yml` fork-secret hardening.
**Fork-only artifacts (06-11, NOT in core — content from Slack pastes):** `AGENT_WORKING_STANDARD.md` (`aaf3729`,`a67820f`), `RELEASE_PROTOCOL.md`, `SECURITY_HANDOFF.md`, `HANDOFF.md`, `APP-AGENT-FRAMEWORK-FEEDBACK-2026-06-12.md`, `STATUS.md`, `scripts/ci/docs-lint.ts`, `BRANCH_PROTECTION_SETUP.md`, `TYPECHECK-HANDOFF.md` (Sam's Windows fork `C:\Users\samde\app-agent-io-core\`, dated 2026-06-16); reference impl `apps/openjurist` PRs #20–#26, commits `aca9f3e`/`da68f33`/`3af67f2`/`01663fe`/`058122d`/`bd49201`; RDS `db.openjurist-pg.justiapro.com` → AWS `friends-openjurist-prod` (us-west-2).
**Grounding reconciliation summary (06-11):** E17 PARTIAL → **incident half now supplied (S5, b07)**; E18 PARTIAL → **mechanism + Option-A confirmation, effectively closed (§4c, b06)**; E14 UNCONFIRMED → **pre-push gate + inert-branch-protection cause grounded fork-local (§4d, b08/b10)**; E10/E11/E12/E13 NOT_IN_SCOPE (fork-only) → **content supplied (§4d), with E13 name corrected to `SECURITY_HANDOFF.md` (not `AI_OPERATIONS_CHARTER.md`)**; E07 CONFIRMED → **PR #110 attribution = Vinay (b11)**. No contradictions with grounding; all gaps were "operational/Slack-layer or openjurist-fork," exactly where these batches sit.
**Roster:** `intel/TEAM.ti` v2. **New batch provenance:** b06 (Jun 16–25; Nick/Vinay/Sam/Angelica/Rachel — E18, infra role-map, branch-protection blocker, Peabody); b07 (Jun 15–19; Angelica/Nick/Sam/Vinay — **definitive E17 disclosure**, PR #116, RAG/MCP); b08 (~Jun 11–15; Sam — pre-push gate, AGENT_WORKING_STANDARD, two-models rule); b09 (~Jun 11; Sam — RELEASE_PROTOCOL, SECURITY_HANDOFF, HANDOFF/RDS); b10 (~Jun 11–12; Angelica+Sam — inert rulesets, framework-feedback/STATUS.md/docs-lint; SECURITY_HANDOFF re-paste dedup); b11 (~Jun 11–16; Vinay/Nick — E07 #110, verbalspeech.ai, fork-per-copy expansion, DO→Cloudflare).

*Provenance: 11 batches + grounding. All 06-11 raw ingested; grounding task `wmca6it0x` reconciled with no contradictions.*