'use client';

import { useState, useEffect } from 'react';
import type { Address } from 'viem';
import {
  isUserEnrolledOnMainnet,
  isModuleCompletedOnMainnet,
  getModulesCompletedOnMainnet
} from '@/lib/contracts/optimized-badge-config';

/**
 * Direct mainnet enrollment check - bypasses wagmi completely
 * Guaranteed to read from Celo Mainnet RPC
 */
export function useDirectMainnetEnrollment(userAddress?: Address, courseId?: bigint) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userAddress || courseId === undefined) {
      setIsEnrolled(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const checkEnrollment = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('[DIRECT MAINNET CHECK] Checking enrollment:', {
          userAddress,
          courseId: courseId.toString(),
          rpcUrl: 'https://forno.celo.org'
        });
        
        const enrolled = await isUserEnrolledOnMainnet(userAddress, courseId);
        
        if (!cancelled) {
          setIsEnrolled(enrolled);
          console.log('[DIRECT MAINNET CHECK] Enrollment result:', enrolled);
        }
      } catch (err) {
        console.error('[DIRECT MAINNET CHECK] Failed:', err);
        if (!cancelled) {
          setError(err as Error);
          setIsEnrolled(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkEnrollment();

    return () => {
      cancelled = true;
    };
  }, [userAddress, courseId]);

  return { isEnrolled, isLoading, error };
}

/**
 * Direct mainnet module completion check - bypasses wagmi completely
 * Guaranteed to read from Celo Mainnet RPC
 */
export function useDirectMainnetModuleCompletion(
  userAddress?: Address, 
  courseId?: bigint, 
  moduleIndex?: number
) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userAddress || courseId === undefined || moduleIndex === undefined) {
      setIsCompleted(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const checkCompletion = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('[DIRECT MAINNET MODULE CHECK] Checking completion:', {
          userAddress,
          courseId: courseId.toString(),
          moduleIndex,
          contractModuleIndex: moduleIndex + 1,
          rpcUrl: 'https://forno.celo.org'
        });
        
        const completed = await isModuleCompletedOnMainnet(userAddress, courseId, moduleIndex);
        
        if (!cancelled) {
          setIsCompleted(completed);
          console.log('[DIRECT MAINNET MODULE CHECK] Completion result:', completed);
        }
      } catch (err) {
        console.error('[DIRECT MAINNET MODULE CHECK] Failed:', err);
        if (!cancelled) {
          setError(err as Error);
          setIsCompleted(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkCompletion();

    return () => {
      cancelled = true;
    };
  }, [userAddress, courseId, moduleIndex]);

  return { isCompleted, isLoading, error };
}

/**
 * Direct mainnet modules completed count - bypasses wagmi completely
 * Guaranteed to read from Celo Mainnet RPC
 */
export function useDirectMainnetModulesCount(userAddress?: Address, courseId?: bigint) {
  const [modulesCompleted, setModulesCompleted] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userAddress || courseId === undefined) {
      setModulesCompleted(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const getCount = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('[DIRECT MAINNET COUNT CHECK] Getting modules count:', {
          userAddress,
          courseId: courseId.toString(),
          rpcUrl: 'https://forno.celo.org'
        });
        
        const count = await getModulesCompletedOnMainnet(userAddress, courseId);
        
        if (!cancelled) {
          setModulesCompleted(count);
          console.log('[DIRECT MAINNET COUNT CHECK] Count result:', count);
        }
      } catch (err) {
        console.error('[DIRECT MAINNET COUNT CHECK] Failed:', err);
        if (!cancelled) {
          setError(err as Error);
          setModulesCompleted(0);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    getCount();

    return () => {
      cancelled = true;
    };
  }, [userAddress, courseId]);

  return { modulesCompleted, isLoading, error };
}