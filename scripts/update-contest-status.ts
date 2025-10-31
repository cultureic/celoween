import { createWalletClient, http, parseAbi } from 'viem';
import { celo } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const CONTEST_FACTORY = '0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB';
const CONTEST_ID = 1264084658n;
const NEW_STATUS = 2; // 0=Draft, 1=Active, 2=Voting, 3=Ended, 4=Cancelled

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const client = createWalletClient({
  account,
  chain: celo,
  transport: http(),
});

const abi = parseAbi([
  'function updateContestStatus(uint256 _contestId, uint8 _newStatus) external',
]);

async function update() {
  console.log('Updating contest', CONTEST_ID.toString(), 'to status', NEW_STATUS);
  
  const hash = await client.writeContract({
    address: CONTEST_FACTORY,
    abi,
    functionName: 'updateContestStatus',
    args: [CONTEST_ID, NEW_STATUS],
  });
  
  console.log('✅ Transaction sent:', hash);
  console.log('Waiting for confirmation...');
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('✅ Done - contest should now be in Voting status on-chain');
}

update().catch(console.error);
