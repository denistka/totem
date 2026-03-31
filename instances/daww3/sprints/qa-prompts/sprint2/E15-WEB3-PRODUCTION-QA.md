# ⛓️ E15: Web3 Production — QA Test Specifications

> **Epic:** E15 - Web3 Production Readiness
> **Status:** ✅ DONE
> **Focus:** Contract testing, Wallet integration, Testnet, The Graph, Security

---

## Agent Prompt for Web3 Production Testing

```
[[[[ #SETTINGS

    mode = agent - implement comprehensive Web3 production tests
    expertize = 'you are world class blockchain security and Web3 testing specialist'
    target = validate Web3 stack for production deployment
    test = true

    code style = [Property-based testing, Fuzzing, Security-first]
    write docs = true
    deep thinking = true
    performance = gas optimization validation
    tech stack = ['Hardhat', 'Wagmi', 'The Graph', 'Slither']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement tests for DAWW3 Web3 production readiness covering:
- Smart contract test coverage (98%+)
- Frontend wallet integration (MetaMask, WalletConnect)
- Testnet deployment and verification
- The Graph subgraph indexing
- Security audit preparation

{{{{ #CUSTOMER PROMT

Нужны тесты для:
- Contracts: TrackNFT, RoyaltySplit, LicenseManager, RoyaltyDistributor, DAWW3Token
- Contract coverage: 98.57% statements, 109 tests
- Wallet: MetaMask, WalletConnect, Coinbase connectors
- Testnet: Mumbai deployment, Polygonscan verification
- Subgraph: 14 entities, event handlers for all contracts
- Security: Slither, reentrancy, access control, integer safety

}}}}

<<<<<<#RECOMMENDED TASKS

E15-QA-1. Smart Contract Tests
- Test TrackNFT minting and ownership
- Test RoyaltySplit distribution accuracy
- Test LicenseManager types and revocation
- Test RoyaltyDistributor batch and Merkle claims
- Test DAWW3Token staking/governance

E15-QA-2. Contract Security Tests
- Run Slither static analysis
- Test reentrancy protection
- Test access control enforcement
- Test integer overflow/underflow
- Test emergency pause functionality

E15-QA-3. Wallet Integration Tests
- Test MetaMask connection
- Test WalletConnect modal
- Test network switching
- Test transaction signing
- Test error handling

E15-QA-4. Subgraph Tests
- Test event handler correctness
- Test entity relationships
- Test query performance
- Test real-time indexing

E15-QA-5. Testnet Deployment Tests
- Test deployment script
- Test contract verification
- Test frontend with testnet
- Test transaction flow end-to-end

E15-QA-6. Gas Optimization Tests
- Measure gas for common operations
- Compare to benchmarks
- Identify optimization opportunities

🏁 Definition of Done
- All 109 contract tests pass
- Security tools report no critical issues
- Wallet connects on all supported browsers
- Subgraph indexes all events correctly
- Testnet deployment verified

>>>>>>

]]]]
```

---

## Smart Contract Tests

### E15-QA-1: Contract Test Coverage

