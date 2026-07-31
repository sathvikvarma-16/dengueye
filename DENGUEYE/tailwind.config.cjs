/** @type {import('tailwindcss').Config} */
module.exports = {
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
      }
    },
  },
  plugins: [],
}
