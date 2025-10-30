import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';

export async function GET(request: Request) {
  try {
    const wallet = request.headers.get('x-wallet-address');
    
    if (!isAdmin(wallet || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get submissions with vote counts, sorted by votes
    const submissions = await prisma.submission.findMany({
      include: {
        submitter: {
          select: {
            walletAddress: true,
          },
        },
        _count: {
          select: { votes: true },
        },
      },
      orderBy: {
        voteCount: 'desc',
      },
    });

    // Format leaderboard
    const leaderboard = submissions.map((sub, index) => ({
      rank: index + 1,
      id: sub.id,
      imageUrl: sub.mediaUrl,
      description: sub.description || sub.title,
      wallet: sub.submitter.walletAddress,
      voteCount: sub.voteCount,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
