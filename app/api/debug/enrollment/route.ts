import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, getUserWalletAddress } from '@/lib/auth-server';
import { isUserEnrolledInCourse } from '@/lib/enrollment-verification';
import { getOptimizedContractAddress, getNetworkConfig } from '@/lib/contracts/optimized-badge-config';
import type { Address } from 'viem';

export async function GET(request: NextRequest) {
  console.log('[DEBUG API] Enrollment verification debug endpoint called');
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get('courseSlug');
    const courseId = searchParams.get('courseId');
    const testAddress = searchParams.get('address');
    
    if (!courseSlug) {
      return NextResponse.json(
        { error: 'courseSlug query parameter is required' },
        { status: 400 }
      );
    }

    let userAddress: string | null = null;
    let authInfo: any = null;

    // Try to get user from authentication if no test address provided
    if (!testAddress) {
      console.log('[DEBUG API] Getting authenticated user...');
      const authResult = await getAuthenticatedUser(request);
      authInfo = {
        isAuthenticated: authResult.isAuthenticated,
        error: authResult.error,
      };
      
      if (authResult.isAuthenticated && authResult.user) {
        userAddress = getUserWalletAddress(authResult.user);
        console.log('[DEBUG API] Found authenticated user address:', userAddress);
      }
    } else {
      userAddress = testAddress.toLowerCase();
      console.log('[DEBUG API] Using provided test address:', userAddress);
    }

    if (!userAddress) {
      return NextResponse.json({
        error: 'No wallet address found. Either authenticate or provide address parameter',
        authInfo,
        courseSlug,
        courseId,
      });
    }

    // Perform enrollment verification
    console.log('[DEBUG API] Starting enrollment verification...');
    const startTime = Date.now();
    
    // Always use mainnet
    const chainId = 42220;
    const contractAddress = getOptimizedContractAddress(chainId);
    const networkConfig = getNetworkConfig(chainId);
    
    const enrollmentResult = await isUserEnrolledInCourse(
      userAddress as Address,
      courseSlug,
      courseId || undefined,
      chainId
    );
    
    const duration = Date.now() - startTime;
    
    console.log('[DEBUG API] Enrollment verification completed');
    
    return NextResponse.json({
      success: true,
      userAddress,
      courseSlug,
      courseId,
      enrollmentResult,
      authInfo,
      performance: {
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      debug: {
        chainId,
        contractAddress,
        network: networkConfig.CHAIN_NAME,
        explorerUrl: networkConfig.EXPLORER_URL,
        isMainnet: networkConfig.IS_MAINNET,
      }
    });
    
  } catch (error) {
    console.error('[DEBUG API] Error in enrollment debug endpoint:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('[DEBUG API] POST method not supported for enrollment debug');
  return NextResponse.json(
    { error: 'Method not allowed. Use GET instead.' },
    { status: 405 }
  );
}