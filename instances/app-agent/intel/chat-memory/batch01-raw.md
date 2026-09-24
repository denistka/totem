# batch01 — raw (verbatim)

- **Ingested:** 2026-07-10 (ingestion order #1 — newest first)
- **Posted:** ~2026-07-08/09 (screenshot header "1 day ago")
- **Author:** Nick Steele
- **Channel:** app-agent (private)
- **Attachment:** image.png (side-by-side multi-tenant screenshot — described below)

---

## Message (verbatim)

> DMG just went live with their first customer Zing! Patio 🚀 our product is now officially multi-tenant compatible! i.e. our customers can sell to their own customers... every thing is separated... agent knowledge, tasks, files, documents, user management, everything.  We have a little clean up work tonight but we can start bringing all this back into the core on Monday

---

## Screenshot (image.png) — description

Two browser windows side by side, both on `develop.dmg-admin.pages.dev/agent/knowledge` (Cloudflare Pages deploy), demonstrating tenant isolation:

- **Left window — DMG tenant** (logged in as **Nick Steele**; logo "Doherty Marketing Group").
  - Left nav (product IA): **Home, Projects, Files, Agent Knowledge, System** (Accounts, Status, Logs, **Security** → Guardrails / Audit / Compliance / Governance / Attestation, Testing, Backups), **Settings** (Defaults, API, Keys).
  - Documents (1, "default"): `app-agent-capabilities.md` — 14 chunks · 11.7 KB · text-embedding-3-small · 7/6/2026.
  - Agent chat panel (model selector "Ask Zing!"): user asked *"can you create an image of a patio?"* → agent returned a **generated image** (Replicate) of a modern patio (lounge chairs, coffee table, umbrella) + descriptive copy offering to explore the furniture collection.
- **Right window — Zing! Patio tenant** (incognito; logged in as **Tim**; logo "ZING PATIO").
  - Same IA; Documents (3, "default"): `kingsleybate2026` (198 chunks · 345.5 KB), `2026 Castelle Price List V9 Mar272026 Adjusted Low Res MSRP` (294 chunks · 532.6 KB), `woodard2027pricelist` (564 chunks · 1.04 MB) — all text-embedding-3-small · 7/1/2026 (real patio-furniture catalogs).
  - Right agent panel branded **"DMG Agent"** — "Ask about your accounts, knowledge base, images, and system."
- Global top search bar: "Describe what you are looking for". Zoom control bottom-left; export/split icons bottom-right.

> Observation (not a conclusion): the DMG window's chat selector reads "Ask Zing!" while the Zing window's agent panel reads "DMG Agent" — some cross-branding in the capture; recorded as-seen.
