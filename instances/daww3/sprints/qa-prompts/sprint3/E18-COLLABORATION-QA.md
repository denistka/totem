# 👥 E18: Collaboration — QA Test Specifications

> **Epic:** E18 - Collaboration & Real-time
> **Priority:** 🟠 HIGH
> **Focus:** Real-time sync, CRDT, Versioning, Multi-user

---

## QA Agent Prompt

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive collaboration tests
    expertize = 'you are world class distributed systems QA engineer'
    target = validate real-time collaboration and data sync
    test = true

    code style = [Chaos testing, Concurrency testing]
    write docs = true
    deep thinking = true
    performance = < 100ms sync latency
    tech stack = ['Vitest', 'Playwright', 'Yjs/Automerge', 'Socket.io']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for E18 Collaboration features.
Validate real-time sync, CRDT conflict resolution, multi-user editing.

{{{{ #CUSTOMER PROMT

Нужны QA тесты для collaboration:
- E18-T1: Project collaboration backend
- E18-T2: Real-time sync (CRDT/OT)
- E18-T3: Track version comparison
- E18-T4: Multi-track P2P streaming
- E18-T5: Live collaboration UI

}}}}

<<<<<<#RECOMMENDED TASKS

E18-QA-1. Backend Collaboration Tests
E18-QA-2. CRDT Sync Tests
E18-QA-3. Version Comparison Tests
E18-QA-4. Multi-track Streaming Tests
E18-QA-5. Live UI Tests

