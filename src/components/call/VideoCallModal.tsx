import React from 'react';
import { useCall } from '../../context/CallContext';
import { formatSecondsToTimer } from '../../utils/formatters';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const VideoCallModal: React.FC = () => {
  const { activeCall, endCall, toggleMute, toggleVideoMute, callDuration } = useCall();
  const { user } = useAuth();

  if (!activeCall || activeCall.type !== 'video') return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none animate-fade-in">
      {/* Remote Video Stream Simulation */}
      <div className="absolute inset-0 z-0">
        {!activeCall.isVideoMuted ? (
          <img
            src={activeCall.contact.avatar}
            alt={activeCall.contact.name}
            className="w-full h-full object-cover filter blur-xs brightness-75 scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#111b21] flex items-center justify-center">
            <img
              src={activeCall.contact.avatar}
              alt={activeCall.contact.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
            />
          </div>
        )}
      </div>

      {/* Top Bar Info */}
      <div className="relative z-10 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-xl font-bold">{activeCall.contact.name}</h2>
          <p className="text-xs text-white/80 font-mono mt-0.5">
            {activeCall.status === 'calling' ? 'Calling...' : formatSecondsToTimer(callDuration)}
          </p>
        </div>
      </div>

      {/* Picture-in-Picture Local User Video Preview */}
      <div className="relative z-10 self-end mr-6 mb-24 w-32 sm:w-40 aspect-3/4 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl bg-[#202c33]">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
          alt="You"
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded font-medium">
          You
        </span>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 p-6 pb-10 flex items-center justify-center gap-6 bg-gradient-to-t from-black/90 to-transparent">
        {/* Toggle Video */}
        <button
          onClick={toggleVideoMute}
          className={`p-4 rounded-full transition-colors ${
            activeCall.isVideoMuted ? 'bg-rose-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          title="Toggle camera"
        >
          {activeCall.isVideoMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        {/* Toggle Mic */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-colors ${
            activeCall.isMuted ? 'bg-rose-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          title="Toggle microphone"
        >
          {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* End Video Call */}
        <button
          onClick={endCall}
          className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transform active:scale-95 transition-transform"
          title="End Video Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
