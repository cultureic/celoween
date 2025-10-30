import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import RenderMdx from '@/components/mdx/RenderMdx'
import LessonLayout from '@/components/academy/LessonLayout'
import { getCourseBySlug, COURSES } from '@/data/academy'
import { LessonAccessWrapper } from './LessonAccessWrapper'
import { EnrollmentProvider } from '@/lib/contexts/EnrollmentContext'
import { cookies } from 'next/headers'
import type { Address } from 'viem'
import { getAuthenticatedUser, getUserWalletAddress } from '@/lib/auth-server'
import { verifyEnrollmentAccess } from '@/lib/enrollment-verification'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  // For production deployment, use static fallback to avoid database dependency
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    console.log('Using static course data for production build')
    return COURSES.map((course) => ({ slug: course.slug }))
  }
  
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true }
    })
    return courses.map(course => ({ slug: course.slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Fallback to static data if database fails
    return COURSES.map((course) => ({ slug: course.slug }))
  }
}

export default async function CoursePage(props: any) {
  const { params, searchParams } = props as { params:{ slug:string }, searchParams?:{ m?:string; s?:string } }
  const awaitedParams = await params
  const awaitedSearchParams = await searchParams
  const m = awaitedSearchParams?.m ? Math.max(1, parseInt(String(awaitedSearchParams.m), 10)) : null
  const s = awaitedSearchParams?.s ? Math.max(1, parseInt(String(awaitedSearchParams.s), 10)) : null

  // Get course from database
  const course = await prisma.course.findUnique({
    where: { slug: awaitedParams.slug },
    include: {
      Module: {
        include: {
          Lesson: true
        },
        orderBy: { index: 'asc' }
      }
    }
  })
  
  if (!course) return notFound()
  
  const courseWithRels = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    status: course.status,
    visibility: course.visibility,
    modules: course.Module.map(module => ({
      id: module.id,
      index: module.index,
      title: module.title,
      summary: module.summary,
      lessons: module.Lesson.map(lesson => ({
        id: lesson.id,
        index: lesson.index,
        title: lesson.title,
        contentMdx: lesson.contentMdx || '',
        status: lesson.status,
        visibility: lesson.visibility
      }))
    }))
  }

  // If no modules exist or no lesson parameters provided, show course overview
  if (courseWithRels.modules.length === 0 || !m || !s) {
    const { CourseDetailClient } = await import('./CourseDetailClient')
    
    // Transform course data for CourseDetailClient
    const courseForClient = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle || '',
      level: 'Principiante' as const, // Default level, could be enhanced with DB field
      category: 'Desarrollo', // Default category, could be enhanced with DB field
      tags: ['blockchain', 'celo', 'web3'], // Default tags
      learners: 0, // Could be enhanced with enrollment count
      rating: 4.8, // Default rating, could be enhanced with reviews system
      ratingCount: 0,
      durationHours: 0, // Could be calculated from modules/lessons
      lessonsCount: courseWithRels.modules.reduce((total, mod) => total + mod.lessons.length, 0),
      isFree: true, // Default, could be enhanced with pricing
      priceUSD: 0,
      coverUrl: course.coverUrl || '/images/course-placeholder.jpg',
      promoVideoUrl: course.promoVideoUrl || undefined,
      outcomes: ['Comprender los fundamentos de blockchain', 'Desarrollar en Celo'], // Default outcomes
      prerequisites: [], // Could be enhanced with prerequisites
      modules: courseWithRels.modules.map(module => ({
        index: module.index,
        title: module.title,
        summary: module.summary || '',
        submodules: module.lessons.map(lesson => ({
          index: lesson.index,
          title: lesson.title,
          summary: '',
          content: lesson.contentMdx,
          items: [] // Enhanced curriculum structure could be added here
        }))
      })),
      instructor: {
        name: 'Celo Mexico Team',
        title: 'Blockchain Educators',
        avatarUrl: '/images/instructor-placeholder.jpg',
        bio: 'Expertos en desarrollo blockchain y el ecosistema Celo, dedicados a enseñar las mejores prácticas en Web3.'
      },
      createdAt: course.createdAt?.toISOString() || new Date().toISOString()
    }
    
    return <CourseDetailClient course={courseForClient} />
  }

  // Show lesson content if specific lesson is requested
  const mod = courseWithRels.modules.find((mm: any) => mm.index === m)
  const lesson = mod?.lessons.find((ll: any) => ll.index === s)
  if (!mod || !lesson || lesson.status !== 'PUBLISHED') return notFound()

  // Server-side enrollment verification
  console.log('[SERVER] Starting server-side enrollment verification');
  let serverHasAccess = false;
  let userWalletAddress: string | null = null;
  
  try {
    // Create a fake request object from the current context
    const cookieStore = await cookies();
    const cookiesString = cookieStore.toString();
    
    // Create a minimal request-like object for auth
    const fakeRequest = {
      headers: {
        get: (name: string) => {
          if (name === 'cookie') {
            return cookiesString;
          }
          return null;
        }
      }
    } as Request;
    
    console.log('[SERVER] Getting authenticated user...');
    const authResult = await getAuthenticatedUser(fakeRequest);
    
    if (authResult.isAuthenticated && authResult.user) {
      userWalletAddress = getUserWalletAddress(authResult.user);
      console.log('[SERVER] User wallet address:', userWalletAddress ? 'found' : 'not found');
      
      if (userWalletAddress) {
        console.log('[SERVER] Verifying enrollment access...');
        const enrollmentResult = await verifyEnrollmentAccess(
          userWalletAddress as Address,
          course.slug,
          course.id,
          42220 // Force mainnet chain ID for server verification
        );
        
        serverHasAccess = enrollmentResult.hasAccess;
        console.log('[SERVER] Server-side enrollment verification result:', {
          hasAccess: serverHasAccess,
          reason: enrollmentResult.reason,
          courseSlug: course.slug,
          courseId: course.id
        });
      }
    } else {
      console.log('[SERVER] User not authenticated:', authResult.error);
    }
  } catch (error) {
    console.error('[SERVER] Error during server-side enrollment verification:', error);
    // Fallback to client-side verification on error
    serverHasAccess = false;
  }

  return (
    <EnrollmentProvider
      courseSlug={course.slug}
      courseId={course.id}
      serverHasAccess={serverHasAccess}
    >
      <LessonAccessWrapper
        courseTitle={course.title}
      >
        <LessonLayout 
          course={courseWithRels} 
          current={{ moduleIndex: m, subIndex: s }}
        >
          <RenderMdx source={lesson.contentMdx ?? ''} />
        </LessonLayout>
      </LessonAccessWrapper>
    </EnrollmentProvider>
  )
}
