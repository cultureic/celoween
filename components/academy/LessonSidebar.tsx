import React from 'react';
import { CourseWithRels } from './LessonLayout';

type LessonSidebarProps = {
  course: CourseWithRels;
  current: { moduleIndex: number; subIndex: number };
  className?: string;
};

export default function LessonSidebar({ course, current, className = '' }: LessonSidebarProps) {
  const getLessonHref = (moduleIndex: number, lessonIndex: number) => {
    return `/academy/${course.slug}?m=${moduleIndex}&s=${lessonIndex}`;
  };

  const isActive = (moduleIndex: number, lessonIndex: number) => {
    return current.moduleIndex === moduleIndex && current.subIndex === lessonIndex;
  };

  const isModuleActive = (moduleIndex: number) => {
    return current.moduleIndex === moduleIndex;
  };

  return (
    <nav className={`p-4 ${className}`}>
      <div className="space-y-6">
        {course.modules.map((module) => (
          <div key={module.id} className="space-y-2">
            {/* Module Header */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isModuleActive(module.index) ? 'bg-celo-yellow' : 'bg-white/30'
              }`} />
              <h3 className="font-gt italic text-sm text-celo-yellow">
                Módulo {module.index}
              </h3>
            </div>
            
            {/* Module Title */}
            <h4 className="font-inter text-sm font-medium text-white/90 ml-4">
              {module.title}
            </h4>
            
            {module.summary && (
              <p className="font-inter text-xs text-white/60 ml-4">
                {module.summary}
              </p>
            )}

            {/* Lessons */}
            <div className="ml-4 space-y-1">
              {module.lessons.map((lesson) => {
                const href = getLessonHref(module.index, lesson.index);
                const active = isActive(module.index, lesson.index);
                
                return (
                  <a
                    key={lesson.id}
                    href={href}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-celo-yellow/20 text-celo-yellow border border-celo-yellow/30'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        active ? 'bg-celo-yellow' : 'bg-white/40'
                      }`} />
                      <span className="font-inter">
                        {lesson.title}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Course Info */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-celo-yellow" />
            <span className="font-gt italic text-sm text-celo-yellow">
              Curso
            </span>
          </div>
          <h5 className="font-inter text-sm font-medium text-white/90 ml-4">
            {course.title}
          </h5>
          {course.subtitle && (
            <p className="font-inter text-xs text-white/60 ml-4">
              {course.subtitle}
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}
