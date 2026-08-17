import React, { useState } from 'react';
import { Contact } from '../../types';
import { Avatar } from '../common/Avatar';
import { Dropdown, DropdownItem } from '../common/Dropdown';
import { Pin, VolumeX, Archive, Trash2, Check, CheckCheck, MoreVertical, Image as ImageIcon, Video, Mic, FileText, MapPin, User } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface ChatListItemProps {
  contact: Contact;
  isActive: boolean;
  onSelect: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  contact,
  isActive,
  onSelect,
}) => {
  const { pinChat, muteChat, archiveChat, deleteChat, markAsRead } = useChat();
  const [dropdownPos, setDropdownPos] = useState<{ isOpen: boolean; x?: number; y?: number }>({ isOpen: false });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownPos({ isOpen: true });
  };

  const menuItems: DropdownItem[] = [
    {
      id: 'pin',
      label: contact.isPinned ? 'Unpin chat' : 'Pin chat',
      icon: <Pin className="w-4 h-4" />,
      onClick: () => pinChat(contact.id),
    },
    {
      id: 'mute',
      label: contact.isMuted ? 'Unmute notifications' : 'Mute notifications',
      icon: <VolumeX className="w-4 h-4" />,
      onClick: () => muteChat(contact.id),
    },
    {
      id: 'archive',
      label: contact.isArchived ? 'Unarchive chat' : 'Archive chat',
      icon: <Archive className="w-4 h-4" />,
      onClick: () => archiveChat(contact.id),
    },
    {
      id: 'mark-read',
      label: contact.unreadCount > 0 ? 'Mark as read' : 'Mark as unread',
      icon: <CheckCheck className="w-4 h-4" />,
      onClick: () => markAsRead(contact.id),
      dividerAfter: true,
    },
    {
      id: 'delete',
      label: 'Delete chat',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => deleteChat(contact.id),
      danger: true,
    },
  ];

  const renderLastMessageTypeIcon = () => {
    const type = contact.lastMessage?.type;
    if (!type || type === 'text') return null;

    const iconClass = "w-3.5 h-3.5 inline mr-1 text-[#8696a0]";
    switch (type) {
      case 'image': return <ImageIcon className={iconClass} />;
      case 'video': return <Video className={iconClass} />;
      case 'voice':
      case 'audio': return <Mic className={iconClass} />;
      case 'document': return <FileText className={iconClass} />;
      case 'location': return <MapPin className={iconClass} />;
      case 'contact': return <User className={iconClass} />;
      default: return null;
    }
  };

  const renderStatusTicks = () => {
    if (contact.lastMessage?.senderId !== 'me') return null;
    const status = contact.lastMessage?.status;

    if (status === 'read') {
      return <CheckCheck className="w-4 h-4 text-wa-blue inline mr-1 shrink-0" />;
    }
    if (status === 'delivered') {
      return <CheckCheck className="w-4 h-4 text-[#8696a0] inline mr-1 shrink-0" />;
    }
    return <Check className="w-4 h-4 text-[#8696a0] inline mr-1 shrink-0" />;
  };

  return (
    <div
      onClick={onSelect}
      onContextMenu={handleContextMenu}
      className={`group relative flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-colors border-b border-[#f0f2f5] dark:border-[#202c33] ${
        isActive
          ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
          : 'bg-white dark:bg-[#111b21] hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
      }`}
    >
      {/* Contact Avatar */}
      <Avatar
        src={contact.avatar}
        name={contact.name}
        size="md"
        isOnline={contact.isOnline}
        isGroup={contact.isGroup}
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
            {contact.name}
          </h4>
          <span
            className={`text-[11px] font-normal shrink-0 ml-2 ${
              contact.unreadCount > 0
                ? 'text-wa-green font-medium'
                : 'text-[#667781] dark:text-[#8696a0]'
            }`}
          >
            {contact.lastMessage?.timestamp || '10:45 AM'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center text-xs text-[#667781] dark:text-[#8696a0] truncate pr-1">
            {contact.isTyping ? (
              <span className="text-wa-green font-medium animate-pulse">typing...</span>
            ) : (
              <>
                {renderStatusTicks()}
                {renderLastMessageTypeIcon()}
                <span className="truncate">{contact.lastMessage?.text || contact.about}</span>
              </>
            )}
          </div>

          {/* Badges & Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {contact.isMuted && (
              <span title="Muted"><VolumeX className="w-3.5 h-3.5 text-[#8696a0]" /></span>
            )}
            {contact.isPinned && (
              <span title="Pinned"><Pin className="w-3.5 h-3.5 text-[#8696a0] rotate-45" /></span>
            )}
            {contact.unreadCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-wa-green text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                {contact.unreadCount}
              </span>
            )}
            
            {/* Quick dropdown trigger on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownPos({ isOpen: true });
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#8696a0] hover:text-[#111b21] dark:hover:text-white transition-opacity"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Context Menu Dropdown */}
      <Dropdown
        isOpen={dropdownPos.isOpen}
        onClose={() => setDropdownPos({ isOpen: false })}
        items={menuItems}
        position="bottom-right"
      />
    </div>
  );
};
