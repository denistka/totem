# ⛓️ E9: Web3 / Monetization (Sandbox)

> **Goal:** Testable local economy  
> **Sprint:** 3  
> **Owner:** Web3 / Backend

---

## E9-T1: Smart Contracts (Hardhat)

**Priority:** 🟠 P1 HIGH  
**Points:** 8  
**Depends on:** E1-T2

### Description
Deploy TrackNFT and RoyaltySplit contracts for ownership and payments.

### Acceptance Criteria
- [ ] TrackNFT mints correctly
- [ ] Royalty splits work
- [ ] Contracts deploy to local Hardhat
- [ ] Contracts verified on testnet
- [ ] Gas optimized

### Contracts

| Contract | Purpose | Standard |
|----------|---------|----------|
| TrackNFT | Track ownership | ERC-721 |
| RoyaltySplit | Revenue distribution | ERC-2981 |
| LicenseManager | License types | Custom |

### TrackNFT Features
```solidity
// Mint track as NFT
function mintTrack(
  string calldata trackId,
  string calldata metadataURI,
  address[] calldata creators,
  uint96[] calldata shares
) external returns (uint256 tokenId)

// Distribute royalty payment
function distributeRoyalty(uint256 tokenId) external payable

// Get royalty split info
function getRoyaltySplit(uint256 tokenId, uint256 salePrice)
  external view returns (address[] memory, uint256[] memory)
```

### Subtasks
- [ ] Create `TrackNFT.sol`
- [ ] Create `RoyaltySplit.sol`
- [ ] Create `LicenseManager.sol`
- [ ] Write comprehensive tests
- [ ] Create deployment script
- [ ] Deploy to local Hardhat node
- [ ] Deploy to Polygon Mumbai testnet
- [ ] Verify contracts on Polygonscan
- [ ] Document contract interfaces

### Gas Optimization
```solidity
// Use calldata for arrays
function mintTrack(..., address[] calldata creators, ...) 

// Pack structs efficiently
struct Track {
  uint128 mintedAt;
  uint64 creatorCount;
  bool active;
  // ...
}

// Use unchecked where safe
unchecked { totalShares += shares[i]; }
```

### Definition of Done
```bash
# Local
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
# → Contracts deployed

# Testnet
npx hardhat run scripts/deploy.ts --network polygonMumbai
npx hardhat verify --network polygonMumbai <address>
# → Verified on Polygonscan
```

---

## E9-T2: Backend ↔ Blockchain

**Priority:** 🟠 P1 HIGH  
**Points:** 5  
**Depends on:** E9-T1

### Description
Listen to blockchain events and sync state.

### Acceptance Criteria
- [ ] Event listener running
- [ ] NFT mints synced to DB
- [ ] Payments tracked
- [ ] Balance caching works
- [ ] Reconnection on disconnect

### Technical Requirements

```typescript
// apps/api/src/modules/payments/blockchain.listener.ts
@Injectable()
export class BlockchainListener implements OnModuleInit {
  private provider: ethers.Provider
  private trackNFT: ethers.Contract
  
  async onModuleInit() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    this.trackNFT = new ethers.Contract(
      process.env.TRACK_NFT_ADDRESS,
      TrackNFTABI,
      this.provider
    )
    
    await this.startListening()
  }
  
  private async startListening() {
    // Listen for TrackMinted events
    this.trackNFT.on('TrackMinted', async (tokenId, trackId, creators, shares) => {
      await this.handleTrackMinted(tokenId, trackId, creators, shares)
    })
    
    // Listen for RoyaltyPaid events
    this.trackNFT.on('RoyaltyPaid', async (tokenId, payer, amount) => {
      await this.handleRoyaltyPaid(tokenId, payer, amount)
    })
  }
  
  private async handleTrackMinted(tokenId, trackId, creators, shares) {
    await this.prisma.track.update({
      where: { id: trackId },
      data: {
        nftTokenId: tokenId.toString(),
        nftContractAddr: process.env.TRACK_NFT_ADDRESS,
        royaltySplits: creators.map((c, i) => ({ address: c, share: shares[i] }))
      }
    })
  }
}
```

