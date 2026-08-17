import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { ChatListItem } from './ChatListItem';
import { Search, X, Archive, Filter, MessageSquarePlus, ArrowLeft } from 'lucide-react';
import { NewChatModal } from './NewChatModal';

export const ChatList: React.FC = () => {
  const {
    filteredContacts,
    activeChatId,
    setActiveChatId,
    activeFilter,
    setActiveFilter,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    contacts,
  } = useChat();

  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const archivedCount = contacts.filter((c) => c.isArchived).length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222d34] overflow-hidden select-none">
      {/* Top Search & Filter Section */}
      <div className="p-2.5 space-y-2 border-b border-[#f0f2f5] dark:border-[#202c33] shrink-0">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          {activeTab === 'archived' && (
            <button
              onClick={() => setActiveTab('chats')}
              className="p-1.5 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-[#f0f2f5] dark:hover:bg-[#202c33] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative flex-1 flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-wa-green transition-all">
            <Search className="w-4 h-4 text-[#8696a0] mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder={activeTab === 'archived' ? 'Search archived chats' : 'Search or start new chat'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="p-2 rounded-xl text-wa-green-deep dark:text-wa-green bg-wa-green/10 hover:bg-wa-green/20 dark:bg-wa-green/15 dark:hover:bg-wa-green/25 transition-colors shrink-0"
            title="New Chat"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills (All, Unread, Favorites, Groups) */}
        {activeTab === 'chats' && !searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-wa-green-deep dark:bg-wa-green text-white dark:text-[#111b21] font-semibold'
                  : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                activeFilter === 'unread'
                  ? 'bg-wa-green-deep dark:bg-wa-green text-white dark:text-[#111b21] font-semibold'
                  : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                activeFilter === 'favorites'
                  ? 'bg-wa-green-deep dark:bg-wa-green text-white dark:text-[#111b21] font-semibold'
                  : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveFilter('groups')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${
                activeFilter === 'groups'
                  ? 'bg-wa-green-deep dark:bg-wa-green text-white dark:text-[#111b21] font-semibold'
                  : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
              }`}
            >
              Groups
            </button>
          </div>
        )}
      </div>

      {/* Archived Chats Header row (if in normal chat tab) */}
      {activeTab === 'chats' && archivedCount > 0 && !searchQuery && (
        <button
          onClick={() => setActiveTab('archived')}
          className="flex items-center justify-between px-4 py-3 border-b border-[#f0f2f5] dark:border-[#202c33] hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors text-left"
        >
          <div className="flex items-center gap-3 text-[#111b21] dark:text-[#e9edef]">
            <Archive className="w-4 h-4 text-[#8696a0]" />
            <span className="text-sm font-medium">Archived</span>
          </div>
          <span className="text-xs font-semibold text-wa-green">{archivedCount}</span>
        </button>
      )}

      {/* Main Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#202c33]">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ChatListItem
              key={contact.id}
              contact={contact}
              isActive={activeChatId === contact.id}
              onSelect={() => setActiveChatId(contact.id)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-[#8696a0]">
            <Filter className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No chats found</p>
            <p className="text-xs mt-1">Try a different search term or start a new chat.</p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
      />
    </div>
  );
};
