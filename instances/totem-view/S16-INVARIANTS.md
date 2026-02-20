# S16 Invariants — Task manager integrations

**Sprint result:** Users can link Totem tasks to Jira, ClickUp, and Notion. Task detail shows "Open in Jira/ClickUp/Notion"; integrations settings show configured state (env-based). S05/S06/S08 preserved.

---

## Frozen decisions

- **IntegrationLink:** `{ provider: 'jira' | 'clickup' | 'notion', externalId, url }`. Stored in .pd frontmatter; API returns it on task. Contract: `sprints/16/S16-INTEGRATION-CONTRACT.md`.
- **Providers:** Jira (JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN), ClickUp (CLICKUP_API_TOKEN), Notion (NOTION_TOKEN). Server-side only; no secrets in repo. Optional list endpoints: Jira projects/issues, ClickUp spaces/tasks, Notion databases.
- **UI:** Task detail shows "Open in {Provider}" when task.integrationLink exists. Integrations page at /integrations shows "Configured via environment" or "Not connected" per provider; links to token docs.
- **Import/sync:** Documented in S16-IMPORT-SYNC.md; implementation deferred.

---

## Invariants for next sprints

- S05/S06/S08 unchanged. Integrations are additive; no change to core board/task UX when no link.
