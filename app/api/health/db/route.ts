import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ping = await prisma.$queryRaw`SELECT 1 as ok`;
    let contestCount: number | null = null;
    try {
      contestCount = await prisma.contest.count();
    } catch {
      contestCount = null;
    }
    return NextResponse.json({ ok: true, ping, contestCount });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      code: err?.code ?? null,
      message: process.env.NODE_ENV === 'development' ? String(err) : 'db error',
    }, { status: 500 });
  }
}
