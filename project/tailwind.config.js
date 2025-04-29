/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f0f4fd',
          100: '#e2e8f9',
          200: '#c5d1f3',
          300: '#a7b9eb',
          400: '#8a9fdf',
          500: '#6c84d3',
          600: '#4e69c6',
          700: '#3f55ae',
          800: '#344693',
          900: '#293878',
        },
        purple: {
          50: '#f5f2ff',
          100: '#ede5ff',
          200: '#daccff',
          300: '#c0a4ff',
          400: '#a978ff',
          500: '#9557f5',
          600: '#8035e8',
          700: '#7128cd',
          800: '#5d22a6',
          900: '#4d1d85',
        },
        lavender: {
          50: '#f4f2ff',
          100: '#ebe5ff',
          200: '#d7ccff',
          300: '#baa4ff',
          400: '#9a78ff',
          500: '#8557f5',
          600: '#7135e8',
          700: '#6028cd',
          800: '#5022a6',
          900: '#401d85',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'stars': 'url("/stars.svg")',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};