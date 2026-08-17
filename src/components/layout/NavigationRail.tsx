import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveTab } from '../../types';
import { MessageSquare, CircleDashed, Radio, Phone, Star, Settings, Sun, Moon } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { SettingsModal } from '../profile/SettingsModal';

export const NavigationRail: React.FC = () => {
  const { activeTab, setActiveTab, contacts } = useChat();
  const { user } = useAuth();
  const { isDark, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const totalUnread = contacts.reduce((sum, c) => sum + (c.isArchived ? 0 : c.unreadCount), 0);

  const navItems = [
    { id: 'chats' as ActiveTab, label: 'Chats', icon: MessageSquare, badge: totalUnread },
    { id: 'status' as ActiveTab, label: 'Status', icon: CircleDashed },
    { id: 'channels' as ActiveTab, label: 'Channels', icon: Radio },
    { id: 'calls' as ActiveTab, label: 'Calls', icon: Phone },
  ];

  return (
    <>
      <div className="w-16 h-full bg-surface dark:bg-surfacedark border-r border-line dark:border-linedark flex flex-col items-center justify-between py-4 select-none shrink-0 z-30 transition-colors">
        {/* Top: Tearline Logo Tile + Nav Items */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {/* Tearline Rotated Brand Tile */}
          <div className="w-9 h-9 rounded-lg bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-content-center font-display font-bold text-sm rotate-[-4deg] shadow-xs cursor-pointer hover:rotate-0 transition-transform mb-2">
            W
          </div>

          {/* Navigation Icons */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-10 h-10 rounded-xl grid place-content-center transition-all ${
                  isActive
                    ? 'bg-cobalt text-white shadow-xs'
                    : 'text-slate dark:text-slatedark hover:bg-ink/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-paperdark'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Icons: Starred, Theme Switcher, Settings, Profile */}
        <div className="flex flex-col items-center gap-2.5 w-full px-2">
          {/* Starred Messages */}
          <button
            onClick={() => setActiveTab('starred')}
            className={`w-10 h-10 rounded-xl grid place-content-center transition-all ${
              activeTab === 'starred'
                ? 'bg-amber text-white shadow-xs'
                : 'text-slate dark:text-slatedark hover:bg-ink/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-paperdark'
            }`}
            title="Starred Messages"
          >
            <Star className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-10 h-10 rounded-xl grid place-content-center text-slate dark:text-slatedark hover:bg-ink/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-paperdark transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-xl grid place-content-center text-slate dark:text-slatedark hover:bg-ink/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-paperdark transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div className="pt-2 border-t border-line dark:border-linedark w-full flex justify-center">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Me'}
              size="sm"
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setIsSettingsOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
