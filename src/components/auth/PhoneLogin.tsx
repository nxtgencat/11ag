import React, { useState, useMemo } from 'react';
import { COUNTRIES } from '../../data/countries';
import { ChevronDown, Search, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] p-8 text-center animate-pop-in">
      {/* WhatsApp Logo */}
      <div className="w-16 h-16 rounded-full bg-wa-green/15 text-wa-green flex items-center justify-center mx-auto mb-6">
        <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.83.81 2.796.81 3.183 0 5.769-2.587 5.77-5.767 0-3.18-2.587-5.765-5.77-5.765zm0-2.172c4.382 0 7.938 3.555 7.939 7.937 0 4.381-3.557 7.938-7.939 7.938-1.332 0-2.593-.341-3.708-.952l-5.323 1.396 1.423-5.197c-.694-1.183-1.07-2.544-1.07-3.985 0-4.382 3.556-7.937 7.938-7.937z"/>
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef] mb-2">
        Enter your phone number
      </h2>
      <p className="text-xs sm:text-sm text-[#667781] dark:text-[#8696a0] mb-8 leading-relaxed">
        WhatsApp will need to verify your account. Carrier SMS charges may apply.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Country Selector Trigger */}
        <div>
          <label className="block text-xs font-medium text-[#667781] dark:text-[#8696a0] mb-1">
            Country / Region
          </label>
          <button
            type="button"
            onClick={() => setIsCountryModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#f0f2f5] dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl text-sm font-medium hover:border-wa-green transition-colors"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="truncate">{selectedCountry.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[#667781] dark:text-[#8696a0]">
              <span className="font-mono">{selectedCountry.dialCode}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-xs font-medium text-[#667781] dark:text-[#8696a0] mb-1">
            Phone Number
          </label>
          <div className="flex items-center bg-[#f0f2f5] dark:bg-[#202c33] border border-[#e9edef] dark:border-[#2a3942] rounded-xl overflow-hidden focus-within:border-wa-green focus-within:ring-1 focus-within:ring-wa-green transition-all">
            <span className="px-3 text-sm font-mono font-medium text-[#667781] dark:text-[#8696a0] border-r border-[#e9edef] dark:border-[#2a3942]">
              {selectedCountry.dialCode}
            </span>
            <input
              type="tel"
              placeholder="e.g. 555 123 4567"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3 py-3 bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] outline-none"
              autoFocus
            />
          </div>
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-wa-green-deep hover:bg-wa-green-teal text-white font-medium rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <span>{isLoading ? 'Verifying...' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Security note */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#8696a0]">
        <ShieldCheck className="w-4 h-4 text-wa-green" />
        <span>End-to-end encrypted verification</span>
      </div>

      {/* Country Selection Modal */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#202c33] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#2a3942] overflow-hidden flex flex-col max-h-[80vh] animate-pop-in">
            <div className="p-4 border-b border-[#e9edef] dark:border-[#2a3942]">
              <h3 className="font-semibold mb-3">Choose a country</h3>
              <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#111b21] rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-[#8696a0] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#e9edef] dark:divide-[#2a3942]">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    setSelectedCountry(country);
                    setIsCountryModalOpen(false);
                    setCountrySearch('');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-sm font-medium">{country.name}</span>
                  </div>
                  <span className="text-sm font-mono text-[#8696a0]">
                    {country.dialCode}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-[#e9edef] dark:border-[#2a3942] text-center">
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="text-xs text-[#8696a0] hover:text-[#111b21] dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
