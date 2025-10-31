# Celo Sepolia Deployment

## 🎉 Successfully Deployed!

All contracts have been deployed to **Celo Sepolia Testnet** (Chain ID: 11142220)

### Deployed Contracts

| Contract | Address | Explorer |
|----------|---------|----------|
| **ContestFactory** | `0xDCCcb5eFAE666c27dB78bCe3A337B8950C037861` | [View on Explorer](https://celo-sepolia.blockscout.com/address/0xDCCcb5eFAE666c27dB78bCe3A337B8950C037861) |
| **VotingContract** | `0x1c50eCae677b8607Bc38818dc03dbA3aa593ce8F` | [View on Explorer](https://celo-sepolia.blockscout.com/address/0x1c50eCae677b8607Bc38818dc03dbA3aa593ce8F) |

### Deployer Account

- **Address:** `0x9f42Caf52783EF12d8174d33c281a850b8eA58aD`
- **Balance:** ~22.8 CELO (Sepolia testnet)

## Environment Configuration

The following has been added to your `.env.local`:

```env
# Contest Contracts (Celo Sepolia)
NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS=0xDCCcb5eFAE666c27dB78bCe3A337B8950C037861
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0x1c50eCae677b8607Bc38818dc03dbA3aa593ce8F
NEXT_PUBLIC_USE_TESTNET=true
```

## ZeroDev Configuration

To enable gasless transactions on Celo Sepolia:

1. **Login to ZeroDev Dashboard:**
   - Go to [https://zerodev.app](https://zerodev.app)
   - Login/create account

2. **Create/Update Project:**
   - Select **Celo Sepolia** network (Chain ID: 11142220)
   - Copy your Project ID
   
3. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_ZERODEV_PROJECT_ID=your-project-id-here
   ```

## Testing the Integration

### 1. Restart Dev Server

```bash
npm run dev
```

### 2. Test Submission Flow

1. Login to the app
2. Wait for smart account initialization (check console for `[ZERODEV]` logs)
3. Submit a contest entry
4. Check console for `[SUBMISSION]` logs showing sponsored transaction
5. Verify on [Celo Sepolia Explorer](https://celo-sepolia.blockscout.com/)

### 3. Test Voting Flow

1. Make sure contest is in `VOTING` status (use admin panel)
2. Click vote on a submission
3. Check console for `[VOTING]` logs
4. Transaction should be gasless (no wallet popup)
5. Verify vote count updates

## Contract Interaction

### Read Functions (Anyone can call)

```javascript
// Get submission details
const submission = await votingContract.getSubmission(submissionId);

// Check if user voted
const hasVoted = await votingContract.hasUserVoted(submissionId, userAddress);

// Get all submissions for contest
const submissions = await votingContract.getContestSubmissions(contestId);
```

### Write Functions (Gasless via ZeroDev)

```javascript
// Submit entry (gasless)
await votingContract.submitEntry(contestId, metadataURI);

// Vote (gasless)
await votingContract.vote(submissionId);

// Remove vote (gasless)
await votingContract.removeVote(submissionId);
```

## Monitoring

### Check Transaction Status

All transactions are logged with their hash. You can view them on:
- [Celo Sepolia Blockscout](https://celo-sepolia.blockscout.com/)

### ZeroDev Dashboard

Monitor paymaster usage:
- Transactions sponsored
- Gas costs covered
- Remaining balance

## Database Schema

Submissions now include on-chain tracking:

```typescript
{
  id: string;
  onChainId?: string;        // Smart contract submission ID
  transactionHash?: string;  // On-chain tx hash
  // ... other fields
}
```

Votes also track transaction hashes:

```typescript
{
  id: string;
  transactionHash?: string;  // On-chain vote tx hash
  // ... other fields
}
```

## Troubleshooting

### Smart Account Not Ready

**Issue:** Users can't submit/vote

**Check:**
1. Browser console for `[ZERODEV]` initialization logs
2. Make sure `NEXT_PUBLIC_ZERODEV_PROJECT_ID` is set correctly
3. Verify ZeroDev project is configured for Celo Sepolia

### Contract Call Failing

**Issue:** Transaction reverts

**Check:**
1. Contest status (must be ACTIVE for submissions, VOTING for votes)
2. User hasn't already submitted/voted
3. Smart account has proper permissions

### Testnet vs Mainnet

The app now runs on **Celo Sepolia** because `NEXT_PUBLIC_USE_TESTNET=true`.

To switch to mainnet:
- Set `NEXT_PUBLIC_USE_TESTNET=false`
- Deploy contracts to Celo mainnet
- Update contract addresses in `.env.local`
- Configure ZeroDev for Celo mainnet (Chain ID: 42220)

## Next Steps

1. ✅ Contracts deployed
2. ⏳ Configure ZeroDev project for Celo Sepolia
3. ⏳ Test submission with gasless transaction
4. ⏳ Test voting with gasless transaction
5. ⏳ Deploy to production (Vercel/etc)

## Resources

- [Celo Sepolia Faucet](https://faucet.celo.org/sepolia) - Get test CELO
- [Celo Sepolia Explorer](https://celo-sepolia.blockscout.com/)
- [ZeroDev Documentation](https://docs.zerodev.app/)
- [Account Abstraction Overview](https://eips.ethereum.org/EIPS/eip-4337)

## Security Notes

⚠️ **Testnet Only** - These contracts are deployed on Celo Sepolia testnet for testing purposes.

Before mainnet deployment:
- [ ] Complete security audit
- [ ] Test all edge cases
- [ ] Set up monitoring and alerts
- [ ] Configure proper access controls
- [ ] Set up multi-sig for admin functions
