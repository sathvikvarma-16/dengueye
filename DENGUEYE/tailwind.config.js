/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gvmc: {
          dark: '#0b132b',
          navy: '#1c2541',
          blue: '#3a506b',
          accent: '#00b4d8',
          cyan: '#90e0ef',
          alert: '#ff4d4d',
          warning: '#ff9f1c',
          success: '#2ec4b6',
          purple: '#7209b7'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 77, 77, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 77, 77, 0.9)' },
        }
      }
    },
  },
  plugins: [],
}
