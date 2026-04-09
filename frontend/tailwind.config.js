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
    'overflow-x-auto',
    'min-w-[500px]',
    'min-w-[600px]',
    'min-w-[700px]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}