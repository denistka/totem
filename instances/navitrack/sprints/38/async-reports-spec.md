# S38 — Async Reports API (Spec)

**Backlog:** H-003 (async Reports API).

---

## Scope

- User requests a report (type, date range, vehicle, partition).
- Report generation is long-running on the backend.
- Frontend: poll or SSE for progress; show progress UI; handle download when ready; allow cancel.

---

## API shape (align with backend)

- **Request report:** `POST /api/reports/request` (or equivalent) — body: bunchId, companyIds, vehicleIds, start, end, partition. Response: `{ reportId, status: 'queued' }`.
- **Progress:** `GET /api/reports/{reportId}/status` — response: `{ status: 'queued'|'processing'|'ready'|'failed', progress?: number, message?: string }`. Poll every N seconds until status is ready or failed.
- **Download:** `GET /api/reports/{reportId}/download` — returns file (e.g. PDF/Excel). Or redirect to signed URL.
- **Cancel:** `POST /api/reports/{reportId}/cancel` (optional).

---

## Frontend tasks

- T3: Implement report request + progress UI (polling or SSE); handle download/cancel.
- Use existing ReportForm for input; add progress state and download button when ready.
