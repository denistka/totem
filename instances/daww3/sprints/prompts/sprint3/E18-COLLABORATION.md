# E18: Collaboration & Real-time — Agent Prompts

> **Goal:** Multi-user project editing, live collaboration
> **Sprint:** 3
> **Owner:** Backend / Frontend
> **Source:** E5, E6 "Problems/Not Implemented"

---

## E18-T1: Project Collaboration Backend

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class collaborative systems architect'
    target = implement multi-user project access and permissions
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = handle 50 concurrent editors
    tech stack = ['NestJS', 'Prisma', 'WebSocket', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement project collaboration backend for DAWW3.
Multi-user access with roles and permissions.

{{{{ #CUSTOMER PROMT

Project collaboration features отсутствуют. Нужно:
- Invite collaborators to project
- Role-based access (owner, editor, viewer)
- Collaboration invitations (email/link)
- User presence tracking
- Activity log

}}}}

<<<<<<#RECOMMENDED TASKS

COLLAB-1. Collaboration Data Model
- ProjectCollaborator entity
- Role enum (owner, admin, editor, viewer)
- Invitation entity with token
- Invitation status (pending, accepted, rejected)
- Expires at for invitations

COLLAB-2. Invitation System
- Generate invitation link
- Email invitation (via notification job)
- Accept/reject endpoints
- Token validation
- Rate limiting invites

COLLAB-3. Permission System
- Permission checking middleware
- Role hierarchy
- Per-resource permissions
- Permission inheritance
- Audit logging

COLLAB-4. Presence Tracking
- WebSocket presence events
- Active users list per project
- Cursor position (optional)
- Last activity timestamp
- Graceful disconnect handling

COLLAB-5. Activity Log
- Log all project changes
- User attribution
- Timestamp
- Change description
- Activity feed API

COLLAB-6. API Endpoints
- POST /projects/:id/collaborators
- DELETE /projects/:id/collaborators/:userId
- PATCH /projects/:id/collaborators/:userId (change role)
- GET /projects/:id/collaborators
- POST /invitations/:token/accept

🏁 Definition of Done
- Users can invite collaborators
- Roles control access
- Presence shows active users
- Activity logged
- Permissions enforced

>>>>>>

]]]]
```

---

## E18-T2: Real-time Sync (CRDT/OT)

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class distributed systems engineer specializing in collaborative editing'
    target = implement conflict-free real-time synchronization
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = < 100ms sync latency
    tech stack = ['Yjs', 'y-websocket', 'NestJS', 'Vue 3']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement real-time synchronization for collaborative editing.
Use CRDT (Yjs) for conflict-free multi-user editing.

{{{{ #CUSTOMER PROMT

Real-time collaboration via WebRTC data channels не реализован. Нужно:
- CRDT для conflict-free editing
- Sync project state между users
- Offline support с reconnect
- Cursor awareness
- Minimal bandwidth

}}}}

<<<<<<#RECOMMENDED TASKS

CRDT-1. Yjs Document Structure
- Y.Doc for project state
- Y.Map for tracks
- Y.Array for track order
- Y.Map for mixer settings
- Y.Array for automation points

CRDT-2. y-websocket Server
- NestJS integration
- Authentication middleware
- Room management (project-based)
- Persistence adapter
- Redis for scaling

CRDT-3. Client Sync Provider
- Connect to y-websocket
- Handle connection states
- Offline queue
- Reconnection logic
- Sync status indicator

CRDT-4. Awareness Protocol
- User cursor position
- Selected track/region
- User color assignment
- Typing indicator
- Presence display

CRDT-5. State Binding
- Bind Yjs to Vue reactive state
- Two-way sync
- Efficient updates
- Batch changes
- Debouncing

CRDT-6. Persistence
- Save Y.Doc to database
- Load on project open
- Incremental saves
- Version history (snapshots)
- Conflict resolution on load

🏁 Definition of Done
- Multiple users edit simultaneously
- No conflicts or data loss
- < 100ms sync latency
- Works offline, syncs on reconnect
- Cursors visible to all users

>>>>>>

]]]]
```

---

## E18-T3: Track Version Comparison

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class version control UX engineer'
    target = implement track version comparison and diff
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast diff calculation
    tech stack = ['Vue 3', 'TypeScript', 'diff algorithms']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement track version comparison for DAWW3.
Show differences between track versions with visual diff.

{{{{ #CUSTOMER PROMT

Track version comparison and merge tools отсутствуют. Нужно:
- Compare two versions of track
- Visual diff display
- Audio diff (A/B playback)
- Revert to version
- Merge changes

}}}}

<<<<<<#RECOMMENDED TASKS

VERSION-1. Version Snapshot System
- Create version on significant change
- Manual version save
- Auto-save versions (time-based)
- Version metadata (name, note)
- Version limit per track

VERSION-2. Diff Calculation
- Track property diff
- Automation curve diff
- Plugin chain diff
- Region/clip diff
- JSON diff algorithm

VERSION-3. Visual Diff UI
- Side-by-side comparison
- Inline diff view
- Color-coded changes
- Change navigation
- Change details

