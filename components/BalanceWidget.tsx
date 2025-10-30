'use client';
import { useState } from 'react';
import { Wallet, Coins } from 'lucide-react';
import PrivyLogin from './PrivyLogin';

interface BalanceWidgetProps {
  className?: string;
}

export default function BalanceWidget({ className = '' }: BalanceWidgetProps) {
  const [celoBalance, setCeloBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [authenticated, setAuthenticated] = useState(false);

  // Mock data for demo purposes
  const mockBalance = '1.25';
  const mockAddress = '0x1234...5678';

  const truncateAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';
  };

  const handleLogin = () => {
    setAuthenticated(true);
    setAddress(mockAddress);
    setCeloBalance(mockBalance);
  };

  if (!authenticated) {
    return (
      <div className={`celo-card celo-border rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display celo-heading">Balance</h3>
          <Wallet className="w-5 h-5 celo-heading" />
        </div>
        <div className="text-center py-8">
          <p className="text-sm celo-text mb-4">Conecta tu wallet para ver tu balance</p>
          <button 
            onClick={handleLogin}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-celo-yellow to-celo-lime text-celo-black dark:text-celo-black rounded-xl text-xs sm:text-sm font-medium hover:from-celo-yellowAlt hover:to-celo-yellow transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
          >
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Conectar Wallet</span>
            <span className="xs:hidden">Conectar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`celo-card celo-border rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display celo-heading">Balance</h3>
        <Wallet className="w-5 h-5 celo-heading" />
      </div>
      
      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-center justify-between p-3 celo-border border rounded-xl">
          <span className="text-sm celo-text">Dirección</span>
          <span className="font-mono text-sm celo-heading">{truncateAddress(address)}</span>
        </div>

        {/* CELO Balance */}
        <div className="flex items-center justify-between p-3 celo-border border rounded-xl">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 celo-heading" />
            <span className="text-sm celo-text">CELO</span>
          </div>
          <span className="font-semibold celo-heading">
            {loading ? '...' : `${celoBalance} CELO`}
          </span>
        </div>

        {/* cUSD Placeholder */}
        <div className="flex items-center justify-between p-3 celo-border border rounded-xl opacity-60">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 celo-text" />
            <span className="text-sm celo-text">cUSD</span>
          </div>
          <div className="text-right">
            <span className="font-semibold celo-text">-- cUSD</span>
            <p className="text-xs celo-text opacity-70">Sincroniza al conectar</p>
          </div>
        </div>
      </div>
    </div>
  );
}

