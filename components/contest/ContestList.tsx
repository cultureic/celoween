'use client';

import { useState } from 'react';
import { ContestCard } from './ContestCard';

interface Contest {
  id: string;
  title: string;
  description: string;
  prizePool: string;
  startDate: Date;
  endDate: Date;
  submissionCount: number;
  totalVotes: number;
  status: 'draft' | 'active' | 'voting' | 'ended' | 'cancelled';
  imageUrl?: string;
}

interface ContestListProps {
  contests: Contest[];
}

type FilterStatus = 'all' | 'active' | 'voting' | 'ended';

export function ContestList({ contests }: ContestListProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredContests = contests.filter((contest) => {
    if (filter === 'all') return true;
    return contest.status === filter;
  });

  const filterButtons: { label: string; value: FilterStatus; emoji: string }[] = [
    { label: 'All', value: 'all', emoji: '🎃' },
    { label: 'Active', value: 'active', emoji: '🔥' },
    { label: 'Voting', value: 'voting', emoji: '🗳️' },
    { label: 'Ended', value: 'ended', emoji: '👻' },
  ];

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === btn.value
                ? 'bg-spook-orange text-spook-bg shadow-glow-orange'
                : 'bg-spook-surface text-gray-300 border border-spook-orange/30 hover:border-spook-orange/60'
            }`}
          >
            {btn.emoji} {btn.label}
          </button>
        ))}
      </div>

      {/* Contest grid */}
      {filteredContests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest) => (
            <ContestCard key={contest.id} {...contest} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👻</div>
          <h3 className="text-2xl font-creepster text-spook-orange mb-2">
            No contests found
          </h3>
          <p className="text-gray-400">
            {filter === 'all'
              ? 'Be the first to create a contest!'
              : `No ${filter} contests at the moment`}
          </p>
        </div>
      )}
    </div>
  );
}
