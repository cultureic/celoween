'use client';
import { openTransak } from '@/lib/ramps/transak';

export default function RampLauncher() {
  return (
    <div className="celo-card celo-border rounded-2xl p-4 inline-flex items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-400">Transak</span>
      <button
        className="rounded-lg bg-black text-white px-4 py-2"
        onClick={openTransak}
      >
        Launch
      </button>
    </div>
  );
}



