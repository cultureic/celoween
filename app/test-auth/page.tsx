'use client';
import { useAuth } from '@/hooks/useAuth';

export default function TestAuthPage() {
  const { user, wallet, isAuthenticated, isAdmin, accessToken } = useAuth();

  const adminWallets = process.env.NEXT_PUBLIC_ADMIN_WALLETS?.split(',').map(addr => addr.toLowerCase().trim()) || [];
  const currentWallet = wallet.address?.toLowerCase();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Has Token:</strong> {accessToken ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
          <p><strong>Connected Wallet:</strong> {wallet.address || 'None'}</p>
          <p><strong>Wallet (lowercase):</strong> {currentWallet || 'None'}</p>
          <p><strong>Chain ID:</strong> {wallet.chainId || 'Unknown'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Configuration</h2>
          <p><strong>Admin Wallets (env):</strong> {process.env.NEXT_PUBLIC_ADMIN_WALLETS || 'Not set'}</p>
          <div className="mt-2">
            <p><strong>Parsed Admin Wallets:</strong></p>
            <ul className="ml-4 list-disc">
              {adminWallets.map((wallet, i) => (
                <li key={i} className={currentWallet === wallet ? 'text-green-600 font-bold' : 'text-gray-600'}>
                  {wallet} {currentWallet === wallet && '← YOU'}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-2"><strong>Wallet Match:</strong> {currentWallet && adminWallets.includes(currentWallet) ? 'YES' : 'NO'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify({ user, wallet }, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Expected Values</h2>
          <p>Your wallet should be: <code>0x9f42Caf52783EF12d8174d33c281a850b8eA58aD</code></p>
          <p>New admin wallet: <code>0xbd7b5d8Fdc2d21e73350741ff5C4cAC335B219a2</code></p>
        </div>
      </div>
    </div>
  );
}