```typescript
// apps/contracts/test/TrackNFT.test.ts

import { expect } from 'chai'
import { ethers } from 'hardhat'
import { TrackNFT, RoyaltySplit } from '../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'

describe('TrackNFT', () => {
  let trackNFT: TrackNFT
  let royaltySplit: RoyaltySplit
  let owner: SignerWithAddress
  let artist1: SignerWithAddress
  let artist2: SignerWithAddress
  let buyer: SignerWithAddress

  beforeEach(async () => {
    [owner, artist1, artist2, buyer] = await ethers.getSigners()
    
    const RoyaltySplitFactory = await ethers.getContractFactory('RoyaltySplit')
    royaltySplit = await RoyaltySplitFactory.deploy()
    
    const TrackNFTFactory = await ethers.getContractFactory('TrackNFT')
    trackNFT = await TrackNFTFactory.deploy(royaltySplit.target)
  })

  describe('Minting', () => {
    it('mints track with single creator', async () => {
      const tx = await trackNFT.mintTrack(
        'track-001',
        'ipfs://metadata',
        [artist1.address],
        [10000] // 100%
      )
      
      await expect(tx)
        .to.emit(trackNFT, 'TrackMinted')
        .withArgs(1, 'track-001', artist1.address)
      
      expect(await trackNFT.ownerOf(1)).to.equal(artist1.address)
    })

    it('mints track with multiple creators', async () => {
      await trackNFT.mintTrack(
        'track-002',
        'ipfs://metadata',
        [artist1.address, artist2.address],
        [7000, 3000] // 70%, 30%
      )
      
      const split = await royaltySplit.getSplit(1)
      expect(split.recipients).to.deep.equal([artist1.address, artist2.address])
      expect(split.shares).to.deep.equal([7000n, 3000n])
    })

    it('reverts if shares do not sum to 100%', async () => {
      await expect(
        trackNFT.mintTrack(
          'track-003',
          'ipfs://metadata',
          [artist1.address, artist2.address],
          [5000, 4000] // Only 90%
        )
      ).to.be.revertedWith('Shares must sum to 100%')
    })

    it('reverts if arrays length mismatch', async () => {
      await expect(
        trackNFT.mintTrack(
          'track-004',
          'ipfs://metadata',
          [artist1.address],
          [7000, 3000]
        )
      ).to.be.revertedWith('Arrays length mismatch')
    })
  })

  describe('Royalty Distribution', () => {
    beforeEach(async () => {
      await trackNFT.mintTrack(
        'track-001',
        'ipfs://metadata',
        [artist1.address, artist2.address],
        [7000, 3000]
      )
    })

    it('distributes royalties correctly', async () => {
      const amount = ethers.parseEther('1')
      
      const artist1Before = await ethers.provider.getBalance(artist1.address)
      const artist2Before = await ethers.provider.getBalance(artist2.address)
      
      await trackNFT.connect(buyer).distributeRoyalty(1, { value: amount })
      
      const artist1After = await ethers.provider.getBalance(artist1.address)
      const artist2After = await ethers.provider.getBalance(artist2.address)
      
      expect(artist1After - artist1Before).to.equal(ethers.parseEther('0.7'))
      expect(artist2After - artist2Before).to.equal(ethers.parseEther('0.3'))
    })

    it('handles small amounts without rounding errors', async () => {
      const amount = ethers.parseEther('0.000001')
      
      await expect(
        trackNFT.connect(buyer).distributeRoyalty(1, { value: amount })
      ).not.to.be.reverted
    })
  })
})
```

### E15-QA-2: LicenseManager Tests

```typescript
// apps/contracts/test/LicenseManager.test.ts

describe('LicenseManager', () => {
  let licenseManager: LicenseManager
  let owner: SignerWithAddress
  let artist: SignerWithAddress
  let buyer: SignerWithAddress

  beforeEach(async () => {
    [owner, artist, buyer] = await ethers.getSigners()
    
    const LicenseManagerFactory = await ethers.getContractFactory('LicenseManager')
    licenseManager = await LicenseManagerFactory.deploy()
  })

  describe('License Types', () => {
    const licenseTypes = [
      { type: 0, name: 'PERSONAL', price: '0.01' },
      { type: 1, name: 'COMMERCIAL', price: '0.1' },
      { type: 2, name: 'REMIX', price: '0.05' },
      { type: 3, name: 'DERIVATIVE', price: '0.08' },
      { type: 4, name: 'STREAMING', price: '0.001' },
      { type: 5, name: 'EXCLUSIVE', price: '1.0' }
    ]

    licenseTypes.forEach(({ type, name, price }) => {
      it(`creates ${name} license`, async () => {
        await licenseManager.connect(artist).createLicense(
          1, // tokenId
          type,
          ethers.parseEther(price)
        )
        
        const license = await licenseManager.getLicense(1, type)
        expect(license.price).to.equal(ethers.parseEther(price))
        expect(license.active).to.be.true
      })
    })
  })

  describe('License Purchase', () => {
    beforeEach(async () => {
      await licenseManager.connect(artist).createLicense(
        1,
        0, // PERSONAL
        ethers.parseEther('0.01')
      )
    })

    it('allows purchase with correct payment', async () => {
      await expect(
        licenseManager.connect(buyer).purchaseLicense(1, 0, {
          value: ethers.parseEther('0.01')
        })
      )
        .to.emit(licenseManager, 'LicensePurchased')
        .withArgs(1, 0, buyer.address)
    })

    it('reverts with insufficient payment', async () => {
      await expect(
        licenseManager.connect(buyer).purchaseLicense(1, 0, {
          value: ethers.parseEther('0.005')
        })
      ).to.be.revertedWith('Insufficient payment')
    })
  })

  describe('License Revocation', () => {
    it('artist can revoke license', async () => {
      await licenseManager.connect(artist).createLicense(1, 0, ethers.parseEther('0.01'))
      
      await licenseManager.connect(artist).revokeLicense(1, 0)
      
      const license = await licenseManager.getLicense(1, 0)
      expect(license.active).to.be.false
    })

    it('non-owner cannot revoke', async () => {
      await licenseManager.connect(artist).createLicense(1, 0, ethers.parseEther('0.01'))
      
      await expect(
        licenseManager.connect(buyer).revokeLicense(1, 0)
      ).to.be.revertedWith('Not authorized')
    })
  })
})
```

