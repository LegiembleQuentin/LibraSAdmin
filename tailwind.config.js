/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f4fb',
          100: '#f0e8f6', 
          200: '#e3d5ee',
          300: '#ceb8df',
          400: '#b292cc',
          500: '#9670b7',
          600: '#7d56a1',
          700: '#684588',
          800: '#563b70',
          900: '#36034E',
          950: '#281235'
        },
        secondary: {
          50: '#fefde8',
          100: '#fffac2',
          200: '#fff588',
          300: '#ffe844',
          400: '#ffd912',
          500: '#FFE815',
          600: '#d4b006',
          700: '#a67c09',
          800: '#89610f',
          900: '#744f14',
          950: '#442a07'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
} 