>>>>>>

]]]]
```

---

## E18-QA-1: Backend Collaboration Tests

```typescript
describe('Project Collaboration Backend', () => {
  describe('Project Sharing', () => {
    it('creates shared project', async () => {
      const project = await createProject({ title: 'Collab Test' })
      
      const shareResult = await projectService.share(project.id, {
        users: ['user-2', 'user-3'],
        permissions: 'edit'
      })
      
      expect(shareResult.collaborators.length).toBe(2)
    })

    it('generates invite link', async () => {
      const project = await createProject({ title: 'Collab Test' })
      
      const link = await projectService.createInviteLink(project.id, {
        expiresIn: 24 * 60 * 60 * 1000, // 24 hours
        maxUses: 5
      })
      
      expect(link).toMatch(/\/invite\/[a-zA-Z0-9]+/)
    })

    it('enforces permissions', async () => {
      const project = await createProject({ ownerId: 'user-1' })
      await projectService.share(project.id, {
        users: ['user-2'],
        permissions: 'view'
      })
      
      await expect(
        projectService.updateTrack(project.id, 'track-1', { name: 'New' }, 'user-2')
      ).rejects.toThrow('Permission denied')
    })
  })

  describe('Presence Tracking', () => {
    it('tracks active collaborators', async () => {
      const project = await createSharedProject()
      
      await presenceService.join(project.id, 'user-1')
      await presenceService.join(project.id, 'user-2')
      
      const presence = await presenceService.getPresence(project.id)
      
      expect(presence.users.length).toBe(2)
    })

    it('tracks cursor positions', async () => {
      const project = await createSharedProject()
      await presenceService.join(project.id, 'user-1')
      
      await presenceService.updateCursor(project.id, 'user-1', {
        trackId: 'track-1',
        position: 5000
      })
      
      const presence = await presenceService.getPresence(project.id)
      expect(presence.users[0].cursor.trackId).toBe('track-1')
    })

    it('removes user on disconnect', async () => {
      const project = await createSharedProject()
      await presenceService.join(project.id, 'user-1')
      
      await presenceService.leave(project.id, 'user-1')
      
      const presence = await presenceService.getPresence(project.id)
      expect(presence.users.length).toBe(0)
    })
  })
})
```

---

## E18-QA-2: CRDT Sync Tests

```typescript
describe('Real-time CRDT Sync', () => {
  describe('Basic Sync', () => {
    it('syncs changes between clients', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      client1.doc.track1.name = 'New Name'
      
      await waitForSync()
      
      expect(client2.doc.track1.name).toBe('New Name')
    })

    it('syncs within 100ms', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      const start = performance.now()
      client1.doc.track1.name = 'Fast Change'
      
      await new Promise<void>(resolve => {
        client2.on('sync', () => {
          if (client2.doc.track1.name === 'Fast Change') {
            resolve()
          }
        })
      })
      
      const elapsed = performance.now() - start
      expect(elapsed).toBeLessThan(100)
    })
  })

  describe('Conflict Resolution', () => {
    it('resolves concurrent edits (LWW)', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      // Disconnect temporarily
      await disconnect(client1, client2)
      
      // Both edit same field
      client1.doc.track1.name = 'Name A'
      client2.doc.track1.name = 'Name B'
      
      // Reconnect
      await reconnect(client1, client2)
      await waitForSync()
      
      // Both should converge to same value
      expect(client1.doc.track1.name).toBe(client2.doc.track1.name)
    })

    it('merges non-conflicting edits', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      await disconnect(client1, client2)
      
      // Edit different fields
      client1.doc.track1.volume = 0.5
      client2.doc.track1.pan = -0.5
      
      await reconnect(client1, client2)
      await waitForSync()
      
      // Both changes preserved
      expect(client1.doc.track1.volume).toBe(0.5)
      expect(client1.doc.track1.pan).toBe(-0.5)
      expect(client2.doc.track1.volume).toBe(0.5)
      expect(client2.doc.track1.pan).toBe(-0.5)
    })

    it('handles offline edits', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      // Client 2 goes offline
      await disconnect(client2)
      
      // Both make edits
      client1.doc.addTrack({ id: 'track-2', name: 'From Client 1' })
      client2.doc.addTrack({ id: 'track-3', name: 'From Client 2' })
      
      // Client 2 comes back online
      await reconnect(client2)
      await waitForSync()
      
      // Both tracks should exist
      expect(client1.doc.tracks).toContainEqual(expect.objectContaining({ id: 'track-2' }))
      expect(client1.doc.tracks).toContainEqual(expect.objectContaining({ id: 'track-3' }))
    })
  })

  describe('Complex Operations', () => {
    it('syncs track reordering', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      client1.doc.reorderTrack('track-2', 0)
      
      await waitForSync()
      
      expect(client2.doc.tracks[0].id).toBe('track-2')
    })

    it('syncs automation points', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      client1.doc.track1.automation.volume.addPoint(1000, 0.5)
      
      await waitForSync()
      
      expect(client2.doc.track1.automation.volume.points).toContainEqual({
        time: 1000,
        value: 0.5
      })
    })

    it('syncs plugin changes', async () => {
      const [client1, client2] = await createSyncClients(2)
      
      client1.doc.track1.plugins[0].params.gain = 0.75
      
      await waitForSync()
      
      expect(client2.doc.track1.plugins[0].params.gain).toBe(0.75)
    })
  })

  describe('Stress Tests', () => {
    it('handles rapid concurrent edits', async () => {
      const clients = await createSyncClients(5)
      
      // All clients make rapid edits
      const editPromises = clients.map(async (client, i) => {
        for (let j = 0; j < 100; j++) {
          client.doc.tracks[0].name = `Client ${i} Edit ${j}`
          await waitMs(10)
        }
      })
      
      await Promise.all(editPromises)
      await waitForSync()
      
      // All clients should converge
      const finalNames = clients.map(c => c.doc.tracks[0].name)
      expect(new Set(finalNames).size).toBe(1)
    })

    it('recovers from network partition', async () => {
      const [client1, client2, client3] = await createSyncClients(3)
      
      // Partition: client3 can only talk to client2
      await partition([client1], [client2, client3])
      
      client1.doc.track1.name = 'From Client 1'
      client3.doc.track1.name = 'From Client 3'
      
      await waitForSync() // Partial sync
      
      // Heal partition
      await healPartition()
      await waitForSync()
      
      // All should converge
      expect(client1.doc.track1.name).toBe(client2.doc.track1.name)
      expect(client2.doc.track1.name).toBe(client3.doc.track1.name)
    })
  })
})
```

---

## E18-QA-3: Version Comparison Tests

```typescript
describe('Track Version Comparison', () => {
  describe('Version History', () => {
    it('creates version snapshot', async () => {
      const project = await createProject()
      
      await project.saveVersion({ message: 'Initial version' })
      
      expect(project.versions.length).toBe(1)
    })

    it('lists version history', async () => {
      const project = await createProject()
      
      await project.saveVersion({ message: 'Version 1' })
      await project.tracks[0].setName('Updated')
      await project.saveVersion({ message: 'Version 2' })
      
      const history = await project.getVersionHistory()
      
      expect(history.length).toBe(2)
      expect(history[0].message).toBe('Version 2')
      expect(history[1].message).toBe('Version 1')
    })
  })

  describe('Diff Generation', () => {
    it('compares track changes', async () => {
      const project = await createProject()
      const v1 = await project.saveVersion({ message: 'V1' })
      
      project.tracks[0].volume = 0.5
      project.tracks[0].name = 'New Name'
      
      const v2 = await project.saveVersion({ message: 'V2' })
      
      const diff = await project.compareVersions(v1.id, v2.id)
      
      expect(diff.changes).toContainEqual({
        track: 'track-1',
        field: 'volume',
        from: 1.0,
        to: 0.5
      })
    })

    it('shows added/removed tracks', async () => {
      const project = await createProject()
      const v1 = await project.saveVersion({ message: 'V1' })
      
      await project.addTrack({ name: 'New Track' })
      
      const v2 = await project.saveVersion({ message: 'V2' })
      
      const diff = await project.compareVersions(v1.id, v2.id)
      
      expect(diff.added).toHaveLength(1)
      expect(diff.added[0].name).toBe('New Track')
    })
  })

  describe('Restore', () => {
    it('restores to previous version', async () => {
      const project = await createProject()
      const originalName = project.tracks[0].name
      
      const v1 = await project.saveVersion({ message: 'V1' })
      
      project.tracks[0].name = 'Changed'
      
      await project.restoreVersion(v1.id)
      
      expect(project.tracks[0].name).toBe(originalName)
    })
  })
})
```

---

## E18-QA-5: Live Collaboration UI Tests

```typescript
describe('Live Collaboration UI', () => {
  describe('Presence Indicators', () => {
    it('shows collaborator avatars', async () => {
      const { page } = await setupCollaborationPage()
      
      // Another user joins
      await simulateUserJoin('user-2')
      
      const avatar = page.locator('[data-testid="collaborator-avatar"]')
      await expect(avatar).toBeVisible()
    })

    it('shows cursor position', async () => {
      const { page } = await setupCollaborationPage()
      await simulateUserJoin('user-2')
      
      // User 2 moves cursor
      await simulateCursorMove('user-2', { trackId: 'track-1', position: 5000 })
      
      const cursor = page.locator('[data-testid="remote-cursor-user-2"]')
      await expect(cursor).toBeVisible()
    })

    it('shows selection', async () => {
      const { page } = await setupCollaborationPage()
      await simulateUserJoin('user-2')
      
      await simulateSelection('user-2', { trackId: 'track-1', start: 0, end: 2000 })
      
      const selection = page.locator('[data-testid="remote-selection-user-2"]')
      await expect(selection).toBeVisible()
    })
  })

  describe('Real-time Updates', () => {
    it('parameter change updates immediately', async () => {
      const { page: page1 } = await setupCollaborationPage({ user: 'user-1' })
      const { page: page2 } = await setupCollaborationPage({ user: 'user-2' })
      
      // User 1 changes volume
      await page1.locator('[data-testid="track-1-volume"]').fill('0.5')
      
      // User 2 sees change
      await expect(page2.locator('[data-testid="track-1-volume"]'))
        .toHaveValue('0.5')
    })

    it('shows "editing" indicator', async () => {
      const { page: page1 } = await setupCollaborationPage({ user: 'user-1' })
      const { page: page2 } = await setupCollaborationPage({ user: 'user-2' })
      
      // User 1 starts editing track name
      await page1.locator('[data-testid="track-1-name"]').click()
      
      // User 2 sees indicator
      await expect(page2.locator('[data-testid="track-1-editing-indicator"]'))
        .toBeVisible()
    })
  })

  describe('Conflict Handling', () => {
    it('shows conflict notification', async () => {
      const { page: page1 } = await setupCollaborationPage({ user: 'user-1' })
      const { page: page2 } = await setupCollaborationPage({ user: 'user-2' })
      
      // Both edit same field simultaneously
      await page1.locator('[data-testid="track-1-name"]').fill('Name A')
      await page2.locator('[data-testid="track-1-name"]').fill('Name B')
      
      // Conflict notification appears
      await expect(page1.locator('[data-testid="conflict-notification"]')
        .or(page2.locator('[data-testid="conflict-notification"]')))
        .toBeVisible()
    })
  })
})
```

---

## Manual Test Checklist

### E18-T1: Collaboration Backend
- [ ] Share project with another user
- [ ] User receives invite notification
- [ ] Permissions enforced correctly
- [ ] Presence shows who's online

### E18-T2: Real-time Sync
- [ ] Edit in one browser, see in another
- [ ] Multiple concurrent edits resolve
- [ ] Offline edits sync on reconnect
- [ ] No data loss

### E18-T3: Versioning
- [ ] Create version snapshot
- [ ] View version history
- [ ] Compare two versions
- [ ] Restore to previous version

### E18-T5: Live UI
- [ ] See collaborator cursors
- [ ] See remote selections
- [ ] Parameters update in real-time
- [ ] Editing indicators show

---

*E18 Collaboration QA — DAWW3 Sprint 3*
