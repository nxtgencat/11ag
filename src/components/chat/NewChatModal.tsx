import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { Contact } from '../../types';
import { Avatar } from '../common/Avatar';
import { Search, UserPlus, Users, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'main' | 'select-members' | 'group-details';

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { contacts, setActiveChatId, createChatWithContact, createGroupChat } = useChat();
  const [step, setStep] = useState<ModalStep>('main');
  const [search, setSearch] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const groupAvatarInputRef = useRef<HTMLInputElement>(null);

  // Reset all form state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('main');
      setSearch('');
      setIsCreatingCustom(false);
      setCustomName('');
      setCustomPhone('');
      setSelectedMembers([]);
      setGroupName('');
      setGroupAvatar('');
    }
  }, [isOpen]);

  const filteredContacts = useMemo(() => {
    const pool = step === 'select-members' ? contacts.filter((c) => !c.isGroup) : contacts;
    if (!search.trim()) return pool;
    const q = search.toLowerCase();
    return pool.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [contacts, search, step]);

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

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    const id = createGroupChat(groupName.trim(), selectedMembers, groupAvatar || undefined);
    setActiveChatId(id);
    onClose();
  };

  const handleGroupAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGroupAvatar(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const renderTitle = () => {
    if (step === 'select-members') return 'Add Participants';
    if (step === 'group-details') return 'Group Name';
    return 'New Chat';
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-[#e9edef] dark:border-[#222d34] bg-[#f0f2f5] dark:bg-[#202c33]">
      <div className="flex items-center gap-3 min-w-0">
        {step !== 'main' && (
          <button
            onClick={() => {
              if (step === 'group-details') setStep('select-members');
              else setStep('main');
            }}
            className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef] truncate">{renderTitle()}</h3>
        {step === 'select-members' && selectedMembers.length > 0 && (
          <span className="text-xs font-mono text-[#667781] dark:text-[#8696a0] shrink-0">
            {selectedMembers.length} selected
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const renderSearch = (placeholder: string) => (
    <div className="p-3 border-b border-[#e9edef] dark:border-[#222d34]">
      <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl px-3 py-2">
        <Search className="w-4 h-4 text-[#8696a0] mr-2 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] outline-none"
          autoFocus
        />
      </div>
    </div>
  );

  const renderMainOptions = () => (
    <div className="px-3 pt-2 space-y-1">
      <button
        onClick={() => {
          setSearch('');
          setStep('select-members');
        }}
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] text-wa-green-deep dark:text-wa-green font-medium text-sm transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-full bg-wa-green/15 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <span>New Group</span>
      </button>

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
  );

  const renderMemberList = () => (
    <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#202c33] p-2">
      <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider">
        {step === 'select-members' ? `Select contacts (${filteredContacts.length})` : `All Contacts (${filteredContacts.length})`}
      </div>

      {filteredContacts.map((c) => {
        const isSelected = selectedMembers.includes(c.id);
        return (
          <div
            key={c.id}
            onClick={() => (step === 'select-members' ? toggleMember(c.id) : handleSelectContact(c))}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              step === 'select-members'
                ? isSelected
                  ? 'bg-wa-green/10 cursor-pointer'
                  : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer'
                : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer'
            }`}
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
            {step === 'select-members' && (
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="cbx shrink-0"
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] overflow-hidden flex flex-col max-h-[85vh] animate-pop-in">
        {/* Header */}
        {renderHeader()}

        {/* Search (main + select-members steps) */}
        {step === 'main' && !isCreatingCustom && renderSearch('Search contacts by name or number...')}
        {step === 'select-members' && renderSearch('Search contacts to add...')}

        {/* Body */}
        {step === 'main' && (
          <>
            {renderMainOptions()}
            {renderMemberList()}
          </>
        )}

        {step === 'select-members' && (
          <>
            {renderMemberList()}
            {/* Next Footer */}
            <div className="p-3 border-t border-[#e9edef] dark:border-[#222d34]">
              <button
                onClick={() => setStep('group-details')}
                disabled={selectedMembers.length === 0}
                className="w-full py-2 bg-wa-green-deep hover:bg-wa-green-teal disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Next ({selectedMembers.length})
              </button>
            </div>
          </>
        )}

        {step === 'group-details' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Avatar picker */}
            <div className="flex flex-col items-center gap-3">
              <input
                ref={groupAvatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleGroupAvatarSelected}
                className="hidden"
              />
              <button
                onClick={() => groupAvatarInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden bg-[#f0f2f5] dark:bg-[#202c33] border border-dashed border-[#c1c9d0] dark:border-[#2a3942] flex items-center justify-center text-[#667781] dark:text-[#8696a0] hover:border-wa-green transition-colors"
              >
                {groupAvatar ? (
                  <img src={groupAvatar} alt="Group avatar" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-7 h-7" />
                )}
              </button>
              <span className="text-xs text-[#667781] dark:text-[#8696a0]">Group icon (optional)</span>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#667781] dark:text-[#8696a0] mb-1.5">
                Group name *
              </div>
              <input
                type="text"
                placeholder="e.g. Weekend Trip 🏖️"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && groupName.trim() && selectedMembers.length > 0) {
                    e.preventDefault();
                    handleCreateGroup();
                  }
                }}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#f0f2f5] dark:bg-[#202c33] border border-transparent focus:border-wa-green text-[#111b21] dark:text-[#e9edef] outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="text-xs text-[#667781] dark:text-[#8696a0]">
              {selectedMembers.length} participants will be added.
            </div>

            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="w-full py-2 bg-wa-green-deep hover:bg-wa-green-teal disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};