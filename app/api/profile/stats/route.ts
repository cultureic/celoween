import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Get submissions count
    const submissions = await prisma.submission.count({
      where: {
        submitterAddress: {
          equals: walletAddress,
          mode: 'insensitive',
        },
      },
    });

    // Get votes count
    const votes = await prisma.vote.count({
      where: {
        voterAddress: {
          equals: walletAddress,
          mode: 'insensitive',
        },
      },
    });

    // Get rewards (if any)
    const rewards = await prisma.reward.findMany({
      where: {
        winnerAddress: {
          equals: walletAddress,
          mode: 'insensitive',
        },
      },
    });

    const totalRewards = rewards.reduce((sum, reward) => {
      return sum + parseFloat(reward.amount || '0');
    }, 0);

    return NextResponse.json({
      submissions,
      votes,
      rewards: totalRewards.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
