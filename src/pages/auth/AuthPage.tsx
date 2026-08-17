import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PhoneLogin } from '../../components/auth/PhoneLogin';
import { OtpVerification } from '../../components/auth/OtpVerification';
import { ProfileSetup } from '../../components/auth/ProfileSetup';
import { Lock } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { authStep } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#f0f2f5] dark:bg-[#0c1317] relative select-none">
      {/* WhatsApp Green Top Banner background decoration */}
      <div className="absolute top-0 inset-x-0 h-48 bg-wa-green-deep dark:bg-[#00a884]/20 z-0" />

      {/* Main Auth Card Container */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Top Branding */}
        <div className="flex items-center gap-2 text-white font-semibold text-sm mb-6 drop-shadow-xs">
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.83.81 2.796.81 3.183 0 5.769-2.587 5.77-5.767 0-3.18-2.587-5.765-5.77-5.765zm0-2.172c4.382 0 7.938 3.555 7.939 7.937 0 4.381-3.557 7.938-7.939 7.938-1.332 0-2.593-.341-3.708-.952l-5.323 1.396 1.423-5.197c-.694-1.183-1.07-2.544-1.07-3.985 0-4.382 3.556-7.937 7.938-7.937z"/>
          </svg>
          <span className="tracking-wide">WHATSAPP WEB</span>
        </div>

        {/* Dynamic Auth Steps */}
        {authStep === 'phone' && <PhoneLogin />}
        {authStep === 'otp' && <OtpVerification />}
        {authStep === 'profile' && <ProfileSetup />}

        {/* Footer */}
        <div className="mt-8 flex items-center gap-2 text-xs text-[#667781] dark:text-[#8696a0]">
          <Lock className="w-3.5 h-3.5" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};
