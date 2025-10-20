import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/contests/[id] - Get single contest with submissions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contest = await prisma.contest.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        submissions: {
          include: {
            submitter: {
              select: {
                walletAddress: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: {
            voteCount: 'desc',
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!contest) {
      return NextResponse.json(
        { error: 'Contest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ contest });
  } catch (error) {
    console.error('Error fetching contest:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contest' },
      { status: 500 }
    );
  }
}

// PATCH /api/contests/[id] - Update contest
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, contractAddress } = body;

    const contest = await prisma.contest.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(contractAddress && { contractAddress }),
      },
      include: {
        creator: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
          },
        },
      },
    });

    return NextResponse.json({ contest });
  } catch (error) {
    console.error('Error updating contest:', error);
    return NextResponse.json(
      { error: 'Failed to update contest' },
      { status: 500 }
    );
  }
}
