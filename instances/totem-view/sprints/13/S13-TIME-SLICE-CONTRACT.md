# S13 Time-slice API contract

**State at time T:** Sprints and tasks as they existed at or before a given point in time. Same response shape as current state; semantics: only include data that existed at T.

---

## Request

- **Endpoint:** `GET /api/instances/:id/sprints`
- **Optional query parameters (at least one supported):**
  - `at` — ISO 8601 date-time (e.g. `2025-02-15T12:00:00Z`) or date-only (e.g. `2025-02-15`). Server returns state as of this time.
  - `commit` — Git SHA (full or short). Server returns state as of this commit. Requires instance directory to be in a git repo.

When neither `at` nor `commit` is present, the response is **current** state (same as today).

---

## Response

**Shape:** Same as current `GET /api/instances/:id/sprints`:

- Array of sprint objects: `id`, `name`, `title`, `goal`, `projectId`, `gate`, `phase`, `invariants`, `tracks`, `tasks`.
- Each `tasks` element: parsed .pd shape (`id`, `title`, `status`, `objective`, `steps`, `acceptanceCriteria`, etc.).

**Semantics when `at` or `commit` is provided:**

- **Sprints:** Only sprints that **existed at T** are included (e.g. sprint directory or .ptl present at T).
- **Tasks:** Within each sprint, only tasks that **existed at T** are included. If a sprint had fewer .pd files at T, the `tasks` array reflects that (no future tasks).

**Optional response field:**

- `asOf` (or `sliceTime`) — ISO 8601 string indicating the effective time of the slice, so the client can display e.g. "As of 15 Feb 2025". When omitted, client can use the requested `at` or the commit date.

---

## How "existed at T" is determined

(Implementation detail; backend chooses one or more.)

1. **Git:** Content at `commit` or at the latest commit with date ≤ `at`. Use `git show rev:path` for file content at rev. Sprints/tasks that didn’t exist at that rev are excluded.
2. **File mtime:** Directories/files with `mtime <= T`. Only existence at T is known; content is read from current files. Document limitation (no history of content changes).
3. **Snapshot store:** Optional; precomputed snapshots keyed by time or commit.

When instance is not a git repo or git is unavailable: fallback to current state only, or to mtime filtering if `at` is supported.

---

## Timeline / history (optional)

- **Endpoint:** `GET /api/instances/:id/timeline` or `GET /api/instances/:id/history`
- **Response:** Small list of available times (e.g. commit dates or mtimes) for the timeline slider range. Format TBD (e.g. `{ times: string[] }` ISO 8601 or `{ commits: { sha, date }[] }`).

Not required for minimal Time Machine; range can be "last N days" or "first commit to now" with no marks.
