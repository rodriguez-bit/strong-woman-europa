/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dr: {
          purple: '#753BBD',
          'purple-light': '#C1A7E2',
          'purple-dark': '#512D6D',
          smoke: '#EAE7ED',
          'smoke-light': '#F3F3F3',
        },
        dark: {
          bg: '#0a0a14',
          card: '#12121e',
          border: '#1e1e2e',
          surface: '#16162a',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
