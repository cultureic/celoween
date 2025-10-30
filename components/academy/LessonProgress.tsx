import React from 'react';
import { CourseWithRels } from './LessonLayout';

type LessonProgressProps = {
  course: CourseWithRels;
  current: { moduleIndex: number; subIndex: number };
  className?: string;
};

export default function LessonProgress({ course, current, className = '' }: LessonProgressProps) {
  // Calculate progress
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  
  const currentLessonIndex = course.modules.reduce((acc, module) => {
    if (module.index < current.moduleIndex) {
      return acc + module.lessons.length;
    } else if (module.index === current.moduleIndex) {
      return acc + current.subIndex - 1;
    }
    return acc;
  }, 0);
  
  const progressPercentage = totalLessons > 0 ? ((currentLessonIndex + 1) / totalLessons) * 100 : 0;

  // Get current lesson info
  const currentModule = course.modules.find(m => m.index === current.moduleIndex);
  const currentLesson = currentModule?.lessons.find(l => l.index === current.subIndex);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Progress Bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
          <span className="font-inter">
            Lección {currentLessonIndex + 1} de {totalLessons}
          </span>
          <span className="font-inter">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-celo-yellow h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current Lesson Info */}
      {currentLesson && (
        <div className="hidden sm:block ml-4 text-right">
          <div className="text-xs text-white/60 font-inter">
            Módulo {current.moduleIndex}
          </div>
          <div className="text-sm text-celo-yellow font-gt italic truncate max-w-32">
            {currentLesson.title}
          </div>
        </div>
      )}
    </div>
  );
}
