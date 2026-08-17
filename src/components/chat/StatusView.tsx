import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../common/Avatar';
import { Plus, X } from 'lucide-react';

export const StatusView: React.FC = () => {
  const { user } = useAuth();
  const { contacts } = useChat();
  const [activeStory, setActiveStory] = useState<{ name: string; avatar: string; time: string; text?: string; img?: string } | null>(null);

  const mockStories = [
    {
      id: '1',
      name: 'Sarah Jenkins',
      avatar: contacts[0]?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      time: '15 minutes ago',
      text: 'Exploring the new design system! 🎨',
      img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      name: 'David Chen',
      avatar: contacts[1]?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      time: '1 hour ago',
      text: 'Morning coffee & code ☕',
      img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      name: 'Emily Watson',
      avatar: contacts[2]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      time: '3 hours ago',
      text: 'Team lunch at the bistro! 🥗',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-paper dark:bg-inkdark border-r border-line dark:border-linedark overflow-y-auto select-none transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-line dark:border-linedark bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paperdark tracking-tight">
              Status Stories
            </h2>
            <span className="ticket-tag text-[9px] py-0 px-2 font-mono">24H</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* My Status Card */}
        <div className="card flex items-center gap-3.5 cursor-pointer hover:border-cobalt transition-colors">
          <div className="relative">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Me'}
              size="lg"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cobalt text-white flex items-center justify-center ring-2 ring-surface dark:ring-surfacedark shadow-xs">
              <Plus className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-medium text-xs text-ink dark:text-paperdark">
              My Status
            </h4>
            <p className="font-mono text-[11px] text-slate dark:text-slatedark mt-0.5">
              Click to add status update
            </p>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="mini-tag">RECENT UPDATES</span>
            <span className="font-mono text-[10px] text-slate dark:text-slatedark">{mockStories.length} stories</span>
          </div>

          <div className="space-y-2">
            {mockStories.map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="card p-3 flex items-center gap-3.5 cursor-pointer hover:border-cobalt transition-all group"
              >
                <div className="p-0.5 rounded-full ring-2 ring-cobalt ring-offset-2 ring-offset-paper dark:ring-offset-inkdark">
                  <Avatar
                    src={story.avatar}
                    name={story.name}
                    size="md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-display font-medium text-xs text-ink dark:text-paperdark group-hover:text-cobalt transition-colors">
                    {story.name}
                  </h5>
                  <p className="font-mono text-[10px] text-slate dark:text-slatedark mt-0.5">
                    {story.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 dark:bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm card p-0 overflow-hidden shadow-2xl relative animate-pop-in">
            {/* Story Progress Bar */}
            <div className="h-1 bg-white/20 w-full">
              <div className="h-full bg-cobalt w-full animate-[shimmer_5s_linear]" />
            </div>

            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-line dark:border-linedark">
              <div className="flex items-center gap-2.5">
                <img src={activeStory.avatar} alt={activeStory.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h4 className="font-display font-semibold text-xs text-ink dark:text-paperdark">{activeStory.name}</h4>
                  <p className="font-mono text-[10px] text-slate">{activeStory.time}</p>
                </div>
              </div>
              <button onClick={() => setActiveStory(null)} className="btn-icon w-7 h-7">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Media */}
            <div className="h-72 bg-ink/10 relative flex items-center justify-center">
              <img src={activeStory.img} alt="Story" className="w-full h-full object-cover" />
              {activeStory.text && (
                <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-ink/75 backdrop-blur-md text-white text-xs font-medium text-center">
                  {activeStory.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
