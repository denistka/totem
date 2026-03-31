# 💎 E20: Web3 UX & Mainnet — QA Test Specifications

> **Epic:** E20 - Web3 UX & Mainnet
> **Priority:** 🟠 HIGH
> **Focus:** Wallet integration, Transaction UI, NFT gallery, Mainnet prep

---

## QA Agent Prompt

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive Web3 UX tests
    expertize = 'you are world class Web3 UX QA engineer'
    target = validate Web3 user flows and mainnet readiness
    test = true

    code style = [E2E testing, Visual regression]
    write docs = true
    deep thinking = true
    performance = smooth transaction UX
    tech stack = ['Playwright', 'Hardhat', 'Wagmi', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for E20 Web3 UX features.
Validate wallet integration, transaction flows, NFT gallery.

{{{{ #CUSTOMER PROMT

Нужны QA тесты для Web3 UX:
- E20-T1: Web3 app integration
- E20-T2: Transaction confirmation UI
- E20-T3: License purchase flow
- E20-T4: Royalty claim UI
- E20-T5: NFT gallery & display
- E20-T6: Mainnet deployment prep

}}}}

<<<<<<#RECOMMENDED TASKS

E20-QA-1. Wallet Integration Tests
E20-QA-2. Transaction UI Tests
E20-QA-3. License Purchase Tests
E20-QA-4. Royalty Claim Tests
E20-QA-5. NFT Gallery Tests
E20-QA-6. Mainnet Prep Tests

>>>>>>

]]]]
```

---

## E20-QA-1: Wallet Integration Tests

```typescript
describe('Wallet Integration', () => {
  describe('MetaMask Connection', () => {
    it('shows connect button when disconnected', async ({ page }) => {
      await page.goto('/')
      
      await expect(page.locator('[data-testid="connect-wallet"]')).toBeVisible()
    })

    it('opens MetaMask on connect click', async ({ page }) => {
      await page.goto('/')
      
      // Mock MetaMask
      await page.evaluate(() => {
        window.ethereum = {
          isMetaMask: true,
          request: vi.fn().mockResolvedValue(['0x1234...'])
        }
      })
      
      await page.click('[data-testid="connect-wallet"]')
      
      expect(window.ethereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts'
      })
    })

    it('displays connected address', async ({ page }) => {
      await setupConnectedWallet(page, '0x1234567890abcdef')
      
      await expect(page.locator('[data-testid="wallet-address"]'))
        .toContainText('0x1234...cdef')
    })

    it('shows correct network', async ({ page }) => {
      await setupConnectedWallet(page, '0x1234', { chainId: 137 })
      
      await expect(page.locator('[data-testid="network-badge"]'))
        .toContainText('Polygon')
    })
  })

  describe('Network Switching', () => {
    it('prompts to switch network', async ({ page }) => {
      await setupConnectedWallet(page, '0x1234', { chainId: 1 }) // Mainnet
      
      await page.goto('/publish')
      
      await expect(page.locator('[data-testid="wrong-network-modal"]'))
        .toBeVisible()
    })

    it('adds network if not configured', async ({ page }) => {
      await setupConnectedWallet(page, '0x1234', { chainId: 1 })
      
      await page.evaluate(() => {
        window.ethereum.request = vi.fn()
          .mockRejectedValueOnce({ code: 4902 }) // Chain not added
          .mockResolvedValueOnce(null)
      })
      
      await page.click('[data-testid="switch-network"]')
      
      expect(window.ethereum.request).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'wallet_addEthereumChain' })
      )
    })
  })

  describe('Disconnect', () => {
    it('disconnects wallet on click', async ({ page }) => {
      await setupConnectedWallet(page, '0x1234')
      
      await page.click('[data-testid="wallet-menu"]')
      await page.click('[data-testid="disconnect"]')
      
      await expect(page.locator('[data-testid="connect-wallet"]')).toBeVisible()
    })
  })
})
```

---

## E20-QA-2: Transaction UI Tests

```typescript
describe('Transaction Confirmation UI', () => {
  describe('Transaction Modal', () => {
    it('shows transaction details before confirm', async ({ page }) => {
      await setupConnectedWallet(page)
      await page.goto('/track/test-track/purchase')
      
      await page.click('[data-testid="purchase-button"]')
      
      await expect(page.locator('[data-testid="tx-modal"]')).toBeVisible()
      await expect(page.locator('[data-testid="tx-amount"]')).toContainText('0.01 ETH')
      await expect(page.locator('[data-testid="tx-gas"]')).toBeVisible()
    })

    it('shows pending state', async ({ page }) => {
      await setupConnectedWallet(page)
      
      await page.evaluate(() => {
        window.ethereum.request = vi.fn().mockImplementation(async ({ method }) => {
          if (method === 'eth_sendTransaction') {
            await new Promise(r => setTimeout(r, 5000)) // Simulate delay
            return '0xhash...'
          }
        })
      })
      
      await page.click('[data-testid="purchase-button"]')
      await page.click('[data-testid="confirm-tx"]')
      
      await expect(page.locator('[data-testid="tx-pending"]')).toBeVisible()
      await expect(page.locator('[data-testid="tx-spinner"]')).toBeVisible()
    })

    it('shows success state', async ({ page }) => {
      await setupConnectedWallet(page)
      await mockSuccessfulTransaction(page, '0xtxhash')
      
      await page.click('[data-testid="purchase-button"]')
      await page.click('[data-testid="confirm-tx"]')
      
      await expect(page.locator('[data-testid="tx-success"]')).toBeVisible()
      await expect(page.locator('[data-testid="tx-hash"]')).toContainText('0xtx')
    })

    it('shows error state with retry', async ({ page }) => {
      await setupConnectedWallet(page)
      
      await page.evaluate(() => {
        window.ethereum.request = vi.fn().mockRejectedValue(new Error('User rejected'))
      })
      
      await page.click('[data-testid="purchase-button"]')
      await page.click('[data-testid="confirm-tx"]')
      
      await expect(page.locator('[data-testid="tx-error"]')).toBeVisible()
      await expect(page.locator('[data-testid="retry-tx"]')).toBeVisible()
    })
  })

  describe('Gas Estimation', () => {
    it('shows estimated gas cost', async ({ page }) => {
      await setupConnectedWallet(page)
      await mockGasEstimate(page, 100000n, 50n) // 100K gas, 50 gwei
      
      await page.goto('/track/test-track/purchase')
      await page.click('[data-testid="purchase-button"]')
      
      await expect(page.locator('[data-testid="gas-estimate"]'))
        .toContainText('~0.005 ETH')
    })

    it('updates gas on network conditions', async ({ page }) => {
      await setupConnectedWallet(page)
      
      await page.goto('/track/test-track/purchase')
      await page.click('[data-testid="purchase-button"]')
      
      const initialGas = await page.locator('[data-testid="gas-estimate"]').textContent()
      
      // Simulate gas price change
      await mockGasEstimate(page, 100000n, 100n) // Double gas price
      await page.click('[data-testid="refresh-gas"]')
      
      const updatedGas = await page.locator('[data-testid="gas-estimate"]').textContent()
      expect(updatedGas).not.toBe(initialGas)
    })
  })
})
```

---

## E20-QA-3: License Purchase Tests

```typescript
describe('License Purchase Flow', () => {
  describe('License Selection', () => {
    it('displays available license types', async ({ page }) => {
      await page.goto('/track/test-track')
      await page.click('[data-testid="licenses-tab"]')
      
      await expect(page.locator('[data-testid="license-personal"]')).toBeVisible()
      await expect(page.locator('[data-testid="license-commercial"]')).toBeVisible()
      await expect(page.locator('[data-testid="license-exclusive"]')).toBeVisible()
    })

    it('shows license terms', async ({ page }) => {
      await page.goto('/track/test-track')
      await page.click('[data-testid="licenses-tab"]')
      await page.click('[data-testid="license-commercial"]')
      
      await expect(page.locator('[data-testid="license-terms"]')).toBeVisible()
      await expect(page.locator('[data-testid="license-price"]')).toContainText('0.1 ETH')
    })
  })

  describe('Purchase Flow', () => {
    it('complete purchase flow', async ({ page }) => {
      await setupConnectedWallet(page)
      await mockSuccessfulTransaction(page)
      
      await page.goto('/track/test-track')
      await page.click('[data-testid="licenses-tab"]')
      await page.click('[data-testid="license-personal"]')
      await page.click('[data-testid="purchase-button"]')
      
      // Confirm terms
      await page.click('[data-testid="accept-terms"]')
      await page.click('[data-testid="confirm-purchase"]')
      
      // Confirm transaction
      await page.click('[data-testid="confirm-tx"]')
      
      // Wait for success
      await expect(page.locator('[data-testid="purchase-success"]')).toBeVisible()
      await expect(page.locator('[data-testid="view-license"]')).toBeVisible()
    })

    it('verifies license ownership after purchase', async ({ page }) => {
      await setupConnectedWallet(page, '0xBuyer')
      await completePurchase(page, 'personal')
      
      await page.goto('/profile/licenses')
      
      await expect(page.locator('[data-testid="license-card"]')).toContainText('Personal')
    })
  })

  describe('Smart Contract Integration', () => {
    it('calls LicenseManager.purchaseLicense', async ({ page }) => {
      await setupConnectedWallet(page)
      
      const txSpy = vi.fn()
      await page.evaluate((spy) => {
        window.ethereum.request = async ({ method, params }) => {
          if (method === 'eth_sendTransaction') {
            spy(params)
            return '0xhash'
          }
        }
      }, txSpy)
      
      await completePurchase(page, 'commercial')
      
      expect(txSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: expect.stringMatching(/^0x/),
          data: expect.stringContaining('purchaseLicense')
        })
      )
    })
  })
})
```

---

## E20-QA-4: Royalty Claim Tests

```typescript
describe('Royalty Claim UI', () => {
  describe('Earnings Display', () => {
    it('shows pending royalties', async ({ page }) => {
      await setupConnectedWallet(page, '0xArtist')
      await mockRoyaltyBalance(page, '0.5')
      
      await page.goto('/dashboard/earnings')
      
      await expect(page.locator('[data-testid="pending-royalties"]'))
        .toContainText('0.5 ETH')
    })

    it('shows earnings breakdown by track', async ({ page }) => {
      await setupConnectedWallet(page, '0xArtist')
      
      await page.goto('/dashboard/earnings')
      
      await expect(page.locator('[data-testid="earnings-by-track"]')).toBeVisible()
      await expect(page.locator('[data-testid="track-earning"]').first())
        .toContainText('ETH')
    })
  })

  describe('Claim Flow', () => {
    it('claims royalties successfully', async ({ page }) => {
      await setupConnectedWallet(page, '0xArtist')
      await mockRoyaltyBalance(page, '0.5')
      await mockSuccessfulTransaction(page)
      
      await page.goto('/dashboard/earnings')
      await page.click('[data-testid="claim-royalties"]')
      await page.click('[data-testid="confirm-claim"]')
      
      await expect(page.locator('[data-testid="claim-success"]')).toBeVisible()
    })

    it('shows minimum claim threshold', async ({ page }) => {
      await setupConnectedWallet(page, '0xArtist')
      await mockRoyaltyBalance(page, '0.001') // Below threshold
      
      await page.goto('/dashboard/earnings')
      
      await expect(page.locator('[data-testid="claim-royalties"]')).toBeDisabled()
      await expect(page.locator('[data-testid="min-threshold-notice"]')).toBeVisible()
    })
  })

  describe('Payment History', () => {
    it('shows past claims', async ({ page }) => {
      await setupConnectedWallet(page, '0xArtist')
      
      await page.goto('/dashboard/earnings')
      await page.click('[data-testid="history-tab"]')
      
      await expect(page.locator('[data-testid="claim-history-item"]').first())
        .toBeVisible()
    })
  })
})
```

---

## E20-QA-5: NFT Gallery Tests

```typescript
describe('NFT Gallery & Display', () => {
  describe('Collection Display', () => {
    it('shows owned NFTs', async ({ page }) => {
      await setupConnectedWallet(page, '0xCollector')
      await mockOwnedNFTs(page, [
        { tokenId: 1, title: 'Track 1', image: 'ipfs://...' },
        { tokenId: 2, title: 'Track 2', image: 'ipfs://...' }
      ])
      
      await page.goto('/profile/collection')
      
      await expect(page.locator('[data-testid="nft-card"]')).toHaveCount(2)
    })

    it('displays NFT metadata', async ({ page }) => {
      await setupConnectedWallet(page, '0xCollector')
      await mockOwnedNFTs(page, [{
        tokenId: 1,
        title: 'My Track',
        artist: 'Artist Name',
        image: 'ipfs://cover'
      }])
      
      await page.goto('/profile/collection')
      await page.click('[data-testid="nft-card"]')
      
      await expect(page.locator('[data-testid="nft-title"]')).toContainText('My Track')
      await expect(page.locator('[data-testid="nft-artist"]')).toContainText('Artist Name')
      await expect(page.locator('[data-testid="nft-image"]')).toBeVisible()
    })
  })

  describe('NFT Detail Page', () => {
    it('shows ownership history', async ({ page }) => {
      await page.goto('/nft/1')
      
      await expect(page.locator('[data-testid="ownership-history"]')).toBeVisible()
      await expect(page.locator('[data-testid="transfer-event"]').first()).toBeVisible()
    })

    it('shows royalty info', async ({ page }) => {
      await page.goto('/nft/1')
      
      await expect(page.locator('[data-testid="royalty-percentage"]'))
        .toContainText('10%')
    })
  })

  describe('Artist Gallery', () => {
    it('shows artist tracks as NFTs', async ({ page }) => {
      await page.goto('/artist/0xArtist')
      
      await expect(page.locator('[data-testid="artist-nfts"]')).toBeVisible()
    })
  })
})
```

---

## E20-QA-6: Mainnet Deployment Tests

```typescript
describe('Mainnet Deployment Prep', () => {
  describe('Contract Verification', () => {
    it('all contracts verified on testnet', async () => {
      const contracts = ['TrackNFT', 'RoyaltySplit', 'LicenseManager']
      
      for (const contract of contracts) {
        const address = deployedAddresses[contract]
        const verified = await polygonscan.checkVerification(address)
        
        expect(verified).toBe(true)
      }
    })
  })

  describe('Testnet Functionality', () => {
    it('mint works on testnet', async () => {
      const tx = await trackNFT.mintTrack(
        'test-track',
        'ipfs://test',
        [testWallet.address],
        [10000]
      )
      
      const receipt = await tx.wait()
      expect(receipt.status).toBe(1)
    })

    it('royalty distribution works on testnet', async () => {
      const balanceBefore = await testWallet.getBalance()
      
      await royaltySplit.distribute(1, { value: parseEther('0.1') })
      
      const balanceAfter = await testWallet.getBalance()
      expect(balanceAfter).toBeGreaterThan(balanceBefore)
    })
  })

  describe('Gas Optimization', () => {
    it('mint gas < 200K', async () => {
      const tx = await trackNFT.mintTrack(
        'gas-test',
        'ipfs://gas',
        [testWallet.address],
        [10000]
      )
      
      const receipt = await tx.wait()
      expect(receipt.gasUsed).toBeLessThan(200000n)
    })
  })

  describe('Security Checklist', () => {
    it('contracts use latest OpenZeppelin', async () => {
      const packageJson = await fs.readFile('apps/contracts/package.json', 'utf8')
      const deps = JSON.parse(packageJson).dependencies
      
      expect(deps['@openzeppelin/contracts']).toMatch(/^[\^~]?5\./)
    })

    it('Slither reports no high severity', async () => {
      const result = await exec('slither apps/contracts --json slither-report.json')
      const report = JSON.parse(await fs.readFile('slither-report.json', 'utf8'))
      
      const highSeverity = report.results.detectors.filter(
        d => d.impact === 'High'
      )
      
      expect(highSeverity.length).toBe(0)
    })
  })
})
```

---

## Manual Test Checklist

### E20-T1: Wallet Integration
- [ ] Connect MetaMask
- [ ] Connect WalletConnect
- [ ] Address displays correctly
- [ ] Network switching works

### E20-T2: Transaction UI
- [ ] Shows gas estimate
- [ ] Pending spinner appears
- [ ] Success shows tx hash
- [ ] Error shows retry option

### E20-T3: License Purchase
- [ ] Browse available licenses
- [ ] Complete purchase flow
- [ ] License appears in profile

### E20-T4: Royalty Claim
- [ ] Shows pending balance
- [ ] Claim transaction works
- [ ] Balance updates after claim

### E20-T5: NFT Gallery
- [ ] Shows owned NFTs
- [ ] NFT detail page works
- [ ] Metadata displays correctly

### E20-T6: Mainnet Prep
- [ ] Testnet contracts work
- [ ] Gas costs reasonable
- [ ] Security scan clean

---

*E20 Web3 UX QA — DAWW3 Sprint 3*
