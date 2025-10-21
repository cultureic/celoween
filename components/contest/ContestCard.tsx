import Link from 'next/link';
import { Calendar, Users, Trophy } from 'lucide-react';

interface ContestCardProps {
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

export function ContestCard({
  id,
  title,
  description,
  prizePool,
  startDate,
  endDate,
  submissionCount,
  totalVotes,
  status,
  imageUrl,
}: ContestCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-spook-green text-spook-bg';
      case 'voting':
        return 'bg-spook-violet text-white';
      case 'ended':
        return 'bg-gray-600 text-gray-300';
      case 'draft':
        return 'bg-gray-700 text-gray-400';
      default:
        return 'bg-gray-600 text-gray-300';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'active':
        return '🎃 Active';
      case 'voting':
        return '🗳️ Voting';
      case 'ended':
        return '👻 Ended';
      case 'draft':
        return '📝 Draft';
      default:
        return status;
    }
  };

  return (
    <Link href={`/contests/${id}`}>
      <div className="group bg-spook-surface border border-spook-orange/30 rounded-2xl overflow-hidden hover:shadow-glow-orange transition-all duration-300 cursor-pointer">
        {/* Image or placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-spook-orange/20 to-spook-violet/20 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">
              🎃
            </div>
          )}
          {/* Status badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}>
            {getStatusLabel()}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-creepster text-spook-orange mb-2 group-hover:text-spook-violet transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Prize pool */}
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-spook-violet" />
            <span className="text-xl font-bold text-spook-violet">{prizePool} cUSD</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{submissionCount} entries</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🗳️</span>
              <span>{totalVotes} votes</span>
            </div>
          </div>

          {/* Dates */}
          <div className="mt-4 pt-4 border-t border-spook-orange/20 flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
