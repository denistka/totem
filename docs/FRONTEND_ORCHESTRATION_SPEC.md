# Frontend Orchestration Specification: The House of Bricks

This document defines the abstract, framework-agnostic architectural blueprint for the system's graphical dashboard. It utilizes the "House Built from Bricks" metaphor to visualize the structural integrity and progress of AI-driven development.

## 1. The Visual Grammar of the Brick

The "Brick" is the primary visual unit representing a single development task. Design must emphasize stability, modularity, and state-clarity.

### 1.1 Structural Properties
- **Proportion**: Each brick should have standardized dimensions to signify atomic weight.
- **Connectors**: Visual indicators of "slots" for dependencies (Prerequisites) and "pins" for outputs (Post-requisites).
- **Surface Detail**: Minimalist display of Task ID and Role (e.g., ARCHITECT, DEV).

### 1.2 State Visualization (The Color & Texture Language)
The UI must communicate system health through non-textual cues:
- **Atmospheric/Ambient State**: Background of the "construction site" reflects the global sprint health.
- **Brick Textures**:
    - *Transparent/Wireframe*: Queued/Potential work.
    - *Pulsing Glow*: Active execution/Sandboxing underway.
    - *Monochromatic/Sanded*: Completed and Verified.
    - *Cracked/Glitch*: Failed verification or build error.
    - *Shielded*: Blocked by a prerequisite failure or Invariant violation.

## 2. Geometric Composition (The House Model)

The arrangement of bricks is not arbitrary but follows the vertical logic of physical construction.

### 2.1 The Vertical DAG (Bottom-Up)
1.  **The Foundation (The Deep Layers)**: Lowest level of the UI. Contains core protocol setup, database migrations, and foundational types.
2.  **The Framework/Walls (The Middleware)**: Middle level. Contains services, business logic, and API adapters.
3.  **The Finishing/Roof (The Surface)**: Highest level. Contains visual components, UX polish, and final integration.

### 2.2 Dynamic Scaffolding
As the AI plans new tasks, "Ghost Bricks" appear in the graph, representing the intended architecture before it is physically implemented. This visualizes the "Planning Horizon."

## 3. Interaction & Intelligence Inspection

The dashboard is not just a monitor but an active interface for the human "ROOT" user to audit the "Machine."

### 3.1 The Inspector (Deep-Dive Panel)
Selecting a brick triggers an "Exploded View" or a side-panel Inspector:
- **Evolutionary View**: A time-scrubber to see the code evolve from raw prompt to final patch.
- **The "Brain Dump"**: Real-time stream of the LLM's internal reasoning logs.
- **Verification Blobs**: Direct access to screenshots, test coverage reports, and build logs produced by the Sandbox.

### 3.2 Manual Interventions (The "God Hand" Gates)
The UI must provide explicit controls for the human operator:
- **Approval Logic**: A definitive primary action to "Pass the Gate" for tasks requiring human verification.
- **Force-Redo**: Ability to "smash" a brick (reset its state) to trigger a re-execution with new instructions.
- **Invariant Lock**: A visual toggle to freeze a specific artifact, making it uneditable by the AI.

## 4. Architectural Observation (The Pure Consumer)

The Frontend must follow a strict **Unidirectional Observer Pattern**.

### 4.1 Data Flow
1.  **Subscription**: The UI opens a persistent stream to the Global Event Bus.
2.  **Normalization**: Incoming events are mapped to the Task Store without modifying the central graph logic (which lives on the Backend).
3.  **Reconciliation**: The UI performs a "Virtual Construction" update—bricks change states and connections gracefully to prevent visual disorientation.

### 4.2 Spatial Navigation
High-purity systems can grow to hundreds of tasks. The UI must support:
- **Semantic Zooming**: At low zoom, show global health and "neighborhoods" of tasks. At high zoom, reveal code details and logs.
- **Path Highlighting**: Clicking a failed task must instantly highlight the entire dependency "load-bearing" path from foundation to roof.

## 5. Performance Invariants
- **Non-Blocking UI**: The main thread must remain fluid even during high-frequency log streaming from 10+ concurrent workers.
- **State Compression**: The visualizer should only keep the active "Construction Horizon" in high-fidelity memory, offloading completed foundation bricks to a simplified summary view.
