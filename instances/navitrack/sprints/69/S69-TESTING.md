# Manual Testing Migration Plan: API v6 Features (Sprint 69)

This plan outlines the steps required to manually verify the newly implemented API v6 features in the NaviTrack application.

## 1. Authentication & Session

- [ ] **Login Flow**: Verify login works for standard credentials.
- [ ] **MFA/OTP**: If possible, trigger an OTP requirement (via server config) and verify the UI handles the 'otp' or 'mail' status by showing the appropriate input.
- [ ] **Logout**: Verify session cleanup and redirection to login.

## 2. Engine Control (Sprint 68)

- [ ] **Access Control**: Select a vehicle without engine block hardware. Verify the "Not Available" screen appears.
- [ ] **Safe Lock**: Click "Lock Engine (Safe Mode)". Confirm the dialog. Verify successful toast message.
- [ ] **Emergency Block**: Click "Emergency Block!". Confirm both safety dialogs. Verify successful toast message.
- [ ] **Unlock**: Click "Unlock Engine". Confirm and verify success.
- [ ] **Permission Check**: Verify that a user without `lock` rights cannot see/interact with these controls.

## 3. Map & Geozones (Sprint 69)

- [ ] **Layer Persistence**: Switch Map Provider (e.g., from Google to OSM). Reload application. Verify the provider remains selected.
- [ ] **Geozone Rendering**: Navigate to a map area with known geozones. Verify Polygons and Circles are visible with correct colors.
- [ ] **Geozone Popups**: Click on a geozone. Verify a popup appears with the zone name/description.

## 4. Fleet Management Screens (Sprint 69)

- [ ] **Geozones List**: Navigate to Settings -> Geozones. Verify the list matches the map data.
- [ ] **Drivers List**: Navigate to Settings -> Drivers. Verify avatars and phone numbers are displayed correctly.
- [ ] **Maintenance Templates**: Navigate to Settings -> Maintenance. Verify "Active" badges and range indicators (Distance/Moto/Time) are visible.
- [ ] **Search**: Verify the search bar filters the list in all three management screens.

## 5. Maintenance Alerts integration

- [ ] **Object List Alerts**: Identify a vehicle with triggered maintenance in the API. Verify the orange `AlertTriangle` icon appears on its card in the main list.
- [ ] **Real-time consistency**: Verify the icon appears/disappears correctly based on whether maintenance work is recorded (if server data updates).

## 6. Layout & Responsiveness

- [ ] **Mobile Experience**: Verify all new screens fit correctly on common mobile viewports (simulated or real device).
- [ ] **Header Integration**: Verify the Back button in the header returns the user to the correct previous screen (Settings or Object Details).
