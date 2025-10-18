'use client';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  LogOut, 
  User, 
  Wallet, 
  ExternalLink,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePrivy } from '@privy-io/react-auth';

export default function PrivyLogin() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Emergency reset function for stuck sessions
  const forceReset = () => {
    localStorage.removeItem('privy:token');
    localStorage.removeItem('privy:refresh_token');
    localStorage.removeItem('privy:identity_token');
    localStorage.removeItem('privy-token');
    document.cookie = 'privy-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'wallet-address=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.reload();
  };
  
  const auth = useAuth();
  
  // DIRECT PRIVY ACCESS FOR DEBUGGING
  const {
    authenticated: privyAuthenticated,
    ready: privyReady,
    user: privyUser,
    login: privyLogin,
    logout: privyLogout
  } = usePrivy();
  
  console.log('[PRIVY LOGIN DEBUG]', {
    useAuthResult: {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      hasUser: !!auth.user,
      hasWallet: !!auth.wallet?.address
    },
    directPrivy: {
      authenticated: privyAuthenticated,
      ready: privyReady,
      hasUser: !!privyUser,
      loginFunction: typeof privyLogin
    }
  });
  
  // Use direct Privy values
  const isAuthenticated = privyAuthenticated;
  const isLoading = !privyReady;
  const user = privyUser;
  const wallet = auth.wallet;
  const login = privyLogin;
  const logout = privyLogout;



  function truncate(address: string) {
    return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';
  }

  const copyAddress = async () => {
    if (!wallet.address) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 bg-transparent text-black dark:text-celo-yellow rounded-full text-[10px] sm:text-xs font-bold border border-celo-border border-[0.7px]">
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="hidden xs:inline">Conectando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button 
        onClick={login} 
        className="group relative overflow-hidden flex items-center gap-1.5 sm:gap-2 px-4 py-2 bg-transparent text-black dark:text-celo-yellow rounded-full text-[10px] sm:text-xs font-bold border border-celo-border border-[0.7px] transition-colors"
      >
        <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 dark:group-hover:text-black">
          <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black dark:text-celo-yellow dark:group-hover:text-black" />
          <span className="hidden xs:inline dark:group-hover:text-black">Conectar Wallet</span>
          <span className="xs:hidden dark:group-hover:text-black">Conectar</span>
        </span>
        <span className="pointer-events-none absolute inset-0 m-auto h-full w-full rounded-full bg-[#fcf6f1] scale-0 transition-transform duration-300 ease-out group-hover:scale-150" />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Wallet Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/30 rounded-xl text-xs sm:text-sm hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-ping opacity-75" />
          </div>
          <span className="font-mono text-xs text-celo-black dark:text-celo-yellow">{truncate(wallet.address || '')}</span>
        </div>
        <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform text-celo-black/70 dark:text-celo-yellow/70 ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu - Glassmorphism */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 backdrop-blur-3xl bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          
          <div className="relative p-4 sm:p-5 space-y-3 sm:space-y-4">
            {/* User Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-celo-black dark:text-celo-yellow">
                <User className="w-3 h-3" />
                <span>Usuario Conectado</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/25 dark:bg-black/25 border border-white/30 dark:border-white/25 backdrop-blur-md">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-celo-yellow to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                  {user?.email?.address?.slice(0, 1).toUpperCase() || wallet.address?.slice(2, 4).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-celo-black dark:text-celo-yellow">
                    {user?.email?.address || 'Wallet User'}
                  </div>
                  <div className="text-xs text-celo-black/70 dark:text-celo-yellow/70">
                    {user?.linkedAccounts?.length || 1} account{(user?.linkedAccounts?.length || 1) !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-celo-black dark:text-celo-yellow">
                <Wallet className="w-3 h-3" />
                <span>Wallet Conectada</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/25 dark:bg-black/25 border border-white/30 dark:border-white/25 backdrop-blur-md">
                <span className="font-mono text-sm text-celo-black dark:text-celo-yellow font-semibold">{truncate(wallet.address || '')}</span>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/30 hover:bg-white/40 border border-white/40 rounded-lg transition-all duration-200 backdrop-blur-lg text-celo-black dark:text-celo-yellow font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 font-medium">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Network Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-celo-black dark:text-celo-yellow">
                <Globe className="w-3 h-3" />
                <span>Red</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/25 dark:bg-black/25 border border-white/30 dark:border-white/25 backdrop-blur-md">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-sm text-celo-black dark:text-celo-yellow font-semibold">Celo Mainnet</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              {/* Account Button */}
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-celo-black dark:text-celo-yellow hover:bg-white/30 dark:hover:bg-black/30 rounded-xl transition-all duration-200 backdrop-blur-lg group font-medium"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Mi Cuenta</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Disconnect Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-200 backdrop-blur-lg group font-medium"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Desconectar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


