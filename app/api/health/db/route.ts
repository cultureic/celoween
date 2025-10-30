import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const ping = await prisma.$queryRaw`SELECT 1 as ok`;
    let courseCount: number | null = null;
    try {
      courseCount = await prisma.course.count();
    } catch {
      courseCount = null;
    }
    return NextResponse.json({ ok: true, ping, courseCount });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      code: err?.code ?? null,
      message: process.env.NODE_ENV === 'development' ? String(err) : 'db error',
    }, { status: 500 });
  }
}
