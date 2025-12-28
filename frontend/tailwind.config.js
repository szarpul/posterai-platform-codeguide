/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm Creative Studio Palette
        cream: {
          DEFAULT: '#FAF8F5',
          dark: '#F5F0E8',
        },
        'warm-white': '#FFFDFB',

        // Primary - Terracotta
        primary: {
          50: '#FEF5F3',
          100: '#FDE8E3',
          200: '#FBD5CC',
          300: '#F7B6A6',
          400: '#F4A990',
          500: '#E07A5F',
          600: '#C45D43',
          700: '#A44A35',
          800: '#873E2E',
          900: '#6F352A',
        },
        terracotta: {
          light: '#F4A990',
          DEFAULT: '#E07A5F',
          dark: '#C45D43',
        },

        // Secondary - Sage Green
        secondary: {
          50: '#F3F7F4',
          100: '#E4EDE6',
          200: '#CADBD0',
          300: '#A5C1AE',
          400: '#8BA894',
          500: '#5A7D64',
          600: '#3D5A45',
          700: '#334A3A',
          800: '#2C3D31',
          900: '#26342B',
        },
        sage: {
          muted: '#8BA894',
          light: '#5A7D64',
          DEFAULT: '#3D5A45',
        },

        // Accent - Gold
        accent: {
          50: '#FBF7F1',
          100: '#F5EBDB',
          200: '#E8C9A8',
          300: '#D4A276',
          400: '#C48B5C',
          500: '#B67644',
          600: '#A05F38',
          700: '#854B30',
          800: '#6D3E2C',
          900: '#5A3527',
        },
        gold: {
          light: '#E8C9A8',
          DEFAULT: '#D4A276',
        },

        // Neutrals - Warm Charcoal
        charcoal: {
          light: '#4A4640',
          DEFAULT: '#2D2A26',
        },
        'warm-gray': '#8A857D',

        // Status colors (keeping warm tones)
        success: {
          50: '#F3F7F4',
          100: '#E4EDE6',
          500: '#5A7D64',
          600: '#3D5A45',
          700: '#334A3A',
        },
        error: {
          50: '#FEF5F3',
          100: '#FDE8E3',
          500: '#E07A5F',
          600: '#C45D43',
          700: '#A44A35',
        },
        warning: {
          50: '#FBF7F1',
          100: '#F5EBDB',
          500: '#D4A276',
          600: '#B67644',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(45, 42, 38, 0.05)',
        'medium': '0 4px 12px rgba(45, 42, 38, 0.08)',
        'large': '0 12px 32px rgba(45, 42, 38, 0.12)',
        'xl': '0 24px 48px rgba(45, 42, 38, 0.16)',
        'inner-soft': 'inset 0 2px 4px rgba(45, 42, 38, 0.06)',
        'glow': '0 0 0 4px rgba(224, 122, 95, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #E07A5F 0%, #C45D43 100%)',
        'gradient-sage': 'linear-gradient(135deg, #5A7D64 0%, #3D5A45 100%)',
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ]
}
