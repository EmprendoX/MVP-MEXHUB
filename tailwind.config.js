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
        // PRIMARY = BRAND CHARCOAL (used for ~95% of UI: text emphasis, buttons, brand mark)
        primary: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#52525B',
          500: '#0A0A0A',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          DEFAULT: '#0A0A0A',
        },
        // ACCENT = ELECTRIC BLUE (used SPARINGLY: top-priority CTAs, links, focus rings)
        accent: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
          DEFAULT: '#2563EB',
        },
        // SUCCESS — forest emerald (deeper than the consumer green)
        success: {
          DEFAULT: '#047857',
          500: '#047857',
          600: '#065F46',
        },
        // ALERT — deep red
        alert: {
          DEFAULT: '#B91C1C',
          500: '#B91C1C',
          600: '#991B1B',
        },
        // ---------------- SEMANTIC TOKENS (light theme) ----------------
        // `dark` family — keeps name for backward compat but maps to LIGHT surfaces.
        //   dark.500/DEFAULT = page background (white).
        dark: {
          50: '#FFFFFF',
          100: '#FAFAF9',
          200: '#F4F4F5',
          300: '#E4E4E7',
          400: '#A1A1AA',
          500: '#FFFFFF',
          600: '#FAFAF9',
          700: '#27272A',
          800: '#18181B',
          900: '#09090B',
          DEFAULT: '#FFFFFF',
        },
        // Stone surface (for alternating sections, sidebars, subtle blocks)
        'light-bg': '#FAFAF9',
        // Primary text — zinc-900
        'text-light': '#18181B',
        // Secondary/muted text — zinc-500
        'text-soft': '#71717A',
        // Border — zinc-200
        'gray-light': '#E4E4E7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(10, 10, 10, 0.04), 0 1px 3px 0 rgba(10, 10, 10, 0.06)',
        card: '0 4px 12px -2px rgba(10, 10, 10, 0.06), 0 2px 4px -1px rgba(10, 10, 10, 0.04)',
        elevated: '0 12px 32px -8px rgba(10, 10, 10, 0.12), 0 4px 12px -2px rgba(10, 10, 10, 0.06)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
    },
  },
  plugins: [],
};
