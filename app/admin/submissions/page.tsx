'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

interface Submission {
  id: string;
  contestId: string;
  imageUrl: string;
  description: string;
  wallet: string;
  voteCount: number;
  createdAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = usePrivy();

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  async function fetchSubmissions() {
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: {
          'x-wallet-address': user?.wallet?.address || '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this submission? This will also delete all associated votes.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
        headers: {
          'x-wallet-address': user?.wallet?.address || '',
        },
      });

      if (res.ok) {
        alert('✅ Submission deleted');
        fetchSubmissions();
      } else {
        alert('❌ Failed to delete submission');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete submission');
    }
  }

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'popular') return sub.voteCount > 10;
    if (filter === 'recent') return Date.now() - new Date(sub.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    return true;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-creepster text-4xl text-spook-orange mb-2">
            🎭 Submissions
          </h1>
          <p className="text-spook-400">
            {submissions.length} total submissions
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'popular', 'recent'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all capitalize
                ${filter === f
                  ? 'bg-spook-orange text-spook-950'
                  : 'bg-spook-800 text-white hover:bg-spook-700'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-spook-900 border border-spook-700 rounded-lg">
          <div className="text-6xl mb-4">😱</div>
          <p className="text-spook-400">No submissions yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-spook-900 border border-spook-700 rounded-lg overflow-hidden hover:shadow-glow-orange transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square bg-spook-800">
                <Image
                  src={submission.imageUrl}
                  alt={submission.description}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-spook-300 line-clamp-2">
                  {submission.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-spook-500">
                    {submission.wallet.slice(0, 6)}...{submission.wallet.slice(-4)}
                  </span>
                  <span className="text-spook-orange font-bold">
                    🗳️ {submission.voteCount}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