VERSION-4. Audio A/B Comparison
- Play version A
- Play version B
- Quick toggle (A/B button)
- Volume match
- Sync playback position

VERSION-5. Version Operations
- Revert track to version
- Restore single property
- Create branch from version
- Delete old versions
- Export version

VERSION-6. Version History UI
- Version list panel
- Timeline view
- User attribution
- Preview thumbnail/waveform
- Quick actions menu

🏁 Definition of Done
- Versions automatically saved
- Diff shows all changes
- A/B playback works
- Can revert to any version
- UI is intuitive

>>>>>>

]]]]
```

---

## E18-T4: Multi-track P2P Streaming

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class P2P streaming engineer'
    target = implement synchronized multi-track P2P streaming
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = synchronized playback across tracks
    tech stack = ['WebRTC', 'Web Audio API', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement multi-track P2P streaming for DAWW3.
Stream multiple tracks simultaneously with synchronization.

{{{{ #CUSTOMER PROMT

Multi-track P2P streaming не реализован. Нужно:
- Stream multiple tracks in sync
- Efficient chunk scheduling
- Bandwidth allocation per track
- Priority-based loading (audible first)
- Seamless track addition

}}}}

<<<<<<#RECOMMENDED TASKS

MULTI-P2P-1. Multi-track Session
- Session management for project
- Track manifest
- Chunk mapping per track
- Sync point coordination
- Session state machine

MULTI-P2P-2. Synchronized Chunk Fetching
- Fetch chunks across tracks in sync
- Position-based prioritization
- Parallel downloads
- Timeout coordination
- Gap handling

MULTI-P2P-3. Bandwidth Allocation
- Total bandwidth estimation
- Per-track allocation
- Priority weighting (solo > mute)
- Dynamic reallocation
- Quality reduction under pressure

MULTI-P2P-4. Buffer Management
- Per-track ring buffers
- Synchronized buffer levels
- Minimum buffer threshold
- Buffer health monitoring
- Underrun prevention

MULTI-P2P-5. Track Addition/Removal
- Hot add track to stream
- Remove without stopping playback
- Chunk renegotiation
- State consistency
- User notification

MULTI-P2P-6. Playback Coordination
- Synchronized play/pause
- Seek across all tracks
- Master clock
- Individual track offset
- Sync verification

🏁 Definition of Done
- Multiple tracks stream together
- Tracks stay synchronized
- Bandwidth adapts to conditions
- Add/remove tracks seamlessly
- No sync drift over time

>>>>>>

]]]]
```

---

## E18-T5: Live Collaboration UI

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class collaborative UX designer'
    target = implement live collaboration UI components
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = real-time updates, low latency
    tech stack = ['Vue 3', 'TypeScript', 'CSS animations']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement live collaboration UI for DAWW3.
Show collaborator presence, cursors, and activity.

{{{{ #CUSTOMER PROMT

Нужен UI для live collaboration:
- Collaborator avatars
- Remote cursors
- Selection highlights
- Activity indicators
- Chat/comments (optional)

}}}}

<<<<<<#RECOMMENDED TASKS

LIVE-UI-1. Collaborator Presence Panel
- Avatar list of active users
- Online status indicator
- Role badge
- View mode (editing/viewing)
- Click to follow user

LIVE-UI-2. Remote Cursors
- Show other users' cursors
- User color coding
- Name label on cursor
- Smooth movement interpolation
- Cursor timeout (idle)

LIVE-UI-3. Selection Highlights
- Show other users' selections
- Selection color per user
- Multiple selections support
- Selection type indicator
- Conflict indication

LIVE-UI-4. Activity Indicators
- "User is editing track X"
- "User is adjusting mixer"
- Typing indicator
- Recording indicator
- Change pulse animation

LIVE-UI-5. Follow Mode
- Follow user's view
- Auto-scroll to their position
- See what they see
- Unfollow on interaction
- Follow indicator

LIVE-UI-6. In-project Chat (Optional)
- Chat sidebar
- Per-project messages
- @mentions
- Timestamp grouping
- Emoji reactions

🏁 Definition of Done
- See who's in project
- See other users' cursors
- Understand what others are doing
- Can follow collaborator's view
- Real-time updates smooth

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E16 (Full Integration) + E5 (Backend) ✅
    │
    ├─────────────────────┐
    ▼                     ▼
E18-T1 (Collab Backend)  E18-T4 (Multi-track P2P)
    │
    ▼
E18-T2 (CRDT Sync)
    │
    ├─────────────────────┐
    ▼                     ▼
E18-T3 (Version Compare) E18-T5 (Live UI)
    │
    ▼
[Collaboration Complete]
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CRDT complexity | High | Use proven Yjs library |
| Sync conflicts | High | CRDT by design handles this |
| Multi-track bandwidth | Medium | Adaptive quality, priority |
| Cursor latency | Low | Interpolation, prediction |

---

## TOTEM Alignment

This epic directly supports TOTEM Vision:
- **Artist collaboration** — Multiple artists on same project
- **Community engagement** — Real-time interaction
- **P2P benefits** — Shared streaming reduces bandwidth
