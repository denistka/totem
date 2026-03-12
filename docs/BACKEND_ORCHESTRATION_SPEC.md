# Backend Orchestration Specification: The Autonomous Task Engine

This document defines the abstract, framework-agnostic architectural blueprint for an autonomous development engine. It focuses on the logic of task orchestration, state management, and the execution lifecycle without referencing specific technologies.

## 1. The Task Graph System (Directed Acyclic Graph)

The core of the engine is a **Directed Acyclic Graph (DAG)**. This structure represents the "dependency-first" philosophy of software construction.

### 1.1 Node Definition (The Atomic Task)
Each node in the graph represents a singular, verifiable intent.
- **Identity**: Unique immutable identifier.
- **Contract**: Input requirements (dependencies) and expected output (artifacts).
- **Metadata**: Declarative properties (Role, Focus, Required Expertise).

### 1.2 Edge Mechanics
Edges define the flow of execution. A directed edge from Node A to Node B implies that Node A is a prerequisite for Node B.
- **Strict Ordering**: Node B cannot enter the `IMPLEMENTING` state until Node A is `VERIFIED`.
- **Parallelism**: Multiple nodes with satisfied dependencies (in-degree 0 in the current execution sub-graph) must be eligible for concurrent execution.

## 2. The Deterministic State Machine

The engine governs every task through a standardized state machine to ensure process integrity.

### 2.1 State Catalog
1.  **QUEUED**: Task exists in the graph but its prerequisites are not yet met.
2.  **READY**: All dependencies are `VERIFIED`. Task is eligible for dispatch.
3.  **PLANNING**: Agent is refining the specific implementation strategy (Drafting).
4.  **EXECUTING**: Active code generation or system modification is underway.
5.  **VERIFYING**: Automated checks (Static Analysis, Execution Tests) are running.
6.  **COMPLETED**: Task passed all manual/automated gates. Node is locked.
7.  **BLOCKED**: A dependency failed or a critical invariant was triggered.
8.  **REPAIRING**: An automated loop is attempting to fix a `FAILED` state.

### 2.2 Transition Integrity
- **One-Way Progress**: Once a task is `COMPLETED`, it cannot be modified without creating a new task or a formal "Refactor" sprint.
- **Automatic Rollback**: If a task fails verification, the engine must decide to either enter `REPAIRING` or block the entire downstream track.

## 3. Execution Orchestration (The Dispatcher)

The Dispatcher is the central loop responsible for task movement.

### 3.1 Resource Allocation
The engine maintains a virtual pool of execution workers. When a task reaches the `READY` state, the Dispatcher:
1.  Allocates a worker slot.
2.  Prepares the **Execution Context** (Project source + Dependency artifacts).
3.  Injects the **Protocol Invariants** (Rules and constraints).

### 3.2 Context Isolation
Execution must occur in a strictly isolated "Sandbox."
- **Ephemeral Nature**: Every task starts with a clean snapshot of the system state defined by its dependencies.
- **Side-Effect Control**: No task can modify files or data structures outside its declared `out` scope without triggering a protocol violation.

## 4. The Event-Driven Intelligence Bus

The engine communicates its internal state changes through a real-time, message-based protocol.

### 4.1 Message Schema
Every event must include:
- `subject`: The task or system component affected.
- `action`: The specific change (e.g., `TRANSITION_TO_EXECUTING`).
- `payload`: Contextual data (partial diffs, log snippets, error codes).
- `correlation_id`: For tracing the lineage of a task back to the original user prompt.

### 4.2 Stream Processing
The engine provides a high-frequency stream for the dashboard and low-frequency persistence for audit logs.

## 5. Artifact & Intelligence Persistence

Persistence is divided into two distinct layers:

### 5.1 The Historical Digest (The "What")
A chronological record of all file changes, terminal outputs, and verification reports. This serves as the primary auditing trail.

### 5.2 The Cognitive Index (The "Why")
An abstract summary of architectural decisions made during the execution. This index is used to update the global system patterns (Reflective Learning).

## 6. Self-Correction & Recovery Loops

The engine implements "Looping Gates" to handle failures:
- **Phase 1: Local Repair**: If a build fails, the engine re-reads the error logs and re-executes the task with "Repair" focus.
- **Phase 2: Architectural Escalation**: If Local Repair fails 3 times, the task is marked `BLOCKED`, and the engine requests a redesign of the task graph from the Planner.
