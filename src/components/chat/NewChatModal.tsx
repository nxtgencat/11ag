import React, { useState, useMemo } from 'react';
import { useChat } from '../../context/ChatContext';
import { Contact } from '../../types';
import { Avatar } from '../common/Avatar';
import { Search, UserPlus, X } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { contacts, setActiveChatId, createChatWithContact } = useChat();
  const [search, setSearch] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  if (!isOpen) return null;

  const handleSelectContact = (c: Contact) => {
    setActiveChatId(c.id);
    onClose();
  };

  const handleCreateCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const id = createChatWithContact({
      name: customName.trim(),
      phone: customPhone.trim() || '+1 (555) 123-4567',
      about: 'Hey there! I am using WhatsApp.',
    });
    setActiveChatId(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] overflow-hidden flex flex-col max-h-[85vh] animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e9edef] dark:border-[#222d34] bg-[#f0f2f5] dark:bg-[#202c33]">
          <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef]">New Chat</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#e9edef] dark:border-[#222d34]">
          <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#8696a0] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search contacts by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* New Contact Option */}
        <div className="px-3 pt-2">
          {!isCreatingCustom ? (
            <button
              onClick={() => setIsCreatingCustom(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] text-wa-green-deep dark:text-wa-green font-medium text-sm transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-wa-green/15 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <span>Add New Contact</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCustomContact} className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl space-y-2.5 mb-2">
              <div className="text-xs font-semibold text-[#667781] dark:text-[#8696a0]">New Contact Details</div>
              <input
                type="text"
                placeholder="Full Name *"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-[#111b21] border border-[#e9edef] dark:border-[#2a3942] outline-none focus:border-wa-green"
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-[#111b21] border border-[#e9edef] dark:border-[#2a3942] outline-none focus:border-wa-green"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="px-3 py-1 text-xs text-[#8696a0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-wa-green-deep hover:bg-wa-green-teal text-white text-xs font-medium rounded-lg"
                >
                  Create & Chat
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#202c33] p-2">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider">
            All Contacts ({filteredContacts.length})
          </div>

          {filteredContacts.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectContact(c)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <Avatar
                src={c.avatar}
                name={c.name}
                size="md"
                isOnline={c.isOnline}
                isGroup={c.isGroup}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                  {c.name}
                </div>
                <div className="text-xs text-[#667781] dark:text-[#8696a0] truncate">
                  {c.about}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
