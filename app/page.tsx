import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function HomePage() {
  // Get the single active contest
  const contest = await prisma.contest.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  // If contest exists, redirect to it
  if (contest) {
    redirect(`/contests/${contest.id}`);
  }

  // No contest exists - show landing page for admin
  return (
    <div className="min-h-screen gradient-spooky flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-8xl mb-6 animate-bounce">👻</div>
        
        <h1 className="font-creepster text-7xl md:text-9xl text-spook-orange mb-6 leading-tight">
          Celoween
        </h1>
        
        <p className="text-2xl md:text-3xl text-spook-violet mb-4 font-semibold">
          Decentralized Halloween Talent Show
        </p>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          No active contest yet. Admin: create one to get started! 🎃
        </p>
        
        <Link href="/admin">
          <button className="bg-spook-orange hover:bg-spook-orange/80 px-8 py-4 rounded-2xl text-xl font-semibold hover:shadow-glow-orange transition-all">
            👻 Go to Admin Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
