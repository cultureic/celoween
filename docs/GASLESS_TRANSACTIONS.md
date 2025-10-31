# Gasless Transactions with ZeroDev

This document explains how gasless transactions are implemented for the Celoween contest platform using ZeroDev smart accounts and paymasters.

## Overview

The platform uses **ZeroDev SDK** with **Kernel v3.1** smart accounts and **EntryPoint v0.7** to provide gasless transactions for:
- 🗳️ **Voting** on submissions
- 📤 **Submitting** contest entries

All transaction gas fees are sponsored by the ZeroDev paymaster, so users don't need CELO or cUSD to interact with the platform.

## Architecture

### 1. Smart Wallet Provider (`ZeroDevSmartWalletProvider`)

Located in: `lib/contexts/ZeroDevSmartWalletProvider.tsx`

This provider:
- Creates a Kernel v3.1 smart account for each user
- Uses ECDSA validator for signature validation
- Connects to ZeroDev's bundler and paymaster services
- Executes sponsored transactions

**Key Features:**
- Automatic smart account creation on login
- Works with both email wallets and MetaMask
- Always uses Celo mainnet (forced)
- Handles transaction sponsorship automatically

### 2. Voting Provider (`VotingProvider`)

Located in: `lib/contexts/VotingProvider.tsx`

Handles gasless voting:
- `castVote(submissionId)` - Cast a gasless vote
- `removeVote(submissionId)` - Remove a vote (also gasless)

Both functions:
1. Encode the contract call
2. Execute via smart account
3. Sync to database after confirmation

### 3. Submission Provider (`SubmissionProvider`)

Located in: `lib/contexts/SubmissionProvider.tsx`

Handles gasless submissions:
- `submitEntry(params)` - Submit entry with sponsored transaction

The flow:
1. Upload image to Supabase
2. Create metadata JSON
3. Submit to smart contract (gasless)
4. Sync to database

## Smart Contract Integration

### Voting Contract

Location: `contracts/VotingContract.sol`

**Functions used:**
- `submitEntry(uint256 _contestId, string _metadataURI)` - Submit entry
- `vote(uint256 _submissionId)` - Cast vote
- `removeVote(uint256 _submissionId)` - Remove vote

### Contract ABI

Location: `lib/contracts/voting-contract.ts`

Contains the ABI and configuration for interacting with the deployed contract.

## Environment Setup

### Required Environment Variables

```env
# ZeroDev Configuration
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your-project-id

# Voting Contract (after deployment)
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0x...
```

### ZeroDev Project Setup

1. Sign up at [https://zerodev.app](https://zerodev.app)
2. Create a new project
3. Select **Celo Mainnet** (Chain ID: 42220)
4. Copy your Project ID
5. Add to `.env.local`

## Deployment Steps

### 1. Deploy ContestFactory Contract

The VotingContract requires a ContestFactory address in its constructor.

```bash
npx hardhat run scripts/deploy-contest-factory.ts --network celo
```

### 2. Deploy VotingContract

```bash
npx hardhat run scripts/deploy-voting-contract.ts --network celo
```

### 3. Update Environment

Add the deployed VotingContract address to `.env.local`:

```env
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0xYourContractAddress
```

## Usage

### For Voting

The `ContestSubmissionsWrapper` automatically wraps submissions with the voting provider:

```tsx
<VotingProvider votingContractAddress={address} votingContractAbi={abi}>
  <ContestSubmissions useSmartContract={true} />
</VotingProvider>
```

### For Submissions

The submission form is also wrapped:

```tsx
<SubmissionProvider votingContractAddress={address} votingContractAbi={abi}>
  <SubmissionForm useSmartContract={true} />
</SubmissionProvider>
```

### Fallback Mode

If `NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS` is not set:
- System falls back to database-only mode
- No smart contract transactions
- Submissions and votes are stored only in PostgreSQL

## Database Schema

The database tracks both on-chain and off-chain data:

### Submission Model

```prisma
model Submission {
  id              String   @id
  onChainId       String?  // Smart contract submission ID
  transactionHash String?  // On-chain tx hash
  // ... other fields
}
```

### Vote Model

```prisma
model Vote {
  id              String   @id
  transactionHash String?  // On-chain tx hash
  // ... other fields
}
```

## User Flow

### Voting Flow

1. User clicks "Vote" button
2. System checks if smart account is ready
3. If ready, executes gasless vote transaction
4. Waits for confirmation (3 seconds)
5. Syncs vote to database
6. Updates UI with new vote count

### Submission Flow

1. User fills form and selects image
2. Image uploads to Supabase
3. System creates metadata JSON
4. Executes gasless submission transaction
5. Waits for confirmation
6. Syncs submission to database
7. Displays success message

## Benefits

✅ **Zero Gas Fees** - Users never pay for transactions
✅ **Better UX** - No need to acquire CELO for gas
✅ **Account Abstraction** - Smart accounts with advanced features
✅ **Dual Storage** - Both on-chain and database for reliability
✅ **Graceful Fallback** - Works without smart contract if needed

## Monitoring

Check smart account activity:
- View logs in browser console (search for `[ZERODEV]`)
- Check ZeroDev dashboard for paymaster usage
- Monitor transaction hashes on Celo Explorer

## Troubleshooting

### Smart Account Not Ready

**Issue:** "Smart account not ready for sponsored transactions"

**Solution:**
- Wait for smart account initialization to complete
- Check browser console for ZeroDev logs
- Verify `NEXT_PUBLIC_ZERODEV_PROJECT_ID` is correct

### Contract Not Found

**Issue:** "Voting contract not configured"

**Solution:**
- Deploy VotingContract to Celo mainnet
- Add address to `.env.local`
- Restart dev server

### Transaction Failing

**Issue:** Sponsored transaction fails

**Solution:**
- Check ZeroDev dashboard for paymaster balance
- Verify contract address is correct
- Check network connection
- Review contract function signatures match ABI

## Future Enhancements

- 🔄 Support for vote weight/delegation
- 🏆 Gasless reward claiming
- 📊 On-chain result finalization
- 🎯 Multi-chain support
- 💾 IPFS integration for metadata

## Resources

- [ZeroDev Documentation](https://docs.zerodev.app/)
- [Kernel Smart Accounts](https://docs.zerodev.app/sdk/core-api/create-account)
- [Account Abstraction ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)
- [Celo Documentation](https://docs.celo.org/)
