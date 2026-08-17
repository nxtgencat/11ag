import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, MessageSquare, Phone, Radio, CircleDashed, Moon, Sun, X } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const { contacts, setActiveChatId, setActiveTab } = useChat();
  const { isDark, setTheme } = useTheme();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredContacts = query.trim()
    ? contacts.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query) ||
        (c.about && c.about.toLowerCase().includes(query.toLowerCase()))
      )
    : contacts.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg card p-0 overflow-hidden shadow-2xl animate-pop-in">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line dark:border-linedark">
          <Search className="w-4 h-4 text-slate dark:text-slatedark shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search contacts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-ink dark:text-paperdark outline-none placeholder:text-slate/60 font-sans"
            autoFocus
          />
          <button onClick={onClose} className="btn-icon w-7 h-7">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results / Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-line/40 dark:divide-linedark/40">
          {/* Quick Nav Section */}
          {!query && (
            <div className="py-1">
              <span className="mini-tag px-2">QUICK NAVIGATION</span>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('chats');
                    onClose();
                  }}
                  className="menu-item"
                >
                  <MessageSquare className="w-4 h-4 text-cobalt" />
                  <span>Go to Chats</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('status');
                    onClose();
                  }}
                  className="menu-item"
                >
                  <CircleDashed className="w-4 h-4 text-mint" />
                  <span>Go to Status</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('channels');
                    onClose();
                  }}
                  className="menu-item"
                >
                  <Radio className="w-4 h-4 text-amber" />
                  <span>Go to Channels</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('calls');
                    onClose();
                  }}
                  className="menu-item"
                >
                  <Phone className="w-4 h-4 text-cobalt-light" />
                  <span>Go to Calls</span>
                </button>
                <button
                  onClick={() => {
                    setTheme(isDark ? 'light' : 'dark');
                    onClose();
                  }}
                  className="menu-item"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4" />}
                  <span>Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
                </button>
              </div>
            </div>
          )}

          {/* Contacts Section */}
          <div className="py-1">
            <span className="mini-tag px-2">
              {query ? 'MATCHING CONTACTS' : 'RECENT CONVERSATIONS'}
            </span>
            <div className="mt-1 space-y-0.5">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveChatId(c.id);
                      setActiveTab('chats');
                      onClose();
                    }}
                    className="menu-item justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-display font-medium text-xs">{c.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate dark:text-slatedark">
                      {c.phone}
                    </span>
                  </button>
                ))
              ) : (
                <p className="p-3 text-xs text-center text-slate">No contacts matched "{query}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-paper dark:bg-inkdark border-t border-line dark:border-linedark flex items-center justify-between text-[11px] font-mono text-slate dark:text-slatedark">
          <span>Navigate with arrows or click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
