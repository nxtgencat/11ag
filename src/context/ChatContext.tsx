import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Contact, Message, MessageType, Attachment, LocationData, SharedContactData, QuotedMessage, ChatFilter, ActiveTab } from '../types';
import { INITIAL_CONTACTS } from '../data/contacts';
import { INITIAL_MESSAGES } from '../data/messages';
import { generateId, searchContactsAndMessages } from '../utils/helpers';
import { sounds } from '../utils/soundEffects';

interface SendMessagePayload {
  text?: string;
  type?: MessageType;
  attachment?: Attachment;
  location?: LocationData;
  sharedContact?: SharedContactData;
  quotedMessage?: QuotedMessage;
}

interface ChatContextType {
  contacts: Contact[];
  activeChatId: string | null;
  activeContact: Contact | null;
  setActiveChatId: (id: string | null) => void;
  messages: Record<string, Message[]>;
  activeMessages: Message[];
  activeFilter: ChatFilter;
  setActiveFilter: (filter: ChatFilter) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredContacts: Contact[];
  isContactDrawerOpen: boolean;
  setIsContactDrawerOpen: (open: boolean) => void;
  
  // Message Actions
  sendMessage: (payload: SendMessagePayload) => void;
  addReaction: (messageId: string, emoji: string) => void;
  starMessage: (messageId: string) => void;
  deleteMessage: (messageId: string, forEveryone: boolean) => void;
  forwardMessage: (messageId: string, targetChatIds: string[]) => void;
  
