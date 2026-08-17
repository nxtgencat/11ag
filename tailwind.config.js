/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: '#F6F5F1',
        surface: '#FFFFFF',
        ink: '#1B1D22',
        slate: '#666B75',
        line: '#E4E2DC',
        cobalt: { DEFAULT: '#2A4CDB', dark: '#1E39B0', light: '#6C86FF' },
        amber: { DEFAULT: '#E8A33D', light: '#F0B65C' },
        mint: { DEFAULT: '#1F9D66', light: '#3DBE86' },
        rose: { DEFAULT: '#D64545', light: '#F16565' },
        inkdark: '#14161A',
        surfacedark: '#1D2027',
        linedark: '#2C2F37',
        slatedark: '#9A9EA8',
        paperdark: '#F1F0EC',

        // WhatsApp / Tearline bridge tokens
        wa: {
          green: '#1F9D66',
          'green-dark': '#157c4f',
          'green-light': '#3DBE86',
          'green-deep': '#1B1D22',
          'green-teal': '#2A4CDB',
          blue: '#2A4CDB',
          'blue-tick': '#2A4CDB',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px'
      },
      boxShadow: {
        xs: '0 1px 2px rgba(27,29,34,0.05)',
        sm: '0 2px 10px rgba(27,29,34,0.06)',
        md: '0 10px 30px rgba(27,29,34,0.08)',
        lg: '0 20px 50px rgba(27,29,34,0.14)',
        glow: '0 0 0 4px rgba(42,76,219,0.15)',
        'wa-dropdown': '0 10px 30px rgba(27,29,34,0.08)',
        'wa-modal': '0 20px 50px rgba(27,29,34,0.14)',
        'wa-bubble': '0 1px 2px rgba(27,29,34,0.05)',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        floatSlow: { '0%,100%': { transform: 'translateY(0) rotate(-2deg)' }, '50%': { transform: 'translateY(-8px) rotate(-1deg)' } },
        stripes: { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '28px 0' } },
        popIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .5s cubic-bezier(.16,1,.3,1) both',
        shimmer: 'shimmer 1.6s infinite linear',
        floatSlow: 'floatSlow 5s ease-in-out infinite',
        stripes: 'stripes 1s linear infinite',
        'pop-in': 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
};
