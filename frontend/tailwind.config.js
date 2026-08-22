/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary palette
        navy: {
          DEFAULT: '#132B5C',
          50: '#EAF2FF',
          100: '#C5D9F7',
          200: '#91B5EF',
          300: '#5D91E6',
          400: '#2E6EDC',
          500: '#132B5C',
          600: '#0E1F44',
          700: '#09142C',
          800: '#040A16',
          900: '#01030A',
        },
        blue: {
          DEFAULT: '#2563EB',
          50: '#EAF2FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Supporting
        purple: {
          DEFAULT: '#8B5CF6',
          light: '#F1EDFF',
        },
        green: {
          DEFAULT: '#10B981',
          light: '#EAFBF4',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FFF7E6',
        },
        red: {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
        },
        // Neutrals
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero-xl': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-lg': ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        'hero-md': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'hero-sm': ['30px', { lineHeight: '1.25', fontWeight: '700' }],
        'section': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'card-title': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.05)',
        'header': '0 1px 0 0 #E2E8F0',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'count-up': 'countUp 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'progress-fill': 'progressFill 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
    },
  },
  plugins: [],
}
