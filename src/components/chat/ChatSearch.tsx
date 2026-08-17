import React from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface ChatSearchProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  matchCount: number;
  currentMatchIndex: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
}

export const ChatSearch: React.FC<ChatSearchProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  matchCount,
  currentMatchIndex,
  onNextMatch,
  onPrevMatch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] animate-slide-down z-10 select-none">
      <div className="flex-1 flex items-center bg-white dark:bg-[#111b21] rounded-xl px-3 py-1.5 border border-[#e9edef] dark:border-[#2a3942] focus-within:border-wa-green transition-all shadow-2xs">
        <Search className="w-4 h-4 text-[#8696a0] mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search in conversation..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] outline-none"
          autoFocus
        />
        {query && (
          <span className="text-xs text-[#8696a0] font-mono shrink-0 ml-2">
            {matchCount > 0 ? `${currentMatchIndex + 1} of ${matchCount}` : 'No matches'}
          </span>
        )}
      </div>

      {matchCount > 0 && (
        <div className="flex items-center gap-1 text-[#54656f] dark:text-[#aebac1]">
          <button
            onClick={onPrevMatch}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            title="Previous match"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onNextMatch}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            title="Next match"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        onClick={onClose}
        className="p-1.5 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
        title="Close search"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
