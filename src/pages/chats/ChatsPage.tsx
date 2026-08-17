import React, { useState, useMemo, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { NavigationRail } from '../../components/layout/NavigationRail';
import { ChatList } from '../../components/chat/ChatList';
import { StatusView } from '../../components/chat/StatusView';
import { ChannelsView } from '../../components/chat/ChannelsView';
import { CallsView } from '../../components/chat/CallsView';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatSearch } from '../../components/chat/ChatSearch';
import { MessageList } from '../../components/messages/MessageList';
import { ChatComposer } from '../../components/chat/ChatComposer';
import { EmptyChatState } from '../../components/chat/EmptyChatState';
import { ContactInfoDrawer } from '../../components/profile/ContactInfoDrawer';
import { VoiceCallModal } from '../../components/call/VoiceCallModal';
import { VideoCallModal } from '../../components/call/VideoCallModal';
import { CommandPaletteModal } from '../../components/common/CommandPaletteModal';
import { Message, QuotedMessage } from '../../types';

export const ChatsPage: React.FC = () => {
  const {
    activeChatId,
    setActiveChatId,
    activeContact,
    activeMessages,
    activeTab,
    isContactDrawerOpen,
    setIsContactDrawerOpen,
  } = useChat();

  const isMobile = useIsMobile();
  const [quotedMessage, setQuotedMessage] = useState<QuotedMessage | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // In-conversation Search Matches
  const matchingMessageIds = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return activeMessages
      .filter((m) => m.text?.toLowerCase().includes(q))
      .map((m) => m.id);
  }, [searchQuery, activeMessages]);

  const handleNextMatch = () => {
    if (matchingMessageIds.length === 0) return;
    const nextIdx = (currentMatchIdx + 1) % matchingMessageIds.length;
    setCurrentMatchIdx(nextIdx);
    scrollToMatchedMessage(matchingMessageIds[nextIdx]);
  };

  const handlePrevMatch = () => {
    if (matchingMessageIds.length === 0) return;
    const prevIdx = (currentMatchIdx - 1 + matchingMessageIds.length) % matchingMessageIds.length;
    setCurrentMatchIdx(prevIdx);
    scrollToMatchedMessage(matchingMessageIds[prevIdx]);
  };

  const scrollToMatchedMessage = (id: string) => {
    const el = document.getElementById(`msg-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-cobalt');
      setTimeout(() => el.classList.remove('ring-2', 'ring-cobalt'), 1500);
    }
  };

  const handleReplyToMessage = (msg: Message) => {
    setQuotedMessage({
      id: msg.id,
      senderId: msg.senderId,
      senderName: msg.senderName,
      text: msg.text,
      type: msg.type,
    });
  };

  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'status':
        return <StatusView />;
      case 'channels':
        return <ChannelsView />;
      case 'calls':
        return <CallsView />;
      case 'chats':
      case 'archived':
      case 'starred':
      default:
        return <ChatList />;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-paper dark:bg-inkdark transition-colors">
      {/* Main Tearline Container */}
      <div className="relative w-full h-full lg:h-[calc(100vh-32px)] lg:max-w-[1560px] lg:my-auto lg:mx-auto bg-surface dark:bg-surfacedark lg:border lg:border-line lg:dark:border-linedark lg:rounded-2xl lg:shadow-xl overflow-hidden flex">
        {/* Far Left Navigation Rail (Hidden on Mobile) */}
        {!isMobile && <NavigationRail />}

        {/* Sidebar (ChatList, Status, Channels, Calls) */}
        {(!isMobile || !activeChatId) && (
          <div className="w-full md:w-80 lg:w-96 h-full shrink-0 flex flex-col">
            {renderSidebarContent()}
          </div>
        )}

        {/* Main Conversation Screen */}
        {(!isMobile || activeChatId) && (
          <div className="flex-1 flex flex-col h-full min-w-0 relative bg-paper dark:bg-inkdark">
            {activeContact ? (
              <>
                {/* Header */}
                <ChatHeader
                  contact={activeContact}
                  onBackToChatList={() => setActiveChatId(null)}
                  onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
                  onOpenContactInfo={() => setIsContactDrawerOpen(true)}
                />

                {/* In-Chat Search Bar */}
                <ChatSearch
                  isOpen={isSearchOpen}
                  onClose={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  query={searchQuery}
                  onQueryChange={(q) => {
                    setSearchQuery(q);
                    setCurrentMatchIdx(0);
                  }}
                  matchCount={matchingMessageIds.length}
                  currentMatchIndex={currentMatchIdx}
                  onNextMatch={handleNextMatch}
                  onPrevMatch={handlePrevMatch}
                />

                {/* Message Stream */}
                <MessageList
                  messages={activeMessages}
                  contact={activeContact}
                  onReplyToMessage={handleReplyToMessage}
                />

                {/* Message Composer */}
                <ChatComposer
                  quotedMessage={quotedMessage}
                  onClearQuotedMessage={() => setQuotedMessage(null)}
                />
              </>
            ) : (
              <EmptyChatState />
            )}
          </div>
        )}

        {/* Sliding Contact Info Drawer */}
        {activeContact && (
          <ContactInfoDrawer
            isOpen={isContactDrawerOpen}
            onClose={() => setIsContactDrawerOpen(false)}
            contact={activeContact}
            messages={activeMessages}
          />
        )}
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPaletteModal
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
      />

      {/* Global Interactive Voice & Video Call Modals */}
      <VoiceCallModal />
      <VideoCallModal />
    </div>
  );
};
