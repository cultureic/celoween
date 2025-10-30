'use client';

import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { encodeFunctionData, type Address } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { getCourseTokenId } from '@/lib/courseToken';
import {
  OPTIMIZED_CONTRACT_CONFIG,
  ENROLLMENT_CACHE_CONFIG,
} from '@/lib/contracts/optimized-badge-config';

// Use unified contract configuration (SINGLE SOURCE OF TRUTH)
const { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI } = OPTIMIZED_CONTRACT_CONFIG;

interface SponsoredEnrollmentState {
  isEnrolling: boolean;
  enrollmentHash: `0x${string}` | null;
  enrollmentError: string | null;
  enrollmentSuccess: boolean;
}

interface UseSponsoredEnrollmentProps {
  courseSlug: string;
  courseId: string;
}


export function useSponsoredEnrollment({ courseSlug, courseId }: UseSponsoredEnrollmentProps) {
  const { authenticated, ready } = usePrivy();
  const queryClient = useQueryClient();
  const {
    smartAccountAddress,
    isSmartAccountReady,
    canSponsorTransaction,
    executeTransaction,
    error: smartAccountError,
    isLoading: smartAccountLoading,
  } = useSmartAccount();

  const [state, setState] = useState<SponsoredEnrollmentState>({
    isEnrolling: false,
    enrollmentHash: null,
    enrollmentError: null,
    enrollmentSuccess: false,
  });

  const enrollWithSponsorship = useCallback(async () => {
    if (!ready || !authenticated) {
      setState(prev => ({
        ...prev,
        enrollmentError: 'User not authenticated',
      }));
      return;
    }

    if (!isSmartAccountReady || !smartAccountAddress || !canSponsorTransaction) {
      setState(prev => ({
        ...prev,
        enrollmentError: 'Smart account not ready for sponsored transactions',
      }));
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isEnrolling: true,
        enrollmentError: null,
        enrollmentHash: null,
        enrollmentSuccess: false,
      }));

      const tokenId = getCourseTokenId(courseSlug, courseId);
      const contractAddress = CONTRACT_ADDRESS;

      console.log('[SPONSORED ENROLLMENT] Starting sponsored enrollment:', {
        courseSlug,
        courseId,
        tokenId: tokenId.toString(),
        smartAccountAddress,
        contractAddress,
      });

      // Encode the enroll function call (optimized contract)
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'enroll',
        args: [tokenId],
      });

      // Execute sponsored transaction through smart account
      const hash = await executeTransaction({
        to: contractAddress,
        data,
        value: 0n,
      });

      if (hash) {
        console.log('[SPONSORED ENROLLMENT] Enrollment transaction sent:', hash);
        setState(prev => ({
          ...prev,
          enrollmentHash: hash,
          enrollmentSuccess: true,
        }));
        
        // Invalidate enrollment cache immediately after transaction is sent
        setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: ['readContract', { address: CONTRACT_ADDRESS, functionName: 'isEnrolled' }] 
          });
        }, 1000);
      } else {
        throw new Error('Transaction execution failed');
      }

    } catch (error) {
      console.error('[SPONSORED ENROLLMENT] Enrollment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Enrollment failed';
      
      // SPECIAL CASE: If user is already enrolled, treat as success
      if (errorMessage.includes('Already enrolled') || errorMessage.includes('416c726561647920656e726f6c6c6564')) {
        console.log('[SPONSORED ENROLLMENT] ✅ User already enrolled - treating as success');
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
      }
    } finally {
      setState(prev => ({
        ...prev,
        isEnrolling: false,
      }));
    }
  }, [
    ready,
    authenticated,
    isSmartAccountReady,
    smartAccountAddress,
    canSponsorTransaction,
    courseSlug,
    courseId,
    executeTransaction,
    queryClient,
  ]);

  const resetEnrollment = useCallback(() => {
    setState({
      isEnrolling: false,
      enrollmentHash: null,
      enrollmentError: null,
      enrollmentSuccess: false,
    });
  }, []);

  // Combine smart account and enrollment errors
  const combinedError = state.enrollmentError || smartAccountError;
  const isLoading = state.isEnrolling || smartAccountLoading;

  return {
    // Enrollment state
    isEnrolling: state.isEnrolling,
    enrollmentHash: state.enrollmentHash,
    enrollmentError: combinedError,
    enrollmentSuccess: state.enrollmentSuccess,
    
    // Smart account state
    isSmartAccountReady,
    smartAccountAddress,
    canSponsorTransaction,
    
    // Actions
    enrollWithSponsorship,
    resetEnrollment,
    
    // Combined loading state
    isLoading,
  };
}

