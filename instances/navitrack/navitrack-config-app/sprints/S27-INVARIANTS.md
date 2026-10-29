# S27 INVARIANTS (DRAFT — not committed, awaiting Denis)

Extends S26-INVARIANTS.md. All S23–S26 invariants hold.

1. Graduation rows have stable identity: React keys never derive from index; deleting row N never changes the values shown in other rows.
2. Only captured rows (frequency > 0) can be deleted; the trailing open row has no trash. Trash touch target ≥ 44×44 px with an aria-label naming the row number.
3. Deleting a row always asks first (confirm sheet); after deletion a 5 s toast offers 'Повернути'/'Undo', restoring rows and keys exactly. There is no "delete last row" button.
4. Numbering is positional (1..n) and renumbers after delete/undo; the open row is re-appended per row limit.
5. Leave guard ("Зберегти зміни?") fires for unsaved graduation edits (edit, capture, delete, undo, template apply), not for draft load or a sensor read. Save writes captured rows to the sensor; only gradWriteOk/gradReadbackOk clear it; failure keeps the sheet open with the graduation reason. "Вийти без збереження" is always available (S23-4).
6. Locales en/uk/ru/pl share the exact same key set and placeholders (locale-parity test). Counted strings use i18next plural forms (_one/_few/_many/_other for uk/ru/pl).
7. Polish is machine-translated until a native review is recorded in src/locales/README.md.
8. A pl-* system language opens the app in Polish only until the user picks a language in Settings; other system languages keep the stored default (ua).
9. Legacy share text formats (S25) are unchanged; their labels come from the active locale.
