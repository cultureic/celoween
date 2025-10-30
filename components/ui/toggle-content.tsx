"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface ToggleContentProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  className?: string;
}

export function ToggleContent({ 
  title, 
  content, 
  defaultOpen = false, 
  className = "" 
}: ToggleContentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Simple function to convert markdown links to clickable HTML
  const makeLinksClickable = (text: string) => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>');
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={`border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}>
      <button
        onClick={toggleOpen}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls="toggle-content"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div 
          id="toggle-content"
          className="px-6 pb-6 border-t border-gray-100"
        >
          <div className="pt-4">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-gray-900 mt-5 mb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                
                if (paragraph.includes('\n- ')) {
                  const lines = paragraph.split('\n');
                  const title = lines[0];
                  const listItems = lines.slice(1).filter(line => line.startsWith('- '));
                  
                  return (
                    <div key={index}>
                      {title && (
                        <p className="mb-3 text-gray-700" dangerouslySetInnerHTML={{ __html: makeLinksClickable(title) }}></p>
                      )}
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        {listItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700" dangerouslySetInnerHTML={{ __html: makeLinksClickable(item.replace('- ', '')) }}></li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: makeLinksClickable(paragraph) }}></p>
                  );
                }
                
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
