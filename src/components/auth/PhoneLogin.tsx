import React, { useState, useMemo } from 'react';
import { COUNTRIES } from '../../data/countries';
import { ChevronDown, Search, ArrowRight, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PhoneLogin: React.FC = () => {
  const { loginWithPhone } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const q = countrySearch.toLowerCase();
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setIsLoading(true);
    await loginWithPhone(selectedCountry.dialCode, phoneNumber);
    setIsLoading(false);
  };

  return (
    <div className="card shadow-lg p-6 sm:p-8 text-center animate-pop-in relative">
      {/* Brand Icon */}
      <div className="w-12 h-12 rounded-xl bg-cobalt/15 text-cobalt dark:text-cobalt-light grid place-content-center mx-auto mb-4">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.83.81 2.796.81 3.183 0 5.769-2.587 5.77-5.767 0-3.18-2.587-5.765-5.77-5.765zm0-2.172c4.382 0 7.938 3.555 7.939 7.937 0 4.381-3.557 7.938-7.939 7.938-1.332 0-2.593-.341-3.708-.952l-5.323 1.396 1.423-5.197c-.694-1.183-1.07-2.544-1.07-3.985 0-4.382 3.556-7.937 7.938-7.937z"/>
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 ticket-tag text-[10px] py-0.5 px-2 mb-2 font-mono">
        <Ticket className="w-3 h-3 text-cobalt" />
        <span>AUTHENTICATION</span>
      </div>

      <h2 className="font-display font-bold text-xl text-ink dark:text-paperdark tracking-tight">
        Enter Your Phone Number
      </h2>
      <p className="text-xs text-slate dark:text-slatedark mt-1 max-w-xs mx-auto">
        WhatsApp will send an SMS to verify your account.
      </p>

      {error && (
        <div className="mt-4 p-2.5 rounded-lg bg-rose/10 border border-rose/20 text-rose text-xs font-medium animate-pop-in">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        {/* Country Selector */}
        <div>
          <label className="mini-tag block mb-1">COUNTRY / REGION</label>
          <button
            type="button"
            onClick={() => setIsCountryModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-line dark:border-linedark bg-surface dark:bg-surfacedark text-sm hover:border-ink dark:hover:border-paperdark transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-medium text-ink dark:text-paperdark truncate">{selectedCountry.name}</span>
            </div>
            <div className="flex items-center gap-1 text-slate font-mono text-xs">
              <span>{selectedCountry.dialCode}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Phone Number Input Group */}
        <div>
          <label className="mini-tag block mb-1">PHONE NUMBER</label>
          <div className="flex rounded-lg border border-line dark:border-linedark overflow-hidden focus-within:border-cobalt focus-within:shadow-glow transition-all">
            <span className="px-3.5 py-2.5 bg-paper dark:bg-inkdark border-r border-line dark:border-linedark text-xs font-mono font-semibold text-ink dark:text-paperdark flex items-center">
              {selectedCountry.dialCode}
            </span>
            <input
              type="tel"
              placeholder="(555) 019-2834"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-surface dark:bg-surfacedark text-sm font-mono text-ink dark:text-paperdark placeholder:text-slate/60 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-6"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Country Selection Modal */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm card p-0 overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-pop-in">
            <div className="p-4 border-b border-line dark:border-linedark flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm">Select Country</h3>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="btn-icon w-7 h-7"
              >
                ✕
              </button>
            </div>

            {/* Search Country */}
            <div className="p-3 border-b border-line dark:border-linedark">
              <div className="relative">
                <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search countries…"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="field py-1.5 pl-9 text-xs"
                  autoFocus
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="flex-1 overflow-y-auto divide-y divide-line/40 dark:divide-linedark/40 p-1">
              {filteredCountries.map((c) => (
                <button
                  key={`${c.code}-${c.dialCode}`}
                  onClick={() => {
                    setSelectedCountry(c);
                    setIsCountryModalOpen(false);
                    setCountrySearch('');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-ink/5 dark:hover:bg-white/5 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-xs font-medium">{c.name}</span>
                  </div>
                  <span className="font-mono text-xs text-slate dark:text-slatedark">
                    {c.dialCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
