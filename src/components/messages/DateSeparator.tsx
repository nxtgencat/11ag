import React from 'react';
import { Lock } from 'lucide-react';

interface DateSeparatorProps {
  label: string;
  isEncryptionNotice?: boolean;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ label, isEncryptionNotice }) => {
  if (isEncryptionNotice) {
    return (
      <div className="flex justify-center my-3 px-4">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#ffeecd] dark:bg-[#182229] border border-[#ffdb99] dark:border-[#2a3942] text-[11px] text-[#54656f] dark:text-[#ffd279] text-center max-w-md shadow-2xs leading-relaxed">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>
            Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-3 select-none">
      <span className="px-3 py-1 rounded-lg bg-white/90 dark:bg-[#182229]/90 text-[11px] font-medium text-[#54656f] dark:text-[#8696a0] shadow-2xs border border-[#e9edef] dark:border-[#2a3942]">
        {label}
      </span>
    </div>
  );
};
