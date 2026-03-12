# Totem View: The Human-AI Interface

Totem View is the graphical orchestrator for the Totem framework, providing a high-level visual dashboard for project health, sprint progress, and architectural memory.

## Core Philosophical Tenets

1. **The House of Bricks**: Every project is built from atomic, high-purity logic "bricks" (.pd files).
2. **Visual Purity**: If the system's state cannot be understood in 30 seconds, the UI is failing.
3. **No Shadow State**: The UI is a reflection of the knowledge graph (.ti files) and history (.ptl/.pd files).

## Dashboard Sections

### 1. The Global Graph (DAG)
A visual representation of the project's dependency tree. Shows locked, active, and completed tasks.

### 2. Purity & Density Metrics
Real-time analysis of the project's adherence to Totem protocol standards (e.g., file lengths, deduplication).

### 3. Invariant Guardian
A dedicated view for monitoring frozen decisions and preventing regressions.

## Getting Started

Totem View is currently in the **Foundation Phase**. 
See [core/GUI_ORCHESTRATOR.ti](file:///Users/denistka/Projects/totem/core/GUI_ORCHESTRATOR.ti) for technical specs.
