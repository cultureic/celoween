import { createConfig, http, useWriteContract, useReadContract, useAccount } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Address, parseEther } from 'viem'

// Contract ABI for MilestoneBadge
export const MILESTONE_BADGE_ABI = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "uri_", "type": "string" }
    ]
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimed",
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      { "name": "account", "type": "address" },
      { "name": "id", "type": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "address" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TransferSingle",
    "inputs": [
      { "indexed": true, "name": "operator", "type": "address" },
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "to", "type": "address" },
      { "name": "id", "type": "uint256" },
      { "name": "value", "type": "uint256" }
    ]
  }
] as const;

// Contract addresses (to be updated after deployment)
export const MILESTONE_BADGE_ADDRESSES = {
  [celoAlfajores.id]: process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_ALFAJORES as Address,
  [celo.id]: process.env.NEXT_PUBLIC_MILESTONE_CONTRACT_ADDRESS_MAINNET as Address,
} as const;

// Hook to check if user has claimed a specific milestone
export function useHasClaimed(tokenId: bigint) {
  const { address } = useAccount();
  const { chain } = useAccount();
  
  const contractAddress = chain?.id ? MILESTONE_BADGE_ADDRESSES[chain.id as keyof typeof MILESTONE_BADGE_ADDRESSES] : undefined;
  
  return useReadContract({
    address: contractAddress,
    abi: MILESTONE_BADGE_ABI,
    functionName: 'claimed',
    args: address && tokenId !== undefined ? [address, tokenId] : undefined,
    query: {
      enabled: !!address && !!contractAddress && tokenId !== undefined,
    }
  });
}

// Hook to get user's badge balance for a specific token
export function useBadgeBalance(tokenId: bigint) {
  const { address } = useAccount();
  const { chain } = useAccount();
  
  const contractAddress = chain?.id ? MILESTONE_BADGE_ADDRESSES[chain.id as keyof typeof MILESTONE_BADGE_ADDRESSES] : undefined;
  
  return useReadContract({
    address: contractAddress,
    abi: MILESTONE_BADGE_ABI,
    functionName: 'balanceOf',
    args: address && tokenId !== undefined ? [address, tokenId] : undefined,
    query: {
      enabled: !!address && !!contractAddress && tokenId !== undefined,
    }
  });
}

// Hook to claim a milestone badge
export function useClaimBadge() {
  const { chain } = useAccount();
  const queryClient = useQueryClient();
  
  const contractAddress = chain?.id ? MILESTONE_BADGE_ADDRESSES[chain.id as keyof typeof MILESTONE_BADGE_ADDRESSES] : undefined;
  
  const { writeContract, isPending, error, data: hash } = useWriteContract();
  
  const claimBadge = useMutation({
    mutationFn: async ({ tokenId }: { tokenId: bigint }) => {
      if (!contractAddress) {
        throw new Error('Contract not deployed on this network');
      }
      
      return writeContract({
        address: contractAddress,
        abi: MILESTONE_BADGE_ABI,
        functionName: 'claim',
        args: [tokenId],
      });
    },
    onSuccess: () => {
      // Invalidate queries to refetch badge status
      queryClient.invalidateQueries({ queryKey: ['claimed'] });
      queryClient.invalidateQueries({ queryKey: ['balanceOf'] });
    },
  });
  
  return {
    claimBadge: claimBadge.mutate,
    claimBadgeAsync: claimBadge.mutateAsync,
    isPending: isPending || claimBadge.isPending,
    error: error || claimBadge.error,
    hash,
  };
}

// Course enrollment - this will be our main enrollment function
export function useCourseEnrollment() {
  const { claimBadgeAsync } = useClaimBadge();
  const queryClient = useQueryClient();
  
  const enrollInCourse = useMutation({
    mutationFn: async ({ courseId, courseSlug }: { courseId: string; courseSlug: string }) => {
      try {
        // Generate deterministic token ID based on course
        const tokenId = BigInt(courseId.slice(-8)); // Use last 8 chars of courseId as tokenId
        
        // Claim the course enrollment badge
        const hash = await claimBadgeAsync({ tokenId });
        
        // Record enrollment in database
        const response = await fetch('/api/enrollment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId,
            courseSlug,
            transactionHash: hash,
            tokenId: tokenId.toString(),
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to record enrollment in database');
        }
        
        const result = await response.json();
        return { ...result, hash, tokenId };
        
      } catch (error) {
        console.error('Enrollment failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch enrollment status
      queryClient.invalidateQueries({ queryKey: ['userEnrollments'] });
      queryClient.invalidateQueries({ queryKey: ['claimed'] });
    },
  });
  
  return {
    enrollInCourse: enrollInCourse.mutate,
    enrollInCourseAsync: enrollInCourse.mutateAsync,
    isPending: enrollInCourse.isPending,
    error: enrollInCourse.error,
  };
}

// Hook to check if user is enrolled in a course
export function useIsEnrolled(courseId: string) {
  const tokenId = BigInt(courseId.slice(-8));
  const { data: hasClaimed, isLoading } = useHasClaimed(tokenId);
  
  return {
    isEnrolled: hasClaimed === true,
    isLoading,
  };
}