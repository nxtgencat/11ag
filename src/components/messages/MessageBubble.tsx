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
      triggerToast('Copied to clipboard');
    }
  };

  const handleForwardSubmit = () => {
    if (selectedForwardChats.length > 0) {
      forwardMessage(message.id, selectedForwardChats);
      setShowForwardModal(false);
      setSelectedForwardChats([]);
      triggerToast(`Forwarded to ${selectedForwardChats.length} conversation(s)`);
    }
  };

  const renderStatusTicks = () => {
    if (!isOutgoing) return null;
    if (message.status === 'read') {
      return <CheckCheck className="w-3.5 h-3.5 text-white/90 dark:text-cobalt-light inline ml-1 shrink-0" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className="w-3.5 h-3.5 text-white/60 dark:text-slatedark inline ml-1 shrink-0" />;
    }
    return <Check className="w-3.5 h-3.5 text-white/60 dark:text-slatedark inline ml-1 shrink-0" />;
  };

  const renderContent = () => {
    if (message.isDeleted) {
      return (
        <span className="text-xs italic opacity-60 flex items-center gap-1.5 py-0.5 font-mono">
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
      className={`group relative flex flex-col my-1.5 select-text ${
        isOutgoing ? 'items-end' : 'items-start'
      }`}
    >
      {/* Floating Action Menu on Hover */}
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

      {/* Tearline Message Bubble */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[62%] px-4 py-2.5 transition-shadow ${
          isOutgoing
            ? 'bg-cobalt text-white rounded-2xl rounded-br-xs shadow-xs'
            : 'bg-surface dark:bg-surfacedark border border-line dark:border-linedark text-ink dark:text-paperdark rounded-2xl rounded-bl-xs shadow-xs'
        }`}
      >
        {/* Forwarded Tag */}
        {message.isForwarded && (
          <div className="flex items-center gap-1 text-[10px] font-mono opacity-70 mb-1">
            <Forward className="w-3 h-3" />
            <span>Forwarded</span>
          </div>
        )}

        {/* Sender Name in Groups */}
        {!isOutgoing && message.senderName && (
          <div className="font-display font-semibold text-[11px] text-cobalt dark:text-cobalt-light mb-1">
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

        {/* Footer info: Star + Mono Time + Status Ticks */}
        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono select-none ${
          isOutgoing ? 'text-white/70' : 'text-slate dark:text-slatedark'
        }`}>
          {message.isStarred && (
            <Star className="w-3 h-3 fill-amber text-amber shrink-0" />
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
          <div className="p-3 bg-paper dark:bg-inkdark rounded-xl border border-line dark:border-linedark">
            <p className="mini-tag mb-1">CONTENT</p>
            <p className="text-xs font-medium">{message.text || `${message.type} attachment`}</p>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-line dark:border-linedark">
              <span className="text-slate dark:text-slatedark">Delivered</span>
              <span className="font-mono">{message.timestamp}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-line dark:border-linedark">
              <span className="text-slate dark:text-slatedark">Read</span>
              <span className="font-mono">{message.status === 'read' ? message.timestamp : '—'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate dark:text-slatedark">Status</span>
              <span className="capitalize font-mono font-semibold text-cobalt dark:text-cobalt-light">{message.status}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Forward Modal */}
      <Modal isOpen={showForwardModal} onClose={() => setShowForwardModal(false)} title="Forward Message" maxWidth="md">
        <div className="space-y-2 max-h-72 overflow-y-auto p-1">
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
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'border-cobalt bg-cobalt/5'
                    : 'border-line dark:border-linedark hover:bg-surface dark:hover:bg-surfacedark'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                  <span className="font-display font-medium text-xs">{c.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="cbx"
                />
              </div>
            );
          })}
        </div>
        <div className="pt-4 border-t border-line dark:border-linedark flex justify-end gap-2">
          <button
            onClick={() => setShowForwardModal(false)}
            className="btn-ghost py-1.5 px-4 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleForwardSubmit}
            disabled={selectedForwardChats.length === 0}
            className="btn-primary py-1.5 px-5 text-xs font-semibold disabled:opacity-50"
          >
            Forward ({selectedForwardChats.length})
          </button>
        </div>
      </Modal>
    </div>
  );
};
