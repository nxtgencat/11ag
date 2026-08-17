import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import { MessageSquare, CircleDashed, Radio, Phone, Star, Settings } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { SettingsModal } from '../profile/SettingsModal';

export const NavigationRail: React.FC = () => {
  const { activeTab, setActiveTab, contacts } = useChat();
  const { user } = useAuth();
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
      <div className="w-14 sm:w-16 h-full bg-[#f0f2f5] dark:bg-[#202c33] border-r border-[#e9edef] dark:border-[#222d34] flex flex-col items-center justify-between py-4 select-none shrink-0 z-30">
        {/* Top Icons */}
        <div className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative p-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-wa-green/15 text-wa-green-deep dark:text-wa-green font-bold'
                    : 'text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-wa-green text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Icons: Starred, Settings, Profile */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setActiveTab('starred')}
            className={`p-2.5 rounded-xl transition-all ${
              activeTab === 'starred'
                ? 'bg-wa-green/15 text-wa-green-deep dark:text-wa-green font-bold'
                : 'text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title="Starred Messages"
          >
            <Star className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile Avatar */}
          <div className="pt-2 border-t border-[#e9edef] dark:border-[#2a3942]">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Me'}
              size="sm"
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
