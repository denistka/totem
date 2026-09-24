# batch03 — raw (faithful transcript)

- **Ingested:** 2026-07-10 (ingestion order #3)
- **Slack span:** ~mid-June → **2026-07-09** — **contiguous continuation of [batch02](batch02-raw.md)** from its truncation point ("book store" / typecheck) through to the Zing! go-live (= [batch01](batch01-raw.md)). With batch02 + batch03, the channel history (2026-03-13 → 2026-07-09) is essentially complete.
- **Participants:** Sam, Nick Steele, Vinay, Rachel Feather, Angelica Steele, Ayman.B, Ajay Kumar (new), **denistka (Denis)** — joined here.
- **🔴 REDACTION:** Nick posted a live `sk-proj-…` OpenAI key in plaintext — **redacted below**; see [CHAT-INTEL § Security](CHAT-INTEL.md). Must be rotated.

---

**Sam 12:45 AM** — One more thing … I added a **book store** … [2 PDFs: `…books-people-james-madison…`, `…president-james-madison…` (localhost:3004)].
**Nick Steele 12:50 AM** — Perfect thank you!
**Sam 12:52 AM** — Should I worry about the typecheck issue?
**Nick Steele 12:53 AM** — I wouldn't say worry. @Vinay could you help look into this for Sam while you work on the **Zing! Patio demo**?
**Sam 12:54 AM** — That's exciting! Zing!

**Sam 7:26 PM** — Guys, **4.8 has gotten dumb. It is breaking things.**
**Nick Steele 9:04 PM** — That happens sometimes. Two possible reasons: (1) junk got into the context window (small misunderstanding/glitch) and it acted on that; (2) the "conspiracy theory" that Anthropic dumbs down models under high usage (lots of people saying it; possibly some truth). Test which: get the conversation history and ask it to trace/pinpoint its mistake — about half the time it can, half it can't.
**Sam 10:06 PM** — Opened a new context window a couple times. Chatter: they put more resources toward the model getting traction and it hurts the others. That typecheck issue was the beginning of feeling something was wrong — it was going in circles.
**Nick Steele 1:22 AM** — Yeah, happened to me too, maybe 2-3% of the time the model becomes really stupid.

**Vinay 11:11 AM** — @Nick @Rachel are there **Cloudflare and GCP accounts** we can use to deploy internal apps?
**Rachel Feather 6:16 PM** — Setting that up today @Vinay, will ping you 🙂
**Rachel Feather 11:39 PM** — @Vinay access set up for the new **app-agent.io** accounts: (1) **Cloudflare** — migrated the domain to a new company Cloudflare account under **nick@app-agent.io**; invited you as **Super Administrator** (accept the email invite). (2) **Google Workspace** — **vinay@app-agent.io** active. Note: updated nameservers in **Squarespace** to point to the new Cloudflare account (propagation may take time). @Angelica @Sam you have invites to your new app-agent email.

**Sam 5:07 PM** — Ranking of models: [reddit /r/ClaudeCode link].
**Sam 5:10 PM** — Fable is coming back! [reddit link: "Anthropic confident of re-enabling Mythos, Fable 5 access 'in coming days'"].

**Nick Steele 8:42 PM** — @Sam can you surface your first pass at how you + Claude suggested we **divide the company**? DMG just signed, Zing! Patio likely to sign, I'm meeting a law firm today. Let's get this agreement between all of us in place sooner than later.

**Nick Steele 3:09 AM** — We got another POC: **Peabody Lawfirm** wants a demo like Zing! Patio, except ingest **estate laws** + hook up **voice assistance**. @Vinay set up another core for Peabody? And next week add **voice support to the core agent** (build on the agent stuff from VoyceMe). I added you to the **UCC core fork** I just made (**Doherty owns it — they approved the contract!** 🙂). I'll send their requirements.
**Vinay 7:26 AM** — Sure
**Vinay 9:53 AM** — Yes, got the invite, I'm in.
**Vinay 2:29 PM** — @Nick can you give me the **OpenAI API key**? Need it for voice (TTS/STT) — can't use OpenRouter for that, need direct OpenAI integration.
**Vinay 2:45 PM** — @Rachel I see ~**650 commits** to the **main** branch a few days back. Are those all intentional?
**Nick Steele 5:29 PM** — 650 commits 😮🤔
**Nick Steele 5:30 PM** — This isn't for the main core is it? We should have a **develop branch** if we don't yet, and **protect main**. DMG is putting a retail store, law firm and warehouse on our framework in production starting next month. We have to start treating this seriously.
**Vinay 5:54 PM** — It's on core main.
**Vinay 5:56 PM** — We can reset to the last good commit if these aren't intentional. Looks to me like a **merge went wrong**.
**Nick Steele 6:19 PM** — @Vinay can you **protect main** so only you or me can accept PRs, and all changes must be PRs from **develop**? Do you know how? It looks like Rachel was trying to put this stuff in `github.com/app-agent-io/internal-private-core` but **Claude got confused and put them in `github.com/app-agent-io/core`**.
**Vinay 6:25 PM** — Yea we should have branch protections, especially with **AI agents having access to everything**.
**Vinay 6:26 PM** — I think @Angelica gave her inputs on branch protection.
**Vinay 6:27 PM** — We should move to a **Teams plan** to set up the rules.
**Nick Steele 8:44 PM** — OK, I'll take care of that today. Thanks for noticing the extra commits! 🙂

**Vinay 7:24 AM** — Do we have an OpenAI API key?
**Nick Steele 2:34 PM** — `sk-proj-…[REDACTED — live OpenAI project key; ROTATE]`
**Nick Steele 2:36 PM** — Sent you an invite to the account as owner. It will auto-recharge usage.
**Vinay 4:26 PM** — Okay, cool, thanks Nick.

**Nick Steele 5:09 AM** — Check out this demo for **PlayEngine**. Got it to run in a **450M-param distilled model, 10 agents running locally on a 2080** while still playing a game 😮 Viable tech! Big games want it for replayability — `dobig.com/games`. **Built 100% with app agent.** [PlayEngine Demo.mov; Do Big Studios — Roblox].

**Vinay 11:04 AM** — Heads up: cleaning up the main branch, removing unintentionally-pushed commits. Resetting to angelica's commit `974e43b5671b949b90bb06e139b0f152fa290457`.
**Vinay 11:07 AM** — Removed commits saved on tag `pre-reset-2026-06-25` (`releases/tag/pre-reset-2026-06-25`), just in case.

**Vinay 12:18 PM** — Team — **voice support is live in core**, ready to ship in Peabody. @Nick — push-to-talk **STT** + tap-to-listen **TTS** in chat UIs. Mic button next to file upload; speaker under each assistant response (Claude-style tap play/pause/resume). Singleton playback, in-memory cache (instant replay), 5-min auto-stop on recording. PRs: Core `#124`, Peabody `peabody-lawfirm#10`.
**Vinay 12:23 PM** — Enabling voice in your forked app — two gates, both required:
> ```
> // 1. apps/<your-app>/app/app.config.ts
> export default defineAppConfig({ voice: { enabled: true } })
> # 2. .env for whichever app serves the page (admin in Peabody)
> VOICE_PROVIDER_URL=https://api.openai.com/v1
> VOICE_PROVIDER_KEY=sk-...
> ```
> If either is missing, both mic and read-aloud render nothing (full DOM removal, not a disabled state).

**Slackbot 9:13 AM** — **denistka from DAB was added to this channel by njsteele.**
**denistka 9:13 AM** — was added to app-agent.
**denistka 9:18 AM** — Hi everyone)
**Ayman.B 9:19 AM** — Hi @denistka! 👋 Welcome to the team! I'm Ayman. Great to have you here, look forward to working together. 😊
**Vinay 6:03 PM** — Hello @denistka. Welcome to the team.
**Nick Steele 7:09 PM** — Hi Everyone, **Denis is learning the core framework.** DMG said they want to potentially do **$2m in sales** with us over the next year; I need to start training people to keep up with demand. Spending the weekend organizing the business side with Rachel; update Monday. Basically DMG is going to give us more business than we'll know what to do with.
**Angelica Steele 9:11 PM** — Hey @denistka! 😄 Always great working with you, so excited you're here!

