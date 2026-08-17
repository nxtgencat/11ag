import React from 'react';
import { useCall } from '../../context/CallContext';
import { Avatar } from '../common/Avatar';
import { formatSecondsToTimer } from '../../utils/formatters';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Video } from 'lucide-react';

export const VoiceCallModal: React.FC = () => {
  const { activeCall, endCall, toggleMute, toggleSpeaker, callDuration, startCall } = useCall();

  if (!activeCall || activeCall.type !== 'voice') return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#111b21]/98 text-white backdrop-blur-md animate-fade-in select-none">
      {/* Top Status */}
      <div className="text-center pt-8">
        <span className="text-xs uppercase tracking-widest text-wa-green font-semibold">
          WhatsApp Audio Call
        </span>
        <h2 className="text-2xl font-bold mt-2">{activeCall.contact.name}</h2>
        <p className="text-sm text-white/70 font-mono mt-1">
          {activeCall.status === 'calling'
            ? 'Ringing...'
            : formatSecondsToTimer(callDuration)}
        </p>
      </div>

      {/* Center Avatar with pulsating sound wave rings */}
      <div className="relative flex items-center justify-center my-auto">
        {activeCall.status === 'connected' && (
          <>
            <div className="absolute w-44 h-44 rounded-full bg-wa-green/10 animate-ping" />
            <div className="absolute w-36 h-36 rounded-full bg-wa-green/20" />
          </>
        )}
        <Avatar
          src={activeCall.contact.avatar}
          name={activeCall.contact.name}
          size="2xl"
          className="relative z-10 shadow-2xl border-4 border-white/20"
        />
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full max-w-sm flex items-center justify-around pb-8">
        {/* Speaker */}
        <button
          onClick={toggleSpeaker}
          className={`p-4 rounded-full transition-colors ${
            activeCall.isSpeakerOn ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
          }`}
          title="Speaker"
        >
          {activeCall.isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        {/* Switch to Video */}
        <button
          onClick={() => startCall(activeCall.contact, 'video')}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Switch to Video"
        >
          <Video className="w-6 h-6" />
        </button>

        {/* Mute */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-colors ${
            activeCall.isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-white'
          }`}
          title="Mute microphone"
        >
          {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={endCall}
          className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transform active:scale-95 transition-transform"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
