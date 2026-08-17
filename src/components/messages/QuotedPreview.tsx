import React from 'react';
import { QuotedMessage } from '../../types';
import { Image as ImageIcon, Video, Mic, FileText, MapPin, User, X } from 'lucide-react';

interface QuotedPreviewProps {
  quoted: QuotedMessage;
  onDismiss?: () => void;
  onClick?: () => void;
  isComposer?: boolean;
}

export const QuotedPreview: React.FC<QuotedPreviewProps> = ({
  quoted,
  onDismiss,
  onClick,
  isComposer,
}) => {
  const renderIcon = () => {
    switch (quoted.type) {
      case 'image': return <ImageIcon className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'video': return <Video className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'voice':
      case 'audio': return <Mic className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'document': return <FileText className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'location': return <MapPin className="w-3.5 h-3.5 text-[#8696a0]" />;
      case 'contact': return <User className="w-3.5 h-3.5 text-[#8696a0]" />;
      default: return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-between gap-2 p-2 rounded-lg bg-black/5 dark:bg-black/20 border-l-4 border-wa-green text-left text-xs mb-1.5 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-black/10 dark:hover:bg-black/30' : ''
      } ${isComposer ? 'bg-[#f0f2f5] dark:bg-[#202c33] border-wa-green shadow-xs p-2.5 rounded-xl mb-2' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-wa-green-deep dark:text-wa-green truncate block mb-0.5">
          {quoted.senderName}
        </span>
        <div className="flex items-center gap-1 text-[#667781] dark:text-[#aebac1] truncate">
          {renderIcon()}
          <span className="truncate">{quoted.text || `${quoted.type} message`}</span>
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="p-1 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
