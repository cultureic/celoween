'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export default function AdminNav() {
  const pathname = usePathname();
  const { user, logout } = usePrivy();
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/edit', label: 'Edit Contest', icon: '✏️' },
    { href: '/admin/submissions', label: 'Submissions', icon: '🎭' },
    { href: '/admin/results', label: 'Results', icon: '🏆' },
  ];
  
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };
  
  return (
    <nav className="bg-spook-900 border-b border-spook-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🎃</span>
            <span className="font-creepster text-xl text-spook-orange">
              CELOWEEN ADMIN
            </span>
          </Link>
          
          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as any}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive(item.href)
                    ? 'bg-spook-orange text-spook-950 shadow-glow-orange'
                    : 'text-spook-300 hover:text-white hover:bg-spook-800'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Wallet & Logout */}
          <div className="flex items-center gap-4">
            {user?.wallet?.address && (
              <div className="text-sm text-spook-400">
                {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
              </div>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-spook-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
