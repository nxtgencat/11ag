import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#111b21]/90 dark:bg-[#202c33]/95 text-white text-xs font-medium shadow-lg backdrop-blur-xs animate-slide-up border border-white/10">
      {message}
    </div>
  );
};
