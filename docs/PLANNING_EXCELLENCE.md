# Planning Excellence: State-Driven Architecture

This guide outlines the best practices for planning complex features in the Totem framework, focusing on State-Driven architecture.

## Core Principles

1. **Scope by Flow, Not by Widget**: Plan tasks in the context of the full user flow. A single "small" task (e.g., adding a component) often pulls in types, styles, and multiple screens. Scope at the scenario/screen level and split into atomic `.pd` tasks by dependency order.
2. **State First**: Define the data structures and state transitions before implementing the UI.
3. **Atomic Tasks**: Every `.pd` file should represent a single, verifiable step.
4. **Just-In-Time Context**: Only load the stacks and rules needed for the specific task at hand.

## Planning Workflow

1. **Research**: Analyze the source-of-truth reference application or documentation.
2. **Decomposition**: Break the feature into logical tracks (e.g., API, Data Layer, UI).
3. **Dependency Mapping**: Identify which tasks depend on others.
4. **Verification Strategy**: Define how each task will be proven correct before moving to the next.