### E15-QA-2: Security Tests

```typescript
// apps/contracts/test/Security.test.ts

describe('Security Tests', () => {
  describe('Reentrancy Protection', () => {
    it('prevents reentrancy in royalty distribution', async () => {
      // Deploy malicious contract
      const AttackerFactory = await ethers.getContractFactory('ReentrancyAttacker')
      const attacker = await AttackerFactory.deploy(trackNFT.target)
      
      await trackNFT.mintTrack(
        'track-001',
        'ipfs://metadata',
        [attacker.target],
        [10000]
      )
      
      // Attempt reentrancy attack
      await expect(
        attacker.attack(1, { value: ethers.parseEther('1') })
      ).to.be.reverted
    })
  })

  describe('Access Control', () => {
    it('only owner can pause contracts', async () => {
      await expect(
        royaltyDistributor.connect(buyer).pause()
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('only owner can set distribution cap', async () => {
      await expect(
        royaltyDistributor.connect(buyer).setDistributionCap(
          ethers.parseEther('100')
        )
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  describe('Integer Safety', () => {
    it('handles maximum uint256 gracefully', async () => {
      const maxUint = ethers.MaxUint256
      
      await expect(
        trackNFT.mintTrack(
          'track-max',
          'ipfs://metadata',
          [artist1.address],
          [maxUint] // Would overflow
        )
      ).to.be.reverted
    })
  })

  describe('Emergency Pause', () => {
    it('paused contract rejects transactions', async () => {
      await royaltyDistributor.pause()
      
      await expect(
        royaltyDistributor.distribute(1, [artist1.address], [10000], {
          value: ethers.parseEther('1')
        })
      ).to.be.revertedWith('Pausable: paused')
    })

    it('can unpause and resume', async () => {
      await royaltyDistributor.pause()
      await royaltyDistributor.unpause()
      
      await expect(
        royaltyDistributor.distribute(1, [artist1.address], [10000], {
          value: ethers.parseEther('1')
        })
      ).not.to.be.reverted
    })
  })
})
```

---

## Wallet Integration Tests

### E15-QA-3: Frontend Wallet

```typescript
// apps/web/src/core/web3/__tests__/wallet-integration.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWallet } from '../composables/useWallet'
import { renderHook } from '@testing-library/vue'

describe('Wallet Integration', () => {
  describe('MetaMask Connection', () => {
    beforeEach(() => {
      // Mock MetaMask provider
      vi.stubGlobal('ethereum', {
        isMetaMask: true,
        request: vi.fn(),
        on: vi.fn(),
        removeListener: vi.fn()
      })
    })

    it('connects to MetaMask', async () => {
      window.ethereum.request.mockResolvedValueOnce(['0x1234...'])
      
      const { result } = renderHook(() => useWallet())
      
      await result.connect('metaMask')
      
      expect(result.isConnected.value).toBe(true)
      expect(result.address.value).toBe('0x1234...')
    })

    it('handles user rejection', async () => {
      window.ethereum.request.mockRejectedValueOnce(
        new Error('User rejected')
      )
      
      const { result } = renderHook(() => useWallet())
      
      await expect(result.connect('metaMask')).rejects.toThrow()
      expect(result.isConnected.value).toBe(false)
    })
  })

  describe('Network Switching', () => {
    it('switches to Polygon', async () => {
      window.ethereum.request
        .mockResolvedValueOnce(['0x1234...']) // eth_requestAccounts
        .mockResolvedValueOnce(null) // wallet_switchEthereumChain
      
      const { result } = renderHook(() => useWallet())
      
      await result.connect('metaMask')
      await result.switchNetwork(137) // Polygon chainId
      
      expect(window.ethereum.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }]
      })
    })

    it('adds network if not available', async () => {
      window.ethereum.request
        .mockResolvedValueOnce(['0x1234...'])
        .mockRejectedValueOnce({ code: 4902 }) // Chain not added
        .mockResolvedValueOnce(null) // wallet_addEthereumChain
      
      const { result } = renderHook(() => useWallet())
      
      await result.connect('metaMask')
      await result.switchNetwork(137)
      
      expect(window.ethereum.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'wallet_addEthereumChain'
        })
      )
    })
  })

  describe('Transaction Signing', () => {
    it('signs and sends transaction', async () => {
      const mockTxHash = '0xabc123...'
      window.ethereum.request
        .mockResolvedValueOnce(['0x1234...'])
        .mockResolvedValueOnce(mockTxHash)
      
      const { result } = renderHook(() => useWallet())
      
      await result.connect('metaMask')
      const txHash = await result.sendTransaction({
        to: '0x5678...',
        value: '1000000000000000000' // 1 ETH
      })
      
      expect(txHash).toBe(mockTxHash)
    })
  })
})
```

