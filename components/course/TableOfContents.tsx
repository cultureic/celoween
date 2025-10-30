'use client';

import React, { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef?: React.RefObject<HTMLElement>;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ contentRef }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const content = contentRef?.current || document.querySelector('article');
    if (!content) return;

    // Extract headings
    const headingElements = content.querySelectorAll('h1, h2, h3, h4');
    const headingData: Heading[] = Array.from(headingElements).map((heading, index) => {
      // Add ID if it doesn't exist
      if (!heading.id) {
        const id = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `heading-${index}`;
        heading.id = id;
      }

      return {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
      };
    });

    setHeadings(headingData);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => {
      headingElements.forEach((heading) => observer.unobserve(heading));
    };
  }, [contentRef]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Table of Contents
        </h3>
      </div>
      <ul className="space-y-2 text-sm border-l-2 border-gray-200 dark:border-gray-700">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={`
                text-left w-full py-1 px-3 rounded transition-colors duration-200
                hover:text-prosperity hover:bg-prosperity/5
                ${
                  activeId === heading.id
                    ? 'text-prosperity font-medium border-l-2 border-prosperity -ml-0.5'
                    : 'text-gray-600 dark:text-gray-400'
                }
              `}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
