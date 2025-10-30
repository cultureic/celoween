/**
 * Server-side enrollment verification
 * Checks if a user has enrollment status via the optimized contract
 */

import { createPublicClient, http, type Address } from 'viem';
import { celoAlfajores, celo } from 'viem/chains';
import { getCourseTokenId } from '@/lib/courseToken';
import { 
  getOptimizedContractConfig, 
  OPTIMIZED_BADGE_ABI,
  getNetworkConfig,
  getOptimizedContractAddress
} from '@/lib/contracts/optimized-badge-config';

/**
 * Get the contract address and configuration for the target chain
 * Defaults to Celo mainnet for production, falls back to Alfajores for development
 */
function getContractConfig(chainId?: number) {
  // Always default to mainnet
  const targetChainId = chainId || 42220;
  
  console.log('[ENROLLMENT VERIFICATION] Using chain:', targetChainId);
  return getOptimizedContractConfig(targetChainId);
}

/**
 * Create a public client for the specified chain
 */
function createPublicWeb3Client(chainId?: number) {
  // Always default to mainnet
  const targetChainId = chainId || 42220;
  const chain = targetChainId === 42220 ? celo : celoAlfajores;
  
  return createPublicClient({
    chain,
    transport: http(),
  });
}

/**
 * Check if a user is enrolled in the course using the optimized contract
 * This is a server-side check that doesn't require wallet connection
 */
export async function hasUserClaimedBadge(
  userAddress: Address,
  courseSlug: string,
  courseId?: string,
  chainId?: number
): Promise<boolean> {
  const startTime = Date.now();
  console.log('[ENROLLMENT VERIFICATION] Checking enrollment status:', {
    userAddress,
    courseSlug,
    courseId,
    chainId,
  });
  
  try {
    const contractConfig = getContractConfig(chainId);
    const tokenId = getCourseTokenId(courseSlug, courseId);
    console.log('[ENROLLMENT VERIFICATION] Contract details:', {
      contractAddress: contractConfig.address,
      tokenId: tokenId.toString(),
      chainId,
    });
    
    const publicClient = createPublicWeb3Client(chainId);

    // Use optimized contract's isEnrolled function
    const isEnrolled = await publicClient.readContract({
      address: contractConfig.address,
      abi: OPTIMIZED_BADGE_ABI,
      functionName: 'isEnrolled',
      args: [userAddress, tokenId],
    });

    const duration = Date.now() - startTime;
    console.log('[ENROLLMENT VERIFICATION] Enrollment check completed:', {
      isEnrolled,
      duration: `${duration}ms`,
    });
    
    return isEnrolled;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[ENROLLMENT VERIFICATION] Error checking enrollment status:', {
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration}ms`,
      userAddress,
      courseSlug,
      chainId,
    });
    // In case of error, we default to false (not enrolled)
    // This is safer than allowing access by default
    return false;
  }
}

/**
 * Check if a user has enrollment (same as hasUserClaimedBadge for optimized contract)
 * Kept for backward compatibility
 */
export async function hasUserEnrollmentBadge(
  userAddress: Address,
  courseSlug: string,
  courseId?: string,
  chainId?: number
): Promise<boolean> {
  // For optimized contract, enrollment status is the same as claimed badge
  return hasUserClaimedBadge(userAddress, courseSlug, courseId, chainId);
}

/**
 * Comprehensive enrollment check using optimized contract
 */
export async function isUserEnrolledInCourse(
  userAddress: Address,
  courseSlug: string,
  courseId?: string,
  chainId?: number
): Promise<{
  isEnrolled: boolean;
  hasClaimed: boolean;
  hasBadge: boolean;
  tokenId: string;
}> {
  const startTime = Date.now();
  console.log('[ENROLLMENT VERIFICATION] Starting enrollment check:', {
    userAddress,
    courseSlug,
    courseId,
    chainId,
  });
  
  try {
    const tokenId = getCourseTokenId(courseSlug, courseId);
    console.log('[ENROLLMENT VERIFICATION] Using token ID:', tokenId.toString());
    
    // For optimized contract, enrollment status is unified
    const isEnrolled = await hasUserClaimedBadge(userAddress, courseSlug, courseId, chainId);
    const duration = Date.now() - startTime;
    
    console.log('[ENROLLMENT VERIFICATION] Enrollment check completed:', {
      isEnrolled,
      tokenId: tokenId.toString(),
      duration: `${duration}ms`,
    });

    return {
      isEnrolled,
      hasClaimed: isEnrolled, // For compatibility
      hasBadge: isEnrolled,   // For compatibility
      tokenId: tokenId.toString(),
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[ENROLLMENT VERIFICATION] Error in enrollment check:', {
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration}ms`,
      userAddress,
      courseSlug,
      chainId,
    });
    return {
      isEnrolled: false,
      hasClaimed: false,
      hasBadge: false,
      tokenId: '0',
    };
  }
}

/**
 * Verify enrollment with detailed error messages
 */
export async function verifyEnrollmentAccess(
  userAddress: Address | undefined,
  courseSlug: string,
  courseId?: string,
  chainId?: number
): Promise<{
  hasAccess: boolean;
  reason?: string;
}> {
  // Check if user has wallet connected
  if (!userAddress) {
    return {
      hasAccess: false,
      reason: 'WALLET_NOT_CONNECTED',
    };
  }

  // Check enrollment status using the correct chain
  const enrollmentStatus = await isUserEnrolledInCourse(userAddress, courseSlug, courseId, chainId);

  if (!enrollmentStatus.isEnrolled) {
    return {
      hasAccess: false,
      reason: 'NOT_ENROLLED',
    };
  }

  return {
    hasAccess: true,
  };
}
