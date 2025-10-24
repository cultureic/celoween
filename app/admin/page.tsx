'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

interface Stats {
  contests: {
    total: number;
    draft: number;
    active: number;
    voting: number;
    ended: number;
  };
  submissions: {
    total: number;
    thisWeek: number;
  };
  votes: {
    total: number;
    thisWeek: number;
  };
  voters: {
    total: number;
  };
  prizePool: {
    total: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: {
            'x-wallet-address': user?.wallet?.address || '',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.wallet?.address) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-6xl animate-bounce">👻</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-creepster text-4xl text-spook-orange mb-2">
          🎃 Admin Dashboard
        </h1>
        <p className="text-spook-400">
          Manage your Celoween contest
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="🎭"
          label="Submissions"
          value={stats?.submissions.total || 0}
          subtitle={`+${stats?.submissions.thisWeek || 0} this week`}
        />
        <StatCard
          icon="🗳️"
          label="Total Votes"
          value={stats?.votes.total || 0}
          subtitle={`+${stats?.votes.thisWeek || 0} this week`}
        />
        <StatCard
          icon="👥"
          label="Unique Voters"
          value={stats?.voters.total || 0}
          subtitle="Engaged users"
        />
        <StatCard
          icon="💰"
          label="Prize Pool"
          value={`${stats?.prizePool.total || 0} CELO`}
          subtitle="Total rewards"
        />
      </div>

      {/* Contest Status */}
      <div className="bg-spook-900 border border-spook-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Contest Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusBadge
            label="Draft"
            count={stats?.contests.draft || 0}
            color="gray"
          />
          <StatusBadge
            label="Active"
            count={stats?.contests.active || 0}
            color="green"
          />
          <StatusBadge
            label="Voting"
            count={stats?.contests.voting || 0}
            color="orange"
          />
          <StatusBadge
            label="Ended"
            count={stats?.contests.ended || 0}
            color="violet"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-spook-900 border border-spook-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            href="/admin/edit"
            icon="✏️"
            label="Edit Contest"
            description="Modify contest details"
          />
          <ActionButton
            href="/admin/submissions"
            icon="🎭"
            label="View Submissions"
            description="Moderate entries"
          />
          <ActionButton
            href="/admin/results"
            icon="🏆"
            label="View Results"
            description="Check leaderboard"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle }: {
  icon: string;
  label: string;
  value: number | string;
  subtitle: string;
}) {
  return (
    <div className="bg-spook-900 border border-spook-700 rounded-lg p-6 hover:shadow-glow-orange transition-all">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-sm text-spook-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-spook-500">{subtitle}</div>
    </div>
  );
}

function StatusBadge({ label, count, color }: {
  label: string;
  count: number;
  color: 'gray' | 'green' | 'orange' | 'violet';
}) {
  const colors = {
    gray: 'bg-gray-500/20 text-gray-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-spook-orange/20 text-spook-orange',
    violet: 'bg-spook-violet/20 text-spook-violet',
  };

  return (
    <div className={`${colors[color]} rounded-lg px-4 py-3 text-center`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

function ActionButton({ href, icon, label, description }: {
  href: string;
  icon: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="bg-spook-800 border border-spook-700 rounded-lg p-4 hover:border-spook-orange hover:shadow-glow-orange transition-all group"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-bold text-white group-hover:text-spook-orange transition-colors">
        {label}
      </div>
      <div className="text-sm text-spook-400 mt-1">{description}</div>
    </Link>
  );
}
