'use client';

import { useDirectMainnetEnrollment, useDirectMainnetModuleCompletion } from '@/lib/hooks/useDirectMainnetReads';
import { getCourseTokenId } from '@/lib/courseToken';
import { useAuth } from '@/hooks/useAuth';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import type { Address } from 'viem';

interface MainnetDebugProps {
  courseSlug: string;
  courseId: string;
  className?: string;
}

export function MainnetDebug({ courseSlug, courseId, className = '' }: MainnetDebugProps) {
  const { wallet } = useAuth();
  const { smartAccountAddress } = useSmartAccount();
  const userAddress = wallet?.address as Address | undefined;
  const tokenId = getCourseTokenId(courseSlug, courseId);

  // Test both addresses
  const walletEnrollment = useDirectMainnetEnrollment(userAddress, tokenId);
  const smartAccountEnrollment = useDirectMainnetEnrollment(smartAccountAddress || undefined, tokenId);
  
  const walletModule0 = useDirectMainnetModuleCompletion(userAddress, tokenId, 0);
  const smartAccountModule0 = useDirectMainnetModuleCompletion(smartAccountAddress || undefined, tokenId, 0);

  return (
    <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
      <h3 className="font-bold text-yellow-800 mb-2">🔍 DIRECT MAINNET DEBUG</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Course:</strong> {courseSlug} (TokenID: {tokenId.toString()})
        </div>
        
        <div>
          <strong>Wallet Address:</strong> {userAddress || 'None'}
        </div>
        
        <div>
          <strong>Smart Account:</strong> {smartAccountAddress || 'None'}
        </div>
        
        <div className="border-t pt-2 mt-2">
          <h4 className="font-semibold text-yellow-800">DIRECT MAINNET ENROLLMENT CHECKS:</h4>
          
          <div className="ml-2">
            <div>
              <strong>Wallet Enrolled:</strong> {
                walletEnrollment.isLoading ? '⏳ Loading...' : 
                walletEnrollment.error ? `❌ Error: ${walletEnrollment.error.message}` :
                walletEnrollment.isEnrolled ? '✅ YES' : '❌ NO'
              }
            </div>
            
            <div>
              <strong>Smart Account Enrolled:</strong> {
                smartAccountEnrollment.isLoading ? '⏳ Loading...' : 
                smartAccountEnrollment.error ? `❌ Error: ${smartAccountEnrollment.error.message}` :
                smartAccountEnrollment.isEnrolled ? '✅ YES' : '❌ NO'
              }
            </div>
          </div>
        </div>
        
        <div className="border-t pt-2 mt-2">
          <h4 className="font-semibold text-yellow-800">MODULE 0 COMPLETION:</h4>
          
          <div className="ml-2">
            <div>
              <strong>Wallet Module 0:</strong> {
                walletModule0.isLoading ? '⏳ Loading...' : 
                walletModule0.error ? `❌ Error: ${walletModule0.error.message}` :
                walletModule0.isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED'
              }
            </div>
            
            <div>
              <strong>Smart Account Module 0:</strong> {
                smartAccountModule0.isLoading ? '⏳ Loading...' : 
                smartAccountModule0.error ? `❌ Error: ${smartAccountModule0.error.message}` :
                smartAccountModule0.isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED'
              }
            </div>
          </div>
        </div>
        
        <div className="text-xs text-yellow-600 mt-2">
          📡 All reads go directly to: https://forno.celo.org (Celo Mainnet)
          <br />
          🏗️ Contract: 0xf8CA094fd88F259Df35e0B8a9f38Df8f4F28F336
        </div>
      </div>
    </div>
  );
}