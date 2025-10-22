'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Submission {
  id: string;
  title: string;
  description: string;
  submitter: string;
  voteCount: number;
  mediaUrl?: string;
  hasVoted?: boolean;
}

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission;
  onVote: (submissionId: string) => Promise<void>;
  onUnvote?: (submissionId: string) => Promise<void>;
}

export function VotingModal({
  isOpen,
  onClose,
  submission,
  onVote,
  onUnvote,
}: VotingModalProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVote = async () => {
    setIsVoting(true);
    setError(null);
    try {
      if (submission.hasVoted && onUnvote) {
        await onUnvote(submission.id);
      } else {
        await onVote(submission.id);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-spook-surface border border-spook-orange/30 rounded-2xl shadow-glow-orange overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Media preview */}
        {submission.mediaUrl && (
          <div className="relative h-64 bg-gradient-to-br from-spook-orange/20 to-spook-violet/20">
            <img
              src={submission.mediaUrl}
              alt={submission.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-creepster text-spook-orange mb-2">
            {submission.title}
          </h2>

          <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
            <span>👤 {submission.submitter.slice(0, 6)}...{submission.submitter.slice(-4)}</span>
            <span>•</span>
            <span>🗳️ {submission.voteCount} votes</span>
          </div>

          <p className="text-gray-300 mb-6">
            {submission.description}
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Vote button */}
          <div className="flex gap-4">
            <button
              onClick={handleVote}
              disabled={isVoting}
              className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all ${
                submission.hasVoted
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                  : 'bg-spook-orange hover:bg-spook-orange/80 text-spook-bg shadow-glow-orange'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isVoting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Processing...
                </span>
              ) : submission.hasVoted ? (
                '🚫 Remove Vote'
              ) : (
                '✨ Vote (Gasless!)'
              )}
            </button>

            <button
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-spook-surface border border-spook-orange/30 hover:border-spook-orange/60 text-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>

          {/* Gasless info */}
          {!submission.hasVoted && (
            <div className="mt-4 p-4 bg-spook-violet/20 border border-spook-violet/30 rounded-lg">
              <p className="text-sm text-gray-300">
                ⛽ <strong>Gasless voting</strong> powered by Biconomy Smart Accounts.
                No transaction fees required!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
