import React, { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { QuotedMessage, MessageType } from '../../types';
import { formatSecondsToTimer, formatFileSize } from '../../utils/formatters';
import { Smile, Paperclip, Mic, Send, Camera, Trash2, Pause, Play, X } from 'lucide-react';
import { EmojiPicker } from '../common/EmojiPicker';
import { AttachmentMenu } from '../media/AttachmentMenu';
import { CameraModal } from '../media/CameraModal';
import { LocationPickerModal } from '../media/LocationPickerModal';
import { ContactPickerModal } from '../media/ContactPickerModal';
import { QuotedPreview } from '../messages/QuotedPreview';

interface ChatComposerProps {
  quotedMessage: QuotedMessage | null;
  onClearQuotedMessage: () => void;
}

interface PendingMediaState {
  url: string;
  type: MessageType;
  fileName: string;
  fileSize: string;
  thumbnailUrl?: string;
  mimeType?: string;
}

const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    const cleanup = () => {
      video.removeAttribute('src');
      URL.revokeObjectURL(url);
    };

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.1, video.duration || 0);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          reject(new Error('canvas unavailable'));
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        cleanup();
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } catch (err) {
        cleanup();
        reject(err);
      }
    };
    video.onerror = () => {
      cleanup();
      reject(new Error('video load failed'));
    };
  });
};

