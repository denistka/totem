# 🎬 Sprint 3 — E2E Test Scenarios

> **Scope:** Complete user journeys validating Sprint 3 features
> **Focus:** Integration flows, Production readiness, Full TOTEM cycle

---

## Critical User Journeys

### S3-E2E-1: Artist Creation to Monetization

```typescript
test.describe('Artist Full Journey', () => {
  test('create → publish → earn', async ({ page }) => {
    // 1. Artist registration
    await test.step('Register as artist', async () => {
      await page.goto('/register')
      await page.fill('[data-testid="email"]', 'artist@test.com')
      await page.fill('[data-testid="password"]', 'SecurePass123!')
      await page.click('[data-testid="role-artist"]')
      await page.click('[data-testid="submit"]')
      
      await expect(page).toHaveURL('/dashboard')
    })

    // 2. Connect wallet
    await test.step('Connect wallet', async () => {
      await setupMetaMask(page, '0xArtist123')
      await page.click('[data-testid="connect-wallet"]')
      await expect(page.locator('[data-testid="wallet-connected"]')).toBeVisible()
    })

    // 3. Create track in DAW
    await test.step('Create track in DAW', async () => {
      await page.click('[data-testid="create-track"]')
      await expect(page).toHaveURL('/daw')
      
      // Import audio
      await page.locator('[data-testid="audio-upload"]')
        .setInputFiles('fixtures/test-track.wav')
      
      await expect(page.locator('[data-testid="waveform"]')).toBeVisible()
      
      // Add plugin
      await page.click('[data-testid="add-plugin"]')
      await page.click('[data-testid="plugin-compressor"]')
      await page.fill('[data-testid="threshold"]', '-12')
      
      // Check metering
      await page.click('[data-testid="play-button"]')
      await expect(page.locator('[data-testid="peak-meter"]')).toBeVisible()
      
      // Bounce with effects
      await page.click('[data-testid="bounce-track"]')
      await expect(page.locator('[data-testid="bounce-complete"]')).toBeVisible()
    })

    // 4. Export track
    await test.step('Export as WAV and MP3', async () => {
      await page.click('[data-testid="export-button"]')
      
      // WAV export
      await page.selectOption('[data-testid="format"]', 'wav')
      await page.click('[data-testid="export-start"]')
      await expect(page.locator('[data-testid="export-complete"]')).toBeVisible()
      
      // MP3 export
      await page.selectOption('[data-testid="format"]', 'mp3')
      await page.click('[data-testid="export-start"]')
      await expect(page.locator('[data-testid="export-complete"]')).toBeVisible()
    })

    // 5. Publish track
    await test.step('Publish and mint NFT', async () => {
      await page.click('[data-testid="publish-button"]')
      
      await page.fill('[data-testid="track-title"]', 'My First Track')
      await page.fill('[data-testid="description"]', 'Created in DAWW3')
      await page.selectOption('[data-testid="genre"]', 'electronic')
      await page.fill('[data-testid="price"]', '0.01')
      
      // Upload cover
      await page.locator('[data-testid="cover-upload"]')
        .setInputFiles('fixtures/cover.jpg')
      
      await page.click('[data-testid="confirm-publish"]')
      
      // Confirm blockchain transaction
      await expect(page.locator('[data-testid="tx-modal"]')).toBeVisible()
      await page.click('[data-testid="confirm-tx"]')
      
      await expect(page.locator('[data-testid="publish-success"]')).toBeVisible({ timeout: 60000 })
    })

    // 6. Verify track is live
    await test.step('Track discoverable', async () => {
      await page.goto('/explore')
      await page.fill('[data-testid="search"]', 'My First Track')
      await page.press('[data-testid="search"]', 'Enter')
      
      await expect(page.locator('[data-testid="track-card"]').first())
        .toContainText('My First Track')
    })

    // 7. Simulate plays and check earnings
    await test.step('Receive royalties', async () => {
      // API call to simulate plays with payments
      await page.request.post('/api/v1/dev/simulate/royalties', {
        data: { trackId: 'track-id', amount: '0.5' }
      })
      
      await page.goto('/dashboard/earnings')
      
      await expect(page.locator('[data-testid="pending-royalties"]'))
        .not.toContainText('0 ETH')
      
      // Claim royalties
      await page.click('[data-testid="claim-royalties"]')
      await page.click('[data-testid="confirm-claim"]')
      
      await expect(page.locator('[data-testid="claim-success"]')).toBeVisible()
    })
  })
})
```

---

### S3-E2E-2: Collaboration Session

