import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';

export async function GET(request: Request) {
  try {
    // Get wallet from header
    const wallet = request.headers.get('x-wallet-address');
    
    if (!isAdmin(wallet || '')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get contest stats
    const contestCount = await prisma.contest.count();
    const contests = await prisma.contest.findMany({
      select: {
        status: true,
        prizeAmount: true,
      },
    });

    const statusCounts = {
      draft: contests.filter(c => c.status === 'DRAFT').length,
      active: contests.filter(c => c.status === 'ACTIVE').length,
      voting: contests.filter(c => c.status === 'VOTING').length,
      ended: contests.filter(c => c.status === 'ENDED').length,
    };

    // Get submission stats
    const submissionCount = await prisma.submission.count();
    const submissionsThisWeek = await prisma.submission.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get vote stats
    const voteCount = await prisma.vote.count();
    const votesThisWeek = await prisma.vote.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get unique voters
    const uniqueVoters = await prisma.vote.findMany({
      select: { voterAddress: true },
      distinct: ['voterAddress'],
    });

    // Calculate total prize pool
    const totalPrizePool = contests.reduce((sum, c) => sum + Number(c.prizeAmount), 0);

    return NextResponse.json({
      contests: {
        total: contestCount,
        draft: statusCounts.draft,
        active: statusCounts.active,
        voting: statusCounts.voting,
        ended: statusCounts.ended,
      },
      submissions: {
        total: submissionCount,
        thisWeek: submissionsThisWeek,
      },
      votes: {
        total: voteCount,
        thisWeek: votesThisWeek,
      },
      voters: {
        total: uniqueVoters.length,
      },
      prizePool: {
        total: totalPrizePool.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
