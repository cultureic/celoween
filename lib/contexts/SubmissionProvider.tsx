"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { encodeFunctionData } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import type { Address } from 'viem';

// Convert string ID to consistent numeric ID for smart contract
function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

interface SubmissionState {
  isSubmitting: boolean;
  submissionError: Error | null;
  submissionHash?: `0x${string}`;
  isConfirmingSubmission: boolean;
  submissionSuccess: boolean;
  submitEntry: (params: {
    contestId: string;
    title: string;
    description: string;
    mediaUrl: string;
    metadataURI: string;
  }) => Promise<string | null>; // Returns on-chain submission ID
  canSponsorTransaction: boolean;
}

const SubmissionContext = createContext<SubmissionState | null>(null);

interface SubmissionProviderProps {
  children: ReactNode;
  votingContractAddress: Address;
  votingContractAbi: any[];
}

export function SubmissionProvider({
  children,
  votingContractAddress,
  votingContractAbi,
}: SubmissionProviderProps) {
  console.log('[SUBMISSION CONTEXT] Initializing with contract:', votingContractAddress);
  
  const { user, authenticated } = usePrivy();
  const smartAccount = useSmartAccount();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingSubmission, setIsConfirmingSubmission] = useState(false);
  const [submissionHash, setSubmissionHash] = useState<`0x${string}` | undefined>();
  const [submissionError, setSubmissionError] = useState<Error | null>(null);

  const userAddress = user?.wallet?.address;
  const isWalletConnected = authenticated && !!userAddress;

  console.log('[SUBMISSION CONTEXT] State:', {
    isWalletConnected,
    canSponsorTransaction: smartAccount.canSponsorTransaction,
    smartAccountReady: smartAccount.isSmartAccountReady,
    smartAccountAddress: smartAccount.smartAccountAddress,
  });

  // Submit an entry using gasless transaction
  const submitEntry = async (params: {
    contestId: string;
    title: string;
    description: string;
    mediaUrl: string;
    metadataURI: string;
  }): Promise<string | null> => {
    console.log('[SUBMISSION] Starting sponsored submission:', params);
    
    if (!isWalletConnected || !userAddress) {
      throw new Error('Wallet not connected');
    }
    
    if (!smartAccount.canSponsorTransaction) {
      throw new Error('Smart account not ready for sponsored transactions. Please wait for smart account initialization.');
    }
    
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionHash(undefined);
    
    try {
      // Convert contestId string to numeric ID for smart contract
      // Use a simple hash function to create consistent numeric IDs from UUIDs
      const numericContestId = hashStringToNumber(params.contestId);
      console.log('[SUBMISSION] Converted contest ID:', params.contestId, '→', numericContestId);
      
      // Encode the submitEntry function call
      const encodedData = encodeFunctionData({
        abi: votingContractAbi,
        functionName: 'submitEntry',
        args: [BigInt(numericContestId), params.metadataURI],
      });
      
      console.log('[SUBMISSION] Executing sponsored transaction:', {
        contract: votingContractAddress,
        contestId: params.contestId,
        metadataURI: params.metadataURI,
        smartAccount: smartAccount.smartAccountAddress,
      });
      
      // Execute sponsored transaction through ZeroDev
      const txHash = await smartAccount.executeTransaction({
        to: votingContractAddress,
        data: encodedData,
        value: 0n,
      });
      
      if (txHash) {
        setSubmissionHash(txHash);
        console.log('[SUBMISSION] ✅ Sponsored submission transaction sent:', txHash);
        
        // Save to database first without onChainId
        const accountAddress = smartAccount.smartAccountAddress || userAddress;
        
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contestId: params.contestId,
            walletAddress: accountAddress,
            title: params.title,
            description: params.description,
            mediaUrl: params.mediaUrl,
            mediaType: 'image',
            thumbnailUrl: params.mediaUrl,
            transactionHash: txHash,
            onChainId: null,
            metadata: JSON.stringify({
              metadataURI: params.metadataURI,
              sponsoredTx: true,
              numericContestId,
            }),
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('[SUBMISSION] Database sync error:', errorData);
          throw new Error(`Failed to sync submission to database: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        const submissionDbId = data.submission?.id;
        console.log('[SUBMISSION] ✅ Submission saved to database:', submissionDbId);
        
        // Wait and query on-chain ID synchronously
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const { createPublicClient, http } = await import('viem');
          const { celo } = await import('viem/chains');
          const { readContract } = await import('viem/actions');
          
          const publicClient = createPublicClient({
            chain: celo,
            transport: http(),
          });
          
          const submissionIdFromContract = (await readContract(publicClient, {
            address: votingContractAddress,
            abi: votingContractAbi,
            functionName: 'getUserSubmission',
            args: [BigInt(numericContestId), accountAddress as `0x${string}`],
          }))[0] as bigint;
          
          if (submissionIdFromContract > 0n) {
            const onChainId = submissionIdFromContract.toString();
            console.log('[SUBMISSION] ✅ Got on-chain ID, updating database:', onChainId);
            
            await fetch(`/api/submissions/${submissionDbId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ onChainId }),
            });
          }
        } catch (error) {
          console.error('[SUBMISSION] ⚠️ Could not fetch on-chain ID:', error);
        } finally {
          setIsConfirmingSubmission(false);
        }
        
        return submissionDbId;
      }
      
      return null;
    } catch (error: any) {
      console.error('[SUBMISSION] ❌ Sponsored submission failed:', error);
      setSubmissionError(new Error(error.message || 'Submission failed'));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submissionState: SubmissionState = {
    isSubmitting,
    submissionError,
    submissionHash,
    isConfirmingSubmission,
    submissionSuccess: !!submissionHash && !isConfirmingSubmission,
    submitEntry,
    canSponsorTransaction: smartAccount.canSponsorTransaction,
  };

  return (
    <SubmissionContext.Provider value={submissionState}>
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmission() {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error('useSubmission must be used within a SubmissionProvider');
  }
  return context;
}
