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
        wa: {
          // Primary Brand
          green: '#25D366',
          'green-dark': '#00a884',
          'green-light': '#25d366',
          'green-deep': '#008069',
          'green-teal': '#128c7e',
          
          // Light Mode Palette
          'light-bg': '#efeae2',
          'light-panel': '#ffffff',
          'light-header': '#f0f2f5',
          'light-border': '#e9edef',
          'light-input': '#ffffff',
          'light-hover': '#f5f6f6',
          'light-outgoing': '#d9fdd3',
          'light-incoming': '#ffffff',
          'light-text-primary': '#111b21',
          'light-text-secondary': '#667781',
          'light-text-muted': '#8696a0',
          'light-badge': '#25d366',
          'light-icon': '#54656f',
          
          // Dark Mode Palette
          'dark-bg': '#0c1317',
          'dark-panel': '#111b21',
          'dark-header': '#202c33',
          'dark-subtle': '#182229',
          'dark-border': '#222d34',
          'dark-input': '#2a3942',
          'dark-hover': '#202c33',
          'dark-outgoing': '#005c4b',
          'dark-incoming': '#202c33',
          'dark-text-primary': '#e9edef',
          'dark-text-secondary': '#8696a0',
          'dark-text-muted': '#667781',
          'dark-badge': '#00a884',
          'dark-icon': '#aebac1',

          // Common Status Colors
          blue: '#53bdeb',
          'blue-tick': '#53bdeb',
          red: '#ea0038',
          yellow: '#ffd279',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'Arial', 'Ubuntu', 'Cantarell', 'Fira Sans', 'sans-serif'],
      },
      boxShadow: {
        'wa-dropdown': '0 2px 5px 0 rgba(11,20,26,.26), 0 2px 10px 0 rgba(11,20,26,.16)',
        'wa-modal': '0 17px 50px 0 rgba(11,20,26,.19), 0 12px 15px 0 rgba(11,20,26,.24)',
        'wa-bubble': '0 1px 0.5px rgba(11,20,26,.13)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '22px' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'wave': 'wave 1s ease-in-out infinite',
        'pop-in': 'popIn 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }
    },
  },
  plugins: [],
}
