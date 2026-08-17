import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../common/Avatar';
import { Plus, X } from 'lucide-react';

export const StatusView: React.FC = () => {
  const { user } = useAuth();
  const { contacts } = useChat();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const statusContacts = contacts.filter((c) => !c.isGroup).slice(0, 8);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222d34] overflow-y-auto select-none">
      {/* Header */}
      <div className="p-4 border-b border-[#f0f2f5] dark:border-[#202c33] bg-[#f0f2f5] dark:bg-[#202c33]">
        <h2 className="font-bold text-lg text-[#111b21] dark:text-[#e9edef]">Status</h2>
      </div>

      {/* My Status */}
      <div className="p-4 flex items-center gap-3 border-b border-[#f0f2f5] dark:border-[#202c33] hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer">
        <div className="relative">
          <Avatar src={user?.avatar} name={user?.name || 'Me'} size="lg" />
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-wa-green text-white flex items-center justify-center border-2 border-white dark:border-[#111b21]">
            <Plus className="w-3.5 h-3.5 stroke-3" />
          </span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef]">My status</h4>
          <p className="text-xs text-[#8696a0]">Click to add status update</p>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="p-3">
        <span className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider block px-2 mb-2">
          Recent updates
        </span>

        <div className="space-y-1">
          {statusContacts.map((contact, idx) => (
            <div
              key={contact.id}
              onClick={() => setActiveStoryIndex(idx)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              {/* Green status circle ring */}
              <div className="p-0.5 rounded-full ring-2 ring-wa-green ring-offset-2 ring-offset-white dark:ring-offset-[#111b21]">
                <Avatar src={contact.avatar} name={contact.name} size="md" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                  {contact.name}
                </h4>
                <p className="text-xs text-[#8696a0]">Today at 9:15 AM</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white animate-fade-in">
          <button
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Progress bar */}
          <div className="absolute top-4 inset-x-8 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white w-2/3 animate-pulse" />
          </div>

          <div className="flex flex-col items-center max-w-sm text-center">
            <Avatar
              src={statusContacts[activeStoryIndex]?.avatar}
              name={statusContacts[activeStoryIndex]?.name || ''}
              size="2xl"
              className="mb-4 border-4 border-wa-green"
            />
            <h3 className="text-xl font-bold">{statusContacts[activeStoryIndex]?.name}</h3>
            <p className="text-sm text-white/70 mt-1">Today at 9:15 AM</p>
            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-lg font-medium">"{statusContacts[activeStoryIndex]?.about}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
