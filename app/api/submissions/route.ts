import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/submissions - Create a new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contestId,
      walletAddress,
      title,
      description,
      mediaUrl,
      mediaType,
      thumbnailUrl,
      metadata,
      transactionHash,
      onChainId,
    } = body;

    // Validate required fields
    if (!contestId || !walletAddress || !title || !mediaUrl || !mediaType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if contest exists and is active
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return NextResponse.json(
        { error: 'Contest not found' },
        { status: 404 }
      );
    }

    if (contest.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Contest is not accepting submissions' },
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

    // Check if user already submitted
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        contestId_submitterAddress: {
          contestId,
          submitterAddress: walletAddress,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted to this contest' },
        { status: 400 }
      );
    }

    // Parse and enhance metadata with stateTag
    let metadataObj = {};
    try {
      metadataObj = metadata ? JSON.parse(metadata) : {};
    } catch {
      metadataObj = {};
    }
    
    // Add stateTag to metadata from body (required field, no default)
    if (body.stateTag) {
      metadataObj.stateTag = body.stateTag;
    }
    
    // Create submission
    const submission = await prisma.submission.create({
      data: {
        contestId,
        submitterAddress: walletAddress,
        title,
        description,
        mediaUrl,
        mediaType,
        thumbnailUrl,
        metadata: JSON.stringify(metadataObj),
        transactionHash,
        onChainId,
      },
      include: {
        submitter: {
          select: {
            walletAddress: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        contest: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

// GET /api/submissions?contestId=xxx&stateTag=xxx - Get submissions for a contest
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contestId = searchParams.get('contestId');
    const walletAddress = searchParams.get('walletAddress');
    const stateTag = searchParams.get('stateTag');

    if (!contestId && !walletAddress) {
      return NextResponse.json(
        { error: 'contestId or walletAddress required' },
        { status: 400 }
      );
    }

    let submissions = await prisma.submission.findMany({
      where: {
        ...(contestId && { contestId }),
        ...(walletAddress && { submitterAddress: walletAddress }),
      },
      include: {
        submitter: {
          select: {
            walletAddress: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        contest: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
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
    });
    
    // Filter by stateTag if provided (filter in JS since it's in JSON metadata)
    if (stateTag) {
      submissions = submissions.filter(sub => {
        try {
          const meta = sub.metadata ? JSON.parse(sub.metadata as string) : {};
          return meta.stateTag === stateTag;
        } catch {
          return false;
        }
      });
    }
    
    // Parse metadata for each submission to extract stateTag
    const submissionsWithStateTag = submissions.map(sub => {
      let stateTag = null;
      try {
        const meta = sub.metadata ? JSON.parse(sub.metadata as string) : {};
        stateTag = meta.stateTag || null;
      } catch {}
      return { ...sub, stateTag };
    });

    return NextResponse.json({ submissions: submissionsWithStateTag });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
