/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        porcelain: '#FBFBFA',
        pearl: '#F4F4F0',
        card: '#FFFFFF',
        borderline: 'rgba(25, 23, 21, 0.08)',
        subtleborder: 'rgba(25, 23, 21, 0.04)',
        charcoal: {
          950: '#0F0E0D',
          900: '#1A1816',
          800: '#2E2B27',
          600: '#5C564E',
          400: '#8C8478',
          200: '#D5CFC5',
        },
        brand: {
          crimson: '#E03131',
          amber: '#F59F00',
          emerald: '#2F9E44',
          indigo: '#3B5BDB',
          cyan: '#1098AD',
          gold: '#C98A0C',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Public Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'float': '0 12px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'inset-glass': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 6s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
