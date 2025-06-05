/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './components/screens/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './components/screens/QuizScreen.tsx',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'blush-pink': '#E8A9B0',
        'peach-sorbet': '#F7C6B2',
        'mauve-mist': '#C8A4B7',
        'deep-plum': '#7F4B6E',
        'soft-gray': '#F4F4F4',
        charcoal: '#333333',
      },
    },
  },
  plugins: [],
};
