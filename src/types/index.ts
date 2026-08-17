export type MessageStatus = 'sent' | 'delivered' | 'read' | 'pending';

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'voice' 
  | 'document' 
  | 'location' 
  | 'contact';

export interface Reaction {
  emoji: string;
  count: number;
  users: { id: string; name: string }[];
}

export interface Attachment {
  type: MessageType;
  url: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  duration?: string | number;
  pageCount?: number;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  mapPreviewUrl?: string;
}

export interface SharedContactData {
  name: string;
  phone: string;
  avatar?: string;
  about?: string;
}

export interface QuotedMessage {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  type: MessageType;
  attachmentPreview?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text?: string;
  type: MessageType;
  timestamp: string; // ISO string or format
  status: MessageStatus;
  isStarred?: boolean;
  isForwarded?: boolean;
  isDeleted?: boolean;
  deletedForEveryone?: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  quotedMessage?: QuotedMessage;
  attachment?: Attachment;
  location?: LocationData;
  sharedContact?: SharedContactData;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  isOnline: boolean;
  lastSeen?: string; // e.g. "today at 10:45 AM"
  isTyping?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  muteUntil?: string; // "8 hours" | "1 week" | "always"
  isArchived?: boolean;
  isBlocked?: boolean;
  isFavorite?: boolean;
  isGroup?: boolean;
  groupMembersCount?: number;
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
    status?: MessageStatus;
    type?: MessageType;
  };
  disappearingMessages?: 'off' | '24h' | '7d' | '90d';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  countryCode: string;
  isLoggedIn: boolean;
}

export interface Country {
  name: string;
  code: string; // "US", "IN", "GB", etc.
  dialCode: string; // "+1", "+91", "+44"
  flag: string;
}

export type ActiveTab = 'chats' | 'status' | 'channels' | 'calls' | 'starred' | 'settings' | 'archived';

export type ChatFilter = 'all' | 'unread' | 'favorites' | 'groups';

export interface ActiveCall {
  contact: Contact;
  type: 'voice' | 'video';
  status: 'calling' | 'connected' | 'ended';
  startedAt?: Date;
  isMuted: boolean;
  isVideoMuted: boolean;
  isSpeakerOn: boolean;
  isScreenSharing?: boolean;
}
