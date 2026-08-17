import React, { useState, useMemo } from 'react';
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
      el.classList.add('bg-wa-green/30');
      setTimeout(() => el.classList.remove('bg-wa-green/30'), 1500);
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

  // Render Left Secondary Sidebar based on ActiveTab
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
    <div className="h-screen w-full flex overflow-hidden bg-[#efeae2] dark:bg-[#0c1317]">
      {/* Top Green Background Accent Strip on desktop */}
      <div className="fixed top-0 inset-x-0 h-32 bg-wa-green-deep dark:bg-[#00a884]/15 z-0 hidden lg:block" />

      {/* Main WhatsApp App Container */}
      <div className="relative z-10 w-full h-full lg:h-[calc(100vh-38px)] lg:max-w-[1600px] lg:my-auto lg:mx-auto bg-white dark:bg-[#111b21] shadow-2xl lg:rounded-xl overflow-hidden flex">
        {/* Far Left Navigation Rail (Hidden on Mobile) */}
        {!isMobile && <NavigationRail />}

        {/* Sidebar (ChatList, Status, Channels, Calls) */}
        {/* On Mobile: Only show if activeChatId is null (i.e. on main list view) */}
        {(!isMobile || !activeChatId) && (
          <div className="w-full md:w-80 lg:w-96 h-full shrink-0 flex flex-col">
            {renderSidebarContent()}
          </div>
        )}

        {/* Main Conversation Screen */}
        {/* On Mobile: Only show if activeChatId is selected */}
        {(!isMobile || activeChatId) && (
          <div className="flex-1 flex flex-col h-full min-w-0 relative">
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

      {/* Global Interactive Voice & Video Call Modals */}
      <VoiceCallModal />
      <VideoCallModal />
    </div>
  );
};
