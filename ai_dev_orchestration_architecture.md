# AI-Orchestrated Development System

## Architecture and Improvements Summary

This document summarizes a practical architecture for a system that
converts **low‑quality user prompts into structured software development
workflows**.\
The goal is to standardize development, automate testing, log changes,
and visualize the development process as a **"house built from bricks"**
metaphor.

------------------------------------------------------------------------

# 1. Core Principle

The system transforms raw prompts into controlled development workflows.

Pipeline:

Raw Prompt → Prompt Normalization → Sprint Planning → Task Graph →
Execution → Build/Test → Preview → UI Dashboard

------------------------------------------------------------------------

# 2. Brick-Based Task Model

Each task is represented as a **brick**.

Example:

brick: id: S72-T03 type: feature state: pending depends_on: - S72-T01

Possible states:

pending\
planning\
implementing\
building\
testing\
verified\
failed

Dependencies create a **DAG (Directed Acyclic Graph)** representing the
house structure:

foundation → walls → roof

------------------------------------------------------------------------

# 3. System Layers

1.  Prompt Normalizer
2.  Sprint Planner
3.  Task Graph Engine
4.  Execution Workers
5.  Build/Test System
6.  Preview Server
7.  UI Dashboard

------------------------------------------------------------------------

# 4. Prompt Normalization

Incoming prompts may be vague or low quality.

Normalization extracts:

problem scope constraints unknowns

Example:

problem: livestock tracking software scope: - gps devices - map
visualization constraints: - mobile first

This step improves AI planning reliability.

------------------------------------------------------------------------

# 5. Task Graph Architecture

Tasks are stored as nodes in a graph.

Example structure:

{ "nodes": \[ {"id": "T1", "state": "pending"}, {"id": "T2", "state":
"blocked"} \], "edges": \[ {"from": "T1", "to": "T2"} \] }

Advantages:

-   dependency management
-   parallel execution
-   visual progress representation

------------------------------------------------------------------------

# 6. Event Bus

A real-time event stream updates the UI.

task_engine → event_bus → ui

Recommended technologies:

Redis Streams\
NATS\
WebSockets

Example event:

{ "type": "task_state_changed", "task": "T03", "state": "testing" }

------------------------------------------------------------------------

# 7. Task Execution Sandbox

Each task runs in an isolated environment.

Recommended approach:

Docker container per task

Benefits:

-   prevents conflicts
-   reproducible builds
-   safe parallel execution

------------------------------------------------------------------------

# 8. Incremental Build System

Avoid full rebuilds.

Process:

task change → incremental build → preview update

Tools:

Vite\
Turborepo\
Incremental TypeScript builds

------------------------------------------------------------------------

# 9. Live Preview Environment

Each successful task can generate a preview.

Example:

preview.local/app?task=S72-T03

The UI allows instant inspection of the result.

------------------------------------------------------------------------

# 10. Pattern Library

Reusable development patterns accelerate project generation.

Examples:

auth-flow\
map-tracking\
report-generation\
pagination

The planner can match prompts to known patterns.

------------------------------------------------------------------------

# 11. Prompt Repair Layer

A repair step improves poor prompts.

Pipeline:

raw prompt → clarify → extract intent → generate sprint

This significantly improves task planning accuracy.

------------------------------------------------------------------------

# 12. Artifact Storage

Every task produces artifacts.

Example:

artifact: code tests logs

Suggested structure:

artifacts/ tasks/ builds/ previews/

------------------------------------------------------------------------

# 13. Observability

System metrics should be recorded.

Examples:

task duration\
failure rate\
LLM retry count

This enables continuous optimization.

------------------------------------------------------------------------

# 14. Minimal Local Infrastructure

Recommended components:

orchestrator task-engine build-worker preview-server ui-dashboard redis
docker

Responsibilities:

Orchestrator → pipeline control\
Task Engine → AI execution\
Build Worker → compile and test\
Preview Server → serve application preview\
UI Dashboard → visualize progress

------------------------------------------------------------------------

# 15. UI Model (House Construction)

The dashboard represents tasks as bricks.

Example:

\[foundation\] done \[wall-1\] running \[wall-2\] blocked \[roof\]
pending

Clicking a brick reveals:

task context\
generated code\
tests\
logs

------------------------------------------------------------------------

# 16. Recommended Technology Stack

Frontend:

React\
Tailwind\
ReactFlow (graph visualization)

Backend:

Node.js\
Redis\
Docker

AI layer:

LLM orchestration scripts

------------------------------------------------------------------------

# 17. Final Result

The system becomes a **local AI‑orchestrated development platform**
combining:

task planning\
AI code generation\
automated testing\
process visualization\
live previews

Conceptually it merges capabilities similar to:

CI pipelines\
issue trackers\
AI coding assistants

into a single structured development workflow.