```typescript
test.describe('Real-time Collaboration', () => {
  test('multi-user editing session', async ({ browser }) => {
    // Setup two users
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // 1. User 1 creates project
    await test.step('User 1 creates project', async () => {
      await loginAs(page1, 'user1@test.com')
      await page1.goto('/daw')
      await page1.click('[data-testid="new-project"]')
      await page1.fill('[data-testid="project-name"]', 'Collab Project')
      await page1.click('[data-testid="create"]')
    })

    // 2. User 1 shares project
    await test.step('User 1 shares project', async () => {
      await page1.click('[data-testid="share-button"]')
      await page1.fill('[data-testid="invite-email"]', 'user2@test.com')
      await page1.click('[data-testid="send-invite"]')
      
      await expect(page1.locator('[data-testid="invite-sent"]')).toBeVisible()
    })

    // 3. User 2 joins project
    await test.step('User 2 joins project', async () => {
      await loginAs(page2, 'user2@test.com')
      await page2.goto('/invites')
      await page2.click('[data-testid="accept-invite"]')
      
      await expect(page2).toHaveURL(/\/daw\//)
    })

    // 4. Real-time sync test
    await test.step('Changes sync in real-time', async () => {
      // User 1 adds track
      await page1.click('[data-testid="add-track"]')
      
      // User 2 sees track appear
      await expect(page2.locator('[data-testid="track"]')).toHaveCount(1)
      
      // User 2 renames track
      await page2.dblclick('[data-testid="track-name"]')
      await page2.fill('[data-testid="track-name-input"]', 'Bass Track')
      await page2.press('[data-testid="track-name-input"]', 'Enter')
      
      // User 1 sees rename
      await expect(page1.locator('[data-testid="track-name"]'))
        .toContainText('Bass Track')
    })

    // 5. Cursor visibility
    await test.step('See collaborator cursor', async () => {
      // User 2 moves cursor
      await page2.mouse.move(500, 300)
      
      // User 1 sees User 2's cursor
      await expect(page1.locator('[data-testid="remote-cursor-user2"]'))
        .toBeVisible()
    })

    // 6. Concurrent editing
    await test.step('Concurrent edits merge', async () => {
      // Both users edit different things simultaneously
      const edit1 = page1.locator('[data-testid="track-volume"]').fill('0.8')
      const edit2 = page2.locator('[data-testid="track-pan"]').fill('-0.5')
      
      await Promise.all([edit1, edit2])
      
      // Both changes should be visible to both users
      await expect(page1.locator('[data-testid="track-volume"]')).toHaveValue('0.8')
      await expect(page1.locator('[data-testid="track-pan"]')).toHaveValue('-0.5')
      await expect(page2.locator('[data-testid="track-volume"]')).toHaveValue('0.8')
      await expect(page2.locator('[data-testid="track-pan"]')).toHaveValue('-0.5')
    })

    // 7. Version save
    await test.step('Save version', async () => {
      await page1.click('[data-testid="save-version"]')
      await page1.fill('[data-testid="version-message"]', 'Initial collab version')
      await page1.click('[data-testid="confirm-save"]')
      
      await expect(page1.locator('[data-testid="version-saved"]')).toBeVisible()
    })

    await context1.close()
    await context2.close()
  })
})
```

---

### S3-E2E-3: License Purchase Flow

```typescript
test.describe('License Purchase', () => {
  test('browse → purchase → download', async ({ page }) => {
    // 1. Browse catalog
    await test.step('Browse and find track', async () => {
      await page.goto('/explore')
      await page.click('[data-testid="filter-genre"]')
      await page.click('[data-testid="genre-electronic"]')
      await page.click('[data-testid="track-card"]').first()
    })

    // 2. View licenses
    await test.step('View available licenses', async () => {
      await page.click('[data-testid="licenses-tab"]')
      
      await expect(page.locator('[data-testid="license-personal"]')).toBeVisible()
      await expect(page.locator('[data-testid="license-commercial"]')).toBeVisible()
    })

    // 3. Connect wallet
    await test.step('Connect wallet for purchase', async () => {
      await setupMetaMask(page, '0xBuyer123', { balance: '1' })
      await page.click('[data-testid="connect-wallet"]')
    })

    // 4. Purchase license
    await test.step('Complete purchase', async () => {
      await page.click('[data-testid="license-commercial"]')
      await page.click('[data-testid="purchase-button"]')
      
      // Accept terms
      await page.click('[data-testid="accept-terms"]')
      await page.click('[data-testid="confirm-purchase"]')
      
      // Confirm transaction
      await expect(page.locator('[data-testid="tx-modal"]')).toBeVisible()
      await page.click('[data-testid="confirm-tx"]')
      
      // Wait for confirmation
      await expect(page.locator('[data-testid="purchase-success"]'))
        .toBeVisible({ timeout: 60000 })
    })

    // 5. Access licensed content
    await test.step('Access purchased license', async () => {
      await page.goto('/profile/licenses')
      
      await expect(page.locator('[data-testid="license-card"]'))
        .toContainText('Commercial')
      
      // Download stems
      await page.click('[data-testid="download-stems"]')
      
      // Verify download started
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('[data-testid="confirm-download"]')
      ])
      
      expect(download.suggestedFilename()).toContain('.zip')
    })
  })
})
```