**Nick Steele 10:09 PM** — 📜 **Equity** (verbatim): "I want to give you all **1% of the company** if you're in this channel to start, **vesting over 1 year**. We start with **10,000,000 shares**, so each of you gets **100,000 shares**. Allocate **50% internally** and reserve **50% for investors**. We'll issue shares based on **merit** — who completes what the company needs (I consider you all **founders**). The company isn't technically worth anything till seed funding, but we're already profitable. I plan to look for **seed funding in the next 90 days** to get us all base salaries if we can't sustain growth from customers. You'll own ≥1% of App Agent — if it sells for $100m in a few years, you'd get $1m. A share is like property (gift, sell, loan against it) with rules (strike price, vesting). [intro-to-VC YouTube link]."

**Vinay 8:15 PM** — @Nick review/merge the **voice support** changes to main: `core#127`.
**Nick Steele 9:10 PM** — Approved. It says it fails merge requirements — looks like it needs another reviewer. Keep or skip that?
**Angelica Steele 4:45 AM** — @Nick I set that by default — you + Vinay as minimum reviewers. Not required, we can override. One or the other?
**Vinay 8:33 AM** — I changed it for develop, but left main as-is. I think we should relax that rule for main as well.

**Sam 11:03 AM** — Howdy y'all, what do you think of a **self-healing/improving system**: updates propagate to all customers on release; security fixes applied immediately; it pulls errors from logs, inspects + fixes on the spot; tracks resource usage (grabs more RAM for a process, releases when done); tracks page-load/speed (adds an index / restructures); systemic upgrades (e.g. auto-AEO for forward-facing pages); scheduled backups; customers can schedule content creation/scraping/ingestion (some auto, some review-first). "This one I'll apply to OpenJurist: a **Report an Issue** box where AI sanity-checks the report and suggests the fix for my approval. Some need a sanity check/approval; some are resource-intensive → do safely. Basically all best-practice maintenance done by AI without anyone lifting a finger." [YouTube link].

