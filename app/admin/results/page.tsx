'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

interface Result {
  rank: number;
  id: string;
  imageUrl: string;
  description: string;
  wallet: string;
  voteCount: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();

  useEffect(() => {
    fetchResults();
  }, [user]);

  async function fetchResults() {
    try {
      const res = await fetch('/api/admin/results', {
        headers: {
          'x-wallet-address': user?.wallet?.address || '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    const csv = [
      ['Rank', 'Wallet', 'Votes', 'Description'].join(','),
      ...results.map(r => 
        [r.rank, r.wallet, r.voteCount, `"${r.description.replace(/"/g, '""')}"`].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celoween-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-6xl animate-bounce">👻</div>
      </div>
    );
  }

  const topThree = results.slice(0, 3);
  const rest = results.slice(3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-creepster text-4xl text-spook-orange mb-2">
            🏆 Results & Winners
          </h1>
          <p className="text-spook-400">
            Final leaderboard sorted by votes
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-6 py-3 bg-spook-orange text-spook-950 rounded-lg font-bold hover:shadow-glow-orange transition-all"
        >
          📥 Export CSV
        </button>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 bg-spook-900 border border-spook-700 rounded-lg">
          <div className="text-6xl mb-4">😱</div>
          <p className="text-spook-400">No submissions yet</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThree.map((result) => (
              <div
                key={result.id}
                className={`
                  bg-spook-900 border rounded-lg overflow-hidden
                  ${result.rank === 1 
                    ? 'border-yellow-500 shadow-glow-orange' 
                    : result.rank === 2
                    ? 'border-gray-400'
                    : 'border-orange-700'
                  }
                `}
              >
                {/* Rank Badge */}
                <div className={`
                  text-center py-3 font-bold text-lg
                  ${result.rank === 1 
                    ? 'bg-yellow-500 text-yellow-950' 
                    : result.rank === 2
                    ? 'bg-gray-400 text-gray-950'
                    : 'bg-orange-700 text-orange-50'
                  }
                `}>
                  {result.rank === 1 && '👑 1st Place'}
                  {result.rank === 2 && '🥈 2nd Place'}
                  {result.rank === 3 && '🥉 3rd Place'}
                </div>

                {/* Image */}
                <div className="relative aspect-square bg-spook-800">
                  <Image
                    src={result.imageUrl}
                    alt={result.description}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <p className="text-sm text-spook-300 line-clamp-2">
                    {result.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-spook-500">
                      {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
                    </span>
                    <span className="text-lg font-bold text-spook-orange">
                      🗳️ {result.voteCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rest of Leaderboard */}
          {rest.length > 0 && (
            <div className="bg-spook-900 border border-spook-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-spook-700">
                <h2 className="text-xl font-bold text-white">Full Leaderboard</h2>
              </div>
              <div className="divide-y divide-spook-700">
                {rest.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-4 p-4 hover:bg-spook-800 transition-colors"
                  >
                    {/* Rank */}
                    <div className="w-12 text-center">
                      <span className="text-2xl font-bold text-spook-400">
                        #{result.rank}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-spook-800">
                      <Image
                        src={result.imageUrl}
                        alt={result.description}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-spook-300 truncate">
                        {result.description}
                      </p>
                      <p className="text-xs text-spook-500 mt-1">
                        {result.wallet.slice(0, 6)}...{result.wallet.slice(-4)}
                      </p>
                    </div>

                    {/* Votes */}
                    <div className="text-right">
                      <span className="text-xl font-bold text-spook-orange">
                        {result.voteCount}
                      </span>
                      <p className="text-xs text-spook-500">votes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
