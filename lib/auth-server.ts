/**
 * Basic JWT token validation (simplified for development)
 * In production, you should use proper JWT verification
 */
export async function validatePrivyToken(token: string) {
  try {
    if (!token) {
      return { isValid: false, user: null, error: 'No token provided' };
    }

    // Basic token format validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, user: null, error: 'Invalid token format' };
    }

    // Decode payload (without verification for development)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return { isValid: false, user: null, error: 'Token expired' };
    }
    
    // Check issuer
    if (payload.iss && !payload.iss.includes('privy')) {
      return { isValid: false, user: null, error: 'Invalid issuer' };
    }

    // Return basic user info from token
    return {
      isValid: true,
      user: {
        id: payload.sub,
        linkedAccounts: payload.wallet ? [{ type: 'wallet', address: payload.wallet }] : [],
        email: payload.email,
      },
      userId: payload.sub,
      error: null,
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      isValid: false,
      user: null,
      error: error instanceof Error ? error.message : 'Token validation failed',
    };
  }
}

/**
 * Checks if a user has admin privileges
 */
export function checkAdminRole(user: any): boolean {
  console.log('[DEBUG] Checking admin role for user:', JSON.stringify(user, null, 2));
  if (!user) {
    console.log('[DEBUG] No user provided to checkAdminRole');
    return false;
  }

  // Hardcoded admin wallets - comprehensive list for dashboard access
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
    '0x09BB59c870AA5CB0e7A01b2f96d72B29f3a4BE90'.toLowerCase(),
    // Add any additional admin wallets here
  ];
  
  // Check all linked accounts for wallet addresses
  const walletAddresses = user.linkedAccounts
    ?.filter((account: any) => account.type === 'wallet')
    .map((account: any) => account.address.toLowerCase()) || [];

  console.log('[DEBUG] Admin wallets:', adminWallets);
  console.log('[DEBUG] User wallet addresses:', walletAddresses);

  const hasAdminWallet = walletAddresses.some((address: string) => 
    adminWallets.includes(address)
  );
  
  console.log('[DEBUG] Has admin wallet:', hasAdminWallet);

  if (hasAdminWallet) {
    console.log('[DEBUG] User has admin wallet access - GRANTED');
    return true;
  }

  // Check for admin role in custom claims (if using Privy's custom claims)
  if (user.customClaims?.role === 'admin') {
    console.log('[DEBUG] User has admin custom claim - GRANTED');
    return true;
  }

  // Fallback: check if any wallet address directly matches (case insensitive)
  if (user.wallet?.address) {
    const userWallet = user.wallet.address.toLowerCase();
    if (adminWallets.includes(userWallet)) {
      console.log('[DEBUG] Direct wallet match found - GRANTED');
      return true;
    }
  }

  // Additional fallback: check email-based admin access
  const adminEmails = ['cesar@celo.mx', 'admin@celo.mx']; // Hardcode admin emails too
  const userEmail = user.email?.address?.toLowerCase() || user.email?.toLowerCase();
  
  if (userEmail && adminEmails.includes(userEmail)) {
    console.log('[DEBUG] User has admin email - GRANTED');
    return true;
  }

  console.log('[DEBUG] No admin access found - DENIED');
  return false;
}

/**
 * Validates token and checks admin role in one call
 */
export async function validateAdminToken(token: string) {
  const validation = await validatePrivyToken(token);
  
  if (!validation.isValid) {
    return {
      ...validation,
      isAdmin: false,
    };
  }

  const isAdmin = checkAdminRole(validation.user);
  
  return {
    ...validation,
    isAdmin,
  };
}

/**
 * Middleware helper to extract and validate token from request
 */
export async function getAuthenticatedUser(request: Request) {
  console.log('[DEBUG] Getting authenticated user from request');
  
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  let token: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
    console.log('[DEBUG] Found token in Authorization header');
  }

  // Try to get token and wallet from cookies if not in header
  const cookiesHeader = request.headers.get('cookie');
  console.log('[DEBUG] Cookies:', cookiesHeader ? 'present' : 'none');
  let walletFromCookie: string | null = null;
  if (cookiesHeader) {
    if (!token) {
      const tokenMatch = cookiesHeader.match(/privy-token=([^;]+)/);
      token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
      console.log('[DEBUG] Token from cookies:', token ? 'found' : 'not found');
    }
    const walletMatch = cookiesHeader.match(/wallet-address=([^;]+)/);
    walletFromCookie = walletMatch ? decodeURIComponent(walletMatch[1]) : null;
    console.log('[DEBUG] Wallet from cookie:', walletFromCookie || 'none');
  }

  if (!token) {
    console.log('[DEBUG] No authentication token found');
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: 'No authentication token found',
    };
  }

  console.log('[DEBUG] Validating token...');
  const validation = await validateAdminToken(token);
  console.log('[DEBUG] Token validation result:', {
    isValid: validation.isValid,
    isAdmin: validation.isAdmin,
    error: validation.error
  });

  // Fallback: if not admin yet, but wallet cookie exists, try with wallet from cookie
  if (validation.isValid && !validation.isAdmin && walletFromCookie) {
    const fallbackUser = {
      ...(validation.user || {}),
      wallet: { address: walletFromCookie },
      linkedAccounts: [
        ...((validation.user && (validation.user as any).linkedAccounts) || []),
        { type: 'wallet', address: walletFromCookie },
      ],
    } as any;
    const fallbackAdmin = checkAdminRole(fallbackUser);
    console.log('[DEBUG] Fallback admin check with cookie wallet:', {
      walletFromCookie,
      fallbackAdmin,
    });
    if (fallbackAdmin) {
      return {
        isAuthenticated: true,
        isAdmin: true,
        user: fallbackUser,
        error: undefined,
      };
    }
  }

  return {
    isAuthenticated: validation.isValid,
    isAdmin: validation.isAdmin,
    user: validation.user,
    error: validation.error || undefined,
  };
}

/**
 * Extract user wallet address from authentication
 */
export function getUserWalletAddress(user: any): string | null {
  if (!user) return null;
  
  // Try linked accounts first (most reliable)
  const walletAccount = user.linkedAccounts?.find((account: any) => account.type === 'wallet');
  if (walletAccount?.address) {
    return walletAccount.address.toLowerCase();
  }
  
  // Fallback to direct wallet property
  if (user.wallet?.address) {
    return user.wallet.address.toLowerCase();
  }
  
  return null;
}
