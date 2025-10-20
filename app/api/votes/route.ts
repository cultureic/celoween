import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/votes - Cast a vote (gasless)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, walletAddress, transactionHash } = body;

    // Validate required fields
    if (!submissionId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if submission exists
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        contest: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Check if contest is in voting phase
    if (submission.contest.status !== 'VOTING') {
      return NextResponse.json(
        { error: 'Contest is not in voting phase' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    // Check if user already voted for this submission
    const existingVote = await prisma.vote.findUnique({
      where: {
        submissionId_voterAddress: {
          submissionId,
          voterAddress: walletAddress,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this submission' },
        { status: 400 }
      );
    }

    // Create vote and increment vote count
    const vote = await prisma.$transaction(async (tx) => {
      // Create vote
      const newVote = await tx.vote.create({
        data: {
          submissionId,
          voterAddress: walletAddress,
          weight: 1,
          transactionHash,
        },
      });

      // Increment vote count on submission
      await tx.submission.update({
        where: { id: submissionId },
        data: {
          voteCount: {
            increment: 1,
          },
        },
      });

      return newVote;
    });

    return NextResponse.json({ vote }, { status: 201 });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { error: 'Failed to cast vote' },
      { status: 500 }
    );
  }
}

// DELETE /api/votes - Remove a vote
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, walletAddress } = body;

    // Validate required fields
    if (!submissionId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if vote exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        submissionId_voterAddress: {
          submissionId,
          voterAddress: walletAddress,
        },
      },
      include: {
        submission: {
          include: {
            contest: true,
          },
        },
      },
    });

    if (!existingVote) {
      return NextResponse.json(
        { error: 'Vote not found' },
        { status: 404 }
      );
    }

    // Check if contest is still in voting phase
    if (existingVote.submission.contest.status !== 'VOTING') {
      return NextResponse.json(
        { error: 'Contest is not in voting phase' },
        { status: 400 }
      );
    }

    // Delete vote and decrement vote count
    await prisma.$transaction(async (tx) => {
      // Delete vote
      await tx.vote.delete({
        where: {
          submissionId_voterAddress: {
            submissionId,
            voterAddress: walletAddress,
          },
        },
      });

      // Decrement vote count on submission
      await tx.submission.update({
        where: { id: submissionId },
        data: {
          voteCount: {
            decrement: 1,
          },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing vote:', error);
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    );
  }
}

// GET /api/votes?submissionId=xxx or walletAddress=xxx - Get votes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const walletAddress = searchParams.get('walletAddress');

    if (!submissionId && !walletAddress) {
      return NextResponse.json(
        { error: 'submissionId or walletAddress required' },
        { status: 400 }
      );
    }

    const votes = await prisma.vote.findMany({
      where: {
        ...(submissionId && { submissionId }),
        ...(walletAddress && { voterAddress: walletAddress }),
      },
      include: {
        submission: {
          select: {
            id: true,
            title: true,
            contestId: true,
          },
        },
        voter: {
          select: {
            walletAddress: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ votes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
