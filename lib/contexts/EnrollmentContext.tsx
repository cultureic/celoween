"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCourseEnrollmentBadge } from '@/lib/hooks/useSimpleBadge';
import { getOptimizedContractConfig } from '@/lib/contracts/optimized-badge-config';
import { getCourseTokenId } from '@/lib/courseToken';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { encodeFunctionData } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';
import { useChainId } from 'wagmi';
import { useDirectMainnetEnrollment } from '@/lib/hooks/useDirectMainnetReads';
import type { Address } from 'viem';

interface EnrollmentState {
  hasBadge: boolean;
  hasClaimed: boolean;
  isLoading: boolean;
  enrollInCourse: () => Promise<void>;
  enrollmentHash?: `0x${string}`;
  enrollmentError?: Error | null;
  isEnrolling: boolean;
  isConfirmingEnrollment: boolean;
  enrollmentSuccess: boolean;
  serverHasAccess: boolean;
  isWalletConnected: boolean;
  userAddress?: Address;
}

const EnrollmentContext = createContext<EnrollmentState | null>(null);

interface EnrollmentProviderProps {
  children: ReactNode;
  courseSlug: string;
  courseId: string;
  serverHasAccess: boolean;
}

export function EnrollmentProvider({
  children,
  courseSlug,
  courseId,
  serverHasAccess,
}: EnrollmentProviderProps) {
  console.log('[ENROLLMENT CONTEXT] Initializing for course:', courseSlug);
  
  const { isAuthenticated, wallet } = useAuth();
  const { authenticated: privyAuthenticated } = usePrivy();
  const queryClient = useQueryClient();
  // Force mainnet regardless of connected wallet chain
  const contractConfig = getOptimizedContractConfig(42220);
  const userAddress = wallet?.address as Address | undefined;
  const isWalletConnected = isAuthenticated && !!userAddress;
  
  console.log('[ENROLLMENT CONTEXT] Using MAINNET contract (FORCED):', contractConfig.address);

  // ZERODEV SMART ACCOUNT - Sponsored transactions
  const smartAccount = useSmartAccount();
  
  // DIRECT MAINNET CHECK: Bypass wagmi completely for guaranteed mainnet reads
  const tokenId = getCourseTokenId(courseSlug, courseId);
  const addressForEnrollmentCheck = smartAccount.smartAccountAddress || userAddress;
  
  console.log('[ENROLLMENT CONTEXT] Using direct mainnet check for addresses:', {
    userAddress,
    smartAccountAddress: smartAccount.smartAccountAddress,
    finalCheckAddress: addressForEnrollmentCheck,
    tokenId: tokenId.toString(),
  });
  
  const directMainnetCheck = useDirectMainnetEnrollment(addressForEnrollmentCheck, tokenId);
  
  
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isConfirmingEnrollment, setIsConfirmingEnrollment] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [enrollmentError, setEnrollmentError] = useState<Error | null>(null);

  console.log('[ENROLLMENT CONTEXT] Enrollment state (DIRECT MAINNET):', {
    directMainnetEnrolled: directMainnetCheck.isEnrolled,
    directMainnetLoading: directMainnetCheck.isLoading,
    directMainnetError: directMainnetCheck.error,
    isEnrolling,
    isConfirmingEnrollment,
    hasWallet: isWalletConnected,
    canSponsorTransaction: smartAccount.canSponsorTransaction,
    smartAccountReady: smartAccount.isSmartAccountReady,
    serverHasAccess,
  });

  // FORCED SPONSORED ENROLLMENT - ZeroDev smart account with paymaster (MAINNET ONLY)
  const enrollInCourse = async () => {
    console.log('[ENROLLMENT] Starting FORCED sponsored enrollment on MAINNET');
    
    if (!isWalletConnected || !userAddress) {
      throw new Error('Wallet not connected');
    }
    
    if (!smartAccount.canSponsorTransaction) {
      throw new Error('Smart account not ready for sponsored transactions. Please wait for smart account initialization.');
    }
    
    const tokenId = getCourseTokenId(courseSlug, courseId);
    
    setIsEnrolling(true);
    setEnrollmentError(null);
    
    try {
      // Encode the function call data
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: 'enroll',
        args: [tokenId],
      });
      
      console.log('[ENROLLMENT] ✅ EXECUTING FORCED MAINNET TRANSACTION:', {
        to: contractConfig.address,
        chainId: 42220, // Celo Mainnet
        rpc: 'https://forno.celo.org',
        data: encodedData,
        tokenId: tokenId.toString(),
      });
      
      // Use ZeroDev sponsored transaction - THIS ALWAYS GOES TO MAINNET
      const txHash = await smartAccount.executeTransaction({
        to: contractConfig.address as `0x${string}`,
        data: encodedData,
        value: 0n,
      });
      
      if (txHash) {
        setHash(txHash);
        console.log('[ENROLLMENT] ✅ Sponsored transaction sent:', txHash);
        
        setIsConfirmingEnrollment(true);
        
        // Wait for transaction confirmation before invalidating cache
        try {
          // Wait for the transaction to be mined (3 seconds should be enough for Celo)
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Invalidate all relevant caches
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['readContract'] }),
            queryClient.invalidateQueries({ queryKey: ['hasBadge'] }),
            queryClient.invalidateQueries({ queryKey: ['hasClaimed'] }),
          ]);
          
          console.log('[ENROLLMENT] ✅ Cache invalidated after transaction confirmation');
        } catch (cacheError) {
          console.warn('[ENROLLMENT] ⚠️ Cache invalidation failed:', cacheError);
        } finally {
          setIsConfirmingEnrollment(false);
        }
      }
    } catch (error: any) {
      console.error('[ENROLLMENT] ❌ Sponsored transaction failed:', error);
      setEnrollmentError(new Error(error.message || 'Enrollment failed'));
      throw error;
    } finally {
      setIsEnrolling(false);
    }
  };


  const enrollmentState: EnrollmentState = {
    hasBadge: directMainnetCheck.isEnrolled,
    hasClaimed: directMainnetCheck.isEnrolled, // Same as hasBadge for optimized contract
    isLoading: directMainnetCheck.isLoading,
    enrollInCourse,
    enrollmentHash: hash,
    enrollmentError: enrollmentError || directMainnetCheck.error,
    isEnrolling,
    isConfirmingEnrollment,
    enrollmentSuccess: !!hash && !isConfirmingEnrollment,
    serverHasAccess,
    isWalletConnected,
    userAddress,
  };

  return (
    <EnrollmentContext.Provider value={enrollmentState}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
}

/**
 * Utility hook to determine if user has access to course content
 */
export function useHasAccess() {
  const enrollment = useEnrollment();
  
  // Check access from multiple sources:
  // 1. Server-side access (already enrolled)
  // 2. Legacy badge/claim status (from SimpleBadge contract)
  // 3. Recent enrollment success (from sponsored or legacy enrollment)
  const hasAccess = enrollment.serverHasAccess || 
                   enrollment.hasBadge || 
                   enrollment.hasClaimed || 
                   enrollment.enrollmentSuccess;

  console.log('[ENROLLMENT ACCESS] Access check:', {
    serverHasAccess: enrollment.serverHasAccess,
    hasBadge: enrollment.hasBadge,
    hasClaimed: enrollment.hasClaimed,
    enrollmentSuccess: enrollment.enrollmentSuccess,
    finalHasAccess: hasAccess,
  });

  return hasAccess;
}
