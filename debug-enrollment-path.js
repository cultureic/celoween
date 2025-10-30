// ENROLLMENT PATH DEBUGGING SCRIPT
// This script will add console logs to trace exactly where enrollment fails

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUGGING ENROLLMENT EXECUTION PATH');
console.log('Adding console logs to trace where enrollment stops...\n');

// 1. Add debug logs to Web3EnrollPanel
const web3PanelPath = 'app/academy/[slug]/Web3EnrollPanel.tsx';
let web3Content = fs.readFileSync(web3PanelPath, 'utf8');

const originalHandleEnroll = `const handleEnroll = async (course: Course) => {
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
      alert(\`Error al inscribirse: \${error instanceof Error ? error.message : 'Error desconocido'}\`);
    }
  };`;

const debugHandleEnroll = `const handleEnroll = async (course: Course) => {
    console.log('🔥 [DEBUG] BUTTON CLICKED - Starting enrollment process');
    console.log('🔥 [DEBUG] Wallet connected:', enrollment.isWalletConnected);
    console.log('🔥 [DEBUG] Course:', course.title);
    console.log('🔥 [DEBUG] Enrollment object:', {
      hasBadge: enrollment.hasBadge,
      hasClaimed: enrollment.hasClaimed,
      isEnrolling: enrollment.isEnrolling,
      enrollmentSuccess: enrollment.enrollmentSuccess
    });
    
    if (!enrollment.isWalletConnected) {
      console.log('🔥 [DEBUG] EARLY RETURN - Wallet not connected');
      alert("Por favor conecta tu wallet para inscribirte en el curso.");
      return;
    }
    
    try {
      console.log('🔥 [DEBUG] ABOUT TO CALL enrollment.enrollInCourse()');
      await enrollment.enrollInCourse();
      console.log('🔥 [DEBUG] enrollment.enrollInCourse() COMPLETED');
    } catch (error) {
      console.error('🔥 [DEBUG] CAUGHT ERROR in handleEnroll:', error);
      alert(\`Error al inscribirse: \${error instanceof Error ? error.message : 'Error desconocido'}\`);
    }
  };`;

if (web3Content.includes(originalHandleEnroll)) {
  web3Content = web3Content.replace(originalHandleEnroll, debugHandleEnroll);
  fs.writeFileSync(web3PanelPath, web3Content);
  console.log('✅ Added debug logs to Web3EnrollPanel');
} else {
  console.log('⚠️  Could not find exact handleEnroll function to replace in Web3EnrollPanel');
}

// 2. Add debug logs to EnrollmentContext
const contextPath = 'lib/contexts/EnrollmentContext.tsx';
let contextContent = fs.readFileSync(contextPath, 'utf8');

const originalEnrollInCourse = `const enrollInCourse = async () => {
    console.log('[ENROLLMENT CONTEXT] Using unified enrollment:', {
      privyAuthenticated,
      prefersSponsoredMethod: unifiedEnrollment.prefersSponsoredMethod,
      canEnroll: unifiedEnrollment.canEnroll,
    });
    
    // The unified hook automatically chooses the best method
    await unifiedEnrollment.enroll();
  };`;

const debugEnrollInCourse = `const enrollInCourse = async () => {
    console.log('🔥 [DEBUG] ENROLLMENT CONTEXT - enrollInCourse() CALLED');
    console.log('🔥 [DEBUG] privyAuthenticated:', privyAuthenticated);
    console.log('🔥 [DEBUG] unifiedEnrollment state:', {
      prefersSponsoredMethod: unifiedEnrollment.prefersSponsoredMethod,
      canEnroll: unifiedEnrollment.canEnroll,
      isEnrolling: unifiedEnrollment.isEnrolling,
      enrollmentSuccess: unifiedEnrollment.enrollmentSuccess
    });
    
    try {
      console.log('🔥 [DEBUG] ABOUT TO CALL unifiedEnrollment.enroll()');
      await unifiedEnrollment.enroll();
      console.log('🔥 [DEBUG] unifiedEnrollment.enroll() COMPLETED');
    } catch (error) {
      console.error('🔥 [DEBUG] ERROR in enrollInCourse:', error);
      throw error;
    }
  };`;

if (contextContent.includes('// The unified hook automatically chooses the best method')) {
  contextContent = contextContent.replace(originalEnrollInCourse, debugEnrollInCourse);
  fs.writeFileSync(contextPath, contextContent);
  console.log('✅ Added debug logs to EnrollmentContext');
} else {
  console.log('⚠️  Could not find exact enrollInCourse function to replace in EnrollmentContext');
}

console.log('\n🔥 DEBUG LOGS ADDED!');
console.log('Now click "Inscribirse" and check the browser console to see where it stops.');
console.log('\nExpected flow:');
console.log('1. 🔥 [DEBUG] BUTTON CLICKED - Starting enrollment process');
console.log('2. 🔥 [DEBUG] ABOUT TO CALL enrollment.enrollInCourse()');
console.log('3. 🔥 [DEBUG] ENROLLMENT CONTEXT - enrollInCourse() CALLED');
console.log('4. 🔥 [DEBUG] ABOUT TO CALL unifiedEnrollment.enroll()');
console.log('5. Should see wallet signing prompt or error message');
console.log('\nIf you don\'t see all these logs, that\'s where the execution is failing!');