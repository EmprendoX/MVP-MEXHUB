/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores HUBMEX
        primary: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00C8F0',
          600: '#00b0d8',
          700: '#0098c0',
          800: '#0080a8',
          900: '#006890',
          DEFAULT: '#00C8F0',
        },
        dark: {
          50: '#f0f2f5',
          100: '#e1e6ea',
          200: '#c3cdd5',
          300: '#a5b4c0',
          400: '#879bab',
          500: '#0B1221',
          600: '#0a0f1e',
          700: '#090d1b',
          800: '#080b18',
          900: '#070915',
          DEFAULT: '#0B1221',
        },
        'light-bg': '#152332',
        'text-light': '#FFFFFF',
        'text-soft': '#B4C5D2',
        success: {
          DEFAULT: '#00E6A8',
          500: '#00E6A8',
        },
        alert: {
          DEFAULT: '#FF4D4F',
          500: '#FF4D4F',
        },
        'gray-light': '#E9EDF2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
