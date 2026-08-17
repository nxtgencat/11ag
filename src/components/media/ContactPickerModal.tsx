import React, { useState } from 'react';
import { SharedContactData } from '../../types';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../common/Avatar';
import { Search, X } from 'lucide-react';

interface ContactPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: SharedContactData) => void;
}

export const ContactPickerModal: React.FC<ContactPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectContact,
}) => {
  const { contacts } = useChat();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = contacts.filter(
    (c) =>
      !c.isGroup &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] overflow-hidden flex flex-col max-h-[80vh] animate-pop-in">
        <div className="flex items-center justify-between p-4 border-b border-[#e9edef] dark:border-[#222d34] bg-[#f0f2f5] dark:bg-[#202c33]">
          <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef]">Share Contact</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-[#e9edef] dark:border-[#222d34]">
          <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#8696a0] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] outline-none"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#202c33]">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelectContact({
                  name: c.name,
                  phone: c.phone,
                  avatar: c.avatar,
                  about: c.about,
                });
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3.5 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] text-left transition-colors"
            >
              <Avatar src={c.avatar} name={c.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                  {c.name}
                </div>
                <div className="text-xs text-[#8696a0] truncate">{c.phone}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
