'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { authenticated, user, login } = usePrivy();
  const [stats, setStats] = useState({
    submissions: 0,
    votes: 0,
    rewards: '0',
  });

  // In a real app, fetch user stats from API
  useEffect(() => {
    if (authenticated && user) {
      // TODO: Fetch user stats
      // setStats(fetchedStats);
    }
  }, [authenticated, user]);

  if (!authenticated) {
    return (
      <div className="min-h-screen gradient-spooky flex items-center justify-center px-4">
        <div className="bg-spook-surface border border-spook-orange/30 rounded-3xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">👻</div>
          <h2 className="font-creepster text-4xl text-spook-orange mb-4">
            Connect Wallet
          </h2>
          <p className="text-gray-400 mb-6">
            Connect your wallet to view your Celoween profile
          </p>
          <button
            onClick={login}
            className="bg-spook-orange hover:bg-spook-orange/80 px-8 py-3 rounded-2xl font-semibold hover:shadow-glow-orange transition-all w-full"
          >
            🔗 Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const walletAddress = user?.wallet?.address || '';
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <div className="min-h-screen gradient-spooky">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-spook-surface border border-spook-orange/30 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-halloween flex items-center justify-center text-4xl">
              👤
            </div>
            
            {/* User Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="font-creepster text-4xl text-spook-orange mb-2">
                {(typeof user?.email === 'string' ? user.email : user?.email?.address) || shortAddress}
              </h1>
              <p className="text-gray-400 mb-4">
                {walletAddress && (
                  <span className="font-mono text-sm">{walletAddress}</span>
                )}
              </p>
              
              {/* Stats */}
              <div className="flex gap-6 justify-center md:justify-start">
                <div>
                  <div className="text-2xl font-bold text-spook-violet">
                    {stats.submissions}
                  </div>
                  <div className="text-sm text-gray-400">Submissions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-spook-green">
                    {stats.votes}
                  </div>
                  <div className="text-sm text-gray-400">Votes Cast</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-spook-orange">
                    {stats.rewards} cUSD
                  </div>
                  <div className="text-sm text-gray-400">Rewards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* My Submissions */}
          <div className="bg-spook-surface border border-spook-violet/30 rounded-3xl p-6">
            <h2 className="font-creepster text-3xl text-spook-violet mb-4">
              🎤 My Submissions
            </h2>
            
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-400 mb-4">No submissions yet</p>
              <Link href="/">
                <button className="bg-spook-violet hover:bg-spook-violet/80 px-6 py-2 rounded-xl hover:shadow-glow-violet transition-all">
                  View Contest
                </button>
              </Link>
            </div>
          </div>

          {/* My Rewards */}
          <div className="bg-spook-surface border border-spook-green/30 rounded-3xl p-6">
            <h2 className="font-creepster text-3xl text-spook-green mb-4">
              💰 My Rewards
            </h2>
            
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🏆</div>
              <p className="text-gray-400 mb-4">No rewards yet</p>
              <p className="text-sm text-gray-500">
                Win contests to earn rewards!
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-spook-surface border border-spook-orange/30 rounded-3xl p-6">
          <h2 className="font-creepster text-3xl text-spook-orange mb-4">
            📊 Recent Activity
          </h2>
          
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👻</div>
            <p className="text-gray-400">No recent activity</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/">
            <button className="bg-spook-orange hover:bg-spook-orange/80 px-6 py-3 rounded-2xl font-semibold hover:shadow-glow-orange transition-all">
              🎤 View Contest
            </button>
          </Link>
          <Link href="/admin">
            <button className="bg-spook-violet hover:bg-spook-violet/80 px-6 py-3 rounded-2xl font-semibold hover:shadow-glow-violet transition-all">
              👻 Admin
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
