# S25 INVARIANTS — Leave guard, share files (DRAFT, awaiting Denis approval)

Depends: [`S24-INVARIANTS.md`](S24-INVARIANTS.md). Date: 2026-10-16. Scope: iOS only.

1. **The unsaved-edits sheet always has an enabled "Leave without saving".** While busy, Save is replaced by progress text + Cancel (`cancelUnlock`); a failed save shows its reason in the sheet.
2. **Shared text keeps the legacy layout**: `dd.MM.yyyy HH:mm:ss`, labels in the UI language (`legacyExport.*`), only points with a captured frequency. The password never goes into the text.
3. **Sharing is text only** via `shareText` (Denis 2026-10-16). Settings text = Denis sample (golden test); graduation text = header + Тарувальна таблиця. No files, no native share plugin.
