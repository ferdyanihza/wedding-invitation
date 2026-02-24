/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
          100: '#fffae0',
          200: '#fff0a8',
          300: '#ffe070',
          400: '#ffc938',
          500: '#f5a623',
          600: '#e07b00',
          700: '#b85d00',
          800: '#8a4200',
          900: '#5c2b00',
        },
        ivory: {
          50: '#fffef9',
          100: '#fffdf0',
          200: '#fff9e0',
          300: '#fff3c4',
          400: '#ffe89e',
          500: '#ffd96e',
        },
        brown: {
          50: '#fdf6f0',
          100: '#f7e8d8',
          200: '#edcfaa',
          300: '#ddb07a',
          400: '#c9904f',
          500: '#b5702a',
          600: '#8e5520',
          700: '#6b3e16',
          800: '#4a2a0e',
          900: '#2d1b0e',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'petal': 'petalFall 6s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
