import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { X, Moon, Sun, Monitor, Lock, LogOut, Check, Palette } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme, wallpaper, setWallpaper } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [about, setAbout] = useState(user?.about || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    updateProfile({ name, about });
    setIsEditingProfile(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg card p-0 overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line dark:border-linedark bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-ink dark:text-paperdark">
              Settings & Preferences
            </h3>
            <span className="ticket-tag text-[9px] py-0 px-2 font-mono">TEARLINE</span>
          </div>
          <button
            onClick={onClose}
            className="btn-icon w-8 h-8"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* User Profile Card */}
          <div className="p-4 rounded-xl bg-paper dark:bg-inkdark border border-line dark:border-linedark space-y-3">
            <div className="flex items-center gap-3.5">
              <Avatar
                src={user?.avatar}
                name={user?.name || 'User'}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-sm text-ink dark:text-paperdark truncate">
                  {user?.name || 'My Profile'}
                </h4>
                <p className="font-mono text-xs text-slate dark:text-slatedark">
                  {user?.phone || '+1 555-0100'}
                </p>
                <p className="text-xs text-slate dark:text-slatedark mt-0.5 truncate italic">
                  "{user?.about || 'Available'}"
                </p>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="btn-outline text-xs py-1 px-3"
              >
                {isEditingProfile ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Inline Profile Editor */}
            {isEditingProfile && (
              <div className="pt-3 border-t border-line dark:border-linedark space-y-2.5 animate-fade-in">
                <div>
                  <label className="mini-tag block mb-1">DISPLAY NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field py-1.5 text-xs"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mini-tag block mb-1">ABOUT / STATUS</label>
                  <input
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="field py-1.5 text-xs"
                    placeholder="About status"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary py-1.5 px-4 text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {isSaved && (
              <div className="p-2 rounded bg-mint/10 text-mint text-xs flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Profile updated successfully!</span>
              </div>
            )}
          </div>

          {/* Theme Mode Selector */}
          <div className="space-y-2">
            <span className="mini-tag">COLOR THEME</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-cobalt bg-cobalt/5 text-cobalt'
                    : 'border-line dark:border-linedark text-slate hover:border-ink dark:hover:border-paperdark'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-xs font-medium">Light</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-cobalt bg-cobalt/5 text-cobalt-light'
                    : 'border-line dark:border-linedark text-slate hover:border-ink dark:hover:border-paperdark'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-xs font-medium">Dark</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'system'
                    ? 'border-cobalt bg-cobalt/5 text-cobalt'
                    : 'border-line dark:border-linedark text-slate hover:border-ink dark:hover:border-paperdark'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="text-xs font-medium">System</span>
              </button>
            </div>
          </div>

          {/* Chat Wallpaper Mode */}
          <div className="space-y-2">
            <span className="mini-tag">CHAT WALLPAPER</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWallpaper('doodle')}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  wallpaper === 'doodle'
                    ? 'border-cobalt bg-cobalt/5'
                    : 'border-line dark:border-linedark hover:border-ink dark:hover:border-paperdark'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-cobalt" />
                  <span className="text-xs font-medium">Paper Grid</span>
                </div>
                {wallpaper === 'doodle' && <Check className="w-4 h-4 text-cobalt" />}
              </button>

              <button
                onClick={() => setWallpaper('solid')}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  wallpaper === 'solid'
                    ? 'border-cobalt bg-cobalt/5'
                    : 'border-line dark:border-linedark hover:border-ink dark:hover:border-paperdark'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-slate" />
                  <span className="text-xs font-medium">Solid Minimal</span>
                </div>
                {wallpaper === 'solid' && <Check className="w-4 h-4 text-cobalt" />}
              </button>
            </div>
          </div>

          {/* Security & Logout */}
          <div className="pt-2 border-t border-line dark:border-linedark flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate dark:text-slatedark text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-mint" />
              <span>Session encrypted</span>
            </div>

            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-rose hover:bg-rose/10 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
