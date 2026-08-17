import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface ReactionPillProps {
  reactions?: Record<string, string[]>;
  onReactionClick?: (emoji: string) => void;
}

export const ReactionPill: React.FC<ReactionPillProps> = ({ reactions, onReactionClick }) => {
  const [showModal, setShowModal] = useState(false);

  if (!reactions || Object.keys(reactions).length === 0) return null;

  const entries = Object.entries(reactions).filter(([_, users]) => users.length > 0);
  if (entries.length === 0) return null;

  const totalCount = entries.reduce((acc, [_, users]) => acc + users.length, 0);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white dark:bg-[#182229] border border-[#e9edef] dark:border-[#2a3942] shadow-xs text-xs hover:scale-105 transition-transform"
      >
        <span className="flex items-center -space-x-1">
          {entries.slice(0, 3).map(([emoji]) => (
            <span key={emoji} className="text-sm">{emoji}</span>
          ))}
        </span>
        {totalCount > 1 && (
          <span className="text-[10px] font-bold text-[#667781] dark:text-[#8696a0] pl-0.5">
            {totalCount}
          </span>
        )}
      </button>

      {/* Modal Breakdown */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Reactions" maxWidth="sm">
        <div className="space-y-3">
          {entries.map(([emoji, users]) => (
            <div key={emoji} className="flex items-center justify-between py-2 border-b border-[#e9edef] dark:border-[#2a3942] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm font-medium">
                    {users.map(u => (u === 'me' ? 'You' : 'Contact')).join(', ')}
                  </p>
                  <p className="text-xs text-[#8696a0]">{users.length} reaction{users.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              {onReactionClick && (
                <button
                  onClick={() => {
                    onReactionClick(emoji);
                    setShowModal(false);
                  }}
                  className="text-xs text-wa-green hover:underline"
                >
                  {users.includes('me') ? 'Remove' : 'React'}
                </button>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
