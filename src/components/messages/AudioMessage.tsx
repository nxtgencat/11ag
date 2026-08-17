import React, { useState, useRef, useEffect } from 'react';
import { Attachment } from '../../types';
import { Play, Pause, Mic } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface AudioMessageProps {
  attachment: Attachment;
  senderAvatar?: string;
  senderName?: string;
  isOutgoing?: boolean;
}

const DEFAULT_WAVEFORM = [
  25, 40, 60, 30, 75, 45, 90, 65, 35, 80, 50, 70, 40, 60, 85, 30, 55, 95, 70, 45, 60, 35, 80, 50, 65, 40, 30, 20
];

export const AudioMessage: React.FC<AudioMessageProps> = ({
  attachment,
  senderAvatar,
  senderName = 'Contact',
  isOutgoing = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [progress, setProgress] = useState(0); // 0 to 100
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);

  const togglePlay = () => {
    if (audioRef.current && attachment.url) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If real audio playback failed (e.g. format), simulate progress
          simulatePlay();
        });
      }
    } else {
      simulatePlay();
    }
  };

  const simulatePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 2 * playbackSpeed;
        });
      }, 100);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const cycleSpeed = () => {
    let nextSpeed: 1 | 1.5 | 2 = 1;
    if (playbackSpeed === 1) nextSpeed = 1.5;
    else if (playbackSpeed === 1.5) nextSpeed = 2;
    else nextSpeed = 1;

    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 py-1 min-w-[240px] sm:min-w-[280px]">
      {/* Real audio element if url present */}
      {attachment.url && (
        <audio
          ref={audioRef}
          src={attachment.url}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Sender Avatar with Mic Badge */}
      <div className="relative shrink-0">
        <Avatar
          src={senderAvatar}
          name={senderName}
          size="md"
        />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-wa-green text-white flex items-center justify-center border-2 border-white dark:border-[#202c33]">
          <Mic className="w-2.5 h-2.5" />
        </span>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-wa-green-deep hover:bg-wa-green-teal text-white flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Scrubber & Timer */}
      <div className="flex-1 min-w-0">
        {/* Animated Waveform Bars */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
            setProgress(newProgress);
            if (audioRef.current && audioRef.current.duration) {
              audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
            }
          }}
          className="flex items-center gap-0.5 h-7 cursor-pointer py-1"
        >
          {DEFAULT_WAVEFORM.map((height, i) => {
            const barProgress = (i / DEFAULT_WAVEFORM.length) * 100;
            const isPlayed = barProgress <= progress;

            return (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={`w-1 rounded-full transition-colors ${
                  isPlayed
                    ? 'bg-wa-green'
                    : isOutgoing
                    ? 'bg-emerald-700/40 dark:bg-emerald-300/40'
                    : 'bg-[#8696a0]/50 dark:bg-[#8696a0]/40'
                }`}
              />
            );
          })}
        </div>

        {/* Duration & Speed */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#667781] dark:text-[#8696a0] mt-0.5">
          <span className="truncate mr-2">{attachment.fileName || attachment.duration || '0:34'}</span>
          <button
            onClick={cycleSpeed}
            className="px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-colors shrink-0"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </div>
  );
};
