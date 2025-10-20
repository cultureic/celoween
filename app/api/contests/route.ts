import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/contests - Get all contests with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const contests = await prisma.contest.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        creator: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    return NextResponse.json({ contests });
  } catch (error) {
    console.error('Error fetching contests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contests' },
      { status: 500 }
    );
  }
}

// POST /api/contests - Create a new contest (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      title,
      description,
      category,
      prizeAmount,
      prizeToken,
      startDate,
      endDate,
      votingEndDate,
      coverImageUrl,
      rules,
      maxSubmissions,
    } = body;

    // Validate required fields
    if (!walletAddress || !title || !description || !category || !prizeAmount || !startDate || !endDate || !votingEndDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Admin wallet check - only this wallet can create contests
    const ADMIN_WALLET = '0x9f42Caf52783EF12d8174d33c281a850b8eA58aD';
    if (walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized: Only admin can create contests' },
        { status: 403 }
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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    // Create contest
    const contest = await prisma.contest.create({
      data: {
        slug,
        title,
        description,
        category,
        prizeAmount,
        prizeToken: prizeToken || 'cUSD',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        votingEndDate: new Date(votingEndDate),
        coverImageUrl,
        rules,
        maxSubmissions: maxSubmissions || 1,
        creatorAddress: walletAddress,
        status: 'DRAFT',
      },
      include: {
        creator: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ contest }, { status: 201 });
  } catch (error) {
    console.error('Error creating contest:', error);
    return NextResponse.json(
      { error: 'Failed to create contest' },
      { status: 500 }
    );
  }
}
