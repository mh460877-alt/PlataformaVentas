/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'md:hidden',
    'hidden',
    'md:block',
    'sm:inline',
    'sm:hidden',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}