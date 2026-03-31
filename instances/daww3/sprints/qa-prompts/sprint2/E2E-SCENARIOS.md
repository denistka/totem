# 🎬 End-to-End Test Scenarios

> **Scope:** Complete user journeys through DAWW3 platform
> **Framework:** Playwright / Cypress
> **Coverage:** Critical business flows

---

## Agent Prompt for E2E Testing

```
[[[[ #SETTINGS

    mode = agent - implement end-to-end test scenarios
    expertize = 'you are world class E2E testing specialist'
    target = validate complete user journeys work correctly
    test = true

    code style = [Page Object Model, Reusable fixtures]
    write docs = true
    deep thinking = true
    performance = tests should complete in reasonable time
    tech stack = ['Playwright', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement E2E tests for DAWW3 covering:
- Artist journey: create, publish, earn
- Listener journey: discover, play, engage
- Web3 journey: connect, purchase, claim

{{{{ #CUSTOMER PROMT

Нужны E2E тесты для:
- Полный путь артиста: регистрация → создание трека → публикация → получение роялти
- Полный путь слушателя: поиск → прослушивание → лайк → сидинг → XP
- Web3 путь: подключение кошелька → покупка лицензии → клейм роялти
- Геймификация: XP накопление → level up → badge → multiplier
- Ошибочные сценарии: нет сети, отмена транзакции, невалидный файл

}}}}

<<<<<<#RECOMMENDED TASKS

E2E-1. Artist Creation Journey
E2E-2. Listener Streaming Journey
E2E-3. Web3 Purchase Journey
E2E-4. Gamification Journey
E2E-5. Error Handling Scenarios
E2E-6. Mobile User Journey

>>>>>>

]]]]
```

---

## E2E-1: Artist Creation Journey

```typescript
// e2e/artist-journey.spec.ts

import { test, expect, Page } from '@playwright/test'

test.describe('Artist Creation Journey', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()
  })

  test('complete artist journey: register → create → publish → earn', async () => {
    // Step 1: Register as artist
    await test.step('Register as artist', async () => {
      await page.goto('/register')
      await page.fill('[data-testid="email"]', 'artist@test.com')
      await page.fill('[data-testid="password"]', 'SecurePass123!')
      await page.fill('[data-testid="display-name"]', 'Test Artist')
      await page.click('[data-testid="role-artist"]')
      await page.click('[data-testid="submit"]')
      
      await expect(page).toHaveURL('/dashboard')
      await expect(page.locator('[data-testid="welcome"]')).toContainText('Test Artist')
    })

    // Step 2: Connect wallet
    await test.step('Connect wallet', async () => {
      await page.click('[data-testid="connect-wallet"]')
      
      // Mock MetaMask interaction
      await page.evaluate(() => {
        window.ethereum = {
          request: async ({ method }) => {
            if (method === 'eth_requestAccounts') return ['0x1234...']
            return null
          }
        }
      })
      
      await page.click('[data-testid="metamask-connect"]')
      await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible()
    })

    // Step 3: Create new track
    await test.step('Create track in DAW', async () => {
      await page.click('[data-testid="create-track"]')
      await expect(page).toHaveURL('/daw')
      
      // Upload audio file
      const fileInput = page.locator('[data-testid="audio-upload"]')
      await fileInput.setInputFiles('fixtures/test-audio.wav')
      
      await expect(page.locator('[data-testid="waveform"]')).toBeVisible()
      
      // Add plugin
      await page.click('[data-testid="add-plugin"]')
      await page.click('[data-testid="plugin-gain"]')
      
      // Adjust gain
      await page.locator('[data-testid="gain-slider"]').fill('0.8')
      
      // Play preview
      await page.click('[data-testid="play"]')
      await page.waitForTimeout(2000)
      await page.click('[data-testid="stop"]')
    })

    // Step 4: Publish track
    await test.step('Publish track', async () => {
      await page.click('[data-testid="publish"]')
      
      await page.fill('[data-testid="track-title"]', 'My First Track')
      await page.fill('[data-testid="track-description"]', 'A test track for E2E testing')
      await page.selectOption('[data-testid="genre"]', 'electronic')
      await page.fill('[data-testid="price"]', '0.01')
      
      // Upload cover art
      const coverInput = page.locator('[data-testid="cover-upload"]')
      await coverInput.setInputFiles('fixtures/cover-art.jpg')
      
      await page.click('[data-testid="confirm-publish"]')
      
      // Confirm blockchain transaction
      await expect(page.locator('[data-testid="transaction-modal"]')).toBeVisible()
      await page.click('[data-testid="confirm-transaction"]')
      
      await expect(page.locator('[data-testid="publish-success"]')).toBeVisible()
    })

    // Step 5: Verify track is live
    await test.step('Verify track is discoverable', async () => {
      await page.goto('/explore')
      await page.fill('[data-testid="search"]', 'My First Track')
      await page.press('[data-testid="search"]', 'Enter')
      
      await expect(page.locator('[data-testid="track-card"]').first()).toContainText('My First Track')
    })

    // Step 6: Simulate plays and check earnings
    await test.step('Check earnings after plays', async () => {
      // Simulate plays via API
      await page.request.post('/api/v1/dev/simulate/plays', {
        data: { trackId: 'track-id', count: 100 }
      })
      
      await page.goto('/dashboard/earnings')
      await expect(page.locator('[data-testid="total-earnings"]')).not.toHaveText('$0.00')
    })
  })
})
```

