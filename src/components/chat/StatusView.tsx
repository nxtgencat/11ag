import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../common/Avatar';
import { Plus, X, Image as ImageIcon, Type, Send } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface StatusItem {
  id: string;
  name: string;
  avatar: string;
  time: string;
  text?: string;
  img?: string;
  videoUrl?: string;
}

const timeAgo = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const StatusView: React.FC = () => {
  const { user } = useAuth();
  const { contacts } = useChat();
  const [activeStory, setActiveStory] = useState<StatusItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusMedia, setStatusMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [myStatuses, setMyStatuses] = useState<StatusItem[]>(() => {
    try {
      const saved = localStorage.getItem('wa_my_statuses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wa_my_statuses', JSON.stringify(myStatuses));
    } catch {
      // Ignore
    }
  }, [myStatuses]);

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

  const handleMediaSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setStatusMedia({
      url: URL.createObjectURL(file),
      type: isVideo ? 'video' : 'image',
    });
    e.target.value = '';
  };

  const handlePostStatus = () => {
    if (!statusText.trim() && !statusMedia) return;
    const newStatus: StatusItem = {
      id: generateId('status'),
      name: user?.name || 'Me',
      avatar: user?.avatar || '',
      time: timeAgo(),
      text: statusText.trim() || undefined,
      img: statusMedia?.type === 'image' ? statusMedia.url : undefined,
      videoUrl: statusMedia?.type === 'video' ? statusMedia.url : undefined,
    };
    setMyStatuses((prev) => [newStatus, ...prev]);
    setStatusText('');
    setStatusMedia(null);
    setIsUploadOpen(false);
  };

  const handleMyStatusClick = () => {
    if (myStatuses.length > 0) {
      setActiveStory(myStatuses[0]);
    } else {
      setIsUploadOpen(true);
    }
  };

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
        <div
          onClick={handleMyStatusClick}
          className={`card flex items-center gap-3.5 cursor-pointer transition-colors ${
            myStatuses.length > 0 ? 'hover:border-cobalt' : 'hover:border-cobalt'
          }`}
        >
          <div className="relative">
            <div className={`rounded-full ${myStatuses.length > 0 ? 'ring-2 ring-cobalt ring-offset-2 ring-offset-surface dark:ring-offset-surfacedark' : ''}`}>
              <Avatar
                src={user?.avatar}
                name={user?.name || 'Me'}
                size="lg"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUploadOpen(true);
              }}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cobalt text-white flex items-center justify-center ring-2 ring-surface dark:ring-surfacedark shadow-xs hover:bg-cobalt-dark transition-colors"
              title="Add status update"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-medium text-xs text-ink dark:text-paperdark">
              My Status
            </h4>
            <p className="font-mono text-[11px] text-slate dark:text-slatedark mt-0.5">
              {myStatuses.length > 0
                ? `${myStatuses.length} update${myStatuses.length > 1 ? 's' : ''} · tap to view`
                : 'Click to add status update'}
            </p>
          </div>
        </div>

        {/* My Status Updates List */}
        {myStatuses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="mini-tag">MY STATUS</span>
              <span className="font-mono text-[10px] text-slate dark:text-slatedark">{myStatuses.length} updates</span>
            </div>

            <div className="space-y-2">
              {myStatuses.map((story) => (
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
                      {story.text || (story.videoUrl ? '🎥 Video update' : '📷 Photo update')}
                    </h5>
                    <p className="font-mono text-[10px] text-slate dark:text-slatedark mt-0.5">
                      Today at {story.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

      {/* Status Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 dark:bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md card p-0 overflow-hidden flex flex-col animate-pop-in">
            <div className="flex items-center justify-between p-4 border-b border-line dark:border-linedark">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-semibold text-sm text-ink dark:text-paperdark">
                  Add Status Update
                </h4>
                <span className="mini-tag font-mono text-[10px]">24H</span>
              </div>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setStatusText('');
                  setStatusMedia(null);
                }}
                className="btn-icon w-8 h-8"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Media preview / picker */}
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaSelected}
                className="hidden"
              />

              {statusMedia ? (
                <div className="relative rounded-xl overflow-hidden bg-ink/10 flex items-center justify-center max-h-64">
                  {statusMedia.type === 'video' ? (
                    <video src={statusMedia.url} controls className="max-h-64 w-full object-contain" />
                  ) : (
                    <img src={statusMedia.url} alt="Status preview" className="max-h-64 w-full object-contain" />
                  )}
                  <button
                    onClick={() => setStatusMedia(null)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Remove media"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => mediaInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-line dark:border-linedark hover:border-cobalt text-slate dark:text-slatedark hover:text-cobalt transition-colors"
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs font-medium">Add photo or video</span>
                </button>
              )}

              {/* Text update */}
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate dark:text-slatedark shrink-0" />
                <textarea
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="Write a text update…"
                  rows={2}
                  className="field py-2 text-sm flex-1 resize-none"
                />
              </div>

              <button
                onClick={handlePostStatus}
                disabled={!statusText.trim() && !statusMedia}
                className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>Post Status</span>
                <Send className="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
              {activeStory.videoUrl ? (
                <video
                  src={activeStory.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : activeStory.img ? (
                <img src={activeStory.img} alt="Story" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6">
                  <p className="text-lg font-display font-semibold text-center leading-relaxed">
                    {activeStory.text}
                  </p>
                </div>
              )}
              {activeStory.text && (activeStory.img || activeStory.videoUrl) && (
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