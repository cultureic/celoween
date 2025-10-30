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
  MODULE_CACHE_CONFIG,
} from '@/lib/contracts/optimized-badge-config';

// Use unified contract configuration (SINGLE SOURCE OF TRUTH)
const { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI } = OPTIMIZED_CONTRACT_CONFIG;

interface ZeroDevTransactionState {
  isProcessing: boolean;
  transactionHash: `0x${string}` | null;
  error: string | null;
  success: boolean;
}

interface UseZeroDevEnrollmentProps {
  courseSlug: string;
  courseId: string;
}


export function useZeroDevEnrollment({ courseSlug, courseId }: UseZeroDevEnrollmentProps) {
  const { authenticated, ready } = usePrivy();
  const queryClient = useQueryClient();
  const {
    kernelClient,
    smartAccountAddress,
    isInitializing,
    canSponsorTransaction,
    executeTransaction,
    error: smartAccountError,
  } = useSmartAccount();

  const [enrollmentState, setEnrollmentState] = useState<ZeroDevTransactionState>({
    isProcessing: false,
    transactionHash: null,
    error: null,
    success: false,
  });

  const [moduleCompletionState, setModuleCompletionState] = useState<ZeroDevTransactionState>({
    isProcessing: false,
    transactionHash: null,
    error: null,
    success: false,
  });

  const [certificateState, setCertificateState] = useState<ZeroDevTransactionState>({
    isProcessing: false,
    transactionHash: null,
    error: null,
    success: false,
  });

  const enrollWithZeroDev = useCallback(async () => {
    if (!ready || !authenticated) {
      setEnrollmentState(prev => ({
        ...prev,
        error: 'User not authenticated',
      }));
      return;
    }

    if (!canSponsorTransaction || !smartAccountAddress) {
      setEnrollmentState(prev => ({
        ...prev,
        error: 'Smart account not ready for sponsored transactions',
      }));
      return;
    }

    try {
      setEnrollmentState({
        isProcessing: true,
        transactionHash: null,
        error: null,
        success: false,
      });

      const tokenId = getCourseTokenId(courseSlug, courseId);
      const contractAddress = CONTRACT_ADDRESS;

      console.log('[ZERODEV ENROLLMENT] Starting enrollment:', {
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

      // Execute through ZeroDev with automatic gas sponsorship
      const hash = await executeTransaction({
        to: contractAddress,
        data,
        value: 0n,
      });

      if (hash) {
        console.log('[ZERODEV ENROLLMENT] Transaction sent:', hash);
        setEnrollmentState({
          isProcessing: false,
          transactionHash: hash,
          error: null,
          success: true,
        });
        
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
      console.error('[ZERODEV ENROLLMENT] Failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Enrollment failed';
      setEnrollmentState({
        isProcessing: false,
        transactionHash: null,
        error: errorMessage,
        success: false,
      });
    }
  }, [
    ready,
    authenticated,
    canSponsorTransaction,
    smartAccountAddress,
    courseSlug,
    courseId,
    executeTransaction,
    queryClient,
  ]);

  const completeModuleWithZeroDev = useCallback(async (moduleIndex: number) => {
    if (!ready || !authenticated) {
      setModuleCompletionState(prev => ({
        ...prev,
        error: 'User not authenticated',
      }));
      return;
    }

    if (!canSponsorTransaction || !smartAccountAddress) {
      setModuleCompletionState(prev => ({
        ...prev,
        error: 'Smart account not ready for sponsored transactions',
      }));
      return;
    }

    try {
      setModuleCompletionState({
        isProcessing: true,
        transactionHash: null,
        error: null,
        success: false,
      });

      const tokenId = getCourseTokenId(courseSlug, courseId);
      const contractAddress = CONTRACT_ADDRESS;

      console.log('[ZERODEV MODULE] Starting module completion:', {
        courseSlug,
        courseId,
        moduleIndex,
        tokenId: tokenId.toString(),
        smartAccountAddress,
        contractAddress,
      });

      // Encode the completeModule function call (optimized contract)
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'completeModule',
        args: [tokenId, moduleIndex],
      });

      // Execute through ZeroDev with automatic gas sponsorship
      const hash = await executeTransaction({
        to: contractAddress,
        data,
        value: 0n,
      });

      if (hash) {
        console.log('[ZERODEV MODULE] Transaction sent:', hash);
        setModuleCompletionState({
          isProcessing: false,
          transactionHash: hash,
          error: null,
          success: true,
        });
        
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
      console.error('[ZERODEV MODULE] Failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Module completion failed';
      setModuleCompletionState({
        isProcessing: false,
        transactionHash: null,
        error: errorMessage,
        success: false,
      });
    }
  }, [
    ready,
    authenticated,
    canSponsorTransaction,
    smartAccountAddress,
    courseSlug,
    courseId,
    executeTransaction,
    queryClient,
  ]);

  const generateCertificateWithZeroDev = useCallback(async () => {
    if (!ready || !authenticated) {
      setCertificateState(prev => ({
        ...prev,
        error: 'User not authenticated',
      }));
      return;
    }

    if (!canSponsorTransaction || !smartAccountAddress) {
      setCertificateState(prev => ({
        ...prev,
        error: 'Smart account not ready for sponsored transactions',
      }));
      return;
    }

    try {
      setCertificateState({
        isProcessing: true,
        transactionHash: null,
        error: null,
        success: false,
      });

      const tokenId = getCourseTokenId(courseSlug, courseId);
      const contractAddress = CONTRACT_ADDRESS;

      console.log('[ZERODEV CERTIFICATE] Starting certificate generation:', {
        courseSlug,
        courseId,
        tokenId: tokenId.toString(),
        smartAccountAddress,
        contractAddress,
      });

      // Note: adminMint function doesn't exist in optimized contract
      // For now, skip certificate generation - focus on enrollment/modules
      throw new Error('Certificate generation not supported with optimized contract yet');

    } catch (error) {
      console.error('[ZERODEV CERTIFICATE] Failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Certificate generation failed';
      setCertificateState({
        isProcessing: false,
        transactionHash: null,
        error: errorMessage,
        success: false,
      });
    }
  }, [
    ready,
    authenticated,
    canSponsorTransaction,
    smartAccountAddress,
    courseSlug,
    courseId,
  ]);

  const resetStates = useCallback(() => {
    setEnrollmentState({
      isProcessing: false,
      transactionHash: null,
      error: null,
      success: false,
    });
    setModuleCompletionState({
      isProcessing: false,
      transactionHash: null,
      error: null,
      success: false,
    });
    setCertificateState({
      isProcessing: false,
      transactionHash: null,
      error: null,
      success: false,
    });
  }, []);

  // Combine errors from smart account and transaction states
  const combinedError = smartAccountError || 
                       enrollmentState.error || 
                       moduleCompletionState.error || 
                       certificateState.error;

  const isLoading = isInitializing || 
                   enrollmentState.isProcessing || 
                   moduleCompletionState.isProcessing || 
                   certificateState.isProcessing;

  return {
    // Smart account state
    smartAccountAddress,
    isSmartAccountReady: canSponsorTransaction,
    isInitializingSmartAccount: isInitializing,
    
    // Enrollment
    enrollWithZeroDev,
    enrollmentHash: enrollmentState.transactionHash,
    enrollmentSuccess: enrollmentState.success,
    isEnrolling: enrollmentState.isProcessing,
    
    // Module completion
    completeModuleWithZeroDev,
    moduleCompletionHash: moduleCompletionState.transactionHash,
    moduleCompletionSuccess: moduleCompletionState.success,
    isCompletingModule: moduleCompletionState.isProcessing,
    
    // Certificate generation
    generateCertificateWithZeroDev,
    certificateHash: certificateState.transactionHash,
    certificateSuccess: certificateState.success,
    isGeneratingCertificate: certificateState.isProcessing,
    
    // Combined state
    error: combinedError,
    isLoading,
    resetStates,
  };
}