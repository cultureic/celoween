import React from 'react';
import LessonSidebar from './LessonSidebar';
import LessonContent from './LessonContent';
import LessonProgress from './LessonProgress';

export type CourseWithRels = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  status?: string;
  visibility?: string;
  modules: Array<{
    id: string;
    index: number;
    title: string;
    summary?: string | null;
    lessons: Array<{
      id: string;
      index: number;
      title: string;
      contentMdx?: string;
      status: string;
      visibility?: string;
    }>;
  }>;
  // Allow additional fields from Prisma
  [key: string]: any;
};

export type LessonLayoutProps = {
  course: CourseWithRels;
  current: { moduleIndex: number; subIndex: number };
  children: React.ReactNode; // MDX rendered content
};

export default function LessonLayout({ course, current, children }: LessonLayoutProps) {
  const currentModule = course.modules.find(m => m.index === current.moduleIndex);
  const currentLesson = currentModule?.lessons.find(l => l.index === current.subIndex);

  if (!currentModule || !currentLesson) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="font-gt italic text-xl md:text-2xl text-celo-yellow truncate">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="font-inter text-sm text-white/70 mt-1 truncate">
                  {course.subtitle}
                </p>
              )}
            </div>
            <LessonProgress 
              course={course} 
              current={current}
              className="hidden md:flex"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-white/10 bg-black/30">
          <LessonSidebar 
            course={course} 
            current={current}
            className="h-[calc(100vh-80px)] overflow-y-auto"
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <LessonContent 
            course={course}
            current={current}
            currentModule={currentModule}
            currentLesson={currentLesson}
          >
            {children}
          </LessonContent>
        </main>
      </div>

      {/* Mobile Progress - shown only on mobile */}
      <div className="lg:hidden border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <LessonProgress 
          course={course} 
          current={current}
          className="px-4 py-3"
        />
      </div>
    </div>
  );
}
