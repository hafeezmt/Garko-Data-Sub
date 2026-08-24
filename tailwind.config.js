/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#00D2FF',
          'cyan-hover': '#00B4D8',
          blue: '#0077B6',
          navy: '#0A192F',
          dark: '#060D1B',
          card: '#0F172A',
          yellow: '#FACC15',
          'yellow-hover': '#EAB308',
          border: '#1E293B'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 210, 255, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(0, 119, 182, 0.4)',
      }
    },
  },
  plugins: [],
}
