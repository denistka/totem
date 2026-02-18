# Test Task: Object Tracking Application

## Requirements

1. **Object Properties**:
   - Unique identifier (UID)
   - Coordinates (lat/lng)
   - Direction of movement (bearing/heading)

2. **Scale**:
   - Support for up to 100-200 simultaneous objects.

3. **Persistence Logic**:
   - If server data stops: mark as **LOST**.
   - After 5 minutes of no data: **REMOVE** from map.

4. **Authentication**:
   - Unique key-based authorization.

5. **Technical Stack**:
   - TypeScript
   - React
   - MobX (State Management)
   - Material UI (UI Library)

6. **Deliverables**:
   - Source code
   - Built application (production bundle)
   - Mock server (providing data)
