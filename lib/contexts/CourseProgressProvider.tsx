"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useEnrollment } from './EnrollmentContext';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { useModulesCompleted, useHasCompletedModule } from '@/lib/hooks/useModuleCompletion';
import { getCourseTokenId } from '@/lib/courseToken';
import type { Address } from 'viem';

interface CourseProgressState {
  // User identification
  userAddress: Address | undefined;
  isConnected: boolean;
  
  // Course identification
  courseSlug: string;
  courseId: string;
  tokenId: bigint;
  
  // Progress data - SINGLE SOURCE OF TRUTH
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  isComplete: boolean;
  
  // Individual module completion status
  moduleCompletionStatus: boolean[];
  
  // Loading states
  isLoading: boolean;
}

const CourseProgressContext = createContext<CourseProgressState | null>(null);

interface CourseProgressProviderProps {
  children: ReactNode;
  courseSlug: string;
  courseId: string;
  totalModules: number;
}

export function CourseProgressProvider({
  children,
  courseSlug,
  courseId,
  totalModules,
}: CourseProgressProviderProps) {
  // USE ENROLLMENT CONTEXT FOR CONSISTENT ADDRESS
  const enrollment = useEnrollment();
  const smartAccount = useSmartAccount();
  
  // MATCH THE ENROLLMENT CONTEXT ADDRESS LOGIC
  const walletAddress = enrollment.userAddress;
  const addressForProgressCheck = smartAccount.smartAccountAddress || walletAddress;
  const isConnected = enrollment.isWalletConnected;
  
  const tokenId = getCourseTokenId(courseSlug, courseId);
  
  // Get contract data with consistent address (same as enrollment)
  const modulesCompleted = useModulesCompleted(addressForProgressCheck, tokenId);
  
  // Get individual module completion status (0, 1, 2, ...)
  const module0Completed = useHasCompletedModule(addressForProgressCheck, tokenId, 0);
  const module1Completed = useHasCompletedModule(addressForProgressCheck, tokenId, 1);
  const module2Completed = useHasCompletedModule(addressForProgressCheck, tokenId, 2);
  const module3Completed = useHasCompletedModule(addressForProgressCheck, tokenId, 3);
  const module4Completed = useHasCompletedModule(addressForProgressCheck, tokenId, 4);
  
  // Build completion status array
  const moduleCompletionStatus = [
    module0Completed.data || false,
    module1Completed.data || false,
    module2Completed.data || false,
    module3Completed.data || false,
    module4Completed.data || false,
  ].slice(0, totalModules);
  
  // Count actual completed modules from individual checks
  const completedModules = moduleCompletionStatus.filter(Boolean).length;
  
  // Calculate progress
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const isComplete = progressPercentage === 100;
  
  // Loading state
  const isLoading = modulesCompleted.isLoading || 
                   module0Completed.isLoading || 
                   module1Completed.isLoading || 
                   module2Completed.isLoading;
  
  console.log('[COURSE PROGRESS PROVIDER] PROGRESS DATA:', {
    walletAddress,
    smartAccountAddress: smartAccount.smartAccountAddress,
    addressForProgressCheck,
    isConnected,
    courseSlug,
    totalModules,
    completedModules,
    progressPercentage,
    moduleCompletionStatus,
    contractModulesCompleted: modulesCompleted.data?.toString(),
  });
  
  const contextValue: CourseProgressState = {
    userAddress: addressForProgressCheck,
    isConnected,
    courseSlug,
    courseId,
    tokenId,
    totalModules,
    completedModules,
    progressPercentage,
    isComplete,
    moduleCompletionStatus,
    isLoading,
  };
  
  return (
    <CourseProgressContext.Provider value={contextValue}>
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext);
  if (!context) {
    throw new Error('useCourseProgress must be used within a CourseProgressProvider');
  }
  return context;
}