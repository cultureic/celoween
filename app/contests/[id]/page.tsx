import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import SubmissionForm from '@/components/contest/SubmissionForm';
import { ContestSubmissionsWrapper } from '@/components/contest/ContestSubmissionsWrapper';

async function getContestData(id: string) {
  const contest = await prisma.contest.findUnique({
    where: { id },
    include: {
      submissions: {
        include: {
          submitter: {
            select: { walletAddress: true }
          },
          _count: {
            select: { votes: true }
          }
        }
      }
    }
  });
  
  return contest;
}

export default async function ContestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contest = await getContestData(id);
  
  if (!contest) {
    return (
      <div className="min-h-screen gradient-spooky flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <h1 className="font-creepster text-4xl text-spook-orange mb-4">Contest Not Found</h1>
          <Link href="/contests">
            <button className="bg-spook-orange hover:bg-spook-orange/80 px-6 py-3 rounded-xl font-semibold transition-all">
              ← Back to Contests
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-spooky">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/contests">
          <button className="flex items-center gap-2 text-gray-300 hover:text-spook-orange transition-colors mb-8">
            ← Back to Contests
          </button>
        </Link>

        <div className="bg-spook-surface border border-spook-orange/30 rounded-2xl p-8">
          <h1 className="font-creepster text-5xl text-spook-orange mb-4">
            {contest.title}
          </h1>
          
          <div className={`inline-block px-4 py-2 rounded-full mb-6 ${
            contest.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
            contest.status === 'VOTING' ? 'bg-spook-orange/20 text-spook-orange' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {contest.status}
          </div>

          <p className="text-xl text-gray-300 mb-6">{contest.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-spook-bg/50 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Prize Pool</div>
              <div className="text-2xl font-bold text-spook-violet">
                {contest.prizeAmount} {contest.prizeToken}
              </div>
            </div>
            
            <div className="bg-spook-bg/50 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Submissions</div>
              <div className="text-2xl font-bold text-spook-orange">
                {contest.submissions.length}
              </div>
            </div>

            <div className="bg-spook-bg/50 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Ends</div>
              <div className="text-lg font-bold text-gray-300">
                {new Date(contest.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {contest.rules && (
            <div className="bg-spook-bg/50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">Rules</div>
              <p className="text-gray-300">{contest.rules}</p>
            </div>
          )}

          {/* SubmissionForm will be wrapped with provider in wrapper */}

          <ContestSubmissionsWrapper 
            contestId={contest.id} 
            contestStatus={contest.status}
          />
        </div>
      </div>
    </div>
  );
}
