"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWriteContract, useChainId } from 'wagmi';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { useQueryClient } from '@tanstack/react-query';
import { encodeFunctionData } from 'viem';
import { getOptimizedContractConfig } from '@/lib/contracts/optimized-badge-config';
import { getCourseTokenId } from '@/lib/courseToken';
import { markModuleDone } from '@/lib/progress';

interface ModuleCompletionState {
  // Shared state
  isCompleting: boolean;
  completionHash?: `0x${string}`;
  completionError?: Error | null;
  completionSuccess: boolean;
  
  // Actions
  completeWithWallet: () => Promise<void>;
  completeWithSponsorship: () => Promise<void>;
  resetCompletion: () => void;
}

const ModuleCompletionContext = createContext<ModuleCompletionState | null>(null);

interface ModuleCompletionProviderProps {
  children: ReactNode;
  courseSlug: string;
  courseId: string;
  moduleIndex: number;
}

export function ModuleCompletionProvider({
  children,
  courseSlug,
  courseId,
  moduleIndex,
}: ModuleCompletionProviderProps) {
  const queryClient = useQueryClient();
  const smartAccount = useSmartAccount();
  // Force mainnet regardless of connected wallet chain
  const contractConfig = getOptimizedContractConfig(42220);
  
  console.log('[MODULE COMPLETION CONTEXT] Using MAINNET contract (FORCED):', contractConfig.address);
  
  // Unified state
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionHash, setCompletionHash] = useState<`0x${string}` | undefined>();
  const [completionError, setCompletionError] = useState<Error | null>(null);
  const [completionSuccess, setCompletionSuccess] = useState(false);
  
  // Normal wallet transaction hook
  const { writeContract, data: writeContractHash } = useWriteContract();
  
  const tokenId = getCourseTokenId(courseSlug, courseId);
  
  // Watch for writeContract hash and update completion state
  useEffect(() => {
    if (writeContractHash) {
      setCompletionHash(writeContractHash);
      markModuleDone(courseSlug, moduleIndex);
      
      // Invalidate cache
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ['readContract'] 
        });
        console.log('[MODULE COMPLETION] Cache invalidated after completion');
      }, 2000);
    }
  }, [writeContractHash, courseSlug, moduleIndex, queryClient]);
  
  // Shared completion logic
  const handleCompletionSuccess = (hash: `0x${string}`) => {
    setCompletionHash(hash);
    setCompletionSuccess(true);
    markModuleDone(courseSlug, moduleIndex);
    
    // Invalidate cache
    setTimeout(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['readContract'] 
      });
      console.log('[MODULE COMPLETION] Cache invalidated after completion');
    }, 2000);
  };
  
  // Method 1: Normal wallet transaction (user pays gas)
  const completeWithWallet = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    setCompletionError(null);
    
    try {
      // Contract expects 1-based module indices
      const contractModuleIndex = moduleIndex + 1;
      
      console.log('[MODULE COMPLETION] Wallet transaction (MAINNET FORCED):', {
        moduleIndex,
        contractModuleIndex,
        tokenId: tokenId.toString(),
        forcedChainId: 42220,
        contractAddress: contractConfig.address,
      });
      
      // writeContract doesn't return a hash directly, it's void
      await writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'completeModule',
        args: [tokenId, contractModuleIndex],
        chainId: 42220, // Force mainnet
      });
      
      // Transaction was initiated successfully
      console.log('[MODULE COMPLETION] ✅ Wallet transaction initiated');
      setCompletionSuccess(true);
    } catch (error: any) {
      console.error('[MODULE COMPLETION] ❌ Wallet transaction failed:', error);
      setCompletionError(new Error(error.message || 'Module completion failed'));
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Method 2: Sponsored transaction (gas-free)
  const completeWithSponsorship = async () => {
    if (isCompleting || !smartAccount.canSponsorTransaction) return;
    
    setIsCompleting(true);
    setCompletionError(null);
    
    try {
      // Contract expects 1-based module indices
      const contractModuleIndex = moduleIndex + 1;
      
      const encodedData = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: 'completeModule',
        args: [tokenId, contractModuleIndex],
      });
      
      console.log('[MODULE COMPLETION] Sponsored transaction (MAINNET FORCED):', {
        moduleIndex,
        contractModuleIndex,
        tokenId: tokenId.toString(),
        forcedChainId: 42220,
        smartAccountAddress: smartAccount.smartAccountAddress,
        contractAddress: contractConfig.address,
      });
      
      const hash = await smartAccount.executeTransaction({
        to: contractConfig.address as `0x${string}`,
        data: encodedData,
        value: 0n,
      });
      
      if (hash) {
        handleCompletionSuccess(hash);
        console.log('[MODULE COMPLETION] ✅ Sponsored transaction sent:', hash);
      }
    } catch (error: any) {
      console.error('[MODULE COMPLETION] ❌ Sponsored transaction failed:', error);
      setCompletionError(new Error(error.message || 'Module completion failed'));
    } finally {
      setIsCompleting(false);
    }
  };
  
  const resetCompletion = () => {
    setCompletionHash(undefined);
    setCompletionError(null);
    setCompletionSuccess(false);
    setIsCompleting(false);
  };
  
  const contextValue: ModuleCompletionState = {
    // Shared state
    isCompleting,
    completionHash,
    completionError,
    completionSuccess,
    
    // Actions
    completeWithWallet,
    completeWithSponsorship,
    resetCompletion,
  };
  
  return (
    <ModuleCompletionContext.Provider value={contextValue}>
      {children}
    </ModuleCompletionContext.Provider>
  );
}

export function useUnifiedModuleCompletion() {
  const context = useContext(ModuleCompletionContext);
  if (!context) {
    throw new Error('useUnifiedModuleCompletion must be used within a ModuleCompletionProvider');
  }
  return context;
}
