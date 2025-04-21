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
    extend: {},
  },
  plugins: [],
};