---

## E2E-2: Listener Streaming Journey

```typescript
// e2e/listener-journey.spec.ts

test.describe('Listener Streaming Journey', () => {
  test('complete listener journey: discover → play → engage → earn XP', async ({ page }) => {
    // Step 1: Browse catalog
    await test.step('Browse and discover tracks', async () => {
      await page.goto('/explore')
      
      // Filter by genre
      await page.click('[data-testid="filter-genre"]')
      await page.click('[data-testid="genre-electronic"]')
      
      // Sort by rating
      await page.selectOption('[data-testid="sort"]', 'rating-desc')
      
      await expect(page.locator('[data-testid="track-card"]')).toHaveCount(20)
    })

    // Step 2: Play track
    await test.step('Play track via P2P', async () => {
      await page.click('[data-testid="track-card"]:first-child')
      await expect(page).toHaveURL(/\/track\//)
      
      await page.click('[data-testid="play-button"]')
      
      // Wait for P2P connection
      await expect(page.locator('[data-testid="p2p-status"]')).toHaveText('Connected')
      
      // Wait for audio to start
      await expect(page.locator('[data-testid="audio-playing"]')).toBeVisible()
      
      // Check progress updates
      await page.waitForTimeout(5000)
      const progress = await page.locator('[data-testid="progress-bar"]').getAttribute('aria-valuenow')
      expect(parseFloat(progress!)).toBeGreaterThan(0)
    })

    // Step 3: Engage with track
    await test.step('Like and share track', async () => {
      await page.click('[data-testid="like-button"]')
      await expect(page.locator('[data-testid="like-button"]')).toHaveClass(/liked/)
      
      await page.click('[data-testid="share-button"]')
      await expect(page.locator('[data-testid="share-modal"]')).toBeVisible()
      await page.click('[data-testid="copy-link"]')
    })

    // Step 4: Complete listening for XP
    await test.step('Complete track for XP', async () => {
      // Fast forward (in test mode)
      await page.evaluate(() => {
        const audio = document.querySelector('audio')
        if (audio) audio.currentTime = audio.duration - 5
      })
      
      // Wait for completion
      await expect(page.locator('[data-testid="xp-notification"]')).toBeVisible()
      await expect(page.locator('[data-testid="xp-notification"]')).toContainText('+2 XP')
    })

    // Step 5: Check profile stats
    await test.step('Verify XP in profile', async () => {
      await page.click('[data-testid="profile-menu"]')
      await page.click('[data-testid="my-profile"]')
      
      await expect(page.locator('[data-testid="total-xp"]')).not.toHaveText('0')
    })
  })

  test('seeding earns additional XP', async ({ page }) => {
    await page.goto('/settings')
    
    // Enable seeding
    await page.click('[data-testid="enable-seeding"]')
    await expect(page.locator('[data-testid="seeding-status"]')).toHaveText('Active')
    
    // Play track to cache chunks
    await page.goto('/track/popular-track')
    await page.click('[data-testid="play-button"]')
    await page.waitForTimeout(30000) // Listen for 30 seconds
    
    // Check seeding stats
    await page.goto('/profile')
    await expect(page.locator('[data-testid="bytes-seeded"]')).not.toHaveText('0 B')
  })
})
```

