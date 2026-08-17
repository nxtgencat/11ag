import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PhoneLogin } from '../../components/auth/PhoneLogin';
import { OtpVerification } from '../../components/auth/OtpVerification';
import { ProfileSetup } from '../../components/auth/ProfileSetup';
import { ShieldCheck, Ticket } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { authStep } = useAuth();

  return (
    <div className="min-h-screen w-full bg-paper dark:bg-inkdark flex flex-col items-center justify-center p-4 relative overflow-hidden select-none transition-colors">
      {/* Decorative Tearline Floating Accent Cards */}
      <div className="absolute top-12 left-12 w-48 h-32 rounded-xl bg-cobalt/5 border border-cobalt/15 rotate-[-8deg] pointer-events-none hidden md:block" />
      <div className="absolute bottom-12 right-12 w-52 h-36 rounded-xl bg-amber/5 border border-amber/15 rotate-[6deg] pointer-events-none hidden md:block" />

      {/* Main Center Container */}
      <div className="w-full max-w-md z-10 space-y-6 animate-fade-in">
        {/* Tearline Brand Tile & Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-ink dark:bg-paperdark text-paper dark:text-inkdark grid place-content-center font-display font-bold text-xl rotate-[-4deg] shadow-md mb-4">
            W
          </div>

          <div className="inline-flex items-center gap-1.5 ticket-tag text-[10px] py-1 px-3 mb-3">
            <Ticket className="w-3 h-3 text-cobalt dark:text-cobalt-light" />
            <span>SESSION GATEWAY · VERIFIED</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-ink dark:text-paperdark tracking-tight">
            WhatsApp Messenger
          </h1>
          <p className="font-mono text-xs text-slate dark:text-slatedark mt-1">
            Tearline Component Architecture
          </p>
        </div>

        {/* Step Sub-Component Rendering */}
        {authStep === 'phone' && <PhoneLogin />}
        {authStep === 'otp' && <OtpVerification />}
        {authStep === 'profile' && <ProfileSetup />}

        {/* Footer Security Badge */}
        <div className="text-center flex items-center justify-center gap-2 text-slate dark:text-slatedark font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-mint" />
          <span>Protected by Signal Protocol Encryption</span>
        </div>
      </div>
    </div>
  );
};
