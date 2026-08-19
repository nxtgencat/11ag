import React, { useState } from 'react';
import { Attachment } from '../../types';
import { VideoPlayerModal } from '../media/VideoPlayerModal';
import { Play } from 'lucide-react';
import { TextMessage } from './TextMessage';

interface VideoMessageProps {
  attachment: Attachment;
  caption?: string;
  senderName?: string;
  timestamp?: string;
}

export const VideoMessage: React.FC<VideoMessageProps> = ({
  attachment,
  caption,
  senderName,
  timestamp,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="space-y-1.5 cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="relative rounded-xl overflow-hidden max-h-72 bg-black/10 group">
          {attachment.thumbnailUrl ? (
            <img
              src={attachment.thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <video
              src={attachment.url}
              muted
              playsInline
              preload="metadata"
              className="w-full max-h-72 object-cover group-hover:scale-102 transition-transform duration-300"
            />
          )}
          {/* Play Icon Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>

          {/* Duration Badge */}
          {attachment.duration && (
            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
              {attachment.duration}
            </span>
          )}
        </div>

        {caption && (
          <div className="px-1 pt-1">
            <TextMessage text={caption} />
          </div>
        )}
      </div>

      <VideoPlayerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        videoUrl={attachment.url}
        senderName={senderName}
        timestamp={timestamp}
      />
    </>
  );
};
