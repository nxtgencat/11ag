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
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md border-b border-line dark:border-linedark select-none z-20 shrink-0">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBackToChatList && (
            <button
              onClick={onBackToChatList}
              className="btn-icon w-8 h-8 md:hidden -ml-1"
              title="Back to chats"
            >
              <ArrowLeft className="w-4 h-4" />
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
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-sm text-ink dark:text-paperdark tracking-tight truncate">
                  {contact.name}
                </h3>
                {contact.isGroup && (
                  <span className="ticket-tag text-[9px] py-0 px-1.5 font-mono">GROUP</span>
                )}
              </div>
              <p className="text-[11px] text-slate dark:text-slatedark truncate font-mono">
                {contact.isTyping ? (
                  <span className="text-mint font-medium animate-pulse">typing...</span>
                ) : contact.isOnline ? (
                  <span className="text-mint font-medium">● online</span>
                ) : (
                  contact.lastSeen || 'offline'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 text-slate dark:text-slatedark">
          <button
            onClick={() => startCall(contact, 'video')}
            className="btn-icon w-8 h-8"
            title="Video call"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={() => startCall(contact, 'voice')}
            className="btn-icon w-8 h-8"
            title="Voice call"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleSearch}
            className="btn-icon w-8 h-8"
            title="Search in conversation"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn-icon w-8 h-8"
              title="More options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
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
      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)} title="Clear Conversation?" maxWidth="sm">
        <p className="text-xs text-slate dark:text-slatedark mb-6 leading-relaxed">
          Messages will be cleared from this conversation. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowClearModal(false)}
            className="btn-ghost py-1.5 px-3 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              clearChat(contact.id);
              setShowClearModal(false);
            }}
            className="px-4 py-1.5 rounded-full bg-rose text-white text-xs font-medium hover:opacity-90"
          >
            Clear Messages
          </button>
        </div>
      </Modal>

      {/* Block Contact Modal */}
      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title={contact.isBlocked ? "Unblock contact?" : "Block contact?"} maxWidth="sm">
        <p className="text-xs text-slate dark:text-slatedark mb-6 leading-relaxed">
          {contact.isBlocked
            ? 'Unblocked contacts will be able to send you messages and initiate calls.'
            : 'Blocked contacts will no longer be able to message or call you.'}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowBlockModal(false)}
            className="btn-ghost py-1.5 px-3 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              blockContact(contact.id);
              setShowBlockModal(false);
            }}
            className={`px-4 py-1.5 rounded-full text-white text-xs font-medium ${
              contact.isBlocked ? 'bg-cobalt' : 'bg-rose'
            }`}
          >
            {contact.isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report Contact?" maxWidth="sm">
        <p className="text-xs text-slate dark:text-slatedark mb-6 leading-relaxed">
          The last 5 messages will be forwarded for moderation review.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowReportModal(false)}
            className="btn-ghost py-1.5 px-3 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-1.5 rounded-full bg-rose text-white text-xs font-medium"
          >
            Report & Block
          </button>
        </div>
      </Modal>
    </>
  );
};
