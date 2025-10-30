import { prisma } from '@/lib/db'
import { CourseCard } from '@/components/academy/CourseCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { COURSES } from '@/data/academy'
// import { motion } from 'framer-motion'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AcademyIndex() {
  let courses: any[] = []
  
  try {
    courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: { Level:true, Category:true, CourseInstructor:{ include:{ Instructor:true }}, CourseTag:{ include:{ Tag:true }} }
    })
  } catch (err) {
    console.error('[academy] Database error, using static data as fallback:', err);
    // Use static data as fallback when database fails
    courses = COURSES.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle,
      level: { name: course.level },
      category: { name: course.category },
      learners: course.learners,
      rating: course.rating,
      ratingCount: course.ratingCount,
      durationHours: course.durationHours,
      lessonsCount: course.lessonsCount,
      isFree: course.isFree,
      coverUrl: course.coverUrl,
      promoVideoUrl: course.promoVideoUrl
    }));
  }

  return (
    <div className="min-h-screen bg-celo-bg text-celo-fg">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-celo-border/60">
        {/* Gradient overlay: black in yellow theme, yellow tint in dark theme */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,.08),transparent_45%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(252,255,82,.12),transparent_45%)]"></div>
        {/* Dots overlay: black dots in yellow theme, white dots in dark theme */}
        <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] dark:[background-image:radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:12px_12px] opacity-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight text-celo-fg">
              Academia <span className="brand-em">Celo</span>
            </h1>
            <p className="mt-4 text-celo-muted max-w-2xl">
              Cursos para aprender y construir en el ecosistema Celo
            </p>
            <div className="h-1 w-20 bg-celo-yellow rounded-full mt-6"></div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {courses.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-celo-fg mb-2 font-display">
                Todos los cursos
              </h2>
              <p className="text-celo-muted">
                {courses.length} curso{courses.length !== 1 ? 's' : ''} disponible{courses.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    title: course.title,
                    subtitle: course.subtitle || undefined,
                    level: course.Level?.name || 'Principiante',
                    category: course.Category?.name || 'General',
                    learners: course.learners || 0,
                    rating: course.rating || 4.8,
                    ratingCount: course.ratingCount || 150,
                    durationHours: course.durationHours || 8,
                    lessonsCount: course.lessonsCount || 30,
                    isFree: course.isFree || true,
                    priceUSD: 0,
                    coverUrl: course.coverUrl || undefined,
                    promoVideoUrl: course.promoVideoUrl || undefined
                  }}
                  href={`/academy/${course.slug}`}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-celo-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-celo-fg mb-4 font-display">
                No hay cursos disponibles todavía
              </h3>
              <p className="text-celo-muted mb-8">
                Estamos trabajando en crear contenido increíble para ti. ¡Vuelve pronto!
              </p>
              <Link href="/">
                <Button className="bg-celo-yellow text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-celo-yellow/70 focus:ring-offset-2 focus:ring-offset-white relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(245,240,230,0.9),rgba(245,240,230,0)_60%)] before:opacity-0 before:scale-0 before:transition-transform before:duration-500 before:ease-out hover:before:opacity-100 hover:before:scale-125 before:-z-10">
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
