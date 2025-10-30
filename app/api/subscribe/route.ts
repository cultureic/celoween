import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return new Response('Missing email', { status: 400 });
  try {
    const db = prisma as any;
    if (db.emailSubscriber?.create) {
      await db.emailSubscriber.create({ data: { email } });
    }
    return new Response('ok');
  } catch (e) {
    // Silently succeed if table/model does not exist in this schema
    return new Response('ok');
  }
}



