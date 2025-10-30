'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useConnect } from 'wagmi';
import { type Address } from 'viem';
import { getCourseTokenId } from '@/lib/courseToken';
import { getOptimizedContractConfig } from '@/lib/contracts/optimized-badge-config';

// Helper to get contract configuration - force mainnet
function useContractConfig() {
  // Always use mainnet regardless of connected wallet chain
  return getOptimizedContractConfig(42220);
}

// Hook to check if a user has completed a specific module
export function useHasCompletedModule(
  userAddress?: Address, 
  courseTokenId?: bigint,
  moduleIndex?: number
) {
  const { address: contractAddress, abi: contractAbi } = useContractConfig();
  
  console.log('[MODULE COMPLETION READ] isModuleCompleted (MAINNET FORCED):', {
    userAddress,
    courseTokenId: courseTokenId?.toString(),
    moduleIndex,
    contractModuleIndex: moduleIndex !== undefined ? moduleIndex + 1 : undefined,
    contractAddress,
    forcedChainId: 42220,
  });
  
  return useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'isModuleCompleted',
    args: userAddress && courseTokenId !== undefined && moduleIndex !== undefined 
      ? [userAddress, courseTokenId, moduleIndex + 1] // Convert to 1-based for contract
      : undefined,
    chainId: 42220, // Force mainnet chain ID
    query: {
      enabled: !!userAddress && courseTokenId !== undefined && moduleIndex !== undefined,
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchInterval: false,
      networkMode: 'always',
    },
  });
}

// Hook to get the total modules completed for a course
export function useModulesCompleted(userAddress?: Address, courseTokenId?: bigint) {
  const { address: contractAddress, abi: contractAbi } = useContractConfig();
  
  console.log('[MODULE COMPLETION READ] getModulesCompleted (MAINNET FORCED):', {
    userAddress,
    courseTokenId: courseTokenId?.toString(),
    contractAddress,
    forcedChainId: 42220,
  });
  
  return useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getModulesCompleted',
    args: userAddress && courseTokenId !== undefined ? [userAddress, courseTokenId] : undefined,
    chainId: 42220, // Force mainnet chain ID
    query: {
      enabled: !!userAddress && courseTokenId !== undefined,
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchInterval: false,
      networkMode: 'always',
    },
  });
}

// Hook to complete a module (updates the NFT metadata state) - MAINNET ONLY
export function useCompleteModuleBadge() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { address: contractAddress, abi: contractAbi } = useContractConfig();
  const completeModule = async (courseTokenId: bigint, moduleIndex: number) => {
    // Ensure connector is connected before write
    if (!isConnected) {
      const ready = connectors.filter((c) => (c as any)?.ready);
      const injectedConnector = ready.find((c) => c.id === 'injected');
      const connector = injectedConnector || ready[0];
      if (!connector) {
        throw new Error('No wallet connector available. On mobile, open the site in your wallet\'s in-app browser (e.g., MetaMask) or configure WalletConnect in environment.');
      }
      await connectAsync({ connector });
    }

    console.log('[MODULE COMPLETION] Sending transaction to mainnet contract:', contractAddress);
    return writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'completeModule',
      args: [courseTokenId, moduleIndex + 1], // Convert to 1-based for contract
      chainId: 42220, // Target mainnet
    });
  };

  return {
    completeModule,
    hash,
    error,
    isPending,
  };
}

// Hook to wait for transaction confirmation
export function useModuleTransactionStatus(hash?: `0x${string}`) {
  return useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });
}

// Combined hook for completing modules with status tracking
export function useCompleteModuleWithStatus() {
  const { completeModule, hash, error, isPending } = useCompleteModuleBadge();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useModuleTransactionStatus(hash);

  return {
    completeModule,
    hash,
    error: error || confirmError,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Hook specifically for module completion with all the data needed
export function useModuleCompletion(
  courseSlug: string,
  courseId: string,
  moduleIndex: number, 
  userAddress?: Address
) {
  // Use the course tokenId - all modules update the SAME NFT
  const courseTokenId = getCourseTokenId(courseSlug, courseId);
  
  const hasCompleted = useHasCompletedModule(userAddress, courseTokenId, moduleIndex);
  const modulesCompleted = useModulesCompleted(userAddress, courseTokenId);
  const { completeModule: completeModuleTx, hash, error, isPending, isConfirming, isSuccess } = useCompleteModuleWithStatus();

  const completeModule = () => {
    return completeModuleTx(courseTokenId, moduleIndex);
  };

  return {
    courseTokenId,
    moduleIndex,
    hasCompleted: hasCompleted.data || false,
    modulesCompleted: Number(modulesCompleted.data ?? 0n),
    isLoading: hasCompleted.isLoading || modulesCompleted.isLoading,
    completeModule,
    completionHash: hash,
    completionError: error,
    isCompleting: isPending,
    isConfirmingCompletion: isConfirming,
    completionSuccess: isSuccess,
  };
}
