import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getContests() {
  // Get the single active contest from database
  const contest = await prisma.contest.findFirst({
    include: {
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!contest) return [];
  
  return [{
    id: contest.id,
    slug: contest.id,
    title: contest.title,
    description: contest.description,
    prizeAmount: contest.prizeAmount,
    prizeToken: contest.prizeToken,
    category: 'Halloween',
    status: contest.status,
    startDate: contest.startDate,
    endDate: contest.endDate,
    votingEndDate: contest.votingEndDate,
    _count: {
      submissions: contest._count.submissions
    }
  }];
}

function ContestCardSkeleton() {
  return (
    <div className="bg-spook-surface border border-spook-orange/30 rounded-3xl p-6 animate-pulse">
      <div className="h-8 bg-spook-orange/20 rounded mb-4 w-3/4" />
      <div className="h-4 bg-spook-violet/20 rounded mb-2 w-full" />
      <div className="h-4 bg-spook-violet/20 rounded mb-4 w-2/3" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-spook-green/20 rounded w-24" />
        <div className="h-10 bg-spook-violet/20 rounded w-32" />
      </div>
    </div>
  );
}

function ContestCard({ contest }: { contest: any }) {
  const isVoting = contest.status === 'VOTING';
  const daysLeft = Math.ceil(
    (new Date(isVoting ? contest.votingEndDate : contest.endDate).getTime() - Date.now()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/contests/${contest.slug}`}>
      <div className="bg-spook-surface border border-spook-orange/30 rounded-3xl p-6 hover:shadow-glow-orange transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-spook-violet/20 text-spook-violet border border-spook-violet/30">
            {contest.category}
          </span>
          {isVoting ? (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-spook-orange/20 text-spook-orange border border-spook-orange/30 animate-pulse">
              🗳️ VOTING
            </span>
          ) : (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-spook-green/20 text-spook-green border border-spook-green/30">
              ✅ OPEN
            </span>
          )}
        </div>
        
        <h2 className="font-creepster text-2xl text-spook-orange mb-3 line-clamp-2">
          {contest.title}
        </h2>
        
        <p className="text-gray-300 mb-4 line-clamp-3 flex-grow">
          {contest.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center justify-between">
            <span>💰 Prize Pool:</span>
            <span className="text-spook-green font-bold">
              {contest.prizeAmount} {contest.prizeToken}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>📊 Submissions:</span>
            <span className="text-spook-violet font-semibold">
              {contest._count.submissions}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>⏰ {isVoting ? 'Voting ends:' : 'Submissions end:'}:</span>
            <span className={daysLeft <= 3 ? 'text-spook-red font-bold' : 'text-gray-300'}>
              {daysLeft > 0 ? `${daysLeft}d left` : 'Ended'}
            </span>
          </div>
        </div>
        
        <button className="mt-4 w-full bg-spook-violet hover:bg-spook-violet/80 px-4 py-2 rounded-xl transition-all hover:shadow-glow-violet text-white font-semibold">
          {isVoting ? '🗳️ Vote Now' : '🎤 View Contest'}
        </button>
      </div>
    </Link>
  );
}

async function ContestGrid() {
  const contests = await getContests();

  if (contests.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">👻</div>
        <h3 className="font-creepster text-3xl text-spook-orange mb-2">
          No Active Contest
        </h3>
        <p className="text-gray-400 mb-6">
          Admin: Create a contest to get started!
        </p>
        <Link href="/admin">
          <button className="bg-spook-orange hover:bg-spook-orange/80 px-6 py-3 rounded-2xl font-semibold hover:shadow-glow-orange transition-all">
            👻 Go to Admin
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <ContestCard key={contest.id} contest={contest} />
      ))}
    </div>
  );
}

export default function ContestsPage() {
  return (
    <div className="min-h-screen gradient-spooky">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-creepster text-6xl md:text-7xl text-spook-orange mb-4">
            🎃 Active Contests
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Join the spookiest talent competition on Celo
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/profile">
              <button className="bg-spook-surface border border-spook-violet hover:bg-spook-violet/20 px-6 py-3 rounded-2xl font-semibold hover:shadow-glow-violet transition-all">
                👤 My Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Contest Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ContestCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ContestGrid />
        </Suspense>
      </div>
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
