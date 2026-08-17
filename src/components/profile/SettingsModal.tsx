import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { X, Moon, Sun, Monitor, Lock, LogOut, User, Check, Palette } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, completeProfileSetup } = useAuth();
  const { theme, setTheme, wallpaper, setWallpaper } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'privacy'>('profile');
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [about, setAbout] = useState(user?.about || 'Hey there! I am using WhatsApp.');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfileSetup(name, about, user?.avatar || '');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] overflow-hidden flex flex-col max-h-[85vh] animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e9edef] dark:border-[#222d34] bg-[#f0f2f5] dark:bg-[#202c33]">
          <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef]">Settings</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e9edef] dark:border-[#222d34] bg-[#f7f8fa] dark:bg-[#182229] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'profile'
                ? 'border-wa-green text-wa-green-deep dark:text-wa-green'
                : 'border-transparent text-[#667781] dark:text-[#8696a0]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'appearance'
                ? 'border-wa-green text-wa-green-deep dark:text-wa-green'
                : 'border-transparent text-[#667781] dark:text-[#8696a0]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Wallpaper</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'privacy'
                ? 'border-wa-green text-wa-green-deep dark:text-wa-green'
                : 'border-transparent text-[#667781] dark:text-[#8696a0]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Account</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={user?.avatar}
                  name={user?.name || 'Me'}
                  size="xl"
                />
                <div>
                  <h4 className="font-semibold text-base">{user?.name}</h4>
                  <p className="text-xs text-[#8696a0] font-mono">{user?.phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#667781] dark:text-[#8696a0] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f2f5] dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl text-sm outline-none focus:border-wa-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#667781] dark:text-[#8696a0] mb-1">
                  About
                </label>
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f2f5] dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl text-sm outline-none focus:border-wa-green"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {isSaved ? (
                  <span className="text-xs font-semibold text-wa-green flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile saved!
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  className="px-5 py-2 bg-wa-green-deep hover:bg-wa-green-teal text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Theme & Wallpaper Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      theme === 'light'
                        ? 'border-wa-green bg-wa-green/10 text-wa-green-deep font-semibold'
                        : 'border-[#e9edef] dark:border-[#2a3942] hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs">Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      theme === 'dark'
                        ? 'border-wa-green bg-wa-green/10 text-wa-green font-semibold'
                        : 'border-[#e9edef] dark:border-[#2a3942] hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs">Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      theme === 'system'
                        ? 'border-wa-green bg-wa-green/10 text-wa-green-deep dark:text-wa-green font-semibold'
                        : 'border-[#e9edef] dark:border-[#2a3942] hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span className="text-xs">System</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8696a0] uppercase tracking-wider mb-3">
                  Chat Wallpaper
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWallpaper('doodle')}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-medium transition-all ${
                      wallpaper === 'doodle'
                        ? 'border-wa-green bg-wa-green/15 text-wa-green-deep dark:text-wa-green font-bold'
                        : 'border-[#e9edef] dark:border-[#2a3942]'
                    }`}
                  >
                    WhatsApp Doodle
                  </button>
                  <button
                    onClick={() => setWallpaper('solid')}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-medium transition-all ${
                      wallpaper === 'solid'
                        ? 'border-wa-green bg-wa-green/15 text-wa-green-deep dark:text-wa-green font-bold'
                        : 'border-[#e9edef] dark:border-[#2a3942]'
                    }`}
                  >
                    Solid Background
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account & Logout Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8696a0]">Registered Phone</span>
                  <span className="font-mono font-medium">{user?.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8696a0]">Encryption Status</span>
                  <span className="text-wa-green font-semibold">Active (Signal Protocol)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out from WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
