import React, { useState } from 'react';
import { BadgeCheck } from 'lucide-react';

export const ChannelsView: React.FC = () => {
  const [following, setFollowing] = useState<string[]>(['1']);

  const channels = [
    {
      id: '1',
      name: 'WhatsApp Official',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      followers: '142M followers',
      desc: 'Get the latest updates, feature announcements and tips directly from the team.',
    },
    {
      id: '2',
      name: 'TechCrunch',
      avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&auto=format&fit=crop&q=80',
      followers: '8.4M followers',
      desc: 'Breaking tech news, startup analysis, and Silicon Valley updates.',
    },
    {
      id: '3',
      name: 'National Geographic',
      avatar: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150&auto=format&fit=crop&q=80',
      followers: '19.2M followers',
      desc: 'Inspiring people to care about the planet through science and exploration.',
    },
  ];

  const toggleFollow = (id: string) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222d34] overflow-y-auto select-none">
      <div className="p-4 border-b border-[#f0f2f5] dark:border-[#202c33] bg-[#f0f2f5] dark:bg-[#202c33]">
        <h2 className="font-bold text-lg text-[#111b21] dark:text-[#e9edef]">Channels</h2>
        <p className="text-xs text-[#8696a0] mt-0.5">Stay updated on topics you care about</p>
      </div>

      <div className="p-3 divide-y divide-[#f0f2f5] dark:divide-[#202c33]">
        {channels.map((channel) => {
          const isFollowed = following.includes(channel.id);
          return (
            <div key={channel.id} className="py-3 px-2 flex items-start gap-3">
              <img src={channel.avatar} alt={channel.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
                    {channel.name}
                  </h4>
                  <BadgeCheck className="w-4 h-4 text-wa-green fill-wa-green/20 shrink-0" />
                </div>
                <p className="text-[11px] text-[#8696a0]">{channel.followers}</p>
                <p className="text-xs text-[#667781] dark:text-[#8696a0] mt-1 line-clamp-2">
                  {channel.desc}
                </p>
              </div>
              <button
                onClick={() => toggleFollow(channel.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  isFollowed
                    ? 'bg-wa-green/15 text-wa-green-deep dark:text-wa-green'
                    : 'bg-wa-green-deep text-white hover:bg-wa-green-teal'
                }`}
              >
                {isFollowed ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
