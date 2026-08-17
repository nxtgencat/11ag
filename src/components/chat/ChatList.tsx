import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { ChatListItem } from './ChatListItem';
import { Search, X, Archive, Filter, Plus, ArrowLeft } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-paper dark:bg-inkdark border-r border-line dark:border-linedark overflow-hidden select-none transition-colors">
      {/* Top Header & Search */}
      <div className="p-4 space-y-3 border-b border-line dark:border-linedark bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md shrink-0">
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'archived' && (
              <button
                onClick={() => setActiveTab('chats')}
                className="btn-icon w-8 h-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paperdark tracking-tight">
              {activeTab === 'archived' ? 'Archived' : 'Messages'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="ticket-tag text-[10px] py-0.5 px-2">
              {contacts.length} THREADS
            </span>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="w-8 h-8 rounded-full bg-cobalt text-white grid place-content-center hover:bg-cobalt-dark transition-all active:scale-95 shadow-xs"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field py-2 pl-9 pr-12 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate dark:text-slatedark absolute left-3 pointer-events-none" />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-0.5 text-slate hover:text-ink dark:hover:text-paperdark"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="kbd absolute right-2 text-[10px]">⌘K</span>
          )}
        </div>

        {/* Filter Pills */}
        {activeTab === 'chats' && !searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark'
                  : 'border border-line dark:border-linedark text-slate dark:text-slatedark hover:border-ink dark:hover:border-paperdark'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeFilter === 'unread'
                  ? 'bg-cobalt text-white'
                  : 'border border-line dark:border-linedark text-slate dark:text-slatedark hover:border-ink dark:hover:border-paperdark'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeFilter === 'favorites'
                  ? 'bg-amber text-white'
                  : 'border border-line dark:border-linedark text-slate dark:text-slatedark hover:border-ink dark:hover:border-paperdark'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveFilter('groups')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeFilter === 'groups'
                  ? 'bg-mint text-white'
                  : 'border border-line dark:border-linedark text-slate dark:text-slatedark hover:border-ink dark:hover:border-paperdark'
              }`}
            >
              Groups
            </button>
          </div>
        )}
      </div>

      {/* Archived Row if present */}
      {activeTab === 'chats' && archivedCount > 0 && !searchQuery && (
        <button
          onClick={() => setActiveTab('archived')}
          className="flex items-center justify-between px-4 py-2.5 border-b border-line dark:border-linedark bg-surface/50 dark:bg-surfacedark/50 hover:bg-surface dark:hover:bg-surfacedark transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 text-ink dark:text-paperdark">
            <Archive className="w-4 h-4 text-slate dark:text-slatedark" />
            <span className="text-xs font-medium">Archived Conversations</span>
          </div>
          <span className="mini-tag font-mono font-semibold text-cobalt dark:text-cobalt-light">
            {archivedCount}
          </span>
        </button>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-line/60 dark:divide-linedark/60">
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
          <div className="p-8 text-center text-slate dark:text-slatedark">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">No conversations found</p>
            <p className="mini-tag text-[10px] mt-1">Try another keyword</p>
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
