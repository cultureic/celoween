import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, bio, avatarUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const instructor = await prisma.instructor.create({
      data: {
        id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        title: title || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(instructor, { status: 201 });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { error: 'Failed to create instructor' },
      { status: 500 }
    );
  }
}