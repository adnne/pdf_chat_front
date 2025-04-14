/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-primary': '#111827',
        'dark-secondary': '#1F2937',
        'dark-accent': '#374151',
        'light-primary': '#FFFFFF',
        'light-secondary': '#F3F4F6',
        'light-accent': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(156, 163, 175, 0.1)',
      },
    },
  },
  plugins: [],
}