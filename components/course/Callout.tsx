'use client';

import React from 'react';
import { 
  InformationCircleIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  LightBulbIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

export type CalloutVariant = 'info' | 'warning' | 'success' | 'tip' | 'danger';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CalloutVariant, {
  container: string;
  icon: string;
  iconComponent: React.ComponentType<{ className?: string }>;
}> = {
  info: {
    container: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    iconComponent: InformationCircleIcon,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    iconComponent: ExclamationTriangleIcon,
  },
  success: {
    container: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    iconComponent: CheckCircleIcon,
  },
  tip: {
    container: 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    iconComponent: LightBulbIcon,
  },
  danger: {
    container: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    iconComponent: XCircleIcon,
  },
};

export const Callout: React.FC<CalloutProps> = ({ 
  variant = 'info', 
  title, 
  children 
}) => {
  const style = variantStyles[variant];
  const Icon = style.iconComponent;

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${style.container}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-semibold mb-1 ${style.icon}`}>
              {title}
            </h3>
          )}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callout;
