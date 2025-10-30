import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { enrollmentService } from '@/lib/contracts/enrollmentService';
import { useQueryClient } from '@tanstack/react-query';
import type { Address } from 'viem';

interface ContractTransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * ENROLLMENT SERVICE HOOK - Following Motus useMotusContracts Pattern
 * 
 * This hook properly initializes the enrollmentService with kernelClient
 * and provides methods for sponsored enrollment and module completion.
 */
export function useEnrollmentService() {
  const { user, authenticated } = usePrivy();
  const { 
    kernelClient, 
    smartAccountAddress, 
    isInitializing, 
    canSponsorTransaction,
    error: walletError 
  } = useSmartAccount();
  
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize enrollment service with ZeroDev Kernel client when available
  // This mirrors Motus's useMotusContracts initialization pattern
  useEffect(() => {
    const initializeWithKernelClient = async () => {
      if (authenticated && kernelClient && smartAccountAddress && !isInitializing) {
        try {
          setIsLoading(true);
          console.log('🔧 useEnrollmentService: Initializing enrollment service with ZeroDev Kernel client...');
          
          // CRITICAL: Initialize enrollment service with kernelClient (like Motus does)
          await enrollmentService.initializeWithSmartAccount(kernelClient);
          setIsInitialized(true);
          console.log('✅ Enrollment service initialized with ZeroDev Kernel client:', smartAccountAddress);
        } catch (err: any) {
          console.error('❌ Failed to initialize enrollment service with kernel client:', err);
          setError(err.message || 'Failed to initialize enrollment service');
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeWithKernelClient();
  }, [authenticated, kernelClient, smartAccountAddress, isInitializing]);

  // ENROLL IN COURSE - Following Motus pattern
  const enrollInCourse = useCallback(async (
    courseSlug: string, 
    courseId: string
  ): Promise<ContractTransactionResult> => {
    if (!authenticated || !smartAccountAddress || !kernelClient) {
      return { success: false, error: 'ZeroDev smart wallet not connected' };
    }

    if (!isInitialized || !enrollmentService.isReady()) {
      return { success: false, error: 'Enrollment service not initialized' };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Enrolling in course with ZeroDev Kernel client:', smartAccountAddress);
      const result = await enrollmentService.enrollInCourse(courseSlug, courseId);
      
      if (result.success) {
        // Invalidate cache after successful enrollment (like our previous implementation)
        setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: ['readContract', { 
              address: enrollmentService.getSmartAccountAddress, 
              functionName: 'isEnrolled' 
            }] 
          });
          console.log('🔄 Cache invalidated after successful enrollment');
        }, 1000);
      } else {
        setError(result.error || 'Enrollment failed');
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to enroll in course';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, smartAccountAddress, kernelClient, isInitialized, queryClient]);

  // COMPLETE MODULE - Following Motus pattern
  const completeModule = useCallback(async (
    courseSlug: string,
    courseId: string,
    moduleIndex: number
  ): Promise<ContractTransactionResult> => {
    if (!authenticated || !smartAccountAddress || !kernelClient) {
      return { success: false, error: 'ZeroDev smart wallet not connected' };
    }

    if (!isInitialized || !enrollmentService.isReady()) {
      return { success: false, error: 'Enrollment service not initialized' };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🎯 Completing module with ZeroDev smart wallet:', smartAccountAddress);
      const result = await enrollmentService.completeModule(courseSlug, courseId, moduleIndex);
      
      if (result.success) {
        // Invalidate module completion cache
        setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: ['readContract', { functionName: 'isModuleCompleted' }] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['readContract', { functionName: 'getModulesCompleted' }] 
          });
          console.log('🔄 Cache invalidated after successful module completion');
        }, 1000);
      } else {
        setError(result.error || 'Module completion failed');
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to complete module';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, smartAccountAddress, kernelClient, isInitialized, queryClient]);

  // CHECK ENROLLMENT STATUS
  const isEnrolled = useCallback(async (
    userAddress: Address,
    courseSlug: string,
    courseId: string
  ): Promise<boolean> => {
    try {
      const result = await enrollmentService.isEnrolled(userAddress, courseSlug, courseId);
      return result.success ? result.data || false : false;
    } catch (error) {
      console.error('Failed to check enrollment status:', error);
      return false;
    }
  }, []);

  // TEST CONTRACT CONNECTIVITY
  const testConnectivity = useCallback(async () => {
    return await enrollmentService.testContractConnectivity();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isInitialized,
    isLoading: isLoading || isInitializing,
    error: error || (walletError ? walletError : null),
    smartAccountAddress,
    authenticated,
    hasSmartAccount: !!smartAccountAddress && !!kernelClient,
    canSponsorTransaction,

    // Core enrollment methods
    enrollInCourse,
    completeModule,
    isEnrolled,

    // Utility methods
    testConnectivity,
    clearError,
    
    // Service info
    isServiceReady: isInitialized && enrollmentService.isReady(),
  };
}