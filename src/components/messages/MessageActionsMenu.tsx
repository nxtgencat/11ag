import React, { useState, useRef } from 'react';
import { Message } from '../../types';
import { Reply, Star, Trash2, Copy, Forward, Info, Plus } from 'lucide-react';
import { EmojiPicker } from '../common/EmojiPicker';
import { DropdownItem, Dropdown } from '../common/Dropdown';

interface MessageActionsMenuProps {
  message: Message;
  isOutgoing: boolean;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onStar: () => void;
  onCopy: () => void;
  onForward: () => void;
  onDelete: (forEveryone: boolean) => void;
  onInfo: () => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export const MessageActionsMenu: React.FC<MessageActionsMenuProps> = ({
  message,
  isOutgoing,
  onReact,
  onReply,
  onStar,
  onCopy,
  onForward,
  onDelete,
  onInfo,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dropdownItems: DropdownItem[] = [
    {
      id: 'reply',
      label: 'Reply',
      icon: <Reply className="w-4 h-4" />,
      onClick: onReply,
    },
    {
      id: 'star',
      label: message.isStarred ? 'Unstar message' : 'Star message',
      icon: <Star className={`w-4 h-4 ${message.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />,
      onClick: onStar,
    },
    {
      id: 'forward',
      label: 'Forward message',
      icon: <Forward className="w-4 h-4" />,
      onClick: onForward,
    },
    {
      id: 'copy',
      label: 'Copy text',
      icon: <Copy className="w-4 h-4" />,
      onClick: onCopy,
    },
    {
      id: 'info',
      label: 'Message info',
      icon: <Info className="w-4 h-4" />,
      onClick: onInfo,
      dividerAfter: true,
    },
    {
      id: 'delete',
      label: 'Delete message',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => setShowDeleteModal(true),
      danger: true,
    },
  ];

  return (
    <>
      <div
        ref={menuRef}
        className={`flex items-center gap-1 bg-white/95 dark:bg-[#202c33]/95 backdrop-blur-xs shadow-wa-dropdown rounded-full border border-[#e9edef] dark:border-[#2a3942] p-1 animate-pop-in select-none z-30`}
      >
        {/* Quick Emojis */}
        <div className="flex items-center gap-0.5 px-1 border-r border-[#e9edef] dark:border-[#2a3942]">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation();
                onReact(emoji);
              }}
              className="p-1 hover:scale-125 active:scale-95 text-base transition-transform"
            >
              {emoji}
            </button>
          ))}

          {/* Plus Emoji Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="p-1 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white transition-colors"
              title="Add reaction"
            >
              <Plus className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <EmojiPicker
                  onSelectEmoji={(emoji) => {
                    onReact(emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Reply Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReply();
          }}
          className="p-1.5 rounded-full text-[#667781] dark:text-[#8696a0] hover:text-wa-green transition-colors"
          title="Reply"
        >
          <Reply className="w-3.5 h-3.5" />
        </button>

        {/* More Actions Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-1.5 rounded-full text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white transition-colors"
            title="More actions"
          >
            <span className="font-bold text-xs leading-none">⋯</span>
          </button>

          <Dropdown
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            items={dropdownItems}
            position={isOutgoing ? 'bottom-right' : 'bottom-left'}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#202c33] rounded-2xl p-6 shadow-wa-modal border border-[#e9edef] dark:border-[#2a3942] text-center animate-pop-in">
            <h3 className="font-semibold text-base mb-2">Delete message?</h3>
            <p className="text-xs text-[#667781] dark:text-[#8696a0] mb-6">
              You can delete this message for everyone or delete it just for yourself.
            </p>

            <div className="flex flex-col gap-2">
              {isOutgoing && (
                <button
                  onClick={() => {
                    onDelete(true);
                    setShowDeleteModal(false);
                  }}
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Delete for everyone
                </button>
              )}
              <button
                onClick={() => {
                  onDelete(false);
                  setShowDeleteModal(false);
                }}
                className="w-full py-2.5 bg-[#f0f2f5] dark:bg-[#2a3942] hover:bg-[#e9edef] text-[#111b21] dark:text-[#e9edef] text-xs font-semibold rounded-xl transition-colors"
              >
                Delete for me
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-2 text-xs text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