---

## Subgraph Tests

### E15-QA-4: The Graph Indexing

```typescript
// apps/subgraph/__tests__/handlers.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import {
  handleTrackMinted,
  handleRoyaltyPaid,
  handleLicensePurchased
} from '../src/track-nft'
import { newMockEvent } from 'matchstick-as'

describe('Subgraph Event Handlers', () => {
  describe('TrackMinted Handler', () => {
    it('creates Track entity', () => {
      const event = createTrackMintedEvent(
        1, // tokenId
        'track-001',
        '0xArtist...'
      )
      
      handleTrackMinted(event)
      
      assert.entityCount('Track', 1)
      assert.fieldEquals('Track', '1', 'trackId', 'track-001')
      assert.fieldEquals('Track', '1', 'creator', '0xArtist...')
    })

    it('creates Creator entity if new', () => {
      const event = createTrackMintedEvent(1, 'track-001', '0xNewArtist...')
      
      handleTrackMinted(event)
      
      assert.entityCount('Creator', 1)
    })

    it('updates GlobalStats', () => {
      const event = createTrackMintedEvent(1, 'track-001', '0xArtist...')
      
      handleTrackMinted(event)
      
      assert.fieldEquals('GlobalStats', 'global', 'totalTracks', '1')
    })
  })

  describe('RoyaltyPaid Handler', () => {
    it('creates RoyaltyPayment entity', () => {
      const event = createRoyaltyPaidEvent(
        1, // tokenId
        '0xPayer...',
        ethers.parseEther('0.1').toString()
      )
      
      handleRoyaltyPaid(event)
      
      assert.entityCount('RoyaltyPayment', 1)
    })

    it('updates creator earnings', () => {
      // First mint track
      handleTrackMinted(createTrackMintedEvent(1, 'track-001', '0xArtist...'))
      
      // Then royalty payment
      handleRoyaltyPaid(createRoyaltyPaidEvent(
        1,
        '0xPayer...',
        ethers.parseEther('0.1').toString()
      ))
      
      assert.fieldEquals('Creator', '0xArtist...', 'totalEarnings', '100000000000000000')
    })
  })

  describe('LicensePurchased Handler', () => {
    it('creates License entity', () => {
      const event = createLicensePurchasedEvent(
        1, // tokenId
        0, // PERSONAL
        '0xBuyer...'
      )
      
      handleLicensePurchased(event)
      
      assert.entityCount('License', 1)
    })
  })
})
```

### E15-QA-4: Subgraph Queries

```graphql
# Test queries for subgraph

# Get top creators by earnings
query TopCreators {
  creators(
    first: 10
    orderBy: totalEarnings
    orderDirection: desc
  ) {
    id
    totalEarnings
    totalTracks
  }
}

# Get track with all licenses
query TrackWithLicenses($tokenId: ID!) {
  track(id: $tokenId) {
    id
    trackId
    metadataURI
    creator {
      id
    }
    licenses {
      licenseType
      price
      purchaser {
        id
      }
    }
    royaltyPayments(first: 10) {
      amount
      payer
      timestamp
    }
  }
}

# Get daily stats
query DailyStats($date: String!) {
  dailyStats(id: $date) {
    date
    tracksCreated
    licensessPurchased
    royaltiesDistributed
    totalVolume
  }
}
```

---

## Gas Optimization Tests

### E15-QA-6: Gas Benchmarks

