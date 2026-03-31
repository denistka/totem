# E15: Web3 Production Readiness — Agent Prompts

> **Goal:** Contract deployment, wallet integration, security audit, testnet, event indexing
> **Sprint:** 2
> **Owner:** Web3 / Backend
> **Source:** E9 Web3 unresolved items (prioritized)

---

## E15-T1: Smart Contract Dependencies & Testing

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Solidity developer'
    target = install dependencies and verify contract compilation and tests
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast test execution
    tech stack = ['Hardhat', 'OpenZeppelin', 'Solidity', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Install OpenZeppelin and verify all smart contract tests pass.
Fix any compilation or test failures.

{{{{ #CUSTOMER PROMT

OpenZeppelin contracts не установлены. Нужно:
- Установить @openzeppelin/contracts
- Исправить импорты в контрактах
- Запустить все тесты
- Исправить failing tests
- Gas optimization check

}}}}

<<<<<<#RECOMMENDED TASKS

CONTRACT-1. Install Dependencies
- Add @openzeppelin/contracts@5.0
- Add @openzeppelin/contracts-upgradeable
- Verify import paths
- Update remappings if needed
- Lock versions

CONTRACT-2. Fix Contract Imports
- Update import paths
- Verify ERC-721 inheritance
- Verify ERC-2981 inheritance
- Check interface compatibility
- Remove unused imports

CONTRACT-3. Run All Tests
- npx hardhat test
- Fix compilation errors
- Fix test failures
- Add missing test cases
- 100% test pass rate

CONTRACT-4. Gas Optimization
- Run gas reporter
- Identify expensive functions
- Optimize storage patterns
- Batch operations
- Compare to gas targets

CONTRACT-5. Coverage Report
- Install solidity-coverage
- Run coverage
- Target > 90% coverage
- Add tests for uncovered paths
- Document edge cases

CONTRACT-6. Static Analysis
- Run Slither
- Run MythX (optional)
- Fix critical issues
- Document known issues
- Security best practices

🏁 Definition of Done
- All contracts compile
- All tests pass
- Gas costs reasonable
- Coverage > 90%
- No critical security issues

>>>>>>

]]]]
```

---

## E15-T2: Frontend Wallet Integration

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Web3 frontend engineer'
    target = implement wallet connection and transaction signing
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast wallet detection
    tech stack = ['ethers.js', 'wagmi', 'viem', 'Vue 3', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement wallet connection for DAWW3 frontend.
Support MetaMask, WalletConnect, and Coinbase Wallet.

{{{{ #CUSTOMER PROMT

Frontend wallet integration отсутствует. Нужно:
- Connect wallet button
- MetaMask, WalletConnect, Coinbase support
- Network switching
- Transaction signing
- Balance display

}}}}

<<<<<<#RECOMMENDED TASKS

WALLET-1. Web3 Provider Setup
- Install viem + wagmi (or ethers.js v6)
- Configure chains (mainnet, polygon, local)
- Provider factory
- Auto-detect installed wallets
- SSR-safe initialization

WALLET-2. Wallet Connectors
- MetaMask connector
- WalletConnect v2 connector
- Coinbase Wallet connector
- Injected (generic) connector
- Safe (Gnosis) connector

WALLET-3. Connection UI
- Connect button component
- Wallet selector modal
- Connected state display
- Address truncation
- ENS name resolution

WALLET-4. Network Management
- Current network display
- Network switch request
- Add network (Polygon)
- Wrong network warning
- Chain ID validation

WALLET-5. Transaction Handling
- Sign message
- Send transaction
- Transaction status tracking
- Confirmation waiting
- Error handling & display

WALLET-6. Vue Composables
- useWallet composable
- useBalance composable
- useNetwork composable
- useContract composable
- useTransaction composable

🏁 Definition of Done
- Multiple wallets connect
- Network switching works
- Transactions sign correctly
- Balance displays
- Error messages clear

>>>>>>

]]]]
```

