'use client';

import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConnect } from 'wagmi';
import { encodeFunctionData, type Address } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { getCourseTokenId } from '@/lib/courseToken';
import {
  OPTIMIZED_CONTRACT_CONFIG,
  ENROLLMENT_CACHE_CONFIG,
} from '@/lib/contracts/optimized-badge-config';

interface UseUnifiedEnrollmentProps {
  courseSlug: string;
  courseId: string;
}

interface UnifiedEnrollmentState {
  isEnrolling: boolean;
  enrollmentHash: `0x${string}` | null;
  enrollmentError: string | null;
  enrollmentSuccess: boolean;
  transactionMethod: 'sponsored' | 'wallet' | null;
}

/**
 * UNIFIED ENROLLMENT HOOK
 * 
 * This hook manages both sponsored and non-sponsored enrollment using the same optimized contract.
 * It automatically detects the user's capabilities and chooses the appropriate method:
 * 
 * 1. SPONSORED: If user has smart account ready and can sponsor transactions
 * 2. WALLET: If user has wallet connected but no sponsored transactions
 * 
 * Both methods use the same contract address and ABI, ensuring consistency.
 */
export function useUnifiedEnrollment({ courseSlug, courseId }: UseUnifiedEnrollmentProps) {
  const { authenticated, ready } = usePrivy();
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { writeContract } = useWriteContract();
  const queryClient = useQueryClient();
  
  // Smart Account (for sponsored transactions)
  const {
    smartAccountAddress,
    isSmartAccountReady,
    canSponsorTransaction,
    executeTransaction,
    error: smartAccountError,
    isLoading: smartAccountLoading,
  } = useSmartAccount();

  const [state, setState] = useState<UnifiedEnrollmentState>({
    isEnrolling: false,
    enrollmentHash: null,
    enrollmentError: null,
    enrollmentSuccess: false,
    transactionMethod: null,
  });

  // Get contract configuration (same for both methods)
  const { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI } = OPTIMIZED_CONTRACT_CONFIG;
  
  const resetEnrollment = useCallback(() => {
    setState({
      isEnrolling: false,
      enrollmentHash: null,
      enrollmentError: null,
      enrollmentSuccess: false,
      transactionMethod: null,
    });
  }, []);

  const invalidateEnrollmentCache = useCallback(() => {
    // Invalidate enrollment cache immediately after transaction
    setTimeout(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['readContract', { address: CONTRACT_ADDRESS, functionName: 'isEnrolled' }] 
      });
      console.log('[UNIFIED ENROLLMENT] Cache invalidated for enrollment status');
    }, 1000);
  }, [queryClient, CONTRACT_ADDRESS]);

  /**
   * SPONSORED ENROLLMENT
   * Uses smart account to execute gasless transaction
   */
  const enrollWithSponsoredTransaction = useCallback(async (tokenId: bigint) => {
    console.log('[UNIFIED ENROLLMENT] Using SPONSORED method');
    
    setState(prev => ({
      ...prev,
      isEnrolling: true,
      enrollmentError: null,
      enrollmentHash: null,
      enrollmentSuccess: false,
      transactionMethod: 'sponsored',
    }));

    try {
      // Encode the enroll function call
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'enroll',
        args: [tokenId],
      });

      // Execute sponsored transaction through smart account
      const hash = await executeTransaction({
        to: CONTRACT_ADDRESS,
        data,
        value: 0n,
      });

      if (hash) {
        console.log('[UNIFIED ENROLLMENT] Sponsored enrollment transaction sent:', hash);
        setState(prev => ({
          ...prev,
          enrollmentHash: hash,
          enrollmentSuccess: true,
        }));
        
        invalidateEnrollmentCache();
        return hash;
      } else {
        throw new Error('Sponsored transaction execution failed');
      }
    } catch (error) {
      console.error('[UNIFIED ENROLLMENT] Sponsored enrollment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sponsored enrollment failed';
      
      // Special case: If user is already enrolled, treat as success
      if (errorMessage.includes('Already enrolled') || errorMessage.includes('416c726561647920656e726f6c6c6564')) {
        console.log('[UNIFIED ENROLLMENT] ✅ User already enrolled - treating as success');
        setState(prev => ({
          ...prev,
          enrollmentSuccess: true,
          enrollmentError: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          enrollmentError: errorMessage,
        }));
        throw error;
      }
    } finally {
      setState(prev => ({
        ...prev,
        isEnrolling: false,
      }));
    }
  }, [executeTransaction, CONTRACT_ADDRESS, CONTRACT_ABI, invalidateEnrollmentCache]);

  /**
   * WALLET ENROLLMENT
   * Uses regular wallet signing for transaction
   */
  const enrollWithWalletTransaction = useCallback(async (tokenId: bigint) => {
    console.log('[UNIFIED ENROLLMENT] Using WALLET method');
    
    setState(prev => ({
      ...prev,
      isEnrolling: true,
      enrollmentError: null,
      enrollmentHash: null,
      enrollmentSuccess: false,
      transactionMethod: 'wallet',
    }));

    try {
      // Ensure wallet is connected
      if (!isConnected) {
        const readyConnectors = connectors.filter((c) => (c as any)?.ready);
        const injected = readyConnectors.find((c) => c.id === 'injected');
        const connector = injected || readyConnectors[0];
        if (connector) {
          await connectAsync({ connector });
        } else {
          throw new Error('No wallet connector available');
        }
      }

      // Execute transaction through wagmi - writeContract returns void, we need to handle differently
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'enroll',
        args: [tokenId],
      });

      // writeContract is void, but if it doesn't throw, transaction was initiated
      console.log('[UNIFIED ENROLLMENT] Wallet enrollment transaction initiated');
      setState(prev => ({
        ...prev,
        enrollmentHash: null, // We don't get hash immediately from writeContract
        enrollmentSuccess: true, // Transaction was initiated successfully
      }));
      
      invalidateEnrollmentCache();
      return; // No hash to return from writeContract
    } catch (error) {
      console.error('[UNIFIED ENROLLMENT] Wallet enrollment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Wallet enrollment failed';
      
      setState(prev => ({
        ...prev,
        enrollmentError: errorMessage,
      }));
      throw error;
    } finally {
      setState(prev => ({
        ...prev,
        isEnrolling: false,
      }));
    }
  }, [isConnected, connectAsync, connectors, writeContract, CONTRACT_ADDRESS, CONTRACT_ABI, invalidateEnrollmentCache]);

  /**
   * MAIN ENROLLMENT FUNCTION
   * Automatically chooses between sponsored or wallet method
   */
  const enroll = useCallback(async () => {
    if (!ready || !authenticated) {
      setState(prev => ({
        ...prev,
        enrollmentError: 'User not authenticated',
      }));
      return;
    }

    const tokenId = getCourseTokenId(courseSlug, courseId);
    
    console.log('[UNIFIED ENROLLMENT] Starting enrollment:', {
      courseSlug,
      courseId,
      tokenId: tokenId.toString(),
      canUseSponsored: canSponsorTransaction,
      hasSmartAccount: !!smartAccountAddress,
      isWalletConnected: isConnected,
    });

    // DECISION LOGIC: Choose sponsored vs wallet method
    if (canSponsorTransaction && smartAccountAddress) {
      console.log('[UNIFIED ENROLLMENT] ✅ Using SPONSORED method (gasless)');
      return await enrollWithSponsoredTransaction(tokenId);
    } else {
      console.log('[UNIFIED ENROLLMENT] 🔒 Using WALLET method (requires gas)');
      return await enrollWithWalletTransaction(tokenId);
    }
  }, [
    ready,
    authenticated,
    courseSlug,
    courseId,
    canSponsorTransaction,
    smartAccountAddress,
    isConnected,
    enrollWithSponsoredTransaction,
    enrollWithWalletTransaction,
  ]);

  // Determine capabilities
  const canEnroll = ready && authenticated && (canSponsorTransaction || isConnected);
  const prefersSponsoredMethod = canSponsorTransaction && !!smartAccountAddress;
  
  // Combine errors from both methods
  const combinedError = state.enrollmentError || smartAccountError;
  const isLoading = state.isEnrolling || smartAccountLoading;

  return {
    // Main enrollment function
    enroll,
    
    // State
    isEnrolling: state.isEnrolling,
    enrollmentHash: state.enrollmentHash,
    enrollmentError: combinedError,
    enrollmentSuccess: state.enrollmentSuccess,
    transactionMethod: state.transactionMethod,
    
    // Capabilities
    canEnroll,
    prefersSponsoredMethod,
    isSmartAccountReady,
    smartAccountAddress,
    
    // Utilities
    resetEnrollment,
    isLoading,
    
    // Contract info
    contractAddress: CONTRACT_ADDRESS,
  };
}

/**
 * USAGE EXAMPLE:
 * 
 * const {
 *   enroll,
 *   isEnrolling,
 *   enrollmentSuccess,
 *   enrollmentError,
 *   prefersSponsoredMethod,
 * } = useUnifiedEnrollment({
 *   courseSlug: 'blockchain-basics',
 *   courseId: 'course-123'
 * });
 * 
 * return (
 *   <button 
 *     onClick={enroll}
 *     disabled={isEnrolling}
 *   >
 *     {isEnrolling ? 'Enrolling...' : 
 *      prefersSponsoredMethod ? 'Enroll Free (No Gas)' : 'Enroll with Wallet'}
 *   </button>
 * );
 */