**Nick Steele 12:03 AM** — 💰 **Zing! Patio is now an official monthly customer!** Signed a **$500/mo support contract** to start (up to 5 hours dev/support per month), will upgrade if needed. Time to get more rigid with our processes 🙂 Thank you everyone!

**Angelica Steele 10:55 PM** — The **product feature roadmap + how multitenancy works** @Vinay [`features-flow.png`].
**Vinay 7:40 AM** — Cool, this is good. What is the **SaaS Client** column you mentioned?
**Nick Steele 6:00 PM** — There are **3 types of clients**:
> 1. **Yellow** — full control: they **fork and own everything**.
> 2. **Blue** — only want source control, not deployment: they fork (run codebase locally) and their GitHub Actions deploy to **OUR stack** (PandaStack — still to set up).
> 3. **Green** — **resold** accounts for Yellow/Blue customers' customers, or people who don't want source control, only AI agents: they sign up for a **SaaS account** from app-agent.io or from the Yellow/Blue customer account.
**Nick Steele 6:01 PM** — Today DMG is **yellow**; their customer Peabody Law wants to resell → yellow or blue; Zing! Patio doesn't want to code → **green**.
**Vinay 6:03 PM** — Got it.
**Sam 6:16 PM** — So yellow = Developer/Pro, blue = Managed, green = Reseller. Looks good!
**Nick Steele 8:18 PM** — Yes. Green can also be a managed account that doesn't need code editing. The table shows which features don't work on green.
**denistka 8:20 PM** — Good plans.
**Sam 8:20 PM** — So: Developer/Pro, Managed, Developer/Pro Reseller, Managed Reseller.
**Nick Steele 8:22 PM** — Me and Angelica are finishing the **DMG deployment** — almost all features in that chart are done, plus online files / Dropbox functionality. We'll start wrapping "everyone probably wants them" features into **out-of-the-box modules** we toggle on per client. Someone could clone the core, turn on the features they want, do a custom brand setup, and have a fully functioning enterprise business in **15 minutes**. We hope to start **bringing the DMG repo back into core Thursday** — it has ~100 improvements.
**denistka 8:23 PM** — I have one thing I want to show as **yellow plan** — how can I demonstrate it? For team.
**Nick Steele 8:23 PM** — Maybe record a video and post it?
**denistka 8:24 PM** — Ok, works for me. Try to demo tomorrow.

**Ajay Kumar 8:30 PM** — was added to app-agent.
**Nick Steele 12:43 AM** — Meet @Ajay Kumar — he'll help set up our **deployment process**; showing me a demo. He owns **pandastack.io**; for blue (managed cloud) accounts we can provision on **PandaStack** (static sites, containers, DBs, cron, edge functions from GitHub).

**Nick Steele 5:50 PM** — Thoughts on **support tiers**?
> **$500/mo** — support within 24h (email); ½ day free engineering/mo; 99% uptime; shared server; 10M tokens/mo (~16k messages, ~5 people light/medium); 10 GB storage.
> **$750/mo** — support within 8h (email, SMS); 1 day free engineering/mo; 99.5% uptime; your own server; 20M tokens/mo (~32k msgs, ~10 people); 25 GB.
> **$1000/mo** — support within 1h (email, SMS, phone, we join your Slack/Teams/WhatsApp); 1.5 days free engineering/mo; 99.9% uptime; your own **cluster**; **CDN** (UI duplicated in up to 48 locations); 30M tokens/mo (~48k msgs, ~15 people); 50 GB.

**Nick Steele 12:38 AM** — 🚀 **DMG just went live with their first customer Zing! Patio** — product is now officially **multi-tenant compatible** (customers can sell to their own customers; everything separated: agent knowledge, tasks, files, documents, user management). "A little clean up work tonight but we can start bringing all this back into the core on Monday." [`image.png` = go-live screenshot; see [batch01](batch01-raw.md)].
