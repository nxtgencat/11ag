import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
  wallpaper: string;
  setWallpaper: (wp: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('wa_theme_mode') as ThemeMode;
      return saved || 'dark'; // Default to dark mode for sleek modern WhatsApp Web look
    } catch {
      return 'dark';
    }
  });

  const [wallpaper, setWallpaper] = useState<string>(() => {
    try {
      return localStorage.getItem('wa_wallpaper') || 'doodle';
    } catch {
      return 'doodle';
    }
  });

  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem('wa_theme_mode', theme);
    } catch {
      // Ignore
    }

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let activeDark = false;
      if (theme === 'dark') {
        activeDark = true;
      } else if (theme === 'light') {
        activeDark = false;
      } else {
        activeDark = mediaQuery.matches;
      }

      setIsDark(activeDark);
      if (activeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('wa_wallpaper', wallpaper);
    } catch {
      // Ignore
    }
  }, [wallpaper]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        wallpaper,
        setWallpaper,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
