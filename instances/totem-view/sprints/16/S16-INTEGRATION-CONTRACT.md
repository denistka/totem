# S16 Integration contract (task managers)

**Purpose:** Link Totem tasks to external items (Jira, ClickUp, Notion). Common shape and provider interface so all providers implement the same contract.

---

## IntegrationLink type

Attached to a Totem task when linked to an external item:

```ts
type IntegrationProvider = 'jira' | 'clickup' | 'notion'

interface IntegrationLink {
  provider: IntegrationProvider
  externalId: string   // e.g. Jira key "PROJ-123", ClickUp task id, Notion page id
  url: string         // human-readable URL to open in browser
}
```

- **provider:** Which task manager.
- **externalId:** Provider’s id or key for the item.
- **url:** Full URL to open the item (e.g. `https://domain.atlassian.net/browse/PROJ-123`).

---

## Provider adapter interface

Server-side only. Credentials from env or secure store (per tenant if S14).

| Method | Required | Description |
|--------|----------|-------------|
| `getTaskUrl(externalId: string)` | Yes | Return browser URL for the external item. |
| `fetchProjects()` | Optional | List projects/spaces/databases for "pick item" UI. |
| `fetchTasks(projectKeyOrId: string)` | Optional | List tasks/issues/pages in a project. |
| `mapStatus(externalStatus: string)` | Optional | Map provider status → Totem status (todo \| in_progress \| done). |

- **Linking:** User can link by (a) picking project + task from list (if fetch endpoints exist), or (b) pasting external URL (parse externalId from URL). Document URL formats per provider for parsing.

---

## Task shape

- Task (from API) includes optional **integrationLink**: `IntegrationLink | null`.
- **Storage (S16-T2):** In .pd frontmatter (YAML) as:
  ```yaml
  integrationLink:
    provider: jira   # or clickup | notion
    externalId: "PROJ-123"
    url: "https://domain.atlassian.net/browse/PROJ-123"
  ```
  Parser and API return it; write path (saving link) can update .pd frontmatter or use a separate store.

---

## Provider URL formats (for parsing pasted URL)

- **Jira:** `https://{domain}.atlassian.net/browse/{key}` → externalId = key.
- **ClickUp:** `https://app.clickup.com/.../t/{task_id}` or contains `/t/` + id.
- **Notion:** `https://notion.so/{page_id_or_slug}` → externalId = page id (32-char hex).
