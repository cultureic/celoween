"use client";

import { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Circle, ExternalLink, Award, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEnrollment } from '@/lib/contexts/EnrollmentContext';
import { useHasCompletedModule } from '@/lib/hooks/useModuleCompletion';
import { useSmartAccount } from '@/lib/contexts/ZeroDevSmartWalletProvider';
import { getCourseTokenId } from '@/lib/courseToken';
import { CertificateGenerator } from '@/components/certificates/CertificateGenerator';
import { SponsoredModuleCompletion } from './SponsoredModuleCompletion';
import { ModuleCompletionProvider } from '@/lib/contexts/ModuleCompletionContext';
import { getOptimizedContractAddress, getNetworkConfig } from '@/lib/contracts/optimized-badge-config';
import { useChainId } from 'wagmi';
import type { Address } from 'viem';

interface Module {
  index: number;
  title: string;
  summary?: string;
  lessons?: any[];
}

interface CourseProgressDashboardProps {
  courseSlug: string;
  courseId: string;
  courseTitle: string;
  modules: Module[];
  className?: string;
}

export function CourseProgressDashboard({
  courseSlug,
  courseId,
  courseTitle,
  modules,
  className = '',
}: CourseProgressDashboardProps) {
  const enrollment = useEnrollment();
  const [mounted, setMounted] = useState(false);
  // Force mainnet regardless of connected wallet chain
  const contractAddress = getOptimizedContractAddress(42220);
  const networkConfig = getNetworkConfig(42220);
  
  // SIMPLE FIX - Use enrollment context that already has the user address
  const enrollmentUserAddress = enrollment.userAddress;
  const tokenId = getCourseTokenId(courseSlug, courseId);
  
  // Get module completion data using the working address from enrollment
  const module0Completed = useHasCompletedModule(enrollmentUserAddress, tokenId, 0);
  const module1Completed = useHasCompletedModule(enrollmentUserAddress, tokenId, 1);
  const module2Completed = useHasCompletedModule(enrollmentUserAddress, tokenId, 2);
  
  const moduleCompletionStatus = [
    module0Completed.data || false,
    module1Completed.data || false,
    module2Completed.data || false,
  ].slice(0, modules.length);
  
  const completedModules = moduleCompletionStatus.filter(Boolean).length;
  const progressPercentage = modules.length > 0 ? Math.round((completedModules / modules.length) * 100) : 0;
  const isComplete = progressPercentage === 100;
  const progressLoading = module0Completed.isLoading || module1Completed.isLoading || module2Completed.isLoading;

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isEnrolled = enrollment.hasBadge || enrollment.hasClaimed || enrollment.enrollmentSuccess;

  console.log('[COURSE PROGRESS DASHBOARD] Using direct module hooks:', {
    courseSlug,
    isEnrolled,
    address: enrollmentUserAddress || 'none',
    completedModules,
    totalModules: modules.length,
    progressPercentage,
    isComplete,
    moduleCompletionStatus,
  });

  if (!mounted || progressLoading) {
    return <CourseProgressSkeleton />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Course Progress
            </div>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {progressPercentage}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Modules Completed</span>
              <span>{completedModules}/{modules.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* NFT Badge Status */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <Award className="h-6 w-6 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900">
                Dynamic NFT Badge
              </p>
              <p className="text-xs text-purple-700">
                Your progress is stored on-chain and updates as you complete modules
              </p>
            </div>
            {Boolean(enrollmentUserAddress) && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={`${networkConfig.EXPLORER_URL}/token/${contractAddress}?a=${tokenId.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs"
                >
                  View NFT <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </div>

          {/* Completion Reward */}
          {isComplete && (
            <div className="text-center py-4 border-t">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Trophy className="h-6 w-6 text-green-600" />
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-sm font-medium text-green-800 mb-1">
                  🎉 Course Completed!
                </p>
                <p className="text-xs text-green-600">
                  Your NFT badge now shows 100% completion. You can claim your certificate!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modules Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Modules Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modules.map((module, index) => (
              <ModuleProgressItem
                key={module.index || index}
                module={module}
                moduleIndex={index}
                courseSlug={courseSlug}
                courseId={courseId}
                userAddress={enrollmentUserAddress}
                isEnrolled={isEnrolled}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Generator */}
      <CertificateGenerator
        course={{
          id: courseId,
          slug: courseSlug,
          title: courseTitle,
          subtitle: null,
          categoryId: null,
          levelId: null,
          coverUrl: null,
          promoVideoUrl: null,
          durationHours: null,
          lessonsCount: null,
          rating: null,
          ratingCount: null,
          learners: null,
          isFree: true,
          visibility: 'PUBLIC' as const,
          status: 'PUBLISHED' as const,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        completedModules={completedModules}
        totalModules={modules.length}
        completionPercentage={progressPercentage}
      />
    </div>
  );
}

interface ModuleProgressItemProps {
  module: Module;
  moduleIndex: number;
  courseSlug: string;
  courseId: string;
  userAddress?: Address;
  isEnrolled: boolean;
}

function ModuleProgressItem({
  module,
  moduleIndex,
  courseSlug,
  courseId,
  userAddress,
  isEnrolled,
}: ModuleProgressItemProps) {
  // CHECK BOTH SMART ACCOUNT AND WALLET ADDRESS FOR COMPLETION
  const { smartAccountAddress } = useSmartAccount();
  const tokenId = getCourseTokenId(courseSlug, courseId);
  
  // Query both addresses
  const walletCompletion = useHasCompletedModule(userAddress, tokenId, moduleIndex);
  const smartAccountCompletion = useHasCompletedModule(smartAccountAddress || undefined, tokenId, moduleIndex);
  
  // Module is completed if EITHER address has completed it
  const isCompleted = walletCompletion.data || smartAccountCompletion.data || false;
  const isLoading = walletCompletion.isLoading || smartAccountCompletion.isLoading;
  
  console.log(`[MODULE ${moduleIndex}] Dual completion check:`, {
    walletAddress: userAddress,
    smartAccountAddress,
    walletCompleted: walletCompletion.data,
    smartAccountCompleted: smartAccountCompletion.data,
    finalIsCompleted: isCompleted,
    tokenId: tokenId.toString(),
    moduleIndex,
    contractModuleIndex: moduleIndex + 1,
  });

  return (
    <div className="space-y-3">
      {/* Module Info */}
      <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">
              Module {moduleIndex + 1}: {module.title}
            </p>
            {isCompleted && (
              <Badge variant="outline" className="text-xs">
                Completed
              </Badge>
            )}
          </div>
          {module.summary && (
            <p className="text-xs text-gray-500 mt-1">
              {module.summary}
            </p>
          )}
          {module.lessons && (
            <p className="text-xs text-gray-400 mt-1">
              {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="text-right text-xs text-gray-500">
          {isCompleted ? (
            <span className="text-green-600 font-medium">✓ Done</span>
          ) : (
            <span>Pending</span>
          )}
        </div>
      </div>
      
      {/* Sponsored Module Completion - Only show if enrolled and not completed */}
      {isEnrolled && !isCompleted && !isLoading && (
        <div className="pl-8">
          <ModuleCompletionProvider 
            courseSlug={courseSlug} 
            courseId={courseId} 
            moduleIndex={moduleIndex}
          >
            <SponsoredModuleCompletion
              courseSlug={courseSlug}
              courseId={courseId}
              moduleIndex={moduleIndex}
              moduleTitle={module.title}
              isCompleted={isCompleted}
              isEnrolled={isEnrolled}
              className="max-w-md"
            />
          </ModuleCompletionProvider>
        </div>
      )}
    </div>
  );
}

function CourseProgressSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="h-2 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-16 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-2 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}