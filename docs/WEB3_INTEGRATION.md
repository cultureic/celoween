# 🎃 Celoween Web3 Integration

## Overview
Celoween uses smart contracts on Celo blockchain for transparent contest management and Biconomy Smart Accounts for gasless voting.

---

## Smart Contracts

### ContestFactory
**Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3` (Local)  
**Purpose:** Manages contest creation and lifecycle

**Key Functions:**
- `createContest()` - Deploy a new contest
- `getContest(uint256)` - Fetch contest details
- `updateContestStatus()` - Change contest phase
- `getTotalContests()` - Get total number of contests

### VotingContract
**Address:** `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` (Local)  
**Purpose:** Handles submissions and voting

**Key Functions:**
- `submitEntry()` - Submit to a contest
- `vote(uint256)` - Cast a vote
- `removeVote(uint256)` - Remove a vote
- `getSubmission()` - Get submission details
- `hasUserVoted()` - Check if user voted

---

## Gasless Voting (Biconomy)

Celoween implements gasless transactions so users can vote without paying gas fees.

### How It Works

1. **User Signs Message** - User signs a meta-transaction off-chain
2. **Relayer Submits** - Biconomy relayer submits the transaction
3. **Paymaster Pays Gas** - Biconomy paymaster covers gas costs
4. **Vote Recorded** - Vote is recorded on-chain

### Configuration

```env
NEXT_PUBLIC_ZERODEV_PROJECT_ID=e46f4ac3-404e-42fc-a3d3-1c75846538a8
```

### Implementation

```typescript
import { useContestContract } from '@/lib/hooks/useContestContract';

function VotingComponent() {
  const { castVote, isLoading, error } = useContestContract();

  const handleVote = async (submissionId: string) => {
    try {
      // This transaction is gasless via Biconomy
      const receipt = await castVote(submissionId);
      console.log('Vote cast:', receipt);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <button onClick={() => handleVote('123')} disabled={isLoading}>
      {isLoading ? 'Voting...' : 'Vote'}
    </button>
  );
}
```

---

## Custom Hook: useContestContract

Located at: `lib/hooks/useContestContract.ts`

### Functions

#### createContest(params)
Admin only. Creates a new contest on-chain.

```typescript
const { createContest } = useContestContract();

await createContest({
  title: 'Spooky Costume Contest',
  metadataURI: 'ipfs://...',
  prizePool: '500',
  prizeToken: '0x...', // cUSD address
  startTime: Math.floor(Date.now() / 1000),
  endTime: Math.floor(Date.now() / 1000) + 86400 * 10,
  votingEndTime: Math.floor(Date.now() / 1000) + 86400 * 15,
});
```

#### submitEntry(contestId, metadataURI)
Submit an entry to a contest.

```typescript
const { submitEntry } = useContestContract();

await submitEntry('1', 'ipfs://QmXxx...');
```

#### castVote(submissionId)
Vote for a submission (gasless).

```typescript
const { castVote } = useContestContract();

await castVote('5');
```

#### removeVote(submissionId)
Remove your vote from a submission.

```typescript
const { removeVote } = useContestContract();

await removeVote('5');
```

#### hasVoted(submissionId, userAddress)
Check if a user has voted.

```typescript
const { hasVoted } = useContestContract();

const voted = await hasVoted('5', '0x...');
```

---

## Architecture: Hybrid On-chain + Off-chain

Celoween uses a hybrid approach for optimal UX and cost:

### On-Chain (Smart Contracts)
- Contest creation and prize pools
- Final vote tallies
- Prize distribution
- Immutable audit trail

### Off-Chain (Database + API)
- Contest metadata (title, description, images)
- Submission details and media
- Vote tracking for real-time updates
- User profiles and activity

### Sync Strategy

1. **Write to Chain** → Transaction submitted
2. **Wait for Confirmation** → Listen for events
3. **Update Database** → API updates Supabase
4. **UI Updates** → Real-time refresh

---

## Wallet Integration

### Privy Auth
Users can login with:
- Email (creates embedded wallet)
- MetaMask
- WalletConnect
- Other Web3 wallets

```typescript
import { usePrivy } from '@privy-io/react-auth';

function LoginButton() {
  const { login, authenticated, user } = usePrivy();

  if (authenticated) {
    return <div>Welcome {user?.wallet?.address}</div>;
  }

  return <button onClick={login}>Login</button>;
}
```

---

## Network Configuration

### Celo Mainnet
- **Chain ID:** 42220
- **RPC:** https://forno.celo.org
- **Explorer:** https://celoscan.io

### Alfajores Testnet
- **Chain ID:** 44787
- **RPC:** https://alfajores-forno.celo-testnet.org
- **Explorer:** https://alfajores.celoscan.io

### Local (Hardhat)
- **Chain ID:** 31337
- **RPC:** http://localhost:8545

Current deployment: **Local** (for development)

---

## Gas Optimization

### Batching
- Vote removal and new vote can be combined
- Multiple status updates in one transaction

### Off-Chain First
- Store heavy data (images, descriptions) off-chain
- Only store critical hashes on-chain
- Use IPFS for decentralized storage

### Lazy Minting
- Contests aren't deployed until activated
- Saves gas for draft contests

---

## Security Considerations

### Admin Controls
- Only admin wallet can create contests
- Contract ownership via OpenZeppelin Ownable
- Emergency pause functionality (if needed)

### Vote Integrity
- One vote per user per submission
- Cannot vote for own submission
- Votes only during VOTING phase

### Reentrancy Protection
- All state-changing functions use ReentrancyGuard
- Checks-Effects-Interactions pattern

---

## Testing

Run contract tests:
```bash
npx hardhat test
```

Deploy to local network:
```bash
npx hardhat node
npx hardhat run scripts/deploy-contests.cjs --network localhost
```

---

## Future Enhancements

- [ ] NFT badges for winners
- [ ] Weighted voting based on reputation
- [ ] Multi-signature contest creation
- [ ] DAO governance for platform decisions
- [ ] Prize pool staking rewards
