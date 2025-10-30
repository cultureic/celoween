'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} animate-bounce`}>
        👻
      </div>
      {message && (
        <p className="text-gray-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}

export function PumpkinLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="text-6xl animate-spin-slow">🎃</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-spook-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      {message && (
        <p className="text-gray-400 font-creepster text-xl">{message}</p>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-spook-surface border border-spook-orange/30 rounded-2xl p-6 animate-pulse">
      <div className="h-48 bg-spook-orange/10 rounded-xl mb-4"></div>
      <div className="h-6 bg-spook-violet/20 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-spook-green/20 rounded mb-2 w-full"></div>
      <div className="h-4 bg-spook-green/20 rounded w-2/3"></div>
    </div>
  );
}
