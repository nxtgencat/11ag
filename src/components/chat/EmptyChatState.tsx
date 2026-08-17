import React from 'react';
import { Lock, Laptop } from 'lucide-react';

export const EmptyChatState: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center flex-1 h-full bg-[#f0f2f5] dark:bg-[#222e35] text-center p-8 border-b-6 border-wa-green">
      <div className="max-w-md flex flex-col items-center animate-fade-in">
        {/* Computer / Phone Sync Illustration */}
        <div className="w-56 h-56 relative flex items-center justify-center mb-6">
          <div className="w-44 h-44 rounded-full bg-wa-green/10 dark:bg-wa-green/5 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-wa-green/20 dark:bg-wa-green/10 flex items-center justify-center">
              <Laptop className="w-16 h-16 text-wa-green-deep dark:text-wa-green stroke-1" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-light text-[#111b21] dark:text-[#e9edef] mb-3">
          WhatsApp Web
        </h2>

        <p className="text-sm text-[#667781] dark:text-[#8696a0] leading-relaxed mb-8">
          Send and receive messages without keeping your phone online.<br />
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>

        <div className="flex items-center gap-2 text-xs text-[#8696a0] bg-white/60 dark:bg-[#111b21]/60 px-4 py-2 rounded-full shadow-2xs border border-[#e9edef] dark:border-[#2a3942]">
          <Lock className="w-3.5 h-3.5 text-wa-green" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};
