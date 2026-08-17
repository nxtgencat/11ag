import React, { useEffect, useRef } from 'react';
import { Message, Contact } from '../../types';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './DateSeparator';

interface MessageListProps {
  messages: Message[];
  contact: Contact;
  onReplyToMessage: (msg: Message) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  contact,
  onReplyToMessage,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleScrollToMessage = (messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-wa-green/20');
      setTimeout(() => {
        el.classList.remove('bg-wa-green/20');
      }, 1500);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 sm:px-8 space-y-1 wa-wallpaper-doodle"
    >
      {/* End-to-end encryption banner */}
      <DateSeparator label="" isEncryptionNotice />

      {/* Date Separator */}
      <DateSeparator label="TODAY" />

      {/* Message Bubbles */}
      {messages.map((message, idx) => {
        const isLastInGroup =
          idx === messages.length - 1 ||
          messages[idx + 1].senderId !== message.senderId;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            senderAvatar={contact.avatar}
            isLastInGroup={isLastInGroup}
            onReplyToMessage={onReplyToMessage}
            onScrollToMessage={handleScrollToMessage}
          />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};
