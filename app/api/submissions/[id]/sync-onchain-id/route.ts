import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';
import { getVotingContractConfig } from '@/lib/contracts/voting-contract';

function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { contest: true },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.onChainId) {
      return NextResponse.json({ onChainId: submission.onChainId });
    }

    const { address, abi } = getVotingContractConfig();
    if (!address) {
      return NextResponse.json({ error: 'Contract not configured' }, { status: 500 });
    }

    const client = createPublicClient({
      chain: celo,
      transport: http(),
    });

    const numericContestId = hashStringToNumber(submission.contestId);
    const onChainId = await client.readContract({
      address,
      abi,
      functionName: 'getUserSubmission',
      args: [BigInt(numericContestId), submission.submitterAddress as `0x${string}`],
    }) as `0x${string}`;

    // Check if not zero hash
    if (onChainId && onChainId !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      await prisma.submission.update({
        where: { id },
        data: { onChainId },
      });

      return NextResponse.json({ onChainId });
    }

    return NextResponse.json({ error: 'No on-chain submission found' }, { status: 404 });
  } catch (error) {
    console.error('Error syncing on-chain ID:', error);
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}
