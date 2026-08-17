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
}

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
      // Trigger real photo/video file picker
      fileMediaInputRef.current?.click();
    } else if (option === 'document') {
      // Trigger real document file picker
      fileDocInputRef.current?.click();
    } else if (option === 'audio') {
      // Trigger real audio file picker
      fileAudioInputRef.current?.click();
    }
  };

  // Real Photo / Video File Selected
  const handleMediaFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);

    setPendingMedia({
      url,
      type: isVideo ? 'video' : 'image',
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    });
    setMediaCaption('');
    setShowMediaPreviewModal(true);

    // Reset input value so same file can be re-selected if needed
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
      },
      quotedMessage: quotedMessage || undefined,
    });
    setPendingMedia(null);
    setMediaCaption('');
    setShowMediaPreviewModal(false);
    onClearQuotedMessage();
  };

  return (
    <div className="relative bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-2 border-t border-[#e9edef] dark:border-[#222d34] select-none">
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
            className="p-2.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Cancel recording"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Recording Timer & Waveform */}
          <div className="flex-1 flex items-center gap-3 bg-white dark:bg-[#111b21] rounded-2xl px-4 py-2 shadow-2xs border border-[#e9edef] dark:border-[#2a3942]">
            {/* Blinking Red Dot */}
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />

            {/* Timer */}
            <span className="font-mono text-sm font-semibold text-[#111b21] dark:text-[#e9edef]">
              {formatSecondsToTimer(recordingTime)}
            </span>

            {/* Waveform Equalizer simulation */}
            <div className="flex-1 flex items-center gap-1 h-5 overflow-hidden">
              {waveformData.map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height}%` }}
                  className="w-1 bg-wa-green rounded-full transition-all"
                />
              ))}
            </div>

            {/* Pause / Resume */}
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="p-1 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            </button>
          </div>

          {/* Send Voice Note */}
          <button
            onClick={handleSendVoiceNote}
            className="w-11 h-11 rounded-full bg-wa-green-deep hover:bg-wa-green-teal text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
            title="Send voice message"
          >
            <Send className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      ) : (
        /* Normal Composer Input */
        <div className="flex items-center gap-2">
          {/* Emoji Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white transition-colors"
              title="Emojis"
            >
              <Smile className="w-6 h-6" />
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
              className="p-2 rounded-full text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white transition-colors"
              title="Attach"
            >
              <Paperclip className="w-6 h-6" />
            </button>

            <AttachmentMenu
              isOpen={showAttachmentMenu}
              onClose={() => setShowAttachmentMenu(false)}
              onSelectOption={handleAttachmentOption}
            />
          </div>

          {/* Text Input Box */}
          <div className="flex-1 flex items-center bg-white dark:bg-[#2a3942] rounded-xl px-4 py-2 border border-[#e9edef] dark:border-transparent focus-within:ring-1 focus-within:ring-wa-green transition-all shadow-2xs">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] outline-none"
            />
          </div>

          {/* Camera Quick Button (when no text) */}
          {!text.trim() && (
            <button
              onClick={() => setShowCameraModal(true)}
              className="p-2 rounded-full text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white transition-colors hidden sm:flex"
              title="Camera"
            >
              <Camera className="w-6 h-6" />
            </button>
          )}

          {/* Dynamic Mic / Send Action */}
          {text.trim() ? (
            <button
              onClick={handleSendText}
              className="w-10 h-10 rounded-full bg-wa-green-deep hover:bg-wa-green-teal text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
              title="Send message"
            >
              <Send className="w-5 h-5 fill-current ml-0.5" />
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="w-10 h-10 rounded-full bg-wa-green-deep hover:bg-wa-green-teal text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
              title="Record voice message"
            >
              <Mic className="w-5 h-5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#202c33] rounded-2xl overflow-hidden shadow-wa-modal border border-[#e9edef] dark:border-[#2a3942] flex flex-col animate-pop-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e9edef] dark:border-[#2a3942]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef]">
                  Preview {pendingMedia.type === 'video' ? 'Video' : 'Photo'}
                </span>
                <span className="text-xs text-[#8696a0] font-mono">
                  ({pendingMedia.fileSize})
                </span>
              </div>
              <button
                onClick={() => {
                  setShowMediaPreviewModal(false);
                  setPendingMedia(null);
                }}
                className="p-1 rounded-full text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content Preview */}
            <div className="h-80 bg-black/90 flex items-center justify-center p-3 relative">
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
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Caption & Send */}
            <div className="p-4 flex items-center gap-3 bg-[#f0f2f5] dark:bg-[#182229]">
              <input
                type="text"
                placeholder="Add a caption..."
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendPendingMedia();
                  }
                }}
                className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-[#2a3942] text-[#111b21] dark:text-[#e9edef] rounded-xl outline-none border border-[#e9edef] dark:border-transparent focus:ring-1 focus:ring-wa-green shadow-2xs"
                autoFocus
              />
              <button
                onClick={handleSendPendingMedia}
                className="w-11 h-11 rounded-full bg-wa-green-deep hover:bg-wa-green-teal text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
                title="Send"
              >
                <Send className="w-5 h-5 fill-current ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
