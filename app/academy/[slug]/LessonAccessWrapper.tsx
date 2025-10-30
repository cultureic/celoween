"use client";

import { CoursePaywall } from "@/components/academy/CoursePaywall";
import { useEffect, useState } from "react";
import { useEnrollment, useHasAccess } from "@/lib/contexts/EnrollmentContext";

interface LessonAccessWrapperProps {
  children: React.ReactNode;
  courseTitle: string;
}

export function LessonAccessWrapper({
  children,
  courseTitle,
}: LessonAccessWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const enrollment = useEnrollment();
  const hasAccess = useHasAccess();
  
  console.log('[LESSON ACCESS WRAPPER] Component state:', {
    mounted,
    isLoading: enrollment.isLoading,
    isWalletConnected: enrollment.isWalletConnected,
    hasAccess,
  });

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // While hydrating, show loading state
  if (!mounted) {
    console.log('[LESSON ACCESS WRAPPER] Not mounted yet, showing loading');
    return (
      <CoursePaywall
        courseTitle={courseTitle}
        courseSlug=""
        reason="LOADING"
      />
    );
  }

  // If checking enrollment status
  if (enrollment.isLoading) {
    console.log('[LESSON ACCESS WRAPPER] Enrollment loading, showing loading state');
    return (
      <CoursePaywall
        courseTitle={courseTitle}
        courseSlug=""
        reason="LOADING"
      />
    );
  }

  // If wallet is not connected
  if (!enrollment.isWalletConnected) {
    console.log('[LESSON ACCESS WRAPPER] Wallet not connected, showing wallet connection prompt');
    return (
      <CoursePaywall
        courseTitle={courseTitle}
        courseSlug=""
        reason="WALLET_NOT_CONNECTED"
        isWalletConnected={false}
      />
    );
  }

  // Check if user has access
  if (!hasAccess) {
    console.log('[LESSON ACCESS WRAPPER] No access, showing enrollment prompt');
    
    const handleEnroll = async () => {
      try {
        console.log('[LESSON ACCESS WRAPPER] Attempting enrollment...');
        await enrollment.enrollInCourse();
        console.log('[LESSON ACCESS WRAPPER] Enrollment successful');
      } catch (error) {
        console.error('[LESSON ACCESS WRAPPER] Enrollment error:', error);
      }
    };

    return (
      <CoursePaywall
        courseTitle={courseTitle}
        courseSlug=""
        reason="NOT_ENROLLED"
        isWalletConnected={true}
        onEnroll={handleEnroll}
        isEnrolling={enrollment.isEnrolling || enrollment.isConfirmingEnrollment}
      />
    );
  }

  // User has access, show the lesson content
  console.log('[LESSON ACCESS WRAPPER] Access granted, rendering lesson content');
  return <>{children}</>;
}
