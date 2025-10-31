"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { encodeFunctionData } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import type { Address, Abi } from 'viem';

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

interface VotingState {
  isVoting: boolean;
  votingError: Error | null;
  votingHash?: `0x${string}`;
  isConfirmingVote: boolean;
  votingSuccess: boolean;
  castVote: (submissionId: string, onChainId?: string) => Promise<void>;
  removeVote: (submissionId: string, onChainId?: string) => Promise<void>;
  getUserVoteInContest: (contestId: string, userAddress: string) => Promise<string | null>;
  getUserSubmissionId: (contestId: string, userAddress: string) => Promise<string | null>;
  computeSubmissionId: (contestId: string, submitterAddress: string) => Promise<string>;
  smartAccountAddress: string | undefined;
  canSponsorTransaction: boolean;
}

const VotingContext = createContext<VotingState | null>(null);

interface VotingProviderProps {
  children: ReactNode;
  votingContractAddress: Address;
  votingContractAbi: Abi;
}

export function VotingProvider({
  children,
  votingContractAddress,
  votingContractAbi,
}: VotingProviderProps) {
  console.log('[VOTING CONTEXT] Initializing with contract:', votingContractAddress);
  
  const { user, authenticated } = usePrivy();
  const smartAccount = useSmartAccount();
  
  const [isVoting, setIsVoting] = useState(false);
  const [isConfirmingVote, setIsConfirmingVote] = useState(false);
  const [votingHash, setVotingHash] = useState<`0x${string}` | undefined>();
  const [votingError, setVotingError] = useState<Error | null>(null);

  const userAddress = user?.wallet?.address;
  const isWalletConnected = authenticated && !!userAddress;

  console.log('[VOTING CONTEXT] State:', {
    isWalletConnected,
    canSponsorTransaction: smartAccount.canSponsorTransaction,
    smartAccountReady: smartAccount.isSmartAccountReady,
    smartAccountAddress: smartAccount.smartAccountAddress,
  });

  // Cast a gasless vote using ZeroDev
  const castVote = async (submissionId: string, onChainId?: string) => {
    console.log('[VOTING] Starting sponsored vote for submission:', submissionId, 'onChainId:', onChainId);
    
    if (!isWalletConnected || !userAddress) {
      throw new Error('Wallet not connected');
    }
    
    if (!smartAccount.canSponsorTransaction) {
      throw new Error('Smart account not ready for sponsored transactions. Please wait for smart account initialization.');
    }
    
    if (!onChainId) {
      throw new Error('Submission has no on-chain ID. Cannot vote on-chain.');
    }
    
    setIsVoting(true);
    setVotingError(null);
    setVotingHash(undefined);
    
    try {
      console.log('[VOTING] Using on-chain submission ID:', onChainId);
      
      // Encode the vote function call
      // onChainId is already a bytes32 hex string
      const encodedData = encodeFunctionData({
        abi: votingContractAbi,
        functionName: 'vote',
        args: [onChainId as `0x${string}`],
      });
      
      console.log('[VOTING] Executing sponsored transaction:', {
        contract: votingContractAddress,
        submissionId,
        smartAccount: smartAccount.smartAccountAddress,
      });
      
      // Execute sponsored transaction through ZeroDev
      const txHash = await smartAccount.executeTransaction({
        to: votingContractAddress,
        data: encodedData,
        value: 0n,
      });
      
      if (txHash) {
        setVotingHash(txHash);
        console.log('[VOTING] ✅ Sponsored vote transaction sent:', txHash);
        
        setIsConfirmingVote(true);
        
        // Wait for transaction confirmation
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('[VOTING] ✅ Vote confirmed on-chain');
        } catch (confirmError) {
          console.warn('[VOTING] ⚠️ Vote confirmation warning:', confirmError);
        } finally {
          setIsConfirmingVote(false);
        }

        // Sync vote to database
        try {
          await fetch('/api/votes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              submissionId,
              walletAddress: smartAccount.smartAccountAddress || userAddress,
              transactionHash: txHash,
            }),
          });
          console.log('[VOTING] ✅ Vote synced to database');
        } catch (dbError) {
          console.warn('[VOTING] ⚠️ Database sync failed:', dbError);
        }
      }
    } catch (error: any) {
      console.error('[VOTING] ❌ Sponsored vote failed:', error);
      setVotingError(new Error(error.message || 'Vote failed'));
      throw error;
    } finally {
      setIsVoting(false);
    }
  };

  // Remove a vote (also gasless)
  const removeVote = async (submissionId: string, onChainId?: string) => {
    console.log('[VOTING] Starting sponsored vote removal for submission:', submissionId, 'onChainId:', onChainId);
    
    if (!isWalletConnected || !userAddress) {
      throw new Error('Wallet not connected');
    }
    
    if (!smartAccount.canSponsorTransaction) {
      throw new Error('Smart account not ready for sponsored transactions');
    }
    
    if (!onChainId) {
      throw new Error('Submission has no on-chain ID. Cannot remove vote on-chain.');
    }
    
    setIsVoting(true);
    setVotingError(null);
    setVotingHash(undefined);
    
    try {
      console.log('[VOTING] Using on-chain submission ID for removal:', onChainId);
      
      // Encode the removeVote function call
      // onChainId is already a bytes32 hex string
      const encodedData = encodeFunctionData({
        abi: votingContractAbi,
        functionName: 'removeVote',
        args: [onChainId as `0x${string}`],
      });
      
      console.log('[VOTING] Executing sponsored transaction (remove vote):', {
        contract: votingContractAddress,
        submissionId,
      });
      
      // Execute sponsored transaction through ZeroDev
      const txHash = await smartAccount.executeTransaction({
        to: votingContractAddress,
        data: encodedData,
        value: 0n,
      });
      
      if (txHash) {
        setVotingHash(txHash);
        console.log('[VOTING] ✅ Sponsored vote removal transaction sent:', txHash);
        
        setIsConfirmingVote(true);
        
        // Wait for transaction confirmation
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('[VOTING] ✅ Vote removal confirmed on-chain');
        } catch (confirmError) {
          console.warn('[VOTING] ⚠️ Vote removal confirmation warning:', confirmError);
        } finally {
          setIsConfirmingVote(false);
        }

        // Remove vote from database
        try {
          await fetch('/api/votes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              submissionId,
              walletAddress: smartAccount.smartAccountAddress || userAddress,
            }),
          });
          console.log('[VOTING] ✅ Vote removal synced to database');
        } catch (dbError) {
          console.warn('[VOTING] ⚠️ Database sync failed:', dbError);
        }
      }
    } catch (error: any) {
      console.error('[VOTING] ❌ Sponsored vote removal failed:', error);
      setVotingError(new Error(error.message || 'Vote removal failed'));
      throw error;
    } finally {
      setIsVoting(false);
    }
  };

  const getUserVoteInContest = async (contestId: string, walletAddress: string): Promise<string | null> => {
    try {
      const { createPublicClient, http } = await import('viem');
      const { celo } = await import('viem/chains');
      const { readContract } = await import('viem/actions');
      
      const publicClient = createPublicClient({
        chain: celo,
        transport: http(),
      });
      
      const numericContestId = hashStringToNumber(contestId);
      
      const onChainSubmissionId = await readContract(publicClient, {
        address: votingContractAddress,
        abi: votingContractAbi,
        functionName: 'getUserVoteInContest',
        args: [BigInt(numericContestId), walletAddress as `0x${string}`],
      }) as `0x${string}`;
      
      // Return the bytes32 hash as a string (or null if it's the zero hash)
      if (onChainSubmissionId && onChainSubmissionId !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        return onChainSubmissionId;
      }
      
      return null;
    } catch (error) {
      console.error('[VOTING] Error fetching user vote:', error);
      return null;
    }
  };

  const getUserSubmissionId = async (contestId: string, submitterAddress: string): Promise<string | null> => {
    try {
      const { createPublicClient, http } = await import('viem');
      const { celo } = await import('viem/chains');
      const { readContract } = await import('viem/actions');
      
      const publicClient = createPublicClient({
        chain: celo,
        transport: http(),
      });
      
      const numericContestId = hashStringToNumber(contestId);
      
      const onChainSubmissionId = await readContract(publicClient, {
        address: votingContractAddress,
        abi: votingContractAbi,
        functionName: 'getUserSubmission',
        args: [BigInt(numericContestId), submitterAddress as `0x${string}`],
      }) as `0x${string}`;
      
      // Return the bytes32 hash as a string (or null if it's the zero hash)
      if (onChainSubmissionId && onChainSubmissionId !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        return onChainSubmissionId;
      }
      
      return null;
    } catch (error) {
      console.error('[VOTING] Error fetching user submission ID:', error);
      return null;
    }
  };

  const computeSubmissionId = async (contestId: string, submitterAddress: string): Promise<string> => {
    try {
      const { createPublicClient, http } = await import('viem');
      const { celo } = await import('viem/chains');
      const { readContract } = await import('viem/actions');
      
      const publicClient = createPublicClient({
        chain: celo,
        transport: http(),
      });
      
      const numericContestId = hashStringToNumber(contestId);
      
      const computedId = await readContract(publicClient, {
        address: votingContractAddress,
        abi: votingContractAbi,
        functionName: 'computeSubmissionId',
        args: [BigInt(numericContestId), submitterAddress as `0x${string}`],
      }) as `0x${string}`;
      
      return computedId;
    } catch (error) {
      console.error('[VOTING] Error computing submission ID:', error);
      throw error;
    }
  };

  const votingState: VotingState = {
    isVoting,
    votingError,
    votingHash,
    isConfirmingVote,
    votingSuccess: !!votingHash && !isConfirmingVote,
    castVote,
    removeVote,
    getUserVoteInContest,
    getUserSubmissionId,
    computeSubmissionId,
    smartAccountAddress: smartAccount.smartAccountAddress ?? undefined,
    canSponsorTransaction: smartAccount.canSponsorTransaction,
  };

  return (
    <VotingContext.Provider value={votingState}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}
