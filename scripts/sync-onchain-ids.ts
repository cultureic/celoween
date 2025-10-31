import { PrismaClient } from '@prisma/client';
import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';
import votingAbi from '../artifacts/contracts/VotingContract.sol/VotingContract.json' with { type: 'json' };

const prisma = new PrismaClient();
const CONTRACT_ADDRESS = '0xa233487B7FB5941Dd81A28A4A547519760BFE89e';

function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

async function sync() {
  const client = createPublicClient({
    chain: celo,
    transport: http(),
  });

  // Get all submissions without onChainId
  const submissions = await prisma.submission.findMany({
    where: {
      onChainId: null,
      transactionHash: { not: null },
    },
    include: {
      contest: true,
    },
  });

  console.log(`Found ${submissions.length} submissions to sync\n`);

  for (const submission of submissions) {
    try {
      const numericContestId = hashStringToNumber(submission.contestId);
      
      const onChainId = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: votingAbi.abi,
        functionName: 'getUserSubmission',
        args: [BigInt(numericContestId), submission.submitterAddress as `0x${string}`],
      });

      if (onChainId > 0n) {
        await prisma.submission.update({
          where: { id: submission.id },
          data: { onChainId: onChainId.toString() },
        });
        console.log(`✅ Updated ${submission.id}: onChainId = ${onChainId}`);
      } else {
        console.log(`⚠️  No on-chain submission found for ${submission.id}`);
      }
    } catch (error) {
      console.error(`❌ Error syncing ${submission.id}:`, error);
    }
  }

  await prisma.$disconnect();
  console.log('\n✅ Sync complete');
}

sync();
