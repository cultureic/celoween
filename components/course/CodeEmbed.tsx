'use client';

import React from 'react';

type EmbedType = 'codesandbox' | 'codepen' | 'stackblitz' | 'replit';

interface CodeEmbedProps {
  type: EmbedType;
  id: string;
  title?: string;
  height?: number;
}

const getEmbedUrl = (type: EmbedType, id: string): string => {
  switch (type) {
    case 'codesandbox':
      return `https://codesandbox.io/embed/${id}?fontsize=14&hidenavigation=1&theme=dark&view=preview`;
    case 'codepen':
      return `https://codepen.io/embed/${id}?default-tab=result&theme-id=dark`;
    case 'stackblitz':
      return `https://stackblitz.com/edit/${id}?embed=1&file=index.tsx&view=preview`;
    case 'replit':
      return `https://replit.com/@${id}?embed=true`;
    default:
      return '';
  }
};

export const CodeEmbed: React.FC<CodeEmbedProps> = ({ 
  type, 
  id, 
  title = 'Interactive Code Example',
  height = 500 
}) => {
  const embedUrl = getEmbedUrl(type, id);

  if (!embedUrl) {
    return (
      <div className="my-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">
          Invalid embed type or ID provided.
        </p>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </p>
      </div>
      <div 
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
        style={{ height: `${height}px` }}
      >
        <iframe
          src={embedUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
          title={title}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default CodeEmbed;
