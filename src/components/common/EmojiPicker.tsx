import React, { useState, useMemo } from 'react';
import { Search, Smile, Heart, Coffee, Car, Lightbulb, Flag } from 'lucide-react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose?: () => void;
}

const EMOJI_CATEGORIES = [
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: Smile,
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😮‍💨', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🫢', '🫡', '🤫', '🫠', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😶‍🌫️', '😏', '🙄', '😬'],
  },
  {
    id: 'gestures',
    name: 'People & Body',
    icon: Heart,
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '🫦', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: Coffee,
    emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '☕', '🍵', '🧃', '🥤', '🧋', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸'],
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: Car,
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚲', '🛴', '🛹', '🛼', '🚁', '✈️', '🛫', '🛬', '🚀', '🛸', '🛰️', '⛵', '🚤', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏰', '🏯', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋'],
  },
  {
    id: 'objects',
    name: 'Objects & Symbols',
    icon: Lightbulb,
    emojis: ['💡', '🔦', '🕯️', '🪔', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💽', '💾', '💿', '📀', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💎', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '📦', '📫', '📪', '📬', '📭', '📮', '🏷️', '✉️', '📧', '📥', '📤', '🎁', '🎈', '🎉', '🎊', '✨', '⚡', '🔥', '💥', '⭐', '🌟', '💫', '☀️', '🌙'],
  },
  {
    id: 'flags',
    name: 'Flags',
    icon: Flag,
    emojis: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇮🇳', '🇯🇵', '🇧🇷', '🇪🇸', '🇮🇹', '🇳🇱', '🇨🇭', '🇸🇪', '🇸🇬', '🇦🇪', '🇸🇦', '🇿🇦', '🇲🇽', '🇦🇷', '🇳🇿', '🇮🇪', '🇳🇴', '🇩🇰', '🇫🇮', '🇵🇹', '🇵🇱', '🇹🇷', '🇰🇷'],
  },
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [search, setSearch] = useState('');

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return null;
    const all = EMOJI_CATEGORIES.flatMap(c => c.emojis);
    return all;
  }, [search]);

  return (
    <div className="w-80 sm:w-88 bg-white dark:bg-[#202c33] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#2a3942] overflow-hidden flex flex-col h-80 animate-pop-in">
      {/* Search Header */}
      <div className="p-2 border-b border-[#e9edef] dark:border-[#2a3942]">
        <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#111b21] rounded-lg px-2.5 py-1.5">
          <Search className="w-4 h-4 text-[#8696a0] mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search emoji"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      {!search && (
        <div className="flex items-center justify-around px-2 py-1.5 border-b border-[#e9edef] dark:border-[#2a3942] bg-[#f7f8fa] dark:bg-[#182229]">
          {EMOJI_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                title={cat.name}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeCategory === cat.id
                    ? 'text-wa-green-deep dark:text-wa-green bg-[#e9edef] dark:bg-[#2a3942]'
                    : 'text-[#8696a0] hover:text-[#54656f] dark:hover:text-[#d1d7db]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-8 gap-1 content-start">
        {(filteredEmojis || EMOJI_CATEGORIES.find(c => c.id === activeCategory)?.emojis || []).map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => onSelectEmoji(emoji)}
            className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-[#f0f2f5] dark:hover:bg-[#2a3942] active:scale-90 transition-transform"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