---

## E15-T3: Testnet Deployment & Verification

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class smart contract deployment engineer'
    target = deploy and verify contracts on Polygon Mumbai testnet
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = reliable deployment
    tech stack = ['Hardhat', 'Polygonscan', 'ethers.js']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Deploy DAWW3 contracts to Polygon Mumbai testnet.
Verify on Polygonscan, document addresses.

{{{{ #CUSTOMER PROMT

Testnet deployment не выполнен. Нужно:
- Deploy to Polygon Mumbai
- Verify contracts on Polygonscan
- Document deployed addresses
- Test basic operations
- Setup deployment scripts

}}}}

<<<<<<#RECOMMENDED TASKS

DEPLOY-1. Deployment Configuration
- hardhat.config.ts networks
- Mumbai RPC endpoint
- Deployer wallet setup
- Gas price configuration
- Nonce management

DEPLOY-2. Deployment Script
- Deploy TrackNFT
- Deploy RoyaltySplit
- Deploy LicenseManager
- Link contracts
- Initial configuration

DEPLOY-3. Contract Verification
- Polygonscan API key
- Verify TrackNFT
- Verify RoyaltySplit
- Verify LicenseManager
- Source code match

DEPLOY-4. Post-Deployment Setup
- Grant roles
- Set initial parameters
- Register in backend
- Update environment vars
- Smoke tests

DEPLOY-5. Address Documentation
- contracts/deployments/mumbai.json
- README with addresses
- Environment variable template
- Block explorer links
- Deployment timestamp

DEPLOY-6. Integration Testing
- Mint test NFT
- Transfer test
- Royalty distribution test
- License purchase test
- Event verification

🏁 Definition of Done
- Contracts deployed to Mumbai
- Verified on Polygonscan
- Addresses documented
- Basic operations work
- Integration tests pass

>>>>>>

]]]]
```

---

## E15-T4: Event Indexing with The Graph

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class blockchain indexing engineer'
    target = implement subgraph for efficient event querying
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = real-time event indexing
    tech stack = ['The Graph', 'GraphQL', 'AssemblyScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement subgraph for DAWW3 contract event indexing.
Enable efficient querying of blockchain data.

{{{{ #CUSTOMER PROMT

Event indexing service отсутствует. Нужно:
- Subgraph definition
- Event handlers
- Entity schemas
- Deploy to The Graph
- GraphQL queries

}}}}

<<<<<<#RECOMMENDED TASKS

GRAPH-1. Subgraph Setup
- graph init
- subgraph.yaml configuration
- Contract ABIs
- Start block configuration
- Network selection

GRAPH-2. Schema Definition
- Track entity
- Creator entity
- License entity
- Payment entity
- Royalty entity

GRAPH-3. Event Handlers
- TrackMinted handler
- RoyaltyPaid handler
- LicensePurchased handler
- Transfer handler
- Approval handler

GRAPH-4. Mappings
- AssemblyScript handlers
- Entity creation/update
- Relationship management
- Derived fields
- Aggregations

GRAPH-5. Deployment
- Deploy to hosted service
- Deploy to Subgraph Studio
- Mumbai subgraph
- Mainnet subgraph (later)
- Version management

GRAPH-6. Frontend Integration
- GraphQL client setup
- Query hooks
- Real-time subscriptions
- Caching strategy
- Error handling

🏁 Definition of Done
- Subgraph indexes events
- GraphQL queries work
- Frontend uses subgraph
- Real-time updates
- Documentation complete

>>>>>>

]]]]
```

---

## E15-T5: Royalty Distribution Optimization

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DeFi protocol engineer'
    target = optimize royalty distribution for gas efficiency
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = minimize gas per distribution
    tech stack = ['Solidity', 'Hardhat', 'MerkleTree']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Optimize royalty distribution in DAWW3 contracts.
Implement batch payments and Merkle tree claims.

{{{{ #CUSTOMER PROMT

Royalty distribution не оптимизирован. Нужно:
- Batch payment processing
- Merkle tree claims
- Gas-efficient splits
- Withdraw pattern
- Distribution caps

}}}}

<<<<<<#RECOMMENDED TASKS

ROYALTY-1. Batch Distribution
- Batch multiple recipients
- Gas limit handling
- Partial batch success
- Retry failed recipients
- Receipt generation

ROYALTY-2. Merkle Tree Claims
- Off-chain Merkle root calculation
- On-chain verification
- Claim function
- Double-claim prevention
- Proof generation API

ROYALTY-3. Pull vs Push Pattern
- Withdraw pattern implementation
- Balance tracking per address
- Claim any time
- No gas for recipients initially
- Unclaimed funds handling

ROYALTY-4. Split Optimization
- Fixed-point arithmetic
- Rounding handling
- Minimum distribution threshold
- Dust collection
- Split caching

ROYALTY-5. Distribution Caps
- Per-transaction cap
- Per-period cap
- Rate limiting
- Emergency pause
- Cap adjustment governance

ROYALTY-6. Analytics & Reporting
- Distribution history
- Per-artist totals
- Period summaries
- Export functionality
- Tax reporting support

🏁 Definition of Done
- Batch payments work
- Merkle claims efficient
- Gas costs reduced 50%+
- All edge cases handled
- Analytics available

>>>>>>

]]]]
```

---

## E15-T6: Security Audit Preparation

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class smart contract security auditor'
    target = prepare contracts for professional security audit
    test = true

    code style = [DRY, Best practice, secure]
    write docs = true
    deep thinking = true
    performance = n/a
    tech stack = ['Solidity', 'Slither', 'Mythril', 'Echidna']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Prepare DAWW3 smart contracts for security audit.
Run automated tools, fix issues, document assumptions.

{{{{ #CUSTOMER PROMT

Smart contract audit не проведён. Нужно:
- Automated security analysis
- Fuzz testing
- Formal verification (critical paths)
- Access control review
- Audit documentation

}}}}

<<<<<<#RECOMMENDED TASKS

AUDIT-1. Static Analysis
- Run Slither full analysis
- Fix high/medium issues
- Document accepted risks
- Configure false positives
- CI integration

AUDIT-2. Fuzz Testing
- Echidna property tests
- Invariant definitions
- Edge case generation
- Long-running campaigns
- Coverage analysis

AUDIT-3. Access Control Review
- Document all roles
- Privilege escalation check
- Admin key management
- Timelock requirements
- Multi-sig review

AUDIT-4. Reentrancy Check
- All external calls
- State before external call
- CEI pattern verification
- ReentrancyGuard usage
- Cross-function reentrancy

AUDIT-5. Economic Analysis
- Token economics review
- Overflow/underflow
- Rounding attacks
- Flash loan vectors
- MEV considerations

AUDIT-6. Audit Documentation
- System overview
- Contract descriptions
- Trust assumptions
- Known limitations
- External dependencies

🏁 Definition of Done
- No high/critical issues
- Fuzz tests pass
- Access control documented
- Audit package ready
- Auditor can start immediately

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E9 (Web3) ✅
    │
    ▼
E15-T1 (Contract Dependencies) ← Sprint 2 START
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
E15-T2 (Wallet)     E15-T3 (Testnet)     E15-T6 (Audit Prep)
    │                     │
    └─────────┬───────────┘
              ▼
        E15-T4 (Event Indexing)
              │
              ▼
        E15-T5 (Royalty Optimization)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Security vulnerabilities | Critical | Audit, fuzz testing, bug bounty |
| Gas costs too high | High | Optimization, L2 deployment |
| Wallet UX friction | Medium | Multiple connectors, clear messaging |
| Subgraph downtime | Medium | Self-hosted fallback |