export const ChatComposer: React.FC<ChatComposerProps> = ({
  quotedMessage,
  onClearQuotedMessage,
}) => {
  const { sendMessage } = useChat();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMediaPreviewModal, setShowMediaPreviewModal] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<PendingMediaState | null>(null);
  const [mediaCaption, setMediaCaption] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const fileMediaInputRef = useRef<HTMLInputElement>(null);
  const fileDocInputRef = useRef<HTMLInputElement>(null);
  const fileAudioInputRef = useRef<HTMLInputElement>(null);

  // Voice recorder hook
  const {
    isRecording,
    isPaused,
    recordingTime,
    waveformData,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();

  const handleSendText = () => {
    if (!text.trim()) return;
    sendMessage({
      text: text.trim(),
      type: 'text',
      quotedMessage: quotedMessage || undefined,
    });
    setText('');
    onClearQuotedMessage();
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // Support pasting images/screenshots directly from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          const url = URL.createObjectURL(file);
          setPendingMedia({
            url,
            type: 'image',
            fileName: file.name || `Pasted_Image_${Date.now()}.png`,
            fileSize: formatFileSize(file.size),
          });
          setShowMediaPreviewModal(true);
          break;
        }
      }
    }
  };

  const handleSendVoiceNote = () => {
    const { duration, audioUrl } = stopRecording();
    sendMessage({
      type: 'voice',
      attachment: {
        type: 'voice',
        url: audioUrl,
        duration: duration,
        fileName: `Voice_Note_${Date.now()}.opus`,
      },
      quotedMessage: quotedMessage || undefined,
    });
    onClearQuotedMessage();
  };

  // Handle Attachment Menu Options
  const handleAttachmentOption = (option: string) => {
    if (option === 'camera') {
      setShowCameraModal(true);
    } else if (option === 'location') {
      setShowLocationModal(true);
    } else if (option === 'contact') {
      setShowContactModal(true);
    } else if (option === 'media') {
      fileMediaInputRef.current?.click();
    } else if (option === 'document') {
      fileDocInputRef.current?.click();
    } else if (option === 'audio') {
      fileAudioInputRef.current?.click();
    }
  };

  // Real Photo / Video File Selected
  const handleMediaFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    const thumbnailUrl = isVideo ? await generateVideoThumbnail(file).catch(() => undefined) : undefined;

    setPendingMedia({
      url,
      type: isVideo ? 'video' : 'image',
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      thumbnailUrl,
      mimeType: file.type,
    });
    setMediaCaption('');
    setShowMediaPreviewModal(true);
    e.target.value = '';
  };

  // Real Document Files Selected
  const handleDocFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const sizeStr = formatFileSize(file.size);

      sendMessage({
        type: 'document',
        attachment: {
          type: 'document',
          url,
          fileName: file.name,
          fileSize: sizeStr,
          mimeType: file.type,
        },
        quotedMessage: quotedMessage || undefined,
      });
    });

    onClearQuotedMessage();
    e.target.value = '';
  };

  // Real Audio Files Selected
  const handleAudioFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const sizeStr = formatFileSize(file.size);

      sendMessage({
        type: 'audio',
        attachment: {
          type: 'audio',
          url,
          fileName: file.name,
          fileSize: sizeStr,
          duration: 'Audio track',
        },
        quotedMessage: quotedMessage || undefined,
      });
    });

    onClearQuotedMessage();
    e.target.value = '';
  };

  const handleSendPendingMedia = () => {
    if (!pendingMedia) return;
    sendMessage({
      type: pendingMedia.type,
      text: mediaCaption.trim() || undefined,
      attachment: {
        type: pendingMedia.type,
        url: pendingMedia.url,
        fileName: pendingMedia.fileName,
        fileSize: pendingMedia.fileSize,
        thumbnailUrl: pendingMedia.thumbnailUrl,
        mimeType: pendingMedia.mimeType,
      },
      quotedMessage: quotedMessage || undefined,
    });
    setPendingMedia(null);
    setMediaCaption('');
    setShowMediaPreviewModal(false);
    onClearQuotedMessage();
  };

  return (
    <div className="relative bg-surface dark:bg-surfacedark px-4 sm:px-6 py-3 border-t border-line dark:border-linedark select-none transition-colors">
      {/* Hidden Real File Inputs */}
      <input
        ref={fileMediaInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleMediaFilesSelected}
        className="hidden"
      />
      <input
        ref={fileDocInputRef}
        type="file"
        accept="*/*"
        multiple
        onChange={handleDocFilesSelected}
        className="hidden"
      />
      <input
        ref={fileAudioInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleAudioFilesSelected}
        className="hidden"
      />

      {/* Quoted Message Preview Banner */}
      {quotedMessage && (
        <QuotedPreview
          quoted={quotedMessage}
          onDismiss={onClearQuotedMessage}
          isComposer
        />
      )}

      {/* Voice Recording Mode View */}
      {isRecording ? (
        <div className="flex items-center justify-between gap-3 py-1 animate-fade-in">
          {/* Trash / Cancel */}
          <button
            onClick={cancelRecording}
            className="w-9 h-9 rounded-full bg-rose/10 text-rose grid place-content-center hover:bg-rose/20 transition-colors"
            title="Cancel recording"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Recording Timer & Waveform */}
          <div className="flex-1 flex items-center gap-3 bg-paper dark:bg-inkdark rounded-xl px-4 py-2 border border-line dark:border-linedark shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-rose animate-pulse" />
            <span className="font-mono text-xs font-semibold text-ink dark:text-paperdark">
              {formatSecondsToTimer(recordingTime)}
            </span>
            <div className="flex-1 flex items-center gap-1 h-5 overflow-hidden">
              {waveformData.map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}%` }}
                  className="w-1 bg-cobalt rounded-full transition-all"
                />
              ))}
            </div>
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="p-1 text-slate hover:text-ink dark:hover:text-paperdark"
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            </button>
          </div>

          {/* Send Voice Note */}
          <button
            onClick={handleSendVoiceNote}
            className="w-9 h-9 rounded-full bg-cobalt hover:bg-cobalt-dark text-white grid place-content-center shadow-xs active:scale-95 transition-all shrink-0"
            title="Send voice message"
          >
            <Send className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>
      ) : (
        /* Normal Composer Input */
        <div className="flex items-center gap-2">
          {/* Emoji Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="btn-icon w-9 h-9 text-slate dark:text-slatedark hover:text-ink dark:hover:text-paperdark"
              title="Emojis"
            >
              <Smile className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-3 z-50">
                <EmojiPicker
                  onSelectEmoji={(emoji) => {
                    setText((prev) => prev + emoji);
                    inputRef.current?.focus();
                  }}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>

          {/* Attachment Paperclip Button */}
          <div className="relative">
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="btn-icon w-9 h-9 text-slate dark:text-slatedark hover:text-ink dark:hover:text-paperdark"
              title="Attach"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <AttachmentMenu
              isOpen={showAttachmentMenu}
              onClose={() => setShowAttachmentMenu(false)}
              onSelectOption={handleAttachmentOption}
            />
          </div>

          {/* Text Input Box */}
          <div className="flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Write a message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className="field py-2 text-sm"
            />
          </div>

          {/* Camera Quick Button (when no text) */}
          {!text.trim() && (
            <button
              onClick={() => setShowCameraModal(true)}
              className="btn-icon w-9 h-9 text-slate dark:text-slatedark hover:text-ink dark:hover:text-paperdark hidden sm:grid"
              title="Camera"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Dynamic Mic / Send Action */}
          {text.trim() ? (
            <button
              onClick={handleSendText}
              className="btn-primary px-4 py-2 shrink-0 flex items-center gap-1.5"
              title="Send message"
            >
              <span className="text-xs font-semibold">Send</span>
              <Send className="w-3.5 h-3.5 fill-current ml-0.5" />
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="w-9 h-9 rounded-full bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-content-center hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-xs"
              title="Record voice message"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={(att) => {
          sendMessage({
            type: 'image',
            attachment: att,
            quotedMessage: quotedMessage || undefined,
          });
          onClearQuotedMessage();
        }}
      />

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSendLocation={(loc) => {
          sendMessage({
            type: 'location',
            location: loc,
            quotedMessage: quotedMessage || undefined,
          });
          onClearQuotedMessage();
        }}
      />

      {/* Contact Picker Modal */}
      <ContactPickerModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSelectContact={(contact) => {
          sendMessage({
            type: 'contact',
            sharedContact: contact,
            quotedMessage: quotedMessage || undefined,
          });
          onClearQuotedMessage();
        }}
      />

      {/* Real Media Preview Modal before Sending */}
      {showMediaPreviewModal && pendingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl card p-0 overflow-hidden flex flex-col animate-pop-in">
            <div className="flex items-center justify-between p-4 border-b border-line dark:border-linedark">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm text-ink dark:text-paperdark">
                  Preview {pendingMedia.type === 'video' ? 'Video' : 'Photo'}
                </span>
                <span className="mini-tag font-mono text-[10px]">
                  {pendingMedia.fileSize}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowMediaPreviewModal(false);
                  setPendingMedia(null);
                }}
                className="btn-icon w-8 h-8"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-80 bg-paper dark:bg-inkdark flex items-center justify-center p-3 relative">
              {pendingMedia.type === 'video' ? (
                <video
                  src={pendingMedia.url}
                  controls
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              ) : (
                <img
                  src={pendingMedia.url}
                  alt="Selected preview"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>

            <div className="p-4 flex items-center gap-3 bg-surface dark:bg-surfacedark border-t border-line dark:border-linedark">
              <input
                type="text"
                placeholder="Add a caption…"
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendPendingMedia();
                  }
                }}
                className="field py-2 text-xs flex-1"
                autoFocus
              />
              <button
                onClick={handleSendPendingMedia}
                className="btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