---

## E2E-3: Web3 Purchase Journey

```typescript
// e2e/web3-journey.spec.ts

test.describe('Web3 Purchase Journey', () => {
  test('purchase license and claim royalties', async ({ page }) => {
    // Step 1: Connect wallet
    await test.step('Connect wallet', async () => {
      await page.goto('/')
      await page.click('[data-testid="connect-wallet"]')
      
      // Interact with MetaMask mock
      await page.click('[data-testid="metamask"]')
      await expect(page.locator('[data-testid="wallet-connected"]')).toBeVisible()
    })

    // Step 2: Find track to license
    await test.step('Find track with licenses', async () => {
      await page.goto('/explore')
      await page.click('[data-testid="filter-licensable"]')
      await page.click('[data-testid="track-card"]:first-child')
    })

    // Step 3: Purchase commercial license
    await test.step('Purchase commercial license', async () => {
      await page.click('[data-testid="licenses-tab"]')
      
      const commercialLicense = page.locator('[data-testid="license-commercial"]')
      await expect(commercialLicense).toContainText('0.1 ETH')
      
      await commercialLicense.click()
      await page.click('[data-testid="purchase-license"]')
      
      // Confirm transaction
      await expect(page.locator('[data-testid="transaction-pending"]')).toBeVisible()
      
      // Wait for confirmation
      await expect(page.locator('[data-testid="transaction-success"]')).toBeVisible({ timeout: 30000 })
    })

    // Step 4: Verify license ownership
    await test.step('Verify license in wallet', async () => {
      await page.goto('/profile/licenses')
      
      await expect(page.locator('[data-testid="license-card"]')).toContainText('Commercial')
    })

    // Step 5: Artist claims royalty
    await test.step('Artist claims royalty payment', async () => {
      // Login as artist
      await page.goto('/login')
      await page.fill('[data-testid="email"]', 'artist@test.com')
      await page.fill('[data-testid="password"]', 'password')
      await page.click('[data-testid="submit"]')
      
      await page.goto('/dashboard/earnings')
      
      await expect(page.locator('[data-testid="pending-royalties"]')).not.toHaveText('0 ETH')
      
      await page.click('[data-testid="claim-royalties"]')
      await expect(page.locator('[data-testid="claim-success"]')).toBeVisible()
    })
  })
})
```

---

## E2E-4: Gamification Journey

```typescript
// e2e/gamification-journey.spec.ts

test.describe('Gamification Journey', () => {
  test('XP accumulation → level up → badge → multiplier', async ({ page }) => {
    // Setup: Create user at specific XP level
    await test.step('Setup user near level threshold', async () => {
      // API call to set XP to 99 (level 1, near level 2)
      await page.request.post('/api/v1/dev/set-xp', {
        data: { userId: 'test-user', xp: 99 }
      })
    })

    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'test@test.com')
    await page.fill('[data-testid="password"]', 'password')
    await page.click('[data-testid="submit"]')

    // Step 1: Earn XP to level up
    await test.step('Earn XP and level up', async () => {
      await page.goto('/track/any-track')
      await page.click('[data-testid="like-button"]') // +1 XP
      
      // Should trigger level up
      await expect(page.locator('[data-testid="level-up-modal"]')).toBeVisible()
      await expect(page.locator('[data-testid="new-level"]')).toHaveText('Level 2')
      
      await page.click('[data-testid="close-modal"]')
    })

    // Step 2: Earn badge
    await test.step('Earn badge through activity', async () => {
      // Simulate uploading first track (First Track badge)
      await page.goto('/daw')
      await page.locator('[data-testid="audio-upload"]').setInputFiles('fixtures/test-audio.wav')
      await page.click('[data-testid="publish"]')
      await page.fill('[data-testid="track-title"]', 'Badge Test Track')
      await page.click('[data-testid="confirm-publish"]')
      
      // Should receive badge notification
      await expect(page.locator('[data-testid="badge-earned"]')).toBeVisible()
      await expect(page.locator('[data-testid="badge-name"]')).toHaveText('First Track')
    })

    // Step 3: Verify multiplier applied
    await test.step('Verify earning multiplier', async () => {
      await page.goto('/dashboard/earnings')
      
      const multiplier = await page.locator('[data-testid="multiplier"]').textContent()
      expect(parseFloat(multiplier!.replace('x', ''))).toBeGreaterThan(1)
    })

    // Step 4: Check leaderboard position
    await test.step('Check leaderboard', async () => {
      await page.goto('/leaderboard')
      
      const myPosition = page.locator('[data-testid="my-position"]')
      await expect(myPosition).toBeVisible()
    })
  })
})
```

