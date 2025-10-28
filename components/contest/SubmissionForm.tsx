'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface SubmissionFormProps {
  contestId: string;
  onSuccess?: () => void;
}

export default function SubmissionForm({ contestId, onSuccess }: SubmissionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, login } = usePrivy();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!user?.wallet?.address) {
      login();
      return;
    }

    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      contestId,
      walletAddress: user.wallet.address,
      title: formData.get('title'),
      description: formData.get('description'),
      mediaUrl: formData.get('imageUrl'),
      mediaType: 'image',
      thumbnailUrl: formData.get('imageUrl'),
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('✅ Submission successful!');
        setIsOpen(false);
        if (onSuccess) onSuccess();
        window.location.reload();
      } else {
        const error = await res.json();
        alert(`❌ ${error.error || 'Failed to submit'}`);
      }
    } catch (error) {
      alert('❌ Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-spook-orange hover:bg-spook-orange/80 px-8 py-4 rounded-xl font-semibold text-lg shadow-glow-orange transition-all"
      >
        🎤 Submit Entry
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-spook-900 border border-spook-orange rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-creepster text-3xl text-spook-orange">
            🎃 Submit Your Entry
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="My Spooky Costume"
              className="w-full px-4 py-3 bg-spook-800 border border-spook-700 rounded-lg text-white placeholder-gray-500 focus:border-spook-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe your costume..."
              className="w-full px-4 py-3 bg-spook-800 border border-spook-700 rounded-lg text-white placeholder-gray-500 focus:border-spook-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              required
              placeholder="https://example.com/my-costume.jpg"
              className="w-full px-4 py-3 bg-spook-800 border border-spook-700 rounded-lg text-white placeholder-gray-500 focus:border-spook-orange focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use a direct image URL (imgur, cloudinary, etc.)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-spook-orange hover:bg-spook-orange/80 px-6 py-3 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? '⏳ Submitting...' : '🎃 Submit Entry'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-spook-800 hover:bg-spook-700 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
