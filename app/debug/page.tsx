'use client';
import { useAuth } from '@/hooks/useAuth';

export default function DebugPage() {
  const { user, wallet, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Debug - Not Authenticated</h1>
          <p>Please connect your wallet first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Debug Information</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
          <p><strong>Address:</strong> {wallet.address || 'Not connected'}</p>
          <p><strong>Chain ID:</strong> {wallet.chainId || 'Unknown'}</p>
          
          {wallet.address && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800">To grant admin access:</h3>
              <p className="text-sm text-yellow-700 mt-2">
                Add this wallet address to your .env.local file:
              </p>
              <code className="block mt-2 p-2 bg-yellow-100 rounded text-sm">
                ADMIN_WALLETS={wallet.address.toLowerCase()}
                <br />
                NEXT_PUBLIC_ADMIN_WALLETS={wallet.address.toLowerCase()}
              </code>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <p><strong>Admin Wallets (Public):</strong> {process.env.NEXT_PUBLIC_ADMIN_WALLETS || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}