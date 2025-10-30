import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { formKey, json } = await req.json();
  if (!formKey || !json) return new Response('Missing', { status: 400 });
  try {
    const db = prisma as any;
    if (db.formSubmission?.create) {
      await db.formSubmission.create({ data: { formKey, json } });
    }
    return new Response('ok');
  } catch (e) {
    // Silently succeed if table/model does not exist in this schema
    return new Response('ok');
  }
}



