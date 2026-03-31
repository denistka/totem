# ⛓️ E9: Web3 & Smart Contracts — QA Test Specifications

> **Epic:** E9 - Smart Contracts & Blockchain Integration
> **Status:** ✅ DONE
> **Focus:** TrackNFT, RoyaltySplit, ERC-721, ERC-2981, API sync

---

## Test Areas

### E9-QA-1: TrackNFT Contract
```solidity
// Hardhat test
describe('TrackNFT', () => {
  it('mints NFT with metadata URI', async () => {
    const tx = await trackNFT.mintTrack(
      'track-001', 
      'ipfs://QmHash...',
      [artist.address],
      [10000]
    )
    
    expect(await trackNFT.tokenURI(1)).to.equal('ipfs://QmHash...')
  })

  it('only owner can transfer', async () => {
    await trackNFT.mintTrack('track', 'uri', [artist.address], [10000])
    
    await expect(
      trackNFT.connect(attacker).transferFrom(artist.address, attacker.address, 1)
    ).to.be.reverted
  })

  it('ERC-2981 royalty info', async () => {
    await trackNFT.mintTrack('track', 'uri', [artist.address], [10000])
    
    const [receiver, amount] = await trackNFT.royaltyInfo(1, ethers.parseEther('1'))
    
    expect(receiver).to.equal(artist.address)
    expect(amount).to.equal(ethers.parseEther('0.1')) // 10% default
  })
})
```

### E9-QA-2: RoyaltySplit Contract
```solidity
describe('RoyaltySplit', () => {
  it('splits payment to multiple recipients', async () => {
    await royaltySplit.setSplit(1, [addr1, addr2], [7000, 3000])
    
    const before1 = await ethers.provider.getBalance(addr1)
    const before2 = await ethers.provider.getBalance(addr2)
    
    await royaltySplit.distribute(1, { value: ethers.parseEther('1') })
    
    const after1 = await ethers.provider.getBalance(addr1)
    const after2 = await ethers.provider.getBalance(addr2)
    
    expect(after1 - before1).to.equal(ethers.parseEther('0.7'))
    expect(after2 - before2).to.equal(ethers.parseEther('0.3'))
  })

  it('rejects invalid share sum', async () => {
    await expect(
      royaltySplit.setSplit(1, [addr1, addr2], [5000, 4000]) // Only 90%
    ).to.be.revertedWith('Shares must sum to 100%')
  })
})
```

### E9-QA-3: API Blockchain Sync
```typescript
describe('Blockchain Sync', () => {
  it('syncs minted tracks to database', async () => {
    // Mint on chain
    await trackNFT.mintTrack('track-001', 'ipfs://...', [artist], [10000])
    
    // Wait for sync
    await waitFor(() => 
      prisma.track.findUnique({ where: { tokenId: 1 } })
    , 10000)
    
    const track = await prisma.track.findUnique({ where: { tokenId: 1 } })
    expect(track).toBeDefined()
    expect(track.onChain).toBe(true)
  })

  it('syncs royalty payments', async () => {
    await royaltySplit.distribute(1, { value: ethers.parseEther('0.1') })
    
    await waitFor(() =>
      prisma.payment.findFirst({ where: { trackId: 'track-001' } })
    , 10000)
    
    const payment = await prisma.payment.findFirst({ where: { trackId: 'track-001' } })
    expect(payment.amount).toBe('0.1')
  })
})
```

---

## Gas Optimization
```solidity
describe('Gas Usage', () => {
  it('mint < 200K gas', async () => {
    const tx = await trackNFT.mintTrack('track', 'uri', [artist], [10000])
    const receipt = await tx.wait()
    expect(receipt.gasUsed).to.be.lt(200000)
  })
})
```

---

## Regression Tests

```typescript
describe('E9 Regression', () => {
  it.todo('OpenZeppelin Upgradeable contracts')
  it.todo('Multi-sig wallet deployment')
  it.todo('Mainnet gas price estimation')
  it.todo('Event listener reconnection')
})
```

---

*E9 Web3 QA — DAWW3 Project*
