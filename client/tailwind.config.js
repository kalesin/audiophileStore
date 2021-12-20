module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    letterSpacing: {
      tightest: '-.075em',
      tighter: '-.05em',
      tight: '-.025em',
      normal: '0',
      wide: '.125em',
      wider: '.25em',
      widest: '.5em',
    },
    extend: {
      backgroundColor: {
        main: 'var(--main)',
        sec: 'var(--sec)',
        'alert-green': 'var(--alert-green)'
      },
      ringColor:{
        main: 'var(--main)',
        sec: 'var(--sec)',
        'alert-green': 'var(--alert-green)'
      },
      colors: {
        main: 'var(--main)',
        sec: 'var(--sec)',
        'alert-green': 'var(--alert-green)'
      },
      fontSize: {
        'xss': '.65rem',
      },
      dropShadow: {
        'lower': '0 4rem 2rem #686868',
        'upper': '0 2rem 2rem #686868'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-x-left':{
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0px)' },
        },
        'fade-in-x-right':{
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0px)' },
        },
        'fade-in-y-up':{
          '0%': { opacity: '0', transform: 'translateY(-100px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        'fade-in-y-down':{
          '0%': { opacity: '0', transform: 'translateY(100px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        }
      },
      animation: {
       'fade-in': 'fade-in 1.2s ease-in-out both',
       'fade-in-short': 'fade-in 0.1s ease-in-out both',
       'fade-in-long': 'fade-in 2s ease-in-out both',
       'fade-in-x-left': 'fade-in-x-left 1.2s ease-in-out both',
       'fade-in-x-right': 'fade-in-x-right 1.2s ease-in-out both',
       'fade-in-y-up': 'fade-in-y-up 1.2s ease-in-out both',
       'fade-in-y-down': 'fade-in-y-down 1.2s ease-in-out both'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
  ]
}