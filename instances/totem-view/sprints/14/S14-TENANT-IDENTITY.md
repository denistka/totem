# S14 Tenant identity model

**Purpose:** Define how the system identifies the client (tenant) per request so API and UI can scope data. No full auth (login/signup) in this sprint — minimal identity only.

---

## Chosen mechanism

- **Primary:** HTTP header **`X-Tenant-Id`** — string (uuid or slug). Same id is used in ownership mapping (S14-T2).
- **Optional (later):** `Authorization: Bearer <token>` where token is an API key or JWT. If used, a server-side store maps key → tenant id, or JWT carries a `tenant`/`sub` claim. Not implemented in S14; header is sufficient.
- **Serverless:** Identity is per request; no sticky session. Header is preferred for Vercel/serverless.

## Tenant id type

- **Type:** string (e.g. `totem-view`, or UUID).
- **Display:** Optional tenant display name can live in config/store or a future token claim; not required for S14.

## Missing or invalid identity

- **Behavior:** Return **401 Unauthorized**.
- **Response body:** `{ "error": "Unauthorized" }` (generic; do not echo tenant id or hint in body).
- **Effect:** No instance list or instance-scoped data is returned. Client should show "Unauthorized" or "Please log in" (S14-T6).

## Security notes

- No passwords or signup in this task.
- Do not log tenant id in plain text in production if it is considered sensitive; document policy in S14 invariants.
