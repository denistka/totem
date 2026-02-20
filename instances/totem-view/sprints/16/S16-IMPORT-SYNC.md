# S16-T7: Optional import / one-way sync (scope)

**Scope for this sprint:** Document only. Implementation deferred.

- **Import from Jira:** Fetch issues from a project (e.g. via existing GET /api/integrations/jira/issues?projectKey=X), match by title or key to existing Totem tasks, then save integration links. Requires write path for links (e.g. .pd frontmatter update or instance-level store). Conflict handling (id clash) and "create as new task" are future.
- **Push status to Jira:** When a Totem task status changes (todo → in_progress → done), call Jira transition API to update issue status. Requires status map (todo → To Do, done → Done, etc.) and write permission on Jira. Can be triggered on task update or via explicit "Sync to Jira" button.

**Extension:** Same pattern for ClickUp and Notion (import or push). Rate limits and provider-specific APIs apply.
