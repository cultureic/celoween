import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/admin';

export async function PATCH(request: Request) {
  try {
    const wallet = request.headers.get('x-wallet-address');
    
    if (!isAdmin(wallet || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    // Validate status transitions
    const validStatuses = ['DRAFT', 'ACTIVE', 'VOTING', 'ENDED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update contest status
    const updated = await prisma.contest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
