import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch levels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const level = await prisma.level.create({
      data: {
        id: `lvl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(level, { status: 201 });
  } catch (error) {
    console.error('Error creating level:', error);
    return NextResponse.json(
      { error: 'Failed to create level' },
      { status: 500 }
    );
  }
}