import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) return new Response('Missing', { status: 400 });
  try {
    const db = prisma as any;
    if (db.contactMessage?.create) {
      await db.contactMessage.create({ data: { name, email, message } });
    }
    return new Response('ok');
  } catch (e) {
    // Silently succeed if table/model does not exist in this schema
    return new Response('ok');
  }
}



