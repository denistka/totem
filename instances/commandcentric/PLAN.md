# CommandCentric: Detailed MVP Plan

## 🎯 Concept

A high-end, military-aesthetic operations dashboard for managing mixed physical assets (fleets, drones, smart-home IoT devices).

## 🛠️ Tech Stack

- **Frontend / Client**: React 19, TypeScript, Tailwind CSS (Dark Glassmorphism UI tokens), Leaflet (Maps), Tauri 2 (Desktop/Mobile wrapper).
- **Backend**: Node.js, WebSockets (for high-frequency telemetry), Redis (Pub/Sub for event streams).
- **Database**: PostgreSQL (for historical telemetry and Incident replay logs).

---

## 🗺️ Epics

### Epic 1: The Tactical Map (E-01)

Build a highly optimized, dark-themed geographic interface capable of rendering 1,000+ live moving entities without UI lag.

### Epic 2: Live Telemetry & Alerts (E-02)

Connect to high-frequency WebSocket streams (IoT device status, battery levels). Implement an alert system for thresholds (e.g., "Drone Battery < 15%").

### Epic 3: Operational Dispatch (E-03)

Allow the commander to select entities on the map and dispatch tasks (e.g., "Return to Base," "Investigate Zone") to operators in the field.

### Epic 4: Incident Replay / Time Travel (E-04)

Implement chronological event sourcing to allow the commander to "scrub" backward in time and review the map state leading up to a critical incident.

---

## 🏃‍♂️ MVp Sprints

### Sprint 01 (S01): Core UI & Skeleton

- **Goal**: Setup the React codebase tailored for a "Command Center" aesthetic. Implement the main grid: Map View, Telemetry Sidebar, Alert Stream.
- **Outcome**: A static but visually striking responsive dashboard frame using glassmorphism tokens.

### Sprint 02 (S02): Live Geographic Rendering (E-01)

- **Goal**: Integrate Leaflet. Build a mock Node.js WebSocket server emitting 200 vehicle/drone coordinates at 5Hz.
- **Outcome**: Smooth, real-time interpolation of markers on the map with clustering out-of-the-box.

### Sprint 03 (S03): Telemetry Grids & Thresholds (E-02)

- **Goal**: Attach specific metadata (speed, voltage, heading) to markers. Build the UI for the "Selected Entity" panel to pulse red on alerts.
- **Outcome**: Clicking an entity displays live tactical data. Critical assets flash on the map automatically.

### Sprint 04 (S04): Task Dispatch Pipeline (E-03)

- **Goal**: Integrate a simplified Kanban/Queue for active field tasks. Drag a task onto an entity to assign it.
- **Outcome**: Commander can "Issue Order" which moves a task into the "In Progress" queue attached to that entity's UID.

### Sprint 05 (S05): The Time Machine (E-04)

- **Goal**: Implement the lower timeline slider. When engaged, disconnect from live WebSockets, request a 5-minute historical event chunk from the DB, and render past positions.
- **Outcome**: MVP Release. Commander can track live fleets, issue orders, and rewind the map 5 minutes to review an event.
