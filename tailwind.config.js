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
          DEFAULT: '#2563eb', // Blue 600
          light: '#60a5fa', // Blue 400
          dark: '#1d4ed8', // Blue 700
        },
        secondary: {
          DEFAULT: '#6366f1', // Indigo 500
          light: '#818cf8', // Indigo 400
          dark: '#4f46e5', // Indigo 600
        },
        accent: {
          DEFAULT: '#8b5cf6', // Violet 500
          light: '#a78bfa', // Violet 400
          dark: '#7c3aed', // Violet 600
        },
        neutral: {
          DEFAULT: '#6b7280', // Gray 500
          light: '#9ca3af', // Gray 400
          dark: '#4b5563', // Gray 600
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 