# E20: Web3 UX & Mainnet — Agent Prompts

> **Goal:** User-facing Web3: purchase, claim, display NFTs, mainnet prep
> **Sprint:** 3
> **Owner:** Frontend / Web3
> **Source:** E9, E15 "Problems/Not Implemented"

---

## E20-T1: Web3 App Integration

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class Web3 frontend engineer'
    target = integrate Web3 components into main app UI
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = minimal bundle impact
    tech stack = ['Vue 3', 'wagmi', 'viem', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Integrate Web3 components into main DAWW3 application.
Connect wallet and network selectors to app navigation.

{{{{ #CUSTOMER PROMT

Frontend Web3 components не интегрированы в main app. Нужно:
- Wallet button в header
- Network selector в UI
- Balance display
- Connection state в app state
- Lazy loading для Web3

}}}}

<<<<<<#RECOMMENDED TASKS

WEB3-APP-1. Header Integration
- Add wallet button to app header
- Show address when connected
- Show balance indicator
- Disconnect option
- Mobile responsive

WEB3-APP-2. Network Selector Placement
- Network badge/indicator
- Quick network switch
- Wrong network warning
- Network change toast
- Persist preference

WEB3-APP-3. App State Integration
- Pinia store for Web3 state
- Connection status
- Chain ID
- Address
- Balance

WEB3-APP-4. Route Guards
- Protect Web3 routes
- Redirect if not connected
- Network check
- Wallet prompt
- Error handling

WEB3-APP-5. Lazy Loading
- Dynamic import for Web3 modules
- Chunk splitting
- Preload on hover
- Fallback loading state
- Bundle size optimization

WEB3-APP-6. Error Handling
- User-friendly error messages
- Transaction rejection handling
- Network error recovery
- Retry mechanisms
- Support link

🏁 Definition of Done
- Wallet connects from header
- Network switches smoothly
- Web3 state synced
- Routes protected appropriately
- Bundle size impact < 50KB

>>>>>>

]]]]
```

---

## E20-T2: Transaction Confirmation UI

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class blockchain UX engineer'
    target = implement transaction confirmation and status UI
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = real-time status updates
    tech stack = ['Vue 3', 'viem', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement transaction confirmation UI for DAWW3.
Clear feedback during transaction lifecycle.

{{{{ #CUSTOMER PROMT

Transaction confirmation UI не реализован. Нужно:
- Pre-transaction summary
- Pending transaction indicator
- Confirmation count
- Success/failure state
- Transaction history

}}}}

<<<<<<#RECOMMENDED TASKS

TX-UI-1. Transaction Modal
- Transaction summary
- Gas estimate display
- Total cost (gas + value)
- Confirm/cancel buttons
- Loading state

TX-UI-2. Pending Transaction Indicator
- Global pending indicator
- Transaction in progress toast
- Animation/spinner
- Click to expand details
- Timeout warning

TX-UI-3. Confirmation Progress
- Show block confirmations
- Progress bar/counter
- Expected time estimate
- Speed up option
- Cancel option (if supported)

TX-UI-4. Result States
- Success celebration
- Transaction hash link
- Failure explanation
- Retry option
- Support contact

TX-UI-5. Transaction History
- Recent transactions list
- Status per transaction
- Filter by type
- Block explorer links
- Copy hash

TX-UI-6. Gas Estimation
- Display gas price options
- Slow/normal/fast presets
- Custom gas input
- Total cost update
- Network congestion indicator

🏁 Definition of Done
- User understands transaction before signing
- Pending state clearly visible
- Confirmation progress shown
- Success/failure clear
- Can review transaction history

>>>>>>

]]]]
```

---

## E20-T3: License Purchase Flow

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class e-commerce UX engineer'
    target = implement end-to-end license purchase flow
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = smooth checkout experience
    tech stack = ['Vue 3', 'viem', 'Solidity', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement license purchase flow for DAWW3 tracks.
Complete checkout from browse to confirmation.

{{{{ #CUSTOMER PROMT

License purchase flow UI не реализован. Нужно:
- License type selection
- Price display
- Checkout flow
- Payment confirmation
- License delivery

}}}}

<<<<<<#RECOMMENDED TASKS

LICENSE-1. License Type Display
- Show available license types per track
- Price per license type
- License terms summary
- Comparison view
- Artist-set pricing

LICENSE-2. License Selection
- License picker component
- Selected license details
- Terms expansion
- Add to cart (optional)
- Proceed to checkout

LICENSE-3. Checkout Flow
- Order summary
- Wallet connection check
- Sufficient balance check
- Gas estimate
- Confirm purchase

LICENSE-4. Smart Contract Interaction
- Call LicenseManager.purchaseLicense
- Handle transaction states
- Wait for confirmation
- Emit events
- Error handling

LICENSE-5. License Delivery
- Show purchased license
- Download license PDF
- Add to user's licenses
- Access unlock
- Email confirmation (optional)

LICENSE-6. Purchase History
- User's purchased licenses
- License details view
- Expiration tracking
- Renewal option
- Transfer option (if allowed)

🏁 Definition of Done
- User can browse and select license
- Checkout completes successfully
- License appears in user's collection
- License grants appropriate access
- Transaction recorded on chain

>>>>>>

]]]]
```

---

## E20-T4: Royalty Claim UI

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class DeFi UX engineer'
    target = implement royalty claim and withdrawal UI
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = accurate balance display
    tech stack = ['Vue 3', 'viem', 'The Graph', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement royalty claim UI for DAWW3 artists.
View earnings and withdraw royalties.

{{{{ #CUSTOMER PROMT

Royalty claim UI не реализован. Нужно:
- Earnings dashboard
- Pending royalties display
- Claim/withdraw button
- Transaction history
- Payout breakdown

}}}}

<<<<<<#RECOMMENDED TASKS

ROYALTY-1. Earnings Dashboard
- Total earnings (all time)
- Pending/claimable balance
- Recent earnings
- Earnings chart (over time)
- Per-track breakdown

ROYALTY-2. Royalty Source Breakdown
- Streams revenue
- License sales
- Tips received
- Secondary sales
- Percentages chart

ROYALTY-3. Claim Interface
- Claimable balance
- Merkle claim (if applicable)
- Minimum claim threshold
- Gas cost vs claim amount
- Claim button

ROYALTY-4. Withdraw Flow
- Select amount
- Destination address
- Gas estimation
- Confirm withdrawal
- Transaction tracking

ROYALTY-5. Payout History
- Historical payouts
- Transaction links
- Date and amount
- Export to CSV
- Tax reporting support

ROYALTY-6. Notification Settings
- Alert on new royalties
- Threshold notifications
- Email preferences
- Push notification option
- Frequency settings

🏁 Definition of Done
- Artist sees earnings clearly
- Can claim pending royalties
- Transaction completes successfully
- History tracks all payouts
- Breakdown helps understand revenue

>>>>>>

]]]]
```

---

## E20-T5: NFT Gallery & Display

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class NFT marketplace UX engineer'
    target = implement NFT gallery and display components
    test = true

    code style = [DRY, Best practice]
    write docs = true
    deep thinking = true
    performance = fast loading, lazy images
    tech stack = ['Vue 3', 'IPFS', 'The Graph', 'TypeScript']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Implement NFT gallery and display for DAWW3.
Show user's track NFTs and browse marketplace.

{{{{ #CUSTOMER PROMT

NFT gallery/display components не реализованы. Нужно:
- User's NFT collection
- NFT detail view
- Marketplace browse
- NFT metadata display
- Audio preview in NFT

}}}}

<<<<<<#RECOMMENDED TASKS

NFT-1. NFT Collection View
- Grid of user's NFTs
- Thumbnail images
- Track title overlay
- Ownership badge
- Filter/sort options

NFT-2. NFT Detail Page
- Large cover art
- Track metadata
- Ownership history
- Current owner
- License information

NFT-3. Audio Preview
- Embedded player
- Sample/preview length
- Waveform display
- Play counter
- Full access for owners

NFT-4. Marketplace Browse
- All available NFTs
- Filter by genre, artist, price
- Sort by recent, popular, price
- Search functionality
- Pagination/infinite scroll

NFT-5. Metadata Display
- Title, artist, album
- Creation date
- Token ID and contract
- IPFS links
- Royalty split info

NFT-6. Share & Embed
- Share to social media
- Embed code for websites
- QR code for NFT
- Deep link to app
- OpenSea/marketplace links

🏁 Definition of Done
- User can view owned NFTs
- NFT details complete and accurate
- Audio plays for preview/owners
- Marketplace browseable
- Sharing works across platforms

>>>>>>

]]]]
```

---

## E20-T6: Mainnet Deployment Prep

```
[[[[ #SETTINGS

    mode = agent - do it until it works and test it
    expertize = 'you are world class blockchain deployment engineer'
    target = prepare for mainnet smart contract deployment
    test = true

    code style = [DRY, Best practice, secure]
    write docs = true
    deep thinking = true
    performance = gas optimized
    tech stack = ['Hardhat', 'Solidity', 'Safe', 'Defender']
    remove unused files and code fragments = true

]]]]

[[[[ #PROMT

Prepare DAWW3 smart contracts for mainnet deployment.
Multi-sig, timelock, monitoring, final audit.

{{{{ #CUSTOMER PROMT

Mainnet deployment preparation отсутствует. Нужно:
- Multi-sig wallet setup
- Timelock для admin functions
- OpenZeppelin Defender integration
- Final security checks
- Deployment documentation

}}}}

<<<<<<#RECOMMENDED TASKS

MAINNET-1. Multi-sig Setup
- Deploy Gnosis Safe
- Configure signers (3-of-5 recommended)
- Transfer ownership to Safe
- Test multi-sig flow
- Document signer responsibilities

MAINNET-2. Timelock Implementation
- Deploy TimelockController
- Set delay (24-48 hours)
- Connect to contracts
- Test timelock flow
- Emergency bypass (if any)

MAINNET-3. OpenZeppelin Defender
- Create Defender account
- Import contracts
- Setup Admin
- Configure Autotasks
- Alert rules

MAINNET-4. Final Security Checklist
- All Slither issues resolved
- Gas optimization complete
- Access control verified
- Reentrancy protection
- External audit complete (or scheduled)

MAINNET-5. Deployment Script
- Deterministic deployment
- Constructor parameters
- Verification script
- Post-deployment setup
- Rollback plan

MAINNET-6. Documentation
- Contract addresses document
- ABI publication
- Integration guide
- Upgrade procedure
- Incident response plan

🏁 Definition of Done
- Multi-sig controls admin
- Timelock delays critical changes
- Defender monitors contracts
- All security checks pass
- Ready for mainnet deploy

>>>>>>

]]]]
```

---

## Dependencies Graph

```
E15 (Web3 Production) ✅
    │
    ▼
E20-T1 (App Integration)
    │
    ├─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼
E20-T2 (TX UI)       E20-T5 (NFT Gallery)  E20-T6 (Mainnet Prep)
    │                     │
    ▼                     │
E20-T3 (License Flow)     │
    │                     │
    ▼                     │
E20-T4 (Royalty Claim) ◀──┘
    │
    ▼
[Web3 UX Complete]
```

---

## TOTEM Alignment

| TOTEM Reference | Implementation |
|-----------------|----------------|
| 3-ECONOMY.md | E20-T3 (License), E20-T4 (Royalty) |
| Dynamic Licensing | License purchase with types |
| Instant Payouts | Royalty claim UI |
| NFT Ownership | E20-T5 (Gallery) |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Mainnet deployment errors | Critical | Multi-sig, timelock, staged rollout |
| User confusion with Web3 | High | Clear UX, tutorials, support |
| Gas cost concerns | Medium | Batch operations, L2 option |
| Contract bugs | Critical | External audit before mainnet |
