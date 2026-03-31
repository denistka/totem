# E9: Web3 / Monetization — Agent Prompts

---

## E9-T1: Smart Contracts (Hardhat)

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Solidity smart contract developer'
    target = TrackNFT and RoyaltySplit contracts
    test = true

    code style = [DRY, Best practice, gas optimization, security]
    write docs = true
    deep thinking = true
    performance = optimized gas costs
    tech stack = ['hardhat@2.22', 'solidity@0.8.24', 'openzeppelin@5', 'ethers@6']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Create smart contracts for DAWW3 track ownership and royalties.
ERC-721 for NFT, ERC-2981 for royalties, custom splits.

{{{{ #CUSTOMER PROMT

Нужны смарт-контракты:
- TrackNFT (ERC-721) для ownership
- Royalty splits для со-авторов
- LicenseManager для лицензий
- Deploy на Polygon

}}}}

<<<<<<#RECOMMENDED TASKS

SOL-1. TrackNFT Contract
File: apps/contracts/contracts/TrackNFT.sol

Features:
- ERC-721 + ERC721URIStorage
- ERC-2981 royalties
- Multi-creator support
- Custom royalty splits

Functions:
- mintTrack(trackId, metadataURI, creators[], shares[])
- distributeRoyalty(tokenId) payable
- getRoyaltySplit(tokenId, salePrice)
- deactivateTrack(tokenId)

SOL-2. LicenseManager Contract
File: apps/contracts/contracts/LicenseManager.sol

License types:
- STREAM (one-time)
- DOWNLOAD (1 year)
- SYNC (1 year)
- COMMERCIAL (1 year)

Functions:
- setTrackPrices(tokenId, prices)
- purchaseLicense(tokenId, licenseType) payable
- hasValidLicense(tokenId, licensee, type)

SOL-3. Gas Optimization
- Use calldata for arrays
- Pack structs efficiently
- Use unchecked where safe
- Minimize storage writes

SOL-4. Security
- ReentrancyGuard
- Ownable access control
- Input validation
- Integer overflow (Solidity 0.8+)

SOL-5. Tests
File: apps/contracts/test/

- TrackNFT.test.ts
- LicenseManager.test.ts
- Full coverage
- Edge cases

SOL-6. Deploy Scripts
File: apps/contracts/scripts/deploy.ts

- Deploy to local Hardhat
- Deploy to testnet
- Verify on explorer

SOL-7. Hardhat Config
File: apps/contracts/hardhat.config.ts

Networks:
- hardhat (local)
- polygonMumbai (testnet)
- polygon (mainnet)
- baseSepolia (testnet)
- base (mainnet)

SOL-8. Documentation
- Contract interfaces
- Deployment guide
- Integration examples

🏁 Definition of Done
- Contracts compile
- All tests pass
- Deploy to local works
- Deploy to testnet works
- Verified on explorer

>>>>>>

]]]]
```

---

## E9-T2: Backend ↔ Blockchain

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class blockchain integration engineer'
    target = event listeners and state sync with blockchain
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = reliable event processing
    tech stack = ['nestjs', 'ethers@6', 'prisma', 'redis']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement blockchain event listener and state sync.
Listen for NFT mints, royalty payments, sync to database.

{{{{ #CUSTOMER PROMT

Нужна синхронизация с блокчейном:
- Слушать события контрактов
- Синхронизировать NFT mints в БД
- Отслеживать платежи
- Кэшировать балансы

}}}}

<<<<<<#RECOMMENDED TASKS

BC-1. BlockchainListener Service
File: apps/api/src/modules/payments/blockchain.listener.ts

@Injectable()
class BlockchainListener implements OnModuleInit {
  private provider: ethers.Provider
  private trackNFT: ethers.Contract
  
  async onModuleInit()
  private async startListening()
  private async handleTrackMinted(tokenId, trackId, creators, shares)
  private async handleRoyaltyPaid(tokenId, payer, amount)
}

BC-2. Event Handlers
- TrackMinted → Update track in DB
- RoyaltyPaid → Record payment
- Transfer → Update ownership

BC-3. Reconnection Logic
- Handle provider disconnect
- Exponential backoff
- Resume from last block

BC-4. Balance Caching
Redis keys:
- balance:{userId} → cached balance
- balance:{userId}:updated → timestamp

Methods:
- cacheBalance(userId, balance)
- getCachedBalance(userId)
- invalidateBalance(userId)

BC-5. Chain Reorg Handling
- Store block number with events
- On reorg, replay affected blocks
- Idempotent handlers

BC-6. Event History Sync
- Sync past events on startup
- From deployment block
- Handle large ranges

BC-7. Admin Monitoring
Metrics:
- Last processed block
- Event processing latency
- Error count

BC-8. Balance Refresh API
GET /api/v1/payments/balance

- Check cache first
- Refresh if stale
- Return with timestamp

🏁 Definition of Done
- Events sync to DB
- Payments tracked
- Balances cached
- Reconnection works

>>>>>>

]]]]
```

---

## E9-T3: Fake Payments (Dev Mode)

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class testing systems engineer'
    target = simulated payments for development/testing
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast test data generation
    tech stack = ['nestjs', 'prisma', 'typescript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement fake payment system for development mode.
Simulate revenue, tips, license sales for testing.

{{{{ #CUSTOMER PROMT

Нужны fake платежи для разработки:
- Симуляция stream revenue
- Симуляция tips
- Генерация тестовых данных
- Только в dev mode

}}}}

<<<<<<#RECOMMENDED TASKS

DEV-1. FakePaymentsService
File: apps/api/src/modules/payments/fake-payments.service.ts

@Injectable()
class FakePaymentsService {
  constructor(
    private prisma: PrismaService,
    private payments: PaymentsService
  )
  
  async simulateStreamPayment(trackId, amount): Promise<Payment>
  async simulateTip(trackId, fromUserId, amount): Promise<Payment>
  async simulateLicenseSale(trackId, amount): Promise<Payment>
  async generateTestRevenue(hours: number): Promise<void>
}

DEV-2. Dev Mode Guard
- Check NODE_ENV === 'development'
- Throw ForbiddenException in production
- Clear error message

DEV-3. Simulation Endpoints
POST /api/v1/dev/simulate/stream
POST /api/v1/dev/simulate/tip
POST /api/v1/dev/simulate/license
POST /api/v1/dev/generate/revenue
GET  /api/v1/dev/reset

DEV-4. Revenue Generator
- Get all public tracks
- Random plays for each
- Realistic distribution (power law)
- Configurable time range

DEV-5. Payment Creation
- Create Payment records
- Mark as simulated in metadata
- Trigger normal payment flow
- Update balances

DEV-6. UI Markers
- Flag fake data in responses
- UI shows warning badge
- Clear visual distinction

DEV-7. Reset Function
- Clear all fake payments
- Reset balances
- Keep real data (if any)

DEV-8. Seed Data Script
File: apps/api/prisma/seed-payments.ts

- Generate weeks of fake data
- Realistic patterns
- Run with: pnpm db:seed-payments

🏁 Definition of Done
- Fake payments work in dev
- Blocked in production
- Test data realistic
- Can reset easily

>>>>>>

]]]]
```
