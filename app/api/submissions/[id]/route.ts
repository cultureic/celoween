import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { onChainId } = body;

    if (!onChainId) {
      return NextResponse.json(
        { error: 'onChainId is required' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.update({
      where: { id },
      data: { onChainId },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
