import React from 'react';
import { Lock, Laptop, Ticket } from 'lucide-react';

export const EmptyChatState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-paper dark:bg-inkdark select-none relative overflow-hidden transition-colors">
      {/* Decorative Tearline Floating Card */}
      <div className="relative mb-8">
        <div className="w-56 h-36 rounded-xl bg-cobalt/10 border border-cobalt/20 shadow-sm rotate-[-3deg] absolute inset-0 animate-floatSlow" />
        <div className="w-56 h-36 rounded-xl bg-surface dark:bg-surfacedark border border-line dark:border-linedark shadow-md rotate-[3deg] p-5 flex flex-col justify-between relative z-10 animate-floatSlow" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate dark:text-slatedark tracking-widest">
              TEARLINE · MSG
            </span>
            <Ticket className="w-4 h-4 text-cobalt dark:text-cobalt-light" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-ink dark:text-paperdark">
              Encrypted Session
            </h4>
            <p className="font-mono text-[10px] text-slate dark:text-slatedark mt-0.5">
              Ready for transmission
            </p>
          </div>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="max-w-md space-y-3 z-10">
        <span className="ticket-tag text-[10px] py-1 px-3">
          <Laptop className="w-3 h-3 text-cobalt dark:text-cobalt-light" />
          DESKTOP & MOBILE WORKSPACE
        </span>

        <h3 className="font-display font-semibold text-2xl text-ink dark:text-paperdark tracking-tight mt-3">
          Select a Conversation
        </h3>

        <p className="text-xs sm:text-sm text-slate dark:text-slatedark leading-relaxed">
          Send real files, record live voice notes, initiate simulated video calls, or switch between 50+ populated contacts.
        </p>

        {/* Shortcut notice */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="font-mono text-xs text-slate dark:text-slatedark">Quick search:</span>
          <span className="kbd text-xs">⌘K</span>
        </div>
      </div>

      {/* Bottom End-to-End Encryption Banner */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[11px] font-mono text-slate dark:text-slatedark">
        <Lock className="w-3.5 h-3.5 text-mint" />
        <span>End-to-end encrypted with Signal Protocol</span>
      </div>
    </div>
  );
};
