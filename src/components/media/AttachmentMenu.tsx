import React, { useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, FileText, Mic, MapPin, User } from 'lucide-react';

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'camera' | 'media' | 'document' | 'audio' | 'location' | 'contact' | 'poll') => void;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  isOpen,
  onClose,
  onSelectOption,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { id: 'document', label: 'Document', icon: FileText, bg: 'bg-indigo-500 hover:bg-indigo-600' },
    { id: 'media', label: 'Photos & Videos', icon: ImageIcon, bg: 'bg-cyan-500 hover:bg-cyan-600' },
    { id: 'camera', label: 'Camera', icon: Camera, bg: 'bg-rose-500 hover:bg-rose-600' },
    { id: 'audio', label: 'Audio', icon: Mic, bg: 'bg-amber-500 hover:bg-amber-600' },
    { id: 'location', label: 'Location', icon: MapPin, bg: 'bg-emerald-500 hover:bg-emerald-600' },
    { id: 'contact', label: 'Contact', icon: User, bg: 'bg-blue-500 hover:bg-blue-600' },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-16 left-4 z-40 p-3 bg-white dark:bg-[#233138] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#2a3942] animate-pop-in grid grid-cols-3 gap-3 w-72"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              onSelectOption(item.id as any);
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-all group"
          >
            <div className={`w-12 h-12 rounded-full ${item.bg} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-[#54656f] dark:text-[#d1d7db] text-center leading-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
