import React from 'react';
import { Message } from '../../types';
import { Star, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface StarredMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  starredMessages?: Message[];
}

export const StarredMessagesModal: React.FC<StarredMessagesModalProps> = ({
  isOpen,
  onClose,
  starredMessages,
}) => {
  const { starMessage, messages: allMessages } = useChat();

  if (!isOpen) return null;

  // Use provided list or collect all starred messages across all chats
  const displayMessages = starredMessages || Object.values(allMessages).flat().filter((m) => m.isStarred);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md card p-0 overflow-hidden flex flex-col max-h-[80vh] animate-pop-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line dark:border-linedark bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber fill-amber" />
            <h3 className="font-display font-semibold text-sm text-ink dark:text-paperdark">
              Starred Messages
            </h3>
            <span className="mini-tag font-mono">({displayMessages.length})</span>
          </div>
          <button
            onClick={onClose}
            className="btn-icon w-8 h-8"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayMessages.length > 0 ? (
            displayMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-xl bg-paper dark:bg-inkdark border border-line dark:border-linedark space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-xs text-cobalt dark:text-cobalt-light">
                    {msg.senderName || (msg.senderId === 'me' ? 'You' : 'Contact')}
                  </span>
                  <span className="font-mono text-[10px] text-slate dark:text-slatedark">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-xs text-ink dark:text-paperdark leading-relaxed">
                  {msg.text || `${msg.type} attachment`}
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => starMessage(msg.id)}
                    className="text-[11px] font-mono text-rose hover:underline"
                  >
                    Unstar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate dark:text-slatedark space-y-2">
              <Star className="w-8 h-8 mx-auto text-amber/40" />
              <p className="text-xs font-medium">No starred messages yet</p>
              <p className="mini-tag text-[10px]">Hover any message and click Star to save it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
