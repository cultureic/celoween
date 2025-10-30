import React from 'react';
import { CourseWithRels } from './LessonLayout';
import { LessonContentClient } from './LessonContentClient';

type LessonContentProps = {
  course: CourseWithRels;
  current: { moduleIndex: number; subIndex: number };
  currentModule: {
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
  };
  currentLesson: {
    id: string;
    index: number;
    title: string;
    contentMdx?: string;
    status: string;
    visibility?: string;
  };
  children: React.ReactNode;
};

export default function LessonContent({ 
  course, 
  current, 
  currentModule, 
  currentLesson, 
  children 
}: LessonContentProps) {
  const requiresWallet = (currentLesson.visibility === 'WALLET' || course.visibility === 'WALLET');

  // Navigation helpers
  const getPrevHref = () => {
    const flat = flattenLessons(course);
    const idx = flat.findIndex(x => x.m === current.moduleIndex && x.s === current.subIndex);
    if (idx > 0) {
      const p = flat[idx - 1];
      return `/academy/${course.slug}?m=${p.m}&s=${p.s}`;
    }
    return null;
  };

  const getNextHref = () => {
    const flat = flattenLessons(course);
    const idx = flat.findIndex(x => x.m === current.moduleIndex && x.s === current.subIndex);
    if (idx >= 0 && idx < flat.length - 1) {
      const n = flat[idx + 1];
      return `/academy/${course.slug}?m=${n.m}&s=${n.s}`;
    }
    return null;
  };

  const prevHref = getPrevHref();
  const nextHref = getNextHref();

  return (
    <LessonContentClient
      courseSlug={course.slug}
      courseId={course.id}
      currentModule={currentModule}
      currentLesson={currentLesson}
      requiresWallet={requiresWallet}
      prevHref={prevHref}
      nextHref={nextHref}
    >
      {children}
    </LessonContentClient>
  );
}

// Helper function to flatten lessons for navigation
function flattenLessons(course: CourseWithRels) {
  const out: { m: number; s: number }[] = [];
  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      out.push({ m: courseModule.index, s: lesson.index });
    }
  }
  return out.sort((a, b) => a.m === b.m ? a.s - b.s : a.m - b.m);
}
