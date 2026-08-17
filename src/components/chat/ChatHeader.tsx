import React, { useState } from 'react';
import { Contact } from '../../types';
import { Avatar } from '../common/Avatar';
import { Phone, Video, Search, MoreVertical, ArrowLeft, ShieldAlert, Ban, Trash2, BellOff, Info, Clock } from 'lucide-react';
import { Dropdown, DropdownItem } from '../common/Dropdown';
import { useChat } from '../../context/ChatContext';
import { useCall } from '../../context/CallContext';
import { Modal } from '../common/Modal';

interface ChatHeaderProps {
  contact: Contact;
  onBackToChatList?: () => void;
  onToggleSearch: () => void;
  onOpenContactInfo: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  contact,
  onBackToChatList,
  onToggleSearch,
  onOpenContactInfo,
}) => {
  const { muteChat, clearChat, blockContact } = useChat();
  const { startCall } = useCall();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const menuItems: DropdownItem[] = [
    {
      id: 'contact-info',
      label: 'Contact info',
      icon: <Info className="w-4 h-4" />,
      onClick: onOpenContactInfo,
    },
    {
      id: 'mute',
      label: contact.isMuted ? 'Unmute notifications' : 'Mute notifications',
      icon: <BellOff className="w-4 h-4" />,
      onClick: () => muteChat(contact.id),
    },
    {
      id: 'disappearing',
      label: 'Disappearing messages',
      icon: <Clock className="w-4 h-4" />,
      onClick: onOpenContactInfo,
      dividerAfter: true,
    },
    {
      id: 'clear',
      label: 'Clear chat',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => setShowClearModal(true),
    },
    {
      id: 'block',
      label: contact.isBlocked ? 'Unblock contact' : 'Block contact',
      icon: <Ban className="w-4 h-4" />,
      onClick: () => setShowBlockModal(true),
      danger: true,
    },
    {
      id: 'report',
      label: 'Report contact',
      icon: <ShieldAlert className="w-4 h-4" />,
      onClick: () => setShowReportModal(true),
      danger: true,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] select-none z-20 shrink-0">
        {/* Left: Back button (on mobile) + Avatar + Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {onBackToChatList && (
            <button
              onClick={onBackToChatList}
              className="p-1.5 -ml-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5 md:hidden"
              title="Back to chats"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={onOpenContactInfo}
            className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 hover:opacity-90 transition-opacity"
          >
            <Avatar
              src={contact.avatar}
              name={contact.name}
              size="md"
              isOnline={contact.isOnline}
              isGroup={contact.isGroup}
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                {contact.name}
              </h3>
              <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate">
                {contact.isTyping ? (
                  <span className="text-wa-green font-medium animate-pulse">typing...</span>
                ) : contact.isOnline ? (
                  <span className="text-wa-green font-medium">online</span>
                ) : (
                  contact.lastSeen || 'offline'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Video Call + Voice Call + Search + Dropdown */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#54656f] dark:text-[#aebac1]">
          <button
            onClick={() => startCall(contact, 'video')}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#111b21] dark:hover:text-white transition-colors"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            onClick={() => startCall(contact, 'voice')}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#111b21] dark:hover:text-white transition-colors"
            title="Voice call"
          >
            <Phone className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#e9edef] dark:bg-[#2a3942] mx-1 hidden sm:block" />

          <button
            onClick={onToggleSearch}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#111b21] dark:hover:text-white transition-colors"
            title="Search in chat"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#111b21] dark:hover:text-white transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <Dropdown
              isOpen={showDropdown}
              onClose={() => setShowDropdown(false)}
              items={menuItems}
              position="bottom-right"
            />
          </div>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)} title="Clear this chat?" maxWidth="sm">
        <p className="text-xs text-[#667781] dark:text-[#8696a0] mb-6 leading-relaxed">
          Messages will only be removed from this device and this chat history.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowClearModal(false)}
            className="px-4 py-2 text-xs text-[#8696a0]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              clearChat(contact.id);
              setShowClearModal(false);
            }}
            className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl"
          >
            Clear Messages
          </button>
        </div>
      </Modal>

      {/* Block Contact Modal */}
      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title={contact.isBlocked ? "Unblock contact?" : "Block contact?"} maxWidth="sm">
        <p className="text-xs text-[#667781] dark:text-[#8696a0] mb-6 leading-relaxed">
          {contact.isBlocked
            ? 'Unblocked contacts will be able to call you and send you messages.'
            : 'Blocked contacts will no longer be able to call you or send you messages.'}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowBlockModal(false)}
            className="px-4 py-2 text-xs text-[#8696a0]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              blockContact(contact.id);
              setShowBlockModal(false);
            }}
            className={`px-5 py-2 text-white text-xs font-semibold rounded-xl ${
              contact.isBlocked ? 'bg-wa-green-deep' : 'bg-rose-500 hover:bg-rose-600'
            }`}
          >
            {contact.isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </Modal>

      {/* Report Contact Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report this contact?" maxWidth="sm">
        <p className="text-xs text-[#667781] dark:text-[#8696a0] mb-6 leading-relaxed">
          The last 5 messages from this contact will be forwarded to WhatsApp for spam analysis.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 text-xs text-[#8696a0]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowReportModal(false);
            }}
            className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl"
          >
            Report & Block
          </button>
        </div>
      </Modal>
    </>
  );
};