  // Chat Actions
  pinChat: (chatId: string) => void;
  muteChat: (chatId: string, duration?: string) => void;
  archiveChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  clearChat: (chatId: string) => void;
  blockContact: (chatId: string) => void;
  markAsRead: (chatId: string) => void;
  toggleFavorite: (chatId: string) => void;
  createChatWithContact: (contact: Partial<Contact>) => string;
  createGroupChat: (name: string, memberIds: string[], avatar?: string) => string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem('wa_contacts_list');
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem('wa_messages_store');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [activeChatId, setActiveChatIdState] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ChatFilter>('all');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('wa_contacts_list', JSON.stringify(contacts));
    } catch {
      // Ignore
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem('wa_messages_store', JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  const activeContact = useMemo(() => {
    return contacts.find(c => c.id === activeChatId) || null;
  }, [contacts, activeChatId]);

  const activeMessages = useMemo(() => {
    if (!activeChatId) return [];
    return messages[activeChatId] || [];
  }, [messages, activeChatId]);

  // Mark as read when selecting chat
  const markAsRead = useCallback((chatId: string) => {
    setContacts(prev =>
      prev.map(c => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const setActiveChatId = useCallback((id: string | null) => {
    setActiveChatIdState(id);
    if (id) {
      markAsRead(id);
    }
  }, [markAsRead]);

  // Filtered contacts list
  const filteredContacts = useMemo(() => {
    let list = contacts;

    // Filter by Active Tab
    if (activeTab === 'archived') {
      list = list.filter(c => c.isArchived);
    } else {
      list = list.filter(c => !c.isArchived);
    }

    // Filter by Tab pills (All, Unread, Favorites, Groups)
    if (activeTab === 'chats') {
      if (activeFilter === 'unread') {
        list = list.filter(c => c.unreadCount > 0);
      } else if (activeFilter === 'favorites') {
        list = list.filter(c => c.isFavorite);
      } else if (activeFilter === 'groups') {
        list = list.filter(c => c.isGroup);
      }
    }

    // Apply Search
    if (searchQuery.trim()) {
      list = searchContactsAndMessages(searchQuery, list, messages);
    }

    // Sort: Pinned first, then by last message time / original order
    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [contacts, activeTab, activeFilter, searchQuery, messages]);

  // Send Message
  const sendMessage = useCallback((payload: SendMessagePayload) => {
    if (!activeChatId) return;

    const newMsgId = generateId('msg');
    const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: newMsgId,
      chatId: activeChatId,
      senderId: 'me',
      senderName: 'You',
      text: payload.text || '',
      type: payload.type || 'text',
      timestamp: nowStr,
      status: 'sent',
      attachment: payload.attachment,
      location: payload.location,
      sharedContact: payload.sharedContact,
      quotedMessage: payload.quotedMessage,
    };

    sounds.playMessageSent();

    setMessages(prev => {
      const currentList = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: [...currentList, newMsg],
      };
    });

    // Update last message in contacts
    setContacts(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          let previewText = payload.text || '';
          if (payload.type === 'image') previewText = '📷 Photo';
          else if (payload.type === 'video') previewText = '🎥 Video';
          else if (payload.type === 'voice') previewText = '🎤 Voice note';
          else if (payload.type === 'document') previewText = '📄 ' + (payload.attachment?.fileName || 'Document');
          else if (payload.type === 'location') previewText = '📍 Location';
          else if (payload.type === 'contact') previewText = '👤 Contact';

          return {
            ...c,
            lastMessage: {
              text: previewText,
              timestamp: 'Just now',
              senderId: 'me',
              status: 'sent',
              type: payload.type || 'text',
            },
          };
        }
        return c;
      })
    );

    // Simulate double-tick delivery and auto-reply simulation after 3s
    setTimeout(() => {
      setMessages(prev => {
        const list = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: list.map(m => (m.id === newMsgId ? { ...m, status: 'read' } : m)),
        };
      });
    }, 1200);

    // Auto-reply simulation for interactive feel if contact is online
    const targetContact = contacts.find(c => c.id === activeChatId);
    if (targetContact && targetContact.isOnline && !targetContact.isGroup) {
      setTimeout(() => {
        // Show typing indicator
        setContacts(prev => prev.map(c => c.id === activeChatId ? { ...c, isTyping: true } : c));

        setTimeout(() => {
          setContacts(prev => prev.map(c => c.id === activeChatId ? { ...c, isTyping: false } : c));

          const replies = [
            'Got it! Sounds great 👍',
            'Thanks for sending this over! Looking at it now.',
            'Awesome, talk to you soon!',
            'Received, appreciate the quick update!',
            'Let me check and get back to you shortly 😊',
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const replyId = generateId('reply');

          const replyMsg: Message = {
            id: replyId,
            chatId: activeChatId,
            senderId: targetContact.id,
            senderName: targetContact.name,
            text: randomReply,
            type: 'text',
            timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          };

          sounds.playMessageReceived();

          setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), replyMsg],
          }));

          setContacts(prev =>
            prev.map(c =>
              c.id === activeChatId
                ? {
                    ...c,
                    lastMessage: {
                      text: randomReply,
                      timestamp: 'Just now',
                      senderId: targetContact.id,
                      status: 'delivered',
                      type: 'text',
                    },
                  }
                : c
            )
          );
        }, 2000);
      }, 1500);
    }
  }, [activeChatId, contacts]);

  // Reaction
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!activeChatId) return;
    sounds.playReaction();

    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map(m => {
          if (m.id !== messageId) return m;
          const currentReactions = { ...(m.reactions || {}) };
          const userList = currentReactions[emoji] || [];

          if (userList.includes('me')) {
            // Remove user reaction
            const updated = userList.filter(u => u !== 'me');
            if (updated.length === 0) {
              delete currentReactions[emoji];
            } else {
              currentReactions[emoji] = updated;
            }
          } else {
            // Add user reaction
            currentReactions[emoji] = [...userList, 'me'];
          }

          return { ...m, reactions: currentReactions };
        }),
      };
    });
  }, [activeChatId]);

  // Star message
  const starMessage = useCallback((messageId: string) => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map(m => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)),
      };
    });
  }, [activeChatId]);

  // Delete message
  const deleteMessage = useCallback((messageId: string, forEveryone: boolean) => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      if (forEveryone) {
        return {
          ...prev,
          [activeChatId]: list.map(m =>
            m.id === messageId
              ? {
                  ...m,
                  isDeleted: true,
                  deletedForEveryone: true,
                  text: '🚫 This message was deleted',
                  attachment: undefined,
                  location: undefined,
                  sharedContact: undefined,
                }
              : m
          ),
        };
      } else {
        return {
          ...prev,
          [activeChatId]: list.filter(m => m.id !== messageId),
        };
      }
    });
  }, [activeChatId]);

  // Forward message
  const forwardMessage = useCallback((messageId: string, targetChatIds: string[]) => {
    if (!activeChatId) return;
    const sourceMsg = (messages[activeChatId] || []).find(m => m.id === messageId);
    if (!sourceMsg) return;

    sounds.playMessageSent();

    setMessages(prev => {
      const updated = { ...prev };
      const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      targetChatIds.forEach(targetId => {
        const forwardedMsg: Message = {
          ...sourceMsg,
          id: generateId('fwd'),
          chatId: targetId,
          senderId: 'me',
          senderName: 'You',
          timestamp: nowStr,
          isForwarded: true,
          status: 'sent',
          reactions: {},
        };
        updated[targetId] = [...(updated[targetId] || []), forwardedMsg];
      });

      return updated;
    });
  }, [activeChatId, messages]);

  // Chat Actions
  const pinChat = useCallback((chatId: string) => {
    setContacts(prev =>
      prev.map(c => (c.id === chatId ? { ...c, isPinned: !c.isPinned } : c))
    );
  }, []);

  const muteChat = useCallback((chatId: string, duration = '8 hours') => {
    setContacts(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
              ...c,
              isMuted: !c.isMuted,
              muteUntil: !c.isMuted ? duration : undefined,
            }
          : c
      )
    );
  }, []);

  const archiveChat = useCallback((chatId: string) => {
    setContacts(prev =>
      prev.map(c => (c.id === chatId ? { ...c, isArchived: !c.isArchived } : c))
    );
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setContacts(prev => prev.filter(c => c.id !== chatId));
    setMessages(prev => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
    if (activeChatId === chatId) {
      setActiveChatIdState(null);
    }
  }, [activeChatId]);

  const clearChat = useCallback((chatId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: [],
    }));
  }, []);

  const blockContact = useCallback((chatId: string) => {
    setContacts(prev =>
      prev.map(c => (c.id === chatId ? { ...c, isBlocked: !c.isBlocked } : c))
    );
  }, []);

  const toggleFavorite = useCallback((chatId: string) => {
    setContacts(prev =>
      prev.map(c => (c.id === chatId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  }, []);

  const createChatWithContact = useCallback((newContactData: Partial<Contact>): string => {
    const id = generateId('user');
    const newContact: Contact = {
      id,
      name: newContactData.name || 'New Contact',
      phone: newContactData.phone || '+1 (555) 000-0000',
      avatar: newContactData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      about: newContactData.about || 'Hey there! I am using WhatsApp.',
      isOnline: true,
      unreadCount: 0,
      lastSeen: 'online',
      ...newContactData,
    };

    setContacts(prev => [newContact, ...prev]);
    setActiveChatIdState(id);
    return id;
  }, []);

  // Create a new group chat
  const createGroupChat = useCallback((name: string, memberIds: string[], avatar?: string): string => {
    const id = generateId('group');
    const memberCount = memberIds.length + 1; // includes you
    const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newGroup: Contact = {
      id,
      name: name.trim() || 'New Group',
      phone: 'group',
      avatar: avatar || '',
      about: `Group · ${memberCount} members`,
      isOnline: true,
      unreadCount: 0,
      lastSeen: 'online',
      isGroup: true,
      groupMembersCount: memberCount,
      members: memberIds,
    };

    setContacts(prev => [newGroup, ...prev]);
    setActiveChatIdState(id);

    // Welcome / system message
    setMessages(prev => ({
      ...prev,
      [id]: [{
        id: generateId('msg'),
        chatId: id,
        senderId: 'system',
        senderName: 'System',
        text: `📢 ${name.trim() || 'Group'} created with ${memberCount} members. Say hi! 👋`,
        type: 'text',
        timestamp: nowStr,
        status: 'read',
      }],
    }));

    return id;
  }, []);

  return (
    <ChatContext.Provider
      value={{
        contacts,
        activeChatId,
        activeContact,
        setActiveChatId,
        messages,
        activeMessages,
        activeFilter,
        setActiveFilter,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filteredContacts,
        isContactDrawerOpen,
        setIsContactDrawerOpen,
        sendMessage,
        addReaction,
        starMessage,
        deleteMessage,
        forwardMessage,
        pinChat,
        muteChat,
        archiveChat,
        deleteChat,
        clearChat,
        blockContact,
        markAsRead,
        toggleFavorite,
        createChatWithContact,
        createGroupChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
