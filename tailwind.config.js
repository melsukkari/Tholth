/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,twig}',
    './src/templates/**/*.twig',
    './src/sections/**/*.twig',
    './src/snippets/**/*.twig'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        winter: {
          ice: '#E0F2FE',
          snow: '#F0F9FF',
          frost: '#BAE6FD',
          sky: '#0EA5E9',
          night: '#1E3A8A',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      animation: {
        'snow-fall': 'snowFall 10s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-in',
      },
      keyframes: {
        snowFall: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            transform: 'translateY(50px) scale(0.95)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1'
          },
        },
        slideDown: {
          '0%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(50px) scale(0.95)',
            opacity: '0'
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'winter': '0 10px 40px rgba(59, 130, 246, 0.3)',
        'overlay': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
