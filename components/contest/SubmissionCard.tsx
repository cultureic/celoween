'use client';

interface SubmissionCardProps {
  id: string;
  title: string;
  description: string;
  submitter: string;
  voteCount: number;
  mediaUrl?: string;
  hasVoted?: boolean;
  onVoteClick: () => void;
  rank?: number;
}

export function SubmissionCard({
  id,
  title,
  description,
  submitter,
  voteCount,
  mediaUrl,
  hasVoted,
  onVoteClick,
  rank,
}: SubmissionCardProps) {
  const getRankEmoji = () => {
    if (!rank) return null;
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="group bg-spook-surface border border-spook-orange/30 rounded-2xl overflow-hidden hover:shadow-glow-violet transition-all duration-300">
      {/* Rank badge */}
      {rank && rank <= 3 && (
        <div className="absolute top-4 left-4 z-10 text-4xl">
          {getRankEmoji()}
        </div>
      )}

      {/* Media */}
      <div className="relative h-64 bg-gradient-to-br from-spook-violet/20 to-spook-orange/20 overflow-hidden">
        {mediaUrl ? (
          <img src={mediaUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            🎭
          </div>
        )}
        
        {/* Vote count badge */}
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-spook-bg/90 backdrop-blur-sm rounded-full border border-spook-violet/50">
          <span className="text-lg font-bold text-spook-violet">🗳️ {voteCount}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-spook-orange mb-2 line-clamp-1">
          {title}
        </h3>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Submitter */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>👤</span>
            <span>{submitter.slice(0, 6)}...{submitter.slice(-4)}</span>
          </div>
          {rank && rank > 3 && (
            <span className="text-sm font-semibold text-gray-500">
              {getRankEmoji()}
            </span>
          )}
        </div>

        {/* Vote button */}
        <button
          onClick={onVoteClick}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            hasVoted
              ? 'bg-gray-700 text-gray-300 border border-gray-600'
              : 'bg-spook-violet hover:bg-spook-violet/80 text-white shadow-glow-violet'
          }`}
        >
          {hasVoted ? '✅ Voted' : '✨ Vote'}
        </button>
      </div>
    </div>
  );
}
