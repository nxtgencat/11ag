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
  const { muteChat, clearChat, blockContact } = useChat();
  const { startCall } = useCall();
  const [showStarredModal, setShowStarredModal] = useState(false);
  const [disappearingOption, setDisappearingOption] = useState<'off' | '24h' | '7d' | '90d'>('off');

  if (!isOpen) return null;

  return (
    <div className="w-full md:w-80 lg:w-96 h-full bg-paper dark:bg-inkdark border-l border-line dark:border-linedark flex flex-col z-30 shrink-0 overflow-y-auto animate-slide-down md:animate-none select-none transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line dark:border-linedark bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-ink dark:text-paperdark">
            Contact Details
          </span>
        </div>
        <button
          onClick={onClose}
          className="btn-icon w-8 h-8"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Profile Card */}
        <div className="card text-center flex flex-col items-center">
          <div className="relative mb-3">
            <Avatar
              src={contact.avatar}
              name={contact.name}
              size="xl"
              isGroup={contact.isGroup}
            />
          </div>

          <h3 className="font-display font-bold text-base text-ink dark:text-paperdark">
            {contact.name}
          </h3>

          <p className="font-mono text-xs text-slate dark:text-slatedark mt-0.5">
            {contact.phone}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 w-full">
            <button
              onClick={() => startCall(contact, 'voice')}
              className="flex-1 py-2 px-3 rounded-full border border-line dark:border-linedark text-xs font-medium flex items-center justify-center gap-1.5 hover:border-ink dark:hover:border-paperdark transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Voice</span>
            </button>
            <button
              onClick={() => startCall(contact, 'video')}
              className="flex-1 py-2 px-3 rounded-full bg-cobalt text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-cobalt-dark transition-all shadow-xs"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>
        </div>

        {/* About Card */}
        <div className="card space-y-1">
          <span className="mini-tag">ABOUT / STATUS</span>
          <p className="text-xs text-ink dark:text-paperdark font-medium leading-relaxed">
            {contact.about || 'Available'}
          </p>
        </div>

        {/* Media, Links & Docs Card */}
        <div className="card p-4 space-y-3">
          <SharedMediaTab messages={messages} />
        </div>

        {/* Options & Settings Card */}
        <div className="card p-2 divide-y divide-line/60 dark:divide-linedark/60">
          {/* Starred Messages */}
          <button
            onClick={() => setShowStarredModal(true)}
            className="w-full flex items-center justify-between p-3 hover:bg-ink/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber" />
              <span className="text-xs font-medium text-ink dark:text-paperdark">Starred Messages</span>
            </div>
            <span className="mini-tag font-mono">BROWSE</span>
          </button>

          {/* Mute */}
          <button
            onClick={() => muteChat(contact.id)}
            className="w-full flex items-center justify-between p-3 hover:bg-ink/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              {contact.isMuted ? (
                <BellOff className="w-4 h-4 text-rose" />
              ) : (
                <Bell className="w-4 h-4 text-slate dark:text-slatedark" />
              )}
              <span className="text-xs font-medium text-ink dark:text-paperdark">
                {contact.isMuted ? 'Muted' : 'Mute Notifications'}
              </span>
            </div>
            <span className="mini-tag font-mono">{contact.isMuted ? 'MUTED' : 'OFF'}</span>
          </button>

          {/* Disappearing Messages */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate dark:text-slatedark" />
                <span className="text-xs font-medium text-ink dark:text-paperdark">Disappearing Messages</span>
              </div>
              <span className="ticket-tag text-[9px] py-0 px-1 font-mono uppercase">{disappearingOption}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              {(['off', '24h', '7d', '90d'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDisappearingOption(opt)}
                  className={`py-1 rounded text-[10px] font-mono transition-all ${
                    disappearingOption === opt
                      ? 'bg-cobalt text-white font-bold'
                      : 'bg-paper dark:bg-inkdark border border-line dark:border-linedark text-slate dark:text-slatedark'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Encryption Note */}
          <div className="p-3 flex items-center gap-3">
            <Lock className="w-4 h-4 text-mint" />
            <div>
              <p className="text-xs font-medium text-ink dark:text-paperdark">End-to-End Encryption</p>
              <p className="text-[10px] text-slate dark:text-slatedark font-mono">Signal Protocol · Verified</p>
            </div>
          </div>
        </div>

        {/* Danger Actions Card */}
        <div className="card p-2 space-y-1">
          <button
            onClick={() => blockContact(contact.id)}
            className="w-full flex items-center gap-3 p-3 text-xs font-medium text-rose hover:bg-rose/5 rounded-lg transition-colors text-left"
          >
            <Ban className="w-4 h-4" />
            <span>{contact.isBlocked ? 'Unblock Contact' : 'Block Contact'}</span>
          </button>
          <button
            onClick={() => clearChat(contact.id)}
            className="w-full flex items-center gap-3 p-3 text-xs font-medium text-rose hover:bg-rose/5 rounded-lg transition-colors text-left"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Chat History</span>
          </button>
        </div>
      </div>

      {/* Starred Messages Modal */}
      <StarredMessagesModal
        isOpen={showStarredModal}
        onClose={() => setShowStarredModal(false)}
      />
    </div>
  );
};
