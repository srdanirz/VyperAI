/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: '#38ff9b',
        red: '#F40F0F',
        grey100: '#D9D9D9',
        grey200: '#141F27',
        grey300: '#121C23',
        background: '#14141F'
      },
      fontFamily: {
        Jakarta300: ['JAKARTA LIGHT', 'sans-serif'],
        Jakarta400: ['JAKARTA REGULAR', 'sans-serif'],
        Jakarta500: ['JAKARTA MEDIUM', 'sans-serif'],
        Jakarta600: ['JAKARTA SEMIBOLD', 'sans-serif'],
        Jakarta700: ['JAKARTA BOLD', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 20s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'snake-attack': 'snakeAttack 1.5s ease-in-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(20px, -50px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(50px, 50px) scale(1.05)',
          },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
        'glow-pulse': {
          '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.4,
            transform: 'scale(1.05)',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        snakeAttack: {
          '0%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: 1,
            zIndex: 9999,
          },
          '25%': { 
            transform: 'scale(1.5) rotate(90deg)',
            zIndex: 9999,
          },
          '50%': { 
            transform: 'scale(2) rotate(90deg) translateX(calc(30vw))',
            zIndex: 9999,
          },
          '75%': { 
            transform: 'scale(2.5) rotate(90deg) translateX(calc(30vw)) translateY(calc(80vh))',
            zIndex: 9999,
          },
          '100%': { 
            transform: 'scale(3) rotate(90deg) translateX(calc(30vw)) translateY(calc(80vh))',
            opacity: 0,
            zIndex: 9999,
          }
        }
      },
      maxWidth: {
        'app': '1400px'
      },
      minWidth: {
        'app': '1400px'
      },
      height: {
        'app': '800px'
      },
      minHeight: {
        'app': '800px'
      }
    }
  },
  plugins: []
}