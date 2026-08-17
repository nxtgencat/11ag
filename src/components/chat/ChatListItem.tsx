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

    const iconClass = "w-3.5 h-3.5 inline mr-1 text-slate dark:text-slatedark";
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
      return <CheckCheck className="w-3.5 h-3.5 text-cobalt dark:text-cobalt-light inline mr-1 shrink-0" />;
    }
    if (status === 'delivered') {
      return <CheckCheck className="w-3.5 h-3.5 text-slate dark:text-slatedark inline mr-1 shrink-0" />;
    }
    return <Check className="w-3.5 h-3.5 text-slate dark:text-slatedark inline mr-1 shrink-0" />;
  };

  return (
    <div
      onClick={onSelect}
      onContextMenu={handleContextMenu}
      className={`group relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
        isActive
          ? 'bg-surface dark:bg-surfacedark shadow-xs border-l-3 border-cobalt'
          : 'hover:bg-surface/60 dark:hover:bg-surfacedark/60'
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
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="font-display font-medium text-xs text-ink dark:text-paperdark truncate">
            {contact.name}
          </h4>
          <span
            className={`font-mono text-[10px] shrink-0 ml-2 ${
              contact.unreadCount > 0
                ? 'text-cobalt dark:text-cobalt-light font-bold'
                : 'text-slate dark:text-slatedark'
            }`}
          >
            {contact.lastMessage?.timestamp || '10:45 AM'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center text-xs text-slate dark:text-slatedark truncate pr-1">
            {contact.isTyping ? (
              <span className="text-mint font-medium animate-pulse font-mono text-[11px]">typing...</span>
            ) : (
              <>
                {renderStatusTicks()}
                {renderLastMessageTypeIcon()}
                <span className="truncate text-xs">{contact.lastMessage?.text || contact.about}</span>
              </>
            )}
          </div>

          {/* Badges & Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {contact.isMuted && (
              <span title="Muted"><VolumeX className="w-3 h-3 text-slate dark:text-slatedark" /></span>
            )}
            {contact.isPinned && (
              <span title="Pinned"><Pin className="w-3 h-3 text-slate dark:text-slatedark rotate-45" /></span>
            )}
            {contact.unreadCount > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-cobalt text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
                {contact.unreadCount}
              </span>
            )}
            
            {/* 3-dots hover action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownPos({ isOpen: true });
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate dark:text-slatedark hover:text-ink dark:hover:text-paperdark transition-opacity"
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
