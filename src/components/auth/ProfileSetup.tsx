import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Smile, ArrowRight, Check } from 'lucide-react';
import { EmojiPicker } from '../common/EmojiPicker';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
];

const STATUS_PRESETS = [
  'Available',
  'Busy',
  'At work 💼',
  'In a meeting 📅',
  'At the gym 🏋️‍♂️',
  'Battery about to die 🪫',
  'Urgent calls only 📞',
  'Sleeping 😴',
];

export const ProfileSetup: React.FC = () => {
  const { completeProfileSetup } = useAuth();
  const [name, setName] = useState('Alex Morgan');
  const [about, setAbout] = useState('Hey there! I am using WhatsApp.');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfileSetup(name, about, selectedAvatar);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] p-8 text-center animate-pop-in">
      <span className="text-xs font-semibold text-wa-green uppercase tracking-wider block mb-2">
        Step 3 of 3
      </span>
      <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef] mb-2">
        Profile Info
      </h2>
      <p className="text-xs sm:text-sm text-[#667781] dark:text-[#8696a0] mb-6">
        Please provide your name and an optional profile photo.
      </p>

      {/* Avatar Picker with Camera Badge */}
      <div className="relative w-28 h-28 mx-auto mb-6">
        <img
          src={selectedAvatar}
          alt="Profile Preview"
          className="w-full h-full rounded-full object-cover border-4 border-wa-green shadow-md"
        />
        <label className="absolute bottom-0 right-0 p-2 bg-wa-green-deep hover:bg-wa-green-teal text-white rounded-full cursor-pointer shadow-md transition-transform hover:scale-110">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <button
          type="button"
          onClick={() => setShowPresetModal(true)}
          className="mt-2 text-xs text-wa-green hover:underline block mx-auto whitespace-nowrap"
        >
          Choose from presets
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Name Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[#667781] dark:text-[#8696a0]">
              Display Name
            </label>
            <span className="text-[10px] font-mono text-[#8696a0]">
              {name.length}/25
            </span>
          </div>
          <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl px-3 py-2.5 focus-within:border-wa-green transition-all">
            <input
              type="text"
              maxLength={25}
              placeholder="Type your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] outline-none pr-8"
              required
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute z-50 mt-1">
              <EmojiPicker
                onSelectEmoji={(emoji) => {
                  setName((prev) => (prev + emoji).slice(0, 25));
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* About / Status */}
        <div>
          <label className="block text-xs font-medium text-[#667781] dark:text-[#8696a0] mb-1">
            About
          </label>
          <input
            type="text"
            placeholder="About you"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#f0f2f5] dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl text-sm text-[#111b21] dark:text-[#e9edef] outline-none focus:border-wa-green transition-all"
          />

          {/* Quick status chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {STATUS_PRESETS.slice(0, 4).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setAbout(status)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  about === status
                    ? 'bg-wa-green/15 text-wa-green border-wa-green'
                    : 'bg-[#f0f2f5] dark:bg-[#202c33] border-transparent text-[#667781] dark:text-[#8696a0] hover:border-[#8696a0]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-wa-green-deep hover:bg-wa-green-teal text-white font-medium rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          <span>Complete Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Preset Avatars Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xs bg-white dark:bg-[#202c33] rounded-2xl p-6 shadow-wa-modal border border-[#e9edef] dark:border-[#2a3942] text-center animate-pop-in">
            <h3 className="font-semibold mb-4">Choose an avatar</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAvatar(preset);
                    setShowPresetModal(false);
                  }}
                  className={`relative rounded-full overflow-hidden aspect-square border-2 transition-transform hover:scale-105 ${
                    selectedAvatar === preset ? 'border-wa-green ring-2 ring-wa-green/40' : 'border-transparent'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                  {selectedAvatar === preset && (
                    <div className="absolute inset-0 bg-wa-green/40 flex items-center justify-center text-white">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPresetModal(false)}
              className="text-xs text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