---

### S3-E2E-4: Offline Mode Journey

```typescript
test.describe('Offline Mode', () => {
  test('cache → disconnect → play → reconnect', async ({ page, context }) => {
    // 1. Login and browse
    await test.step('Browse tracks online', async () => {
      await loginAs(page, 'user@test.com')
      await page.goto('/explore')
    })

    // 2. Play track to cache
    await test.step('Play track to cache it', async () => {
      await page.click('[data-testid="track-card"]').first()
      await page.click('[data-testid="play-button"]')
      
      // Wait for full track to cache
      await page.waitForTimeout(60000) // 1 minute
      
      await page.click('[data-testid="stop-button"]')
    })

    // 3. Go offline
    await test.step('Go offline', async () => {
      await context.setOffline(true)
      
      await expect(page.locator('[data-testid="offline-indicator"]'))
        .toBeVisible()
    })

    // 4. Access offline library
    await test.step('Open offline library', async () => {
      await page.goto('/library/offline')
      
      await expect(page.locator('[data-testid="offline-track"]'))
        .toHaveCount(1)
    })

    // 5. Play offline
    await test.step('Play track offline', async () => {
      await page.click('[data-testid="offline-track"]')
      await page.click('[data-testid="play-button"]')
      
      await expect(page.locator('[data-testid="audio-playing"]'))
        .toBeVisible()
      
      // Listen for a while
      await page.waitForTimeout(30000)
    })

    // 6. Reconnect and sync
    await test.step('Reconnect and sync', async () => {
      await context.setOffline(false)
      
      await expect(page.locator('[data-testid="offline-indicator"]'))
        .not.toBeVisible()
      
      // Wait for sync
      await expect(page.locator('[data-testid="syncing"]'))
        .not.toBeVisible({ timeout: 30000 })
    })

    // 7. Verify play recorded
    await test.step('Verify play was synced', async () => {
      await page.goto('/library/history')
      
      await expect(page.locator('[data-testid="history-item"]').first())
        .toBeVisible()
    })
  })
})
```

---

### S3-E2E-5: Production Load Scenario

```typescript
test.describe('Production Load', () => {
  test.skip('10K concurrent WebSocket connections', async ({ browser }) => {
    const contexts: BrowserContext[] = []
    const pages: Page[] = []
    
    // Create 100 virtual users (10K simulated via connections)
    for (let i = 0; i < 100; i++) {
      const context = await browser.newContext()
      const page = await context.newPage()
      contexts.push(context)
      pages.push(page)
    }

    await test.step('All users connect', async () => {
      await Promise.all(pages.map(async (page, i) => {
        await loginAs(page, `user${i}@test.com`)
        await page.goto('/explore')
        
        // Each page opens 100 WebSocket connections
        await page.evaluate(async () => {
          const sockets = []
          for (let j = 0; j < 100; j++) {
            const socket = io('/', { transports: ['websocket'] })
            sockets.push(socket)
          }
          window.__testSockets = sockets
        })
      }))
    })

    await test.step('All users active for 5 minutes', async () => {
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000))
    })

    await test.step('Verify no errors', async () => {
      for (const page of pages) {
        const errors = await page.evaluate(() => window.__consoleErrors || [])
        expect(errors.filter(e => e.includes('WebSocket'))).toHaveLength(0)
      }
    })

    // Cleanup
    for (const context of contexts) {
      await context.close()
    }
  }, 10 * 60 * 1000) // 10 minute timeout
})
```

---

## TOTEM Vision Validation

```typescript
test.describe('TOTEM Vision', () => {
  test('creation → distribution → monetization', async ({ page }) => {
    // Full cycle test
    await test.step('Artist creates track', async () => {
      await completeArtistCreation(page)
    })

    await test.step('Track distributed via P2P', async () => {
      await verifyP2PDistribution(page)
    })

    await test.step('Artist receives payment', async () => {
      await verifyRoyaltyPayment(page)
    })

    await test.step('Payment > Spotify rate', async () => {
      const payout = await getArtistPayout(page)
      const spotifyRate = 0.003 // $0.003 per stream
      
      expect(payout).toBeGreaterThan(spotifyRate * 100) // 100x Spotify
    })
  })
})
```

---

## CI/CD Integration

```yaml
# .github/workflows/sprint3-e2e.yml
name: Sprint 3 E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
      redis:
        image: redis:7
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Start services
        run: docker-compose up -d
      
      - name: Run E2E tests
        run: pnpm test:e2e:sprint3
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

*Sprint 3 E2E Scenarios — DAWW3 QA*
