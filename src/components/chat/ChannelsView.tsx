import React, { useState } from 'react';
import { BadgeCheck } from 'lucide-react';

export const ChannelsView: React.FC = () => {
  const [following, setFollowing] = useState<string[]>(['1']);

  const channels = [
    {
      id: '1',
      name: 'WhatsApp Official',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      followers: '154.2M followers',
      description: 'The official channel for product updates, security tips, and announcements.',
      verified: true,
      lastPost: 'Explore our latest Tearline component integration with seamless desktop & mobile experiences.',
      time: '2h ago',
    },
    {
      id: '2',
      name: 'Tech & Architecture Daily',
      avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
      followers: '28.4M followers',
      description: 'Curated engineering articles, system designs, and frontend deep-dives.',
      verified: true,
      lastPost: 'Why modular state architectures outperform monolith providers in React 18 apps.',
      time: '5h ago',
    },
    {
      id: '3',
      name: 'Design Digest',
      avatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
      followers: '9.8M followers',
      description: 'UI/UX inspiration, typography pairings, and interaction design patterns.',
      verified: true,
      lastPost: 'Space Grotesk + IBM Plex Mono: The definitive industrial aesthetic pairing.',
      time: 'Yesterday',
    },
  ];

  const toggleFollow = (id: string) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full bg-paper dark:bg-inkdark border-r border-line dark:border-linedark overflow-y-auto select-none transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-line dark:border-linedark bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paperdark tracking-tight">
              Channels
            </h2>
            <span className="ticket-tag text-[9px] py-0 px-2 font-mono">FEED</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="mini-tag">DISCOVER BROADCASTS</span>
          <span className="font-mono text-[10px] text-slate dark:text-slatedark">{channels.length} channels</span>
        </div>

        <div className="space-y-3">
          {channels.map((channel) => {
            const isFollowed = following.includes(channel.id);
            return (
              <div
                key={channel.id}
                className="card p-4 space-y-3 hover:border-cobalt transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-semibold text-xs text-ink dark:text-paperdark">
                          {channel.name}
                        </h4>
                        {channel.verified && (
                          <BadgeCheck className="w-3.5 h-3.5 fill-cobalt text-white" />
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-slate dark:text-slatedark mt-0.5">
                        {channel.followers}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(channel.id)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                      isFollowed
                        ? 'border border-line dark:border-linedark text-slate dark:text-slatedark'
                        : 'bg-cobalt text-white hover:bg-cobalt-dark shadow-xs'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>

                <p className="text-xs text-slate dark:text-slatedark leading-relaxed">
                  {channel.description}
                </p>

                {/* Latest Broadcast Message */}
                <div className="p-2.5 rounded-lg bg-paper dark:bg-inkdark border border-line dark:border-linedark space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate">
                    <span className="text-cobalt dark:text-cobalt-light font-semibold">LATEST UPDATE</span>
                    <span>{channel.time}</span>
                  </div>
                  <p className="text-xs text-ink dark:text-paperdark">
                    {channel.lastPost}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
