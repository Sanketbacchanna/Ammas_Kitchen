/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ecc71', // Fresh Green
        secondary: '#27ae60', // Darker Green
        dark: '#1a1a1a', // Rich black/gray
        'dark-lighter': '#2a2a2a', // Slightly lighter dark for cards
        light: '#f7fff7', // Off-white
        accent: '#f1c40f', // Gold/Yellow accent
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
