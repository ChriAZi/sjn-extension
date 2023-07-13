/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./**/*.tsx'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        'light-blue': '#D9EFFF',
        'very-light-blue': '#C0D3E1',
        'dark-blue': '#0A54CE',
        'dark-grey': '#1C1B1F',
        'lighter-grey': '#EEF0EF',
        'light-grey': '#555555',
        'loading-grey': '#A9A9A9',
        'error-red': '#f3d8d7'
      }
    }
  }
}
