/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a7e76',
          dark: '#0f4c49',
          light: '#2ba8a0',
        },
        accent: {
          DEFAULT: '#f97316',
          dark: '#ea580c',
          light: '#fb923c',
        },
        silver: {
          DEFAULT: '#e5e7eb',
          dark: '#9ca3af',
          light: '#f3f4f6',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};