import { NextResponse } from 'next/server';

export async function GET() {
  const hasDb = !!process.env.DATABASE_URL;
  const hasDirect = !!process.env.DIRECT_URL;
  return NextResponse.json({
    ok: true,
    node: process.version,
    env: {
      DATABASE_URL: hasDb,
      DIRECT_URL: hasDirect,
      NODE_ENV: process.env.NODE_ENV ?? null,
    },
  });
}
