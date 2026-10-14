# S20-T1 leftover tree

Unowned working tree at S20 start. Keep only a hunk that matches a rule S19 already froze. Revert the rest.

## Kept

| File | Hunk | Why |
|------|------|-----|
| `src/config/lib/navigation.ts` | `home` leaves `ShellScreenId` | Home is a bottom tab, not a screen outside the bar |
| `src/config/lib/navigation.ts` | `{ id: 'home', labelKey: 'nav.home' }` in `TABS` | Home is a bottom tab and the primary hub tab |
| `src/config/lib/navigation.ts` | `installation-report` → `home` in `hubTabHighlight` | Installation-report highlights Home |
| `src/config/lib/navigation.test.ts` | Tab list is Home · Sensors · Logs · About | Same Home-tab rule |
| `src/config/lib/navigation.test.ts` | Home and installation-report highlight `home` | Home tab + report highlights Home |
| `src/store/useNavigationStore.ts` | default `hubTab: 'home'` | Home is the primary hub tab |
| `src/store/useNavigationStore.test.ts` | fixture `hubTab: 'home'` | Matches the primary hub tab |
| `src/shell/components/MobileShellTabBar.tsx` | one `Home` icon, `h-5 w-5`, same slot style as the other tabs | A Home tab may keep one icon in the existing style |
| `src/screens/settings/SettingsScreen.test.tsx` | drop the level-1 "Settings" heading assertion | Settings does not gain a second screen header |

## Reverted

| File | Hunk | Why |
|------|------|-----|
| `src/config/lib/navigation.ts` | `SCREEN_DEPTH` / `screenDepth` | screenDepth slide motion. S19 did not freeze it |
| `src/config/lib/navigation.test.ts` | depth-order test and `screenDepth` import | Same |
| `src/shell/components/MobileShellTabBar.tsx` | Sensors icon `Activity` → `Radar` | Icon swap |
| `src/shell/components/MobileShellTabBar.tsx` | drop `border-t border-border/40` | Glass border |
| `src/shell/components/MobileShellTabBar.tsx` | `px-1 pt-1.5 pb-1.5`, tighter button padding, `rounded-2xl` | Padding |
| `src/shell/components/MobileShellTabBar.tsx` | `text-[10px] font-semibold tracking-wide` | Type tracking |
| `src/shell/components/MobileShellTabBar.tsx` | active icon pill (`h-8 w-8`, `bg-primary/15`) | Chrome S19 did not freeze |

## Compile fix outside the six files

`src/shell/components/ScreenTransition.tsx` was already committed in S19-T3 and imported `screenDepth`, which existed only in this uncommitted tree. Reverting `screenDepth` left that import broken. The directional `x` slide is removed. The crossfade and the exiting-screen `pointer-events: none` stay, so the S19 click-block test still holds. No new screen, tab, command, or sensor.
