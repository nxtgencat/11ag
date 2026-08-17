import React, { useState } from 'react';
import { Contact, Message } from '../../types';
import { Avatar } from '../common/Avatar';
import { SharedMediaTab } from './SharedMediaTab';
import { StarredMessagesModal } from './StarredMessagesModal';
import { X, Star, Bell, BellOff, Lock, Clock, Ban, Trash2, Phone, Video } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useCall } from '../../context/CallContext';

interface ContactInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  messages: Message[];
}

export const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({
  isOpen,
  onClose,
  contact,
  messages,
}) => {
  const { muteChat, blockContact, clearChat, deleteChat } = useChat();
  const { startCall } = useCall();
  const [showStarredModal, setShowStarredModal] = useState(false);
  const [disappearingVal, setDisappearingVal] = useState<'off' | '24h' | '7d' | '90d'>(contact.disappearingMessages || 'off');

  if (!isOpen) return null;

  const starredMessages = messages.filter((m) => m.isStarred);

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 md:w-96 bg-white dark:bg-[#111b21] border-l border-[#e9edef] dark:border-[#222d34] shadow-2xl flex flex-col animate-slide-up sm:animate-fade-in select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef]">Contact Info</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto divide-y-8 divide-[#f0f2f5] dark:divide-[#0c1317]">
        {/* Profile Card */}
        <div className="p-6 flex flex-col items-center text-center bg-white dark:bg-[#111b21]">
          <Avatar
            src={contact.avatar}
            name={contact.name}
            size="2xl"
            isOnline={contact.isOnline}
            isGroup={contact.isGroup}
            className="mb-4 shadow-md"
          />
          <h2 className="text-lg font-bold text-[#111b21] dark:text-[#e9edef]">
            {contact.name}
          </h2>
          <p className="text-xs text-[#667781] dark:text-[#8696a0] font-mono mt-0.5">
            {contact.phone}
          </p>

          {/* Quick Call Actions */}
          <div className="flex items-center gap-6 mt-5">
            <button
              onClick={() => startCall(contact, 'voice')}
              className="flex flex-col items-center gap-1 text-wa-green-deep dark:text-wa-green hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-wa-green/15 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium">Audio</span>
            </button>
            <button
              onClick={() => startCall(contact, 'video')}
              className="flex flex-col items-center gap-1 text-wa-green-deep dark:text-wa-green hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-wa-green/15 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium">Video</span>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="p-4 bg-white dark:bg-[#111b21]">
          <span className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider block mb-1">
            About
          </span>
          <p className="text-sm text-[#111b21] dark:text-[#e9edef] leading-relaxed">
            {contact.about}
          </p>
        </div>

        {/* Media, Links & Docs Browser */}
        <div className="p-4 bg-white dark:bg-[#111b21]">
          <span className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider block mb-2">
            Media, Links and Docs
          </span>
          <SharedMediaTab messages={messages} />
        </div>

        {/* Starred Messages Section */}
        <div className="p-2 bg-white dark:bg-[#111b21]">
          <button
            onClick={() => setShowStarredModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors"
          >
            <div className="flex items-center gap-3 text-[#111b21] dark:text-[#e9edef]">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">Starred Messages</span>
            </div>
            <span className="text-xs font-semibold text-wa-green">
              {starredMessages.length}
            </span>
          </button>
        </div>

        {/* Notification & Disappearing Settings */}
        <div className="p-2 bg-white dark:bg-[#111b21] space-y-1">
          {/* Mute toggle */}
          <button
            onClick={() => muteChat(contact.id)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors text-left"
          >
            <div className="flex items-center gap-3 text-[#111b21] dark:text-[#e9edef]">
              {contact.isMuted ? <BellOff className="w-5 h-5 text-[#8696a0]" /> : <Bell className="w-5 h-5 text-[#8696a0]" />}
              <span className="text-sm font-medium">Mute notifications</span>
            </div>
            <span className="text-xs font-mono text-[#8696a0]">
              {contact.isMuted ? contact.muteUntil || 'Always' : 'Off'}
            </span>
          </button>

          {/* Disappearing messages */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 text-[#111b21] dark:text-[#e9edef]">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#8696a0]" />
                <span className="text-sm font-medium">Disappearing messages</span>
              </div>
              <span className="text-xs text-[#8696a0] capitalize">{disappearingVal}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {(['off', '24h', '7d', '90d'] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setDisappearingVal(val)}
                  className={`py-1 text-xs rounded-lg border uppercase font-mono transition-colors ${
                    disappearingVal === val
                      ? 'bg-wa-green/15 text-wa-green border-wa-green font-bold'
                      : 'border-[#e9edef] dark:border-[#2a3942] text-[#8696a0]'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Encryption Note */}
          <div className="flex items-center gap-3 p-3 text-xs text-[#8696a0]">
            <Lock className="w-5 h-5 shrink-0 text-wa-green" />
            <div>
              <p className="font-semibold text-[#111b21] dark:text-[#e9edef]">Encryption</p>
              <p className="text-[11px] leading-relaxed">Messages and calls are end-to-end encrypted. Tap to verify.</p>
            </div>
          </div>
        </div>

        {/* Danger Actions */}
        <div className="p-2 bg-white dark:bg-[#111b21] space-y-1">
          <button
            onClick={() => blockContact(contact.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 text-sm font-medium transition-colors"
          >
            <Ban className="w-5 h-5" />
            <span>{contact.isBlocked ? 'Unblock Contact' : 'Block Contact'}</span>
          </button>

          <button
            onClick={() => {
              clearChat(contact.id);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear Chat</span>
          </button>

          <button
            onClick={() => {
              deleteChat(contact.id);
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Conversation</span>
          </button>
        </div>
      </div>

      {/* Starred Messages Modal */}
      <StarredMessagesModal
        isOpen={showStarredModal}
        onClose={() => setShowStarredModal(false)}
        starredMessages={starredMessages}
      />
    </div>
  );
};
