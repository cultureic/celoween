'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { isAdmin } from '@/lib/auth/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
    
    if (ready && authenticated && user?.wallet?.address) {
      if (!isAdmin(user.wallet.address)) {
        router.push('/');
      }
    }
  }, [ready, authenticated, user, router]);
  
  // Loading state
  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-spook-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">👻</div>
          <p className="text-spook-400">Checking permissions...</p>
        </div>
      </div>
    );
  }
  
  // Not admin
  if (!isAdmin(user?.wallet?.address)) {
    return (
      <div className="min-h-screen bg-spook-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <p className="text-spook-400 mb-4">Access Denied</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-spook-orange text-spook-950 rounded-lg hover:shadow-glow-orange transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-spook-950">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
