/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          DEFAULT: '#6b5448',
          light: '#fdfaf6',
          dark: '#4d3e36',
          accent: '#f0e3d3',
        },
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
        hover: '0 6px 20px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        scaleIn: 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
