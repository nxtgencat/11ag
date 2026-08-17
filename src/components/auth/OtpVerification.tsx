import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, RefreshCw, KeyRound, Ticket } from 'lucide-react';

export const OtpVerification: React.FC = () => {
  const { tempPhone, tempCountryCode, verifyOtp, setAuthStep, resendCountdown, resendOtp } = useAuth() as any;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || otp.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    setError('');
    setIsLoading(true);
    const success = await verifyOtp(fullCode);
    setIsLoading(false);
    if (!success) {
      setError('Invalid code. For testing, use demo code: 123456');
    }
  };

  const handleAutoFillDemo = () => {
    const demo = ['1', '2', '3', '4', '5', '6'];
    setOtp(demo);
    setError('');
    handleVerify('123456');
  };

  return (
    <div className="card shadow-lg p-6 sm:p-8 text-center animate-pop-in relative">
      {/* Back Button */}
      <button
        onClick={() => setAuthStep?.('phone')}
        className="btn-icon w-8 h-8 absolute top-5 left-5"
        title="Back to phone number"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Header Badge */}
      <div className="w-12 h-12 rounded-xl bg-cobalt/15 text-cobalt dark:text-cobalt-light grid place-content-center mx-auto mb-4">
        <KeyRound className="w-6 h-6" />
      </div>

      <div className="inline-flex items-center gap-1.5 ticket-tag text-[10px] py-0.5 px-2 mb-2 font-mono">
        <Ticket className="w-3 h-3 text-cobalt" />
        <span>SMS PASSCODE</span>
      </div>

      <h2 className="font-display font-bold text-xl text-ink dark:text-paperdark tracking-tight">
        Verify Your Phone
      </h2>
      <p className="text-xs text-slate dark:text-slatedark mt-1 max-w-xs mx-auto">
        Code sent to <span className="font-mono font-semibold text-ink dark:text-paperdark">{tempCountryCode} {tempPhone || '+1 (555) 019-2834'}</span>
      </p>

      {/* Demo Code Helper Shortcut */}
      <div className="mt-4 p-3 rounded-lg bg-cobalt/5 border border-cobalt/20 flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] text-cobalt dark:text-cobalt-light font-medium">Demo Code: 123456</span>
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="text-xs font-semibold text-cobalt hover:underline"
        >
          Auto-fill
        </button>
      </div>

      {error && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose/10 border border-rose/20 text-rose text-xs font-medium animate-pop-in">
          {error}
        </div>
      )}

      {/* Tearline 3-dash-3 OTP Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="mt-6 space-y-6"
      >
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 select-none" onPaste={handlePaste}>
          {/* First 3 Digits */}
          {[0, 1, 2].map((idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 sm:w-11 h-12 text-center rounded-lg border border-line dark:border-linedark bg-surface dark:bg-surfacedark text-ink dark:text-paperdark text-base font-mono font-bold focus:border-cobalt focus:shadow-glow outline-none transition-all"
            />
          ))}

          {/* Tearline Dash Separator */}
          <span className="w-2 text-center text-slate font-mono font-bold">—</span>

          {/* Last 3 Digits */}
          {[3, 4, 5].map((idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 sm:w-11 h-12 text-center rounded-lg border border-line dark:border-linedark bg-surface dark:bg-surfacedark text-ink dark:text-paperdark text-base font-mono font-bold focus:border-cobalt focus:shadow-glow outline-none transition-all"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isLoading || otp.join('').length < 6}
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <span>Confirm & Continue</span>
          )}
        </button>

        {/* Resend Countdown */}
        <div className="pt-2">
          {resendCountdown > 0 ? (
            <p className="text-xs font-mono text-slate dark:text-slatedark">
              Resend code in <span className="font-semibold text-cobalt dark:text-cobalt-light">{resendCountdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={resendOtp}
              className="text-xs font-medium text-cobalt dark:text-cobalt-light hover:underline font-mono"
            >
              Didn't receive code? Resend SMS
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
