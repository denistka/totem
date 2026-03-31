# SDUI-Proto Invariants

> Core principles to uphold across all sprints.

1. **Server-Driven Focus**: The UI must be highly decoupled, relying purely on JSON data fetched natively.
2. **Recursive Node Rendering**: The core architecture maps string `type` arrays recursively into concrete sub-components like stat cards, vehicles, headers.
3. **Themed Experiences**: The experience toggles dynamically (Fleet, Sports, Beer). CSS structure must respect `[data-theme]` attributes.