```typescript
// apps/contracts/test/GasBenchmark.test.ts

describe('Gas Benchmarks', () => {
  it('mintTrack gas should be < 200K', async () => {
    const tx = await trackNFT.mintTrack(
      'track-001',
      'ipfs://metadata',
      [artist1.address],
      [10000]
    )
    
    const receipt = await tx.wait()
    console.log('mintTrack gas:', receipt.gasUsed.toString())
    
    expect(receipt.gasUsed).to.be.lessThan(200000n)
  })

  it('distributeRoyalty gas should be < 100K', async () => {
    await trackNFT.mintTrack('track-001', 'ipfs://metadata', [artist1.address], [10000])
    
    const tx = await trackNFT.distributeRoyalty(1, {
      value: ethers.parseEther('0.1')
    })
    
    const receipt = await tx.wait()
    console.log('distributeRoyalty gas:', receipt.gasUsed.toString())
    
    expect(receipt.gasUsed).to.be.lessThan(100000n)
  })

  it('batch distribution 10 recipients < 300K', async () => {
    const recipients = Array(10).fill(null).map((_, i) =>
      ethers.Wallet.createRandom().address
    )
    const shares = Array(10).fill(1000) // 10% each
    
    const tx = await royaltyDistributor.batchDistribute(
      1,
      recipients,
      shares,
      { value: ethers.parseEther('1') }
    )
    
    const receipt = await tx.wait()
    console.log('batchDistribute (10) gas:', receipt.gasUsed.toString())
    
    expect(receipt.gasUsed).to.be.lessThan(300000n)
  })
})
```

---

## Testnet Deployment Tests

### E15-QA-5: Deployment Verification

```bash
# Manual testnet deployment verification steps

# 1. Deploy to Mumbai
npx hardhat run scripts/deploy.ts --network polygonMumbai

# 2. Verify on Polygonscan
npx hardhat verify --network polygonMumbai DEPLOYED_ADDRESS

# 3. Test basic operations
npx hardhat console --network polygonMumbai
> const TrackNFT = await ethers.getContractFactory('TrackNFT')
> const contract = TrackNFT.attach('DEPLOYED_ADDRESS')
> await contract.name()
> await contract.symbol()

# 4. Check frontend connects
# - Open app with Mumbai network
# - Connect wallet
# - Verify contract interaction
```

---

## Manual Test Checklist

### E15-MANUAL: Web3 Validation

- [ ] **MetaMask Connect**: Popup appears, address shown after connect
- [ ] **Network Switch**: Prompt appears when wrong network
- [ ] **Mint NFT**: Transaction confirms, NFT appears in wallet
- [ ] **Pay Royalty**: ETH/MATIC transfers to creators
- [ ] **Purchase License**: Transaction confirms, license granted
- [ ] **Subgraph Query**: Data appears in frontend from subgraph
- [ ] **Testnet Deploy**: Contracts verified on Polygonscan
- [ ] **Mobile Wallet**: WalletConnect works on mobile

---

## Security Audit Checklist

### E15-SECURITY: Pre-Audit Tasks

```markdown
# From docs/AUDIT_CHECKLIST.md

## Code Quality
- [ ] All tests pass (109 tests)
- [ ] Coverage > 98%
- [ ] No compiler warnings
- [ ] NatSpec comments complete

## Static Analysis
- [ ] Slither reports reviewed
- [ ] MythX scan clean
- [ ] Reentrancy patterns checked

## Access Control
- [ ] Ownable functions documented
- [ ] Role hierarchy clear
- [ ] Admin functions time-locked (TODO)

## Economic Security
- [ ] Overflow/underflow protected (Solidity 0.8+)
- [ ] Frontrunning mitigated
- [ ] Flash loan resistance (N/A for current functions)

## Emergency Procedures
- [ ] Pause mechanism tested
- [ ] Recovery procedures documented
```

---

## Regression Tests

```typescript
describe('E15 Regression Tests', () => {
  it.todo('Testnet deployment with funded wallet')
  it.todo('WalletConnect project ID configuration')
  it.todo('Subgraph deployment to hosted service')
  it.todo('Multi-sig wallet deployment')
  it.todo('Timelock contract for admin')
  it.todo('Formal verification (Certora)')
  it.todo('Echidna fuzz testing')
  it.todo('Transaction confirmation UI')
  it.todo('Gas estimation display')
  it.todo('NFT gallery components')
})
```

---

*E15 Web3 Production QA — DAWW3 Project*
