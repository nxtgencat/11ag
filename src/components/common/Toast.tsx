import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, type = 'info' }) => {
  if (!isVisible || !message) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-mint" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-rose" />;
      default:
        return <Info className="w-3.5 h-3.5 text-cobalt dark:text-cobalt-light" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] pointer-events-none animate-slide-up">
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ink/90 dark:bg-paperdark/95 text-paper dark:text-inkdark shadow-lg border border-white/10 dark:border-black/10 backdrop-blur-md text-xs font-medium">
        {renderIcon()}
        <span>{message}</span>
      </div>
    </div>
  );
};
