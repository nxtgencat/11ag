import React from 'react';
import { Message } from '../../types';
import { Star, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface StarredMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  starredMessages: Message[];
}

export const StarredMessagesModal: React.FC<StarredMessagesModalProps> = ({
  isOpen,
  onClose,
  starredMessages,
}) => {
  const { starMessage } = useChat();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] overflow-hidden flex flex-col max-h-[80vh] animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e9edef] dark:border-[#222d34] bg-[#f0f2f5] dark:bg-[#202c33]">
          <div className="flex items-center gap-2 font-semibold text-[#111b21] dark:text-[#e9edef]">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>Starred Messages ({starredMessages.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#202c33] p-2">
          {starredMessages.length > 0 ? (
            starredMessages.map((msg) => (
              <div key={msg.id} className="p-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] rounded-xl flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] text-[#8696a0] mb-1">
                    <span className="font-semibold text-wa-green-deep dark:text-wa-green">{msg.senderName}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#111b21] dark:text-[#e9edef] break-words">
                    {msg.text || `${msg.type} message`}
                  </p>
                </div>
                <button
                  onClick={() => starMessage(msg.id)}
                  className="p-1 text-amber-400 hover:text-[#8696a0]"
                  title="Unstar"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#8696a0]">
              <Star className="w-12 h-12 mx-auto mb-2 opacity-30 stroke-1" />
              <p className="text-sm font-medium">No Starred Messages</p>
              <p className="text-xs mt-1">Tap Star on any message to save it here for later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
