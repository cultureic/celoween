'use client';

import React, { useRef } from 'react';
import { ReadingProgress } from './ReadingProgress';
import { TableOfContents } from './TableOfContents';

interface CourseLayoutProps {
  children: React.ReactNode;
  showTOC?: boolean;
  showProgress?: boolean;
}

export const CourseLayout: React.FC<CourseLayoutProps> = ({ 
  children, 
  showTOC = true,
  showProgress = true 
}) => {
  const contentRef = useRef<HTMLElement>(null);

  return (
    <>
      {showProgress && <ReadingProgress />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <article 
            ref={contentRef}
            className="flex-1 min-w-0 max-w-4xl mx-auto prose prose-lg dark:prose-invert"
          >
            {children}
          </article>

          {/* Table of Contents - Hidden on mobile, visible on lg+ */}
          {showTOC && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <TableOfContents contentRef={contentRef} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseLayout;