/**
 * Hook for sponsored module completion
 */
interface UseSponsoredModuleCompletionProps {
  courseSlug: string;
  courseId: string;
}

export function useSponsoredModuleCompletion({ 
  courseSlug, 
  courseId 
}: UseSponsoredModuleCompletionProps) {
  const { authenticated, ready } = usePrivy();
  const queryClient = useQueryClient();
  const {
    smartAccountAddress,
    isSmartAccountReady,
    canSponsorTransaction,
    executeTransaction,
    error: smartAccountError,
    isLoading: smartAccountLoading,
  } = useSmartAccount();

  const [state, setState] = useState({
    isCompleting: false,
    completionHash: null as `0x${string}` | null,
    completionError: null as string | null,
    completionSuccess: false,
  });

  const completeModuleWithSponsorship = useCallback(async (moduleIndex: number) => {
    if (!ready || !authenticated) {
      setState(prev => ({
        ...prev,
        completionError: 'User not authenticated',
      }));
      return;
    }

    if (!isSmartAccountReady || !smartAccountAddress || !canSponsorTransaction) {
      setState(prev => ({
        ...prev,
        completionError: 'Smart account not ready for sponsored transactions',
      }));
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isCompleting: true,
        completionError: null,
        completionHash: null,
        completionSuccess: false,
      }));

      const tokenId = getCourseTokenId(courseSlug, courseId);
      const contractAddress = CONTRACT_ADDRESS;

      console.log('[SPONSORED MODULE COMPLETION] Starting sponsored module completion:', {
        courseSlug,
        courseId,
        moduleIndex,
        contractModuleIndex: moduleIndex + 1,
        tokenId: tokenId.toString(),
        smartAccountAddress,
        contractAddress,
      });

      // Encode the completeModule function call (optimized contract)
      // FIX: Contract expects 1-based module indices (0 is reserved for enrollment)
      const contractModuleIndex = moduleIndex + 1;
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'completeModule',
        args: [tokenId, contractModuleIndex],
      });

      // Execute sponsored transaction through smart account
      const hash = await executeTransaction({
        to: contractAddress,
        data,
        value: 0n,
      });

      if (hash) {
        console.log('[SPONSORED MODULE COMPLETION] Module completion transaction sent:', hash);
        setState(prev => ({
          ...prev,
          completionHash: hash,
          completionSuccess: true,
        }));
        
        // Invalidate module completion cache immediately after transaction is sent
        setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: ['readContract', { address: CONTRACT_ADDRESS, functionName: 'isModuleCompleted' }] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['readContract', { address: CONTRACT_ADDRESS, functionName: 'getModulesCompleted' }] 
          });
        }, 1000);
      } else {
        throw new Error('Transaction execution failed');
      }

    } catch (error) {
      console.error('[SPONSORED MODULE COMPLETION] Module completion failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Module completion failed';
      setState(prev => ({
        ...prev,
        completionError: errorMessage,
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isCompleting: false,
      }));
    }
  }, [
    ready,
    authenticated,
    isSmartAccountReady,
    smartAccountAddress,
    canSponsorTransaction,
    courseSlug,
    courseId,
    executeTransaction,
    queryClient,
  ]);

  const resetCompletion = useCallback(() => {
    setState({
      isCompleting: false,
      completionHash: null,
      completionError: null,
      completionSuccess: false,
    });
  }, []);

  const combinedError = state.completionError || smartAccountError;
  const isLoading = state.isCompleting || smartAccountLoading;

  return {
    // Module completion state
    isCompleting: state.isCompleting,
    completionHash: state.completionHash,
    completionError: combinedError,
    completionSuccess: state.completionSuccess,
    
    // Smart account state
    isSmartAccountReady,
    smartAccountAddress,
    canSponsorTransaction,
    
    // Actions
    completeModuleWithSponsorship,
    resetCompletion,
    
    // Combined loading state
    isLoading,
  };
}