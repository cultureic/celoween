import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';

// GET single contest (for editing)
export async function GET(request: Request) {
  try {
    const wallet = request.headers.get('x-wallet-address');
    
    if (!isAdmin(wallet || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the first (and only) contest
    const contest = await prisma.contest.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!contest) {
      return NextResponse.json({ error: 'No contest found' }, { status: 404 });
    }

    return NextResponse.json(contest);
  } catch (error) {
    console.error('Get contest error:', error);
    return NextResponse.json({ error: 'Failed to fetch contest' }, { status: 500 });
  }
}

// PUT update contest
export async function PUT(request: Request) {
  try {
    const wallet = request.headers.get('x-wallet-address');
    
    if (!isAdmin(wallet || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, startDate, endDate, votingEndDate, prizePool } = body;

    if (!id) {
      return NextResponse.json({ error: 'Contest ID required' }, { status: 400 });
    }

    // Update contest
    const updated = await prisma.contest.update({
      where: { id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        votingEndDate: new Date(votingEndDate),
        prizePool,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update contest error:', error);
    return NextResponse.json({ error: 'Failed to update contest' }, { status: 500 });
  }
}
