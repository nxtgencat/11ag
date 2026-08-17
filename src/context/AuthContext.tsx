import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

export type AuthStep = 'phone' | 'otp' | 'profile' | 'authenticated';

interface AuthContextType {
  user: UserProfile | null;
  authStep: AuthStep;
  tempPhone: string;
  tempCountryCode: string;
  loginWithPhone: (countryCode: string, phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  completeProfileSetup: (name: string, about: string, avatar: string) => void;
  logout: () => void;
  resendOtp: () => void;
  resendCountdown: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'me',
  name: 'Alex Morgan',
  phone: '+1 (555) 019-2834',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  about: 'Available | Building cool things 🚀',
  countryCode: 'US',
  isLoggedIn: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('wa_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [authStep, setAuthStep] = useState<AuthStep>(() => {
    try {
      const saved = localStorage.getItem('wa_user_profile');
      return saved ? 'authenticated' : 'authenticated'; // Default directly into authenticated for convenience, or can test login
    } catch {
      return 'authenticated';
    }
  });

  const [tempPhone, setTempPhone] = useState('');
  const [tempCountryCode, setTempCountryCode] = useState('US');
  const [resendCountdown, setResendCountdown] = useState(30);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wa_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('wa_user_profile');
    }
  }, [user]);

  useEffect(() => {
    let interval: number | undefined;
    if (authStep === 'otp' && resendCountdown > 0) {
      interval = window.setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, resendCountdown]);

  const loginWithPhone = async (countryCode: string, phone: string): Promise<boolean> => {
    setTempCountryCode(countryCode);
    setTempPhone(phone);
    setResendCountdown(30);
    setAuthStep('otp');
    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (otp.length === 6) {
      setAuthStep('profile');
      return true;
    }
    return false;
  };

  const completeProfileSetup = (name: string, about: string, avatar: string) => {
    const newUser: UserProfile = {
      id: 'me',
      name: name.trim() || 'My WhatsApp',
      phone: `${tempCountryCode} ${tempPhone}`.trim() || '+1 (555) 019-2834',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      about: about.trim() || 'Hey there! I am using WhatsApp.',
      countryCode: tempCountryCode || 'US',
      isLoggedIn: true,
    };
    setUser(newUser);
    setAuthStep('authenticated');
  };

  const logout = () => {
    setUser(null);
    setAuthStep('phone');
    setTempPhone('');
  };

  const resendOtp = () => {
    setResendCountdown(30);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStep,
        tempPhone,
        tempCountryCode,
        loginWithPhone,
        verifyOtp,
        completeProfileSetup,
        logout,
        resendOtp,
        resendCountdown,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
