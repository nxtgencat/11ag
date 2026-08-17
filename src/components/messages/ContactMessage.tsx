import React from 'react';
import { SharedContactData } from '../../types';
import { Avatar } from '../common/Avatar';
import { MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface ContactMessageProps {
  contact: SharedContactData;
}

export const ContactMessage: React.FC<ContactMessageProps> = ({ contact }) => {
  const { createChatWithContact } = useChat();

  const handleMessage = () => {
    createChatWithContact({
      name: contact.name,
      phone: contact.phone,
      about: contact.about,
      avatar: contact.avatar,
    });
  };

  return (
    <div className="rounded-xl overflow-hidden max-w-sm border border-[#e9edef] dark:border-[#2a3942] bg-white dark:bg-[#182229]">
      {/* Contact Profile Header */}
      <div className="flex items-center gap-3 p-3 border-b border-[#e9edef] dark:border-[#2a3942]">
        <Avatar src={contact.avatar} name={contact.name} size="md" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
            {contact.name}
          </h4>
          <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate font-mono">
            {contact.phone}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleMessage}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-wa-green hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Message Contact</span>
      </button>
    </div>
  );
};
