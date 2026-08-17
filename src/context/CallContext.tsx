import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveCall, Contact } from '../types';

interface CallContextType {
  activeCall: ActiveCall | null;
  startCall: (contact: Contact, type: 'voice' | 'video') => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideoMute: () => void;
  toggleSpeaker: () => void;
  callDuration: number; // in seconds
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);

  useEffect(() => {
    let timer: number | undefined;
    if (activeCall && activeCall.status === 'connected') {
      timer = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCall]);

  const startCall = (contact: Contact, type: 'voice' | 'video') => {
    setCallDuration(0);
    setActiveCall({
      contact,
      type,
      status: 'calling',
      isMuted: false,
      isVideoMuted: false,
      isSpeakerOn: true,
    });

    // Simulate connection after 2.5s
    setTimeout(() => {
      setActiveCall(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'connected',
          startedAt: new Date(),
        };
      });
    }, 2500);
  };

  const endCall = () => {
    setActiveCall(prev => (prev ? { ...prev, status: 'ended' } : null));
    setTimeout(() => {
      setActiveCall(null);
      setCallDuration(0);
    }, 800);
  };

  const toggleMute = () => {
    setActiveCall(prev => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleVideoMute = () => {
    setActiveCall(prev => (prev ? { ...prev, isVideoMuted: !prev.isVideoMuted } : null));
  };

  const toggleSpeaker = () => {
    setActiveCall(prev => (prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null));
  };

  return (
    <CallContext.Provider
      value={{
        activeCall,
        startCall,
        endCall,
        toggleMute,
        toggleVideoMute,
        toggleSpeaker,
        callDuration,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
