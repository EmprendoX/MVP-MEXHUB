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
        // Paleta light (marketplace estilo Fiverr).
        // Los nombres de tokens se mantienen para no romper clases existentes,
        // pero los valores hex son los del nuevo tema light + verde.
        primary: {
          50: '#E7F9F0',
          100: '#CFF3E1',
          200: '#9FE7C4',
          300: '#6FDBA7',
          400: '#3FCF8A',
          500: '#1DBF73',
          600: '#19A463',
          700: '#158953',
          800: '#116E43',
          900: '#0D5333',
          DEFAULT: '#1DBF73',
        },
        // `dark.DEFAULT` = white — usado como `text-dark` en botones sobre primary
        // (texto blanco sobre verde).
        // `dark.500` = fondo de página (soft gray).
        // `dark.800` / `dark.900` mantienen tonos oscuros para scrims/overlays
        // via `bg-dark-800/60`.
        dark: {
          50: '#FFFFFF',
          100: '#FAFBFC',
          200: '#F5F7F9',
          300: '#EDF0F3',
          400: '#E4E8EC',
          500: '#F5F7F9',
          600: '#EDF0F3',
          700: '#4A5261',
          800: '#1A1D24',
          900: '#0D0F14',
          DEFAULT: '#FFFFFF',
        },
        'light-bg': '#FFFFFF',
        'text-light': '#1A1D24',
        'text-soft': '#6E7580',
        success: {
          DEFAULT: '#22C55E',
          500: '#22C55E',
        },
        alert: {
          DEFAULT: '#EF4444',
          500: '#EF4444',
        },
        'gray-light': '#E4E8EC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(20, 30, 40, 0.06), 0 1px 2px 0 rgba(20, 30, 40, 0.04)',
        'card': '0 4px 12px -2px rgba(20, 30, 40, 0.08), 0 2px 6px -2px rgba(20, 30, 40, 0.04)',
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
