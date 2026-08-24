/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A0D12',
          surface: '#12161D',
          elevated: '#1A1F29',
        },
        borderline: '#262C38',
        text: {
          primary: '#E8EAED',
          secondary: '#8891A1',
          muted: '#565E6C',
        },
        accent: {
          DEFAULT: '#4ADE80',
          hover: '#22C55E',
        },
        danger: '#FF4D4D',
        warning: '#FFB020',
        
        // Backward compatibility mappings
        porcelain: '#0A0D12',
        pearl: '#12161D',
        card: '#12161D',
        bone: '#E8EAED',
        charcoal: {
          950: '#E8EAED',
          900: '#E8EAED',
          800: '#8891A1',
          600: '#8891A1',
          400: '#565E6C',
          200: '#262C38',
        },
        brand: {
          primary: '#4ADE80',
          primaryDark: '#22C55E',
          gold: '#FFB020',
          teal: '#4ADE80',
          telegram: '#4ADE80',
          emerald: '#4ADE80',
          crimson: '#FF4D4D',
          purple: '#8891A1',
          amber: '#FFB020',
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'accent-glow': '0 0 16px -2px rgba(74, 222, 128, 0.4)',
      }
    },
  },
  plugins: [],
}
