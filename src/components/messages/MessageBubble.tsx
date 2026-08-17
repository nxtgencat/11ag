import React, { useState } from 'react';
import { Message } from '../../types';
import { Check, CheckCheck, Star, Forward } from 'lucide-react';
import { formatTimeOnly } from '../../utils/formatters';
import { TextMessage } from './TextMessage';
import { ImageMessage } from './ImageMessage';
import { VideoMessage } from './VideoMessage';
import { AudioMessage } from './AudioMessage';
import { DocumentMessage } from './DocumentMessage';
import { LocationMessage } from './LocationMessage';
import { ContactMessage } from './ContactMessage';
import { QuotedPreview } from './QuotedPreview';
import { ReactionPill } from './ReactionPill';
import { MessageActionsMenu } from './MessageActionsMenu';
import { useChat } from '../../context/ChatContext';
import { Toast } from '../common/Toast';
import { Modal } from '../common/Modal';

interface MessageBubbleProps {
  message: Message;
  senderAvatar?: string;
  isLastInGroup?: boolean;
  onReplyToMessage: (msg: Message) => void;
  onScrollToMessage?: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  senderAvatar,
  onReplyToMessage,
  onScrollToMessage,
}) => {
  const { addReaction, starMessage, deleteMessage, forwardMessage, contacts } = useChat();
  const isOutgoing = message.senderId === 'me';
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedForwardChats, setSelectedForwardChats] = useState<string[]>([]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      triggerToast('Message copied to clipboard');
    }
  };

  const handleForwardSubmit = () => {
    if (selectedForwardChats.length > 0) {
      forwardMessage(message.id, selectedForwardChats);
      setShowForwardModal(false);
      setSelectedForwardChats([]);
      triggerToast(`Forwarded to ${selectedForwardChats.length} chat(s)`);
    }
  };

  const renderStatusTicks = () => {
    if (!isOutgoing) return null;
    if (message.status === 'read') {
      return <CheckCheck className="w-4 h-4 text-wa-blue inline ml-1 shrink-0" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className="w-4 h-4 text-[#8696a0] inline ml-1 shrink-0" />;
    }
    return <Check className="w-4 h-4 text-[#8696a0] inline ml-1 shrink-0" />;
  };

  const renderContent = () => {
    if (message.isDeleted) {
      return (
        <span className="text-xs italic text-[#8696a0] flex items-center gap-1.5 py-0.5">
          🚫 <span>This message was deleted</span>
        </span>
      );
    }

    switch (message.type) {
      case 'image':
        return (
          <ImageMessage
            attachment={message.attachment!}
            caption={message.text}
            senderName={message.senderName}
            timestamp={message.timestamp}
          />
        );
      case 'video':
        return (
          <VideoMessage
            attachment={message.attachment!}
            caption={message.text}
            senderName={message.senderName}
            timestamp={message.timestamp}
          />
        );
      case 'voice':
      case 'audio':
        return (
          <AudioMessage
            attachment={message.attachment!}
            senderAvatar={senderAvatar}
            senderName={message.senderName}
            isOutgoing={isOutgoing}
          />
        );
      case 'document':
        return <DocumentMessage attachment={message.attachment!} />;
      case 'location':
        return <LocationMessage location={message.location!} />;
      case 'contact':
        return <ContactMessage contact={message.sharedContact!} />;
      case 'text':
      default:
        return <TextMessage text={message.text || ''} />;
    }
  };

  return (
    <div
      id={`msg-${message.id}`}
      className={`group relative flex flex-col my-1 select-text ${
        isOutgoing ? 'items-end' : 'items-start'
      }`}
    >
      {/* Floating Action Menu on Hover (Desktop) / Long press */}
      <div
        className={`absolute -top-7 hidden group-hover:flex z-30 transition-opacity ${
          isOutgoing ? 'right-2' : 'left-2'
        }`}
      >
        <MessageActionsMenu
          message={message}
          isOutgoing={isOutgoing}
          onReact={(emoji) => addReaction(message.id, emoji)}
          onReply={() => onReplyToMessage(message)}
          onStar={() => {
            starMessage(message.id);
            triggerToast(message.isStarred ? 'Unstarred' : 'Starred');
          }}
          onCopy={handleCopy}
          onForward={() => setShowForwardModal(true)}
          onDelete={(forEveryone) => deleteMessage(message.id, forEveryone)}
          onInfo={() => setShowInfoModal(true)}
        />
      </div>

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[65%] rounded-2xl px-3 py-2 shadow-wa-bubble transition-shadow ${
          isOutgoing
            ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-xs'
            : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-xs'
        }`}
      >
        {/* Forwarded Header */}
        {message.isForwarded && (
          <div className="flex items-center gap-1 text-[11px] italic text-[#667781] dark:text-[#8696a0] mb-1">
            <Forward className="w-3 h-3" />
            <span>Forwarded</span>
          </div>
        )}

        {/* Sender Name in Groups */}
        {!isOutgoing && message.senderName && (
          <div className="text-[12px] font-bold text-teal-600 dark:text-emerald-400 mb-1">
            {message.senderName}
          </div>
        )}

        {/* Quoted Message */}
        {message.quotedMessage && (
          <QuotedPreview
            quoted={message.quotedMessage}
            onClick={() => onScrollToMessage?.(message.quotedMessage!.id)}
          />
        )}

        {/* Message Body */}
        {renderContent()}

        {/* Footer info: Star + Time + Status Ticks */}
        <div className="flex items-center justify-end gap-1 mt-1 text-[11px] font-normal text-[#667781] dark:text-[#8696a0] select-none">
          {message.isStarred && (
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
          )}
          <span className="leading-none">{formatTimeOnly(message.timestamp)}</span>
          {renderStatusTicks()}
        </div>
      </div>

      {/* Emoji Reactions Pill */}
      {message.reactions && (
        <div className={`mt-0.5 ${isOutgoing ? 'mr-1' : 'ml-1'}`}>
          <ReactionPill
            reactions={message.reactions}
            onReactionClick={(emoji) => addReaction(message.id, emoji)}
          />
        </div>
      )}

      {/* Toast */}
      <Toast message={toastMsg} isVisible={showToast} />

      {/* Message Info Modal */}
      <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} title="Message Info" maxWidth="sm">
        <div className="space-y-4">
          <div className="p-3 bg-[#f0f2f5] dark:bg-[#182229] rounded-xl">
            <p className="text-xs text-[#8696a0] mb-1">Content</p>
            <p className="text-sm font-medium">{message.text || `${message.type} attachment`}</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-[#e9edef] dark:border-[#2a3942]">
              <span className="text-[#8696a0]">Delivered</span>
              <span className="font-mono">{message.timestamp}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#e9edef] dark:border-[#2a3942]">
              <span className="text-[#8696a0]">Read</span>
              <span className="font-mono">{message.status === 'read' ? message.timestamp : '—'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#8696a0]">Status</span>
              <span className="capitalize font-semibold text-wa-green">{message.status}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Forward Modal */}
      <Modal isOpen={showForwardModal} onClose={() => setShowForwardModal(false)} title="Forward Message To..." maxWidth="md">
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {contacts.map((c) => {
            const isSelected = selectedForwardChats.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => {
                  if (isSelected) {
                    setSelectedForwardChats((prev) => prev.filter((id) => id !== c.id));
                  } else {
                    setSelectedForwardChats((prev) => [...prev, c.id]);
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-wa-green/15' : 'hover:bg-[#f5f6f6] dark:hover:bg-[#182229]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-sm font-medium">{c.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="w-4 h-4 accent-wa-green"
                />
              </div>
            );
          })}
        </div>
        <div className="pt-4 border-t border-[#e9edef] dark:border-[#2a3942] flex justify-end gap-2">
          <button
            onClick={() => setShowForwardModal(false)}
            className="px-4 py-2 text-xs text-[#8696a0]"
          >
            Cancel
          </button>
          <button
            onClick={handleForwardSubmit}
            disabled={selectedForwardChats.length === 0}
            className="px-5 py-2 bg-wa-green-deep hover:bg-wa-green-teal text-white text-xs font-semibold rounded-xl disabled:opacity-50"
          >
            Forward ({selectedForwardChats.length})
          </button>
        </div>
      </Modal>
    </div>
  );
};
