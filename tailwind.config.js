/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          navy: '#0B1F4D',
          blue: '#1769FF',
          DEFAULT: '#1769FF',
        },
        secondary: {
          blue: '#4D8DFF',
        },
        pale: {
          blue: '#F3F7FF',
        },
        brand: {
          navy: '#0B1F4D',
          blue: '#1769FF',
          lightblue: '#4D8DFF',
          pale: '#F3F7FF',
          text: '#172033',
          muted: '#667085',
          success: '#15803D',
          warning: '#D97706',
          error: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.08)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
        'nav': '0 1px 0 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
