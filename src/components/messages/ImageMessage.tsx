import React, { useState } from 'react';
import { Attachment } from '../../types';
import { MediaViewerModal } from '../media/MediaViewerModal';
import { TextMessage } from './TextMessage';

interface ImageMessageProps {
  attachment: Attachment;
  caption?: string;
  senderName?: string;
  timestamp?: string;
}

export const ImageMessage: React.FC<ImageMessageProps> = ({
  attachment,
  caption,
  senderName,
  timestamp,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="space-y-1.5 cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="relative rounded-xl overflow-hidden max-h-72 bg-black/5 group">
          <img
            src={attachment.thumbnailUrl || attachment.url}
            alt={attachment.fileName || 'Photo'}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
          {attachment.fileSize && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-xs font-mono">
              {attachment.fileSize}
            </span>
          )}
        </div>

        {caption && (
          <div className="px-1 pt-1">
            <TextMessage text={caption} />
          </div>
        )}
      </div>

      <MediaViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mediaUrl={attachment.url}
        caption={caption}
        senderName={senderName}
        timestamp={timestamp}
      />
    </>
  );
};
