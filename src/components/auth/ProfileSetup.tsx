import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Check, Ticket } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

const STATUS_PRESETS = [
  'Available',
  'Busy',
  'At work',
  'In a meeting',
  'Battery about to die',
  'Building products 🚀',
];

export const ProfileSetup: React.FC = () => {
  const { completeProfileSetup } = useAuth();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('Available');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a profile name');
      return;
    }
    setError('');
    setIsLoading(true);
    completeProfileSetup(name, about, avatar);
    setIsLoading(false);
  };

  return (
    <div className="card shadow-lg p-6 sm:p-8 text-center animate-pop-in relative">
      <div className="inline-flex items-center gap-1.5 ticket-tag text-[10px] py-0.5 px-2 mb-2 font-mono">
        <Ticket className="w-3 h-3 text-cobalt" />
        <span>PROFILE CREATION</span>
      </div>

      <h2 className="font-display font-bold text-xl text-ink dark:text-paperdark tracking-tight">
        Complete Your Profile
      </h2>
      <p className="text-xs text-slate dark:text-slatedark mt-1 max-w-xs mx-auto">
        Choose your display photo, name, and status.
      </p>

      {error && (
        <div className="mt-4 p-2.5 rounded-lg bg-rose/10 border border-rose/20 text-rose text-xs font-medium animate-pop-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
        {/* Avatar Picker */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar preview"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cobalt/40 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cobalt text-white flex items-center justify-center shadow-xs">
              <Camera className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            {PRESET_AVATARS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAvatar(url)}
                className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                  avatar === url ? 'border-cobalt ring-2 ring-cobalt/30' : 'border-transparent opacity-70'
                }`}
              >
                <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Display Name Input */}
        <div>
          <label className="mini-tag block mb-1">YOUR NAME</label>
          <input
            type="text"
            placeholder="Type your name…"
            value={name}
            maxLength={25}
            onChange={(e) => setName(e.target.value)}
            className="field py-2 text-sm"
            autoFocus
          />
          <div className="flex justify-end mt-1 text-[10px] font-mono text-slate">
            <span>{name.length}/25</span>
          </div>
        </div>

        {/* About Status */}
        <div>
          <label className="mini-tag block mb-1">ABOUT / STATUS</label>
          <input
            type="text"
            placeholder="What's your status?"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="field py-2 text-sm mb-2"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {STATUS_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAbout(preset)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  about === preset
                    ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark'
                    : 'border border-line dark:border-linedark text-slate hover:border-ink dark:hover:border-paperdark'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
        >
          <span>Launch Messenger</span>
          <Check className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
