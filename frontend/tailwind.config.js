/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',  // Blue
        secondary: '#0D9488', // Teal
        accent: '#FBBF24',   // Yellow
        error: '#DC2626',    // Red
        'neutral-dark': '#111827',
        'neutral-light': '#F3F4F6',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
}

