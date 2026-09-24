# batch09 — raw (Sam's framework docs: RELEASE_PROTOCOL, HANDOFF, SECURITY_HANDOFF)

- **Ingested:** 2026-07-10 (ingestion order #9)
- **Type:** three reference documents Sam shared (~Jun 11), all **OpenJurist-fork / framework-standard**. Ground E10/E11/E13. Digested (not verbatim — large).
- **New external contacts:** **Esteban, Phil** (Justia RDS); data sources: CourtListener, archive.org OCR, Wikipedia, Shopify.

---

## `core/docs/RELEASE_PROTOCOL.md` — framework standard (how to ship)
Gated release lifecycle every App Agent app follows; core insight: *"models are confident and fast → replace 'trust the model' with 'verify the artifact behind a gate the model can't reach around.'"* "The model proposes; the gate disposes."
- **9 model rules:** one `feat/` branch per change · write blast-radius first · verify with pasted evidence · expand/contract migrations + idempotent replayable data scripts · PR + independent review · never self-promote to prod · never two agents on one tree · run the security checklist · extend controls never remove.
- **10 gated stages:** local change → impact analysis → **verify gate (stage 3, where most model mistakes die)** → PR → CI → staging → smoke → human-approved prod → post-deploy verify → rollback.
- **4 enforcement layers (authority order):** ① branch protection (server-side, unbypassable) ② CI required checks (typecheck·migration-safety·build·lint·test) ③ human prod approval (required reviewers + OIDC, no long-lived keys) ④ local pre-push hook (fast, *bypassable — never the gate*).
- **App Instantiation Contract:** each app fills specifics (RELEASE.md, SECURITY.md, migrations/CONVENTIONS.md, CI workflow, deploy workflows, verify.sh + pre-push, smoke set, rollback triggers, `deploy_in_progress` pause flag).
- **Enforcement gaps (documented):** branch protection **off** (GitHub 403 on free private repo) · CI lint/test not yet required + lint baseline broken (~13k errors from gitignored Drupal dump) · deploy stages dormant until AWS (`OJ_DEPLOY_ENABLED`).
- Reference instantiation: `apps/openjurist/RELEASE.md`.

## `apps/openjurist/HANDOFF.md` — OpenJurist dev handoff (2026-06-11)
- Branch `feat/oj-historical-state-reporters`, tree clean. Commits: `aca9f3e`/`da68f33`/`3af67f2` (security), `01663fe` (release protocol + pre-push gate), `058122d`/`bd49201` (Opus 4.8 UI refactor + parity scripts, reviewed GO + 4 typecheck fixes). Committed, **not pushed/deployed** (deploy dormant).
- **RDS cutover PENDING (live-launch path):** Justia provisioned an RDS `db.openjurist-pg.justiapro.com` → AWS `friends-openjurist-prod`, us-west-2, likely loaded the 2026-06-05 dump. Blocked on: (1) **verify endpoint out-of-band with Esteban/Phil** (`justiapro.com` ≠ `justia.com` — a connect attempt was blocked by the safety classifier pending verification); (2) creds/connectivity check. Then Stage 6–9 of RELEASE.md.
- Docs map: SECURITY.md, SECURITY_HANDOFF.md, RELEASE_PROTOCOL.md, RELEASE.md, verify.sh + .githooks/pre-push, migrations/CONVENTIONS.md, POST-HANDOFF-DEPLOY-SAFETY.md, BRANCH_PROTECTION_SETUP.md.

## `apps/openjurist/SECURITY_HANDOFF.md` — security dossier
- OpenJurist = public, **unauthenticated** legal-research site; **untrusted ingest** (CourtListener bulk, archive.org OCR, scraped Wikipedia, Shopify); only privileged role = admin → admin compromise = full-site compromise.
- Verdict: hardening pass, not a rewrite. **7-layer defense-in-depth:** Cloudflare edge (DDoS/WAF/TLS) → HTTP security headers (XCTO/XFO/HSTS/Referrer/Permissions/CSP) → authn/authz (sealed cookie + admin-guard + per-request `OJ_ADMIN_EMAILS` re-check) → input boundary (per-IP throttles on trusted `cf-connecting-ip` + honeypots + `urlSafety`) → output boundary (`sanitizeRichHtml` allowlist before every v-html + `safeJsonLd`) → data (Drizzle parameterized SQL + least-privilege role) → config/boot (secrets private, security-preflight fail-fast, openAPI off in prod).
- **12 findings** (mostly medium/low), almost all ✅ fixed; headline ongoing = finishing **CSP enforcement** (report-only shipped). Audited-and-confirmed-not-exploitable: SQLi, command injection, SSRF, cart tampering, SMTP header injection, mass-assignment.
- **Method:** multi-agent audit, 10 dimensions in parallel, each finding handed to **adversarial verifiers instructed to refute** it → only real issues survive. 10-rule grep-able pre-commit checklist in `SECURITY.md`.
- Open (deploy/infra/decision): full CSP enforcement, lock origin firewall to Cloudflare IPs, apply least-privilege DB role, og-image signing, embed-vs-XFO product decision.

---

## Significance
- These + `AGENT_WORKING_STANDARD.md` ([batch08](batch08-raw.md)) = Sam's **framework-standard trio** (Work / Ship / Operate). All authored in the OpenJurist fork; the repo-scan confirmed them absent from core/dev-fork/totem → **fork-only**, exactly as grounded.
- **They overlap heavily with Totem V6** (verify-before-assert, gate:LOCKED ≈ "model proposes, gate disposes", ADR immutability, single-source-of-truth, human-approval-for-prod). → the standing ROOT decision: **adopt into the fork + reconcile, or keep Totem V6 canonical & cite as prior art.**
- Sam's security method (multi-agent finder → adversarial refuters → synthesis) is the **same shape** as the workflows this instance runs — notable convergence.
