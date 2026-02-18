# S01-AUDIT: Military Object Tracking System

## 🎯 Task Context

Objective: High-performance map-based tracking system for 100-200 objects with state persistence and strict auth.

## 📋 Requirements Decomposition

### 1. Data Model (`ARCHITECT.pa` impact)

- **Object Entity**: `{ id: string, pos: [lat, lng], dir: number, status: 'active' | 'lost', lastSeen: timestamp }`
- **Scale**: 200 entities. React rendering optimization required (possibly Canvas or optimized SVG for markers if performance drops).

### 2. State Management (`MobX`)

- **Store**: `ObjectStore` will manage the observable list.
- **Lost Logic**: A background worker/timer inside MobX to check `Date.now() - lastSeen`.
  - `> T_lost`: status = 'lost'
  - `> 5min`: delete from store

### 3. Authentication

- **Mechanism**: LocalStorage key or Header-based.
- **Flow**: Guarded routes/components checking for the presence of the unique key.

### 4. Integration

- **Mock Server**: Needs to emit jittery movement data for the objects to simulate real-world conditions.
- **Map**: Choice of engine (OpenStreetMap/Leaflet or Google Maps). Recommendation: **Leaflet** (open source, fits military/independent theme).

## ⚠️ Risk Assessment

- **R1: Performance**. React might struggle with 200 re-renders if the map library isn't handled correctly. Use `observer` optimally.
- **R2: Temporal Logic**. Ensuring the 5-minute removal works even if the tab is backgrounded.
- **R3: Mock Server Sync**. The mock must reliably simulate "data stops" for specific IDs to test Requirement #3.

## ✅ Next Steps (Phase 1)

1. Initialize Vite + React + TS project.
2. Install MUI, MobX, Leaflet.
3. Setup Mock Server (Node.js/Express or simple script).
