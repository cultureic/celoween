'use client';

import React, { useState } from 'react';

export interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              px-4 py-3 text-sm font-medium transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-prosperity focus:ring-offset-2
              ${
                activeTab === index
                  ? 'bg-white dark:bg-gray-900 text-prosperity border-b-2 border-prosperity'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-white dark:bg-gray-900">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
