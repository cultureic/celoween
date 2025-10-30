import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';

export async function GET(request: Request) {
  try {
    const wallet = request.headers.get('x-wallet-address');
    
    if (!isAdmin(wallet || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all submissions with vote counts and user info
    const submissions = await prisma.submission.findMany({
      include: {
        submitter: {
          select: {
            walletAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format response
    const formatted = submissions.map(sub => ({
      id: sub.id,
      contestId: sub.contestId,
      imageUrl: sub.mediaUrl,
      description: sub.description || sub.title,
      wallet: sub.submitter.walletAddress,
      voteCount: sub.voteCount,
      createdAt: sub.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
