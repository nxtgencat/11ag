import React from 'react';
import { Lock } from 'lucide-react';

interface DateSeparatorProps {
  label: string;
  isEncryptionNotice?: boolean;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ label, isEncryptionNotice }) => {
  if (isEncryptionNotice) {
    return (
      <div className="flex justify-center my-4 px-4 select-none">
        <div className="ticket-tag text-[10px] py-1.5 px-3 max-w-md text-center leading-relaxed">
          <Lock className="w-3 h-3 text-cobalt dark:text-cobalt-light shrink-0" />
          <span>Messages are end-to-end encrypted · Tearline Signal Protocol</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 my-4 select-none px-4">
      <div className="h-px flex-1 bg-line dark:bg-linedark" />
      <span className="font-mono text-[10px] tracking-widest text-slate dark:text-slatedark uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-line dark:bg-linedark" />
    </div>
  );
};