---

## E2E-5: Error Handling Scenarios

```typescript
// e2e/error-handling.spec.ts

test.describe('Error Handling', () => {
  test('handles network disconnection gracefully', async ({ page, context }) => {
    await page.goto('/track/test-track')
    await page.click('[data-testid="play-button"]')
    
    // Simulate offline
    await context.setOffline(true)
    
    await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible()
    await expect(page.locator('[data-testid="audio-buffering"]')).toBeVisible()
    
    // Restore connection
    await context.setOffline(false)
    
    // Audio should resume
    await expect(page.locator('[data-testid="audio-playing"]')).toBeVisible()
  })

  test('handles wallet transaction rejection', async ({ page }) => {
    await page.goto('/track/licensed-track')
    
    // Mock transaction rejection
    await page.evaluate(() => {
      window.ethereum.request = async () => {
        throw new Error('User rejected transaction')
      }
    })
    
    await page.click('[data-testid="purchase-license"]')
    
    await expect(page.locator('[data-testid="transaction-error"]')).toContainText('rejected')
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
  })

  test('handles invalid file upload', async ({ page }) => {
    await page.goto('/daw')
    
    const fileInput = page.locator('[data-testid="audio-upload"]')
    await fileInput.setInputFiles('fixtures/invalid-file.exe')
    
    await expect(page.locator('[data-testid="upload-error"]')).toContainText('Invalid file type')
  })

  test('handles session expiry', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Force session expiry
    await page.evaluate(() => {
      localStorage.removeItem('token')
    })
    
    await page.click('[data-testid="refresh-data"]')
    
    await expect(page).toHaveURL('/login')
    await expect(page.locator('[data-testid="session-expired"]')).toBeVisible()
  })
})
```

---

## E2E-6: Mobile User Journey

```typescript
// e2e/mobile-journey.spec.ts

test.describe('Mobile User Journey', () => {
  test.use({ viewport: { width: 375, height: 812 } }) // iPhone X

  test('complete mobile playback journey', async ({ page }) => {
    await test.step('Navigate with mobile menu', async () => {
      await page.goto('/')
      await page.click('[data-testid="mobile-menu"]')
      await page.click('[data-testid="explore-link"]')
      
      await expect(page).toHaveURL('/explore')
    })

    await test.step('Play track with mobile controls', async () => {
      await page.click('[data-testid="track-card"]:first-child')
      await page.click('[data-testid="play-button"]')
      
      // Mini player should appear
      await expect(page.locator('[data-testid="mini-player"]')).toBeVisible()
      
      // Expand to full player
      await page.click('[data-testid="mini-player"]')
      await expect(page.locator('[data-testid="full-player"]')).toBeVisible()
    })

    await test.step('Background playback continues', async () => {
      // Simulate app going to background
      await page.evaluate(() => {
        document.dispatchEvent(new Event('visibilitychange'))
      })
      
      // Audio should continue (check via Media Session API)
      const isPlaying = await page.evaluate(() => {
        return navigator.mediaSession.playbackState === 'playing'
      })
      
      expect(isPlaying).toBe(true)
    })
  })
})
```

---

## Test Data Fixtures

```typescript
// e2e/fixtures/index.ts

export const testArtist = {
  email: 'artist@test.com',
  password: 'SecurePass123!',
  displayName: 'Test Artist',
  walletAddress: '0x1234...'
}

export const testListener = {
  email: 'listener@test.com',
  password: 'SecurePass123!',
  displayName: 'Test Listener'
}

export const testTrack = {
  title: 'E2E Test Track',
  description: 'A track for E2E testing',
  genre: 'electronic',
  price: '0.01'
}
```

---

## CI Integration

```yaml
# .github/workflows/e2e.yml

name: E2E Tests

on: [push, pull_request]

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
        run: pnpm test:e2e
      
      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

*E2E Scenarios — DAWW3 QA*
