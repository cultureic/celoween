'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export interface UseAuthReturn {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  
  // Token management
  accessToken: string | null;
  getAccessToken: () => Promise<string>;
  
  // Admin role management
  isAdmin: boolean;
  checkAdminRole: () => boolean;
  
  // Auth actions
  login: () => void;
  logout: () => Promise<void>;
  
  // Wallet info
  wallet: {
    address: string | null;
    chainId: number | null;
  };
}

export function useAuth(): UseAuthReturn {
  const {
    authenticated,
    ready,
    user,
    login,
    logout,
    getAccessToken,
  } = usePrivy();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get the primary wallet from linked accounts
  const wallet = user?.linkedAccounts?.find(
    (account: any) => account.type === 'wallet'
  ) || null;

  // Update access token when authentication state changes
  useEffect(() => {
    const updateToken = async () => {
      if (authenticated && ready) {
        try {
          const token = await getAccessToken();
          setAccessToken(token);
          
          // Store token in localStorage for middleware access
          if (token) {
            localStorage.setItem('privy-token', token);
            
            // Also set as cookie for SSR
            document.cookie = `privy-token=${token}; path=/; max-age=86400; SameSite=strict`;
          }

          // Persist current wallet address in a cookie for SSR admin checks
          const currentWallet = (wallet as any)?.address;
          if (currentWallet) {
            document.cookie = `wallet-address=${currentWallet}; path=/; max-age=86400; SameSite=strict`;
          }
        } catch (error) {
          console.error('Failed to get access token:', error);
          setAccessToken(null);
        }
      } else {
        setAccessToken(null);
        localStorage.removeItem('privy-token');
        // Clear cookies
        document.cookie = 'privy-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'wallet-address=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    };

    updateToken();
  }, [authenticated, ready, getAccessToken, wallet]);

  // Check admin role based on user data - HARDCODED ADMIN WALLETS
  const checkAdminRole = () => {
    if (!user || !wallet) return false;

    // Hardcoded admin wallets - must match server-side list in auth-server.ts
    const adminWallets = [
      '0x9f42Caf52783EF12d8174d33c281a850b8eA58aD'.toLowerCase(),
      '0x742d35Cc6634C0532925a3b8D43C6c4C1C46ff59'.toLowerCase(),
      '0x8ba1f109551bD432803012645Hac136c82C3c6f9'.toLowerCase(),
      '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase(),
      '0xA0b86a33E6441E6C4c2c4b24d4bE7E62E4c5F8c'.toLowerCase(),
      '0x0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'.toLowerCase(),
      '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB'.toLowerCase(),
      '0x583031D1113aD414F02576BD6afaBfb302140225'.toLowerCase(),
      '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'.toLowerCase(),
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'.toLowerCase(),
      '0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase(),
      '0x514910771AF9Ca656af840dff83E8264EcF986CA'.toLowerCase(),
      '0xbd7b5d8Fdc2d21e73350741ff5C4cAC335B219a2'.toLowerCase(),
    ];
    const walletAddress = (wallet as any)?.address?.toLowerCase();
    
    console.log('[DEBUG] Client-side admin check:', {
      walletAddress,
      adminWallets,
      isMatch: walletAddress && adminWallets.includes(walletAddress)
    });
    
    if (walletAddress && adminWallets.includes(walletAddress)) {
      console.log('[DEBUG] ADMIN ACCESS GRANTED - wallet match found');
      return true;
    }

    // Check for admin role in user custom claims (if using Privy's custom claims)
    if ((user as any)?.customClaims?.role === 'admin') {
      return true;
    }

    return false;
  };

  // Update admin status when user changes
  useEffect(() => {
    const isAdminResult = checkAdminRole();
    console.log('[DEBUG] useAuth admin check', {
      user: !!user,
      wallet: !!wallet,
      walletAddress: (wallet as any)?.address,
      isAdminResult,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
    });
    setIsAdmin(isAdminResult);
  }, [user, wallet]);

  // Enhanced logout that cleans up tokens and admin state
  const handleLogout = async () => {
    try {
      await logout();
      setAccessToken(null);
      setIsAdmin(false);
      localStorage.removeItem('privy-token');
      document.cookie = 'privy-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'wallet-address=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Enhanced getAccessToken with error handling
  const getTokenSafely = async (): Promise<string> => {
    if (!authenticated) {
      throw new Error('User not authenticated');
    }
    
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('No token received');
      return token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw error;
    }
  };

  return {
    // Authentication state
    isAuthenticated: authenticated,
    isLoading: false, // Force ready to bypass stuck state
    user,
    
    // Token management
    accessToken,
    getAccessToken: getTokenSafely,
    
    // Admin role management
    isAdmin,
    checkAdminRole,
    
    // Auth actions
    login,
    logout: handleLogout,
    
    // Wallet info
    wallet: {
      address: (wallet as any)?.address || null,
      chainId: (wallet as any)?.chainId || null,
    },
  };
}

// Hook for admin-only components - NO REDIRECTS, JUST AUTH DATA
export function useRequireAdmin() {
  const auth = useAuth();
  
  useEffect(() => {
    console.log('[DEBUG] useRequireAdmin called', {
      isAuthenticated: auth.isAuthenticated,
      isAdmin: auth.isAdmin,
      nodeEnv: process.env.NODE_ENV,
      currentPath: window.location.pathname,
      currentWallet: auth.wallet.address
    });
    
    // NO REDIRECTS - Admin access is controlled client-side only
    console.log('[DEBUG] Client-side admin auth only - no redirects');
  }, [auth.isAuthenticated, auth.isAdmin]);
  
  return auth;
}

// Hook for authenticated-only components
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect unauthenticated users to login
      window.location.href = '/login';
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  
  return auth;
}