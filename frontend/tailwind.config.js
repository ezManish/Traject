/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F5F0',       // Archival technical alabaster
        surface: '#FFFFFF',      // Pure surface card
        subtle: '#EFECE5',       // Recessed data well / badge ground
        hairline: '#E2DDD5',     // 1px architectural hairline
        strongline: '#C8C1B5',   // Strong focus border
        charcoal: {
          900: '#191715',        // Primary text (high contrast AAA)
          700: '#3D3833',        // Headings
          500: '#5C564E',        // Secondary metadata
          400: '#8C8479',        // Captions / mono
          200: '#D5CFC6',        // Dividers
        },
        signal: {
          seed: '#6C6358',       // Neutral Slate
          emerging: '#2B8A3E',   // Forest Pine
          expanding: '#C25E00',  // Warm Ochre
          viral: '#C92A2A',      // High-voltage Crimson
          saturation: '#862E9C', // Deep Plum
          declining: '#5C564E',  // Muted Slate
          gold: '#975A16',       // Deep Brass / Receipt mark
          teal: '#099268',       // Spruce Teal (Positive)
          hot: '#C92A2A',        // Crimson (Negative)
        }
      },
      fontFamily: {
        display: ['Public Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        body: ['Public Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(25, 23, 21, 0.04)',
        'raised': '0 2px 6px -1px rgba(25, 23, 21, 0.06), 0 1px 3px -1px rgba(25, 23, 21, 0.04)',
      }
    },
  },
  plugins: [],
}