### Event Handling Flow
```
1. Contract emits event
2. Backend listener catches event
3. Parse event data
4. Update database
5. Notify frontend via WebSocket
6. Cache balances in Redis
```

### Subtasks
- [ ] Create `BlockchainListener` service
- [ ] Implement event handlers
- [ ] Add reconnection logic
- [ ] Cache balances in Redis
- [ ] Add balance refresh API
- [ ] Handle chain reorgs
- [ ] Add event history sync
- [ ] Create admin monitoring

### Definition of Done
- NFT mints appear in DB immediately
- Payments tracked accurately
- Balances cached and fresh

---

## E9-T3: Fake Payments (Dev Mode)

**Priority:** 🟡 P2 MEDIUM  
**Points:** 3  
**Depends on:** E9-T2

### Description
Simulated payments for development and testing.

### Acceptance Criteria
- [ ] Dev mode flag
- [ ] Fake payment API
- [ ] Simulated revenue generation
- [ ] Test payout flows
- [ ] Clear dev vs prod

### Technical Requirements

```typescript
// apps/api/src/modules/payments/fake-payments.service.ts
@Injectable()
export class FakePaymentsService {
  constructor(
    private prisma: PrismaService,
    private payments: PaymentsService
  ) {}
  
  // Only works in development
  async simulateStreamPayment(trackId: string, amount: number): Promise<Payment> {
    if (process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException('Only in dev mode')
    }
    
    return this.payments.createPayment({
      type: PaymentType.STREAM_REVENUE,
      trackId,
      amount,
      currency: 'USDC',
      status: PaymentStatus.COMPLETED,
      metadata: { simulated: true }
    })
  }
  
  async simulateTip(trackId: string, fromUserId: string, amount: number): Promise<Payment> {
    // ...
  }
  
  async simulateLicenseSale(trackId: string, amount: number): Promise<Payment> {
    // ...
  }
  
  // Generate random revenue for testing
  async generateTestRevenue(hours: number = 24): Promise<void> {
    const tracks = await this.prisma.track.findMany({ where: { isPublic: true } })
    
    for (const track of tracks) {
      const plays = Math.floor(Math.random() * 100)
      for (let i = 0; i < plays; i++) {
        await this.simulateStreamPayment(track.id, 0.001 + Math.random() * 0.005)
      }
    }
  }
}
```

### Dev API Endpoints
```
POST /api/v1/dev/simulate/stream    # Simulate stream payment
POST /api/v1/dev/simulate/tip       # Simulate tip
POST /api/v1/dev/simulate/license   # Simulate license sale
POST /api/v1/dev/generate/revenue   # Generate random revenue
GET  /api/v1/dev/reset              # Reset all payments
```

### Subtasks
- [ ] Create `FakePaymentsService`
- [ ] Add dev mode guard
- [ ] Create simulation endpoints
- [ ] Add revenue generator
- [ ] Create seed data script
- [ ] Add clear markers in UI for fake data
- [ ] Document dev mode usage

### Definition of Done
```bash
# Generate test data
curl -X POST http://localhost:4000/api/v1/dev/generate/revenue

# Check balances
curl http://localhost:4000/api/v1/payments/balance
# → Shows simulated earnings
```

---

## Dependencies Graph

```
E1-T2 (Docker)
    │
    ▼
E9-T1 (Contracts) ◀────── Hardhat node in Docker
    │
    ▼
E9-T2 (Blockchain Sync)
    │
    ▼
E9-T3 (Fake Payments)
```

---

## Testnet Deployment

### Polygon Mumbai
```bash
# Deploy
npx hardhat run scripts/deploy.ts --network polygonMumbai

# Verify
npx hardhat verify --network polygonMumbai <TrackNFT_ADDRESS> <constructor_args>
```

### Faucets
- Polygon Mumbai: https://faucet.polygon.technology/
- Base Sepolia: https://www.coinbase.com/faucets/base-sepolia-faucet

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| Private key exposure | Use env vars, never commit |
| Reentrancy | ReentrancyGuard, checks-effects-interactions |
| Integer overflow | Solidity 0.8+ built-in checks |
| Access control | Ownable, role-based |
| Front-running | Not critical for this use case |
