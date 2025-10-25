'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  votingEndDate: string;
  prizePool: string;
  status: string;
}

export default function EditContestPage() {
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    async function fetchContest() {
      try {
        const res = await fetch('/api/admin/contest', {
          headers: {
            'x-wallet-address': user?.wallet?.address || '',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setContest(data);
        }
      } catch (error) {
        console.error('Failed to fetch contest:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.wallet?.address) {
      fetchContest();
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: contest?.id,
      title: formData.get('title'),
      description: formData.get('description'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      votingEndDate: formData.get('votingEndDate'),
      prizePool: formData.get('prizePool'),
    };

    try {
      const res = await fetch('/api/admin/contest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': user?.wallet?.address || '',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('✅ Contest updated successfully!');
        router.push('/admin');
      } else {
        alert('❌ Failed to update contest');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Failed to update contest');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!confirm(`Change status to ${newStatus}?`)) return;

    try {
      const res = await fetch('/api/admin/contest/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': user?.wallet?.address || '',
        },
        body: JSON.stringify({ id: contest?.id, status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setContest(updated);
        alert(`✅ Status changed to ${newStatus}`);
      } else {
        alert('❌ Failed to change status');
      }
    } catch (error) {
      console.error('Status change error:', error);
      alert('❌ Failed to change status');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-6xl animate-bounce">👻</div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😱</div>
        <p className="text-spook-400">No contest found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-creepster text-4xl text-spook-orange mb-2">
          ✏️ Edit Contest
        </h1>
        <p className="text-spook-400">Modify contest details and settings</p>
      </div>

      {/* Status Control */}
      <div className="bg-spook-900 border border-spook-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Contest Status</h2>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-spook-400">Current:</span>
          <StatusBadge status={contest.status} />
        </div>
        <div className="flex flex-wrap gap-2">
          {['DRAFT', 'ACTIVE', 'VOTING', 'ENDED'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={contest.status === status}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${contest.status === status
                  ? 'bg-spook-700 text-spook-500 cursor-not-allowed'
                  : 'bg-spook-800 text-white hover:bg-spook-orange hover:text-spook-950'
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-spook-900 border border-spook-700 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Contest Details</h2>

        <div>
          <label className="block text-sm font-medium text-spook-300 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={contest.title}
            required
            className="w-full px-4 py-2 bg-spook-800 border border-spook-700 rounded-lg text-white focus:border-spook-orange focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-spook-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={contest.description}
            required
            rows={4}
            className="w-full px-4 py-2 bg-spook-800 border border-spook-700 rounded-lg text-white focus:border-spook-orange focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Start Date
            </label>
            <input
              type="datetime-local"
              name="startDate"
              defaultValue={new Date(contest.startDate).toISOString().slice(0, 16)}
              required
              className="w-full px-4 py-2 bg-spook-800 border border-spook-700 rounded-lg text-white focus:border-spook-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              End Date
            </label>
            <input
              type="datetime-local"
              name="endDate"
              defaultValue={new Date(contest.endDate).toISOString().slice(0, 16)}
              required
              className="w-full px-4 py-2 bg-spook-800 border border-spook-700 rounded-lg text-white focus:border-spook-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Voting End
            </label>
            <input
              type="datetime-local"
              name="votingEndDate"
              defaultValue={new Date(contest.votingEndDate).toISOString().slice(0, 16)}
              required
              className="w-full px-4 py-2 bg-spook-800 border border-spook-700 rounded-lg text-white focus:border-spook-orange focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-spook-300 mb-2">
            Prize Pool (CELO)
          </label>
          <input
            type="number"
            name="prizePool"
            step="0.01"
            defaultValue={contest.prizePool}
            required
            className="w-full px-4 py-2 bg-spook-800 border border-spook-700 rounded-lg text-white focus:border-spook-orange focus:outline-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-spook-orange text-spook-950 rounded-lg font-bold hover:shadow-glow-orange transition-all disabled:opacity-50"
          >
            {saving ? '💾 Saving...' : '💾 Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-3 bg-spook-800 text-white rounded-lg font-medium hover:bg-spook-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-500/20 text-gray-400',
    ACTIVE: 'bg-green-500/20 text-green-400',
    VOTING: 'bg-spook-orange/20 text-spook-orange',
    ENDED: 'bg-spook-violet/20 text-spook-violet',
    CANCELLED: 'bg-red-500/20 text-red-400',
  };

  return (
    <span className={`${colors[status]} px-3 py-1 rounded-lg text-sm font-bold`}>
      {status}
    </span>
  );
}
