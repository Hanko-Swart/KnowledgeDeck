/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0c3547',    // Very dark blue
          DEFAULT: '#10656d', // Very dark cyan
          light: '#598f91',   // Mostly desaturated dark cyan
        },
        secondary: {
          dark: '#93b071',    // Mostly desaturated dark green
          DEFAULT: '#ede2cc', // Light grayish orange
          light: '#edae93',   // Very soft orange
        },
        accent: '#dd6670',    // Soft red
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 