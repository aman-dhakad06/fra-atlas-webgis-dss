/** @type {import('tailwindcss').Config} */
export default {
  // This is the required line that enables dark mode
  darkMode: 'class', 

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'spin-slower': 'spin 25s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'fade-in-slow': 'fadeIn 1s ease-in-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}