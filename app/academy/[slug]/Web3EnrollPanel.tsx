"use client";

import { EnrollPanel } from "@/components/academy/EnrollPanel";
import { Course } from "@/components/academy/types";
import { useEnrollment } from "@/lib/contexts/EnrollmentContext";

interface Web3EnrollPanelProps {
  course: Course;
}

export default function Web3EnrollPanel({ course }: Web3EnrollPanelProps) {
  const enrollment = useEnrollment();
  
  console.log('[WEB3 ENROLL PANEL] Enrollment state:', {
    hasBadge: enrollment.hasBadge,
    hasClaimed: enrollment.hasClaimed,
    isLoading: enrollment.isLoading,
    isWalletConnected: enrollment.isWalletConnected,
  });

  const handleEnroll = async (course: Course) => {
    if (!enrollment.isWalletConnected) {
      alert("Por favor conecta tu wallet para inscribirte en el curso.");
      return;
    }
    
    try {
      console.log('[WEB3 ENROLL PANEL] Enrolling in course:', course.title);
      await enrollment.enrollInCourse();
      console.log('[WEB3 ENROLL PANEL] Enrollment initiated');
    } catch (error) {
      console.error('[WEB3 ENROLL PANEL] Enrollment error:', error);
      alert(`Error al inscribirse: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <EnrollPanel 
      course={course} 
      onEnroll={handleEnroll}
      enrollmentState={{
        hasBadge: enrollment.hasBadge,
        hasClaimed: enrollment.hasClaimed,
        isLoading: enrollment.isLoading,
        isEnrolling: enrollment.isEnrolling,
        isConfirmingEnrollment: enrollment.isConfirmingEnrollment,
        enrollmentSuccess: enrollment.enrollmentSuccess,
        enrollmentError: enrollment.enrollmentError || null,
        enrollmentHash: enrollment.enrollmentHash,
        isWalletConnected: enrollment.isWalletConnected
      }}
    />
  );
}
