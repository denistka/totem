# S85 — ScreenRouter lazy boundaries

| Route (`AppScreen`)   | Component              | Load strategy                          |
| --------------------- | ---------------------- | -------------------------------------- |
| `login`               | `LoginScreen`          | **Static** — first paint / auth entry  |
| `objects`             | `ObjectsScreen`        | **React.lazy** — `screens/objects`     |
| `map`                 | `MapScreen`            | **React.lazy**                         |
| `tracking`            | `TrackingScreen`       | **React.lazy**                         |
| `tracking-action`     | `TrackingActionScreen` | **React.lazy**                         |
| `reports`             | `ReportsScreen`        | **React.lazy** (via `screens/reports`) |
| `object-details`      | `ObjectDetailsScreen`  | **React.lazy**                         |
| `settings`            | `SettingsScreen`       | **React.lazy**                         |
| `notifications`       | `NotificationSettingsScreen` | **React.lazy**                   |

## Notes

- Router imports **types** and **login** synchronously only; heavy screens are behind `Suspense` (fallback `null`, same as prior routes).
- **Gap (follow-up optional):** `LoginScreen` remains eager by design; if bundle metrics require it, consider lazy login after shell paint (product decision).
