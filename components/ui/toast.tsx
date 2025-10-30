"use client";

import * as React from "react";
import { cn } from "@/components/lib/utils";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  className?: string;
}

export interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...props, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <Toast key={index} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function Toast({ title, description, variant = "default", className }: ToastProps & { id?: string }) {
  return (
    <div
      className={cn(
        "max-w-sm w-full bg-white border rounded-lg shadow-lg p-4",
        variant === "destructive" && "border-red-200 bg-red-50",
        variant === "default" && "border-gray-200 bg-white",
        className
      )}
    >
      {title && (
        <div className={cn(
          "font-medium text-sm",
          variant === "destructive" ? "text-red-800" : "text-gray-900"
        )}>
          {title}
        </div>
      )}
      {description && (
        <div className={cn(
          "text-sm mt-1",
          variant === "destructive" ? "text-red-600" : "text-gray-600"
        )}>
          {description}
        </div>
      )}
    </div>
  );
}
