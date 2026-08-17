import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export const OtpVerification: React.FC = () => {
  const { verifyOtp, tempCountryCode, tempPhone, resendOtp, resendCountdown, logout } = useAuth();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (error) setError('');
    const cleanVal = value.replace(/\D/g, '');

    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Handle single digit
    if (cleanVal.length === 1) {
      const newDigits = [...digits];
      newDigits[index] = cleanVal;
      setDigits(newDigits);

      // Auto advance
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if all 6 are filled
      if (index === 5 || newDigits.every(d => d !== '')) {
        handleComplete(newDigits.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      const newDigits = pasteData.split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      handleComplete(pasteData);
    }
  };

  const handleComplete = async (code: string) => {
    setIsVerifying(true);
    setTimeout(async () => {
      const success = await verifyOtp(code);
      if (!success) {
        setError('Invalid verification code. Please check and try again.');
        setIsVerifying(false);
      }
    }, 800);
  };

  const handleFillDemo = () => {
    const demo = ['1', '2', '3', '4', '5', '6'];
    setDigits(demo);
    handleComplete('123456');
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] p-8 text-center animate-pop-in">
      {/* Top back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={logout}
          className="p-1.5 rounded-full text-[#667781] hover:bg-[#f0f2f5] dark:hover:bg-[#202c33] transition-colors"
          title="Change phone number"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-wa-green uppercase tracking-wider">
          Step 2 of 3
        </span>
        <div className="w-5" />
      </div>

      <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef] mb-2">
        Verifying your number
      </h2>
      <p className="text-xs sm:text-sm text-[#667781] dark:text-[#8696a0] mb-2">
        Waiting to automatically detect an SMS sent to:
      </p>
      <p className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef] mb-6">
        {tempCountryCode} {tempPhone || '+1 (555) 019-2834'}{' '}
        <button
          onClick={logout}
          className="text-wa-green hover:underline text-xs ml-1 font-normal"
        >
          Wrong number?
        </button>
      </p>

      {/* 6 OTP Boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 my-6" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl bg-[#f0f2f5] dark:bg-[#202c33] border ${
              digit
                ? 'border-wa-green text-wa-green-deep dark:text-wa-green'
                : 'border-[#e9edef] dark:border-[#2a3942] text-[#111b21] dark:text-[#e9edef]'
            } focus:border-wa-green focus:ring-2 focus:ring-wa-green/30 outline-none transition-all`}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      {/* Resend OTP */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={resendOtp}
          disabled={resendCountdown > 0}
          className="inline-flex items-center justify-center gap-1.5 text-xs text-[#667781] dark:text-[#8696a0] hover:text-wa-green disabled:opacity-60 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resendCountdown > 0 ? '' : 'animate-spin'}`} />
          {resendCountdown > 0 ? (
            <span>Resend code in <strong className="font-mono">{resendCountdown}s</strong></span>
          ) : (
            <span>Resend SMS code</span>
          )}
        </button>

        {/* Demo auto-fill shortcut */}
        <button
          type="button"
          onClick={handleFillDemo}
          disabled={isVerifying}
          className="mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/30 text-wa-green text-xs font-semibold rounded-xl border border-wa-green/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto-fill Demo Code (123456)</span>
        </button>
      </div>

      {isVerifying && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-wa-green animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          <span>Verifying code...</span>
        </div>
      )}
    </div>
  );
};
