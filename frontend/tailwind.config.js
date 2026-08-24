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
        porcelain: '#090A0F', // Obsidian Base
        pearl: '#12151F',     // Deep Slate Surface
        card: '#161926',      // Luminescent Card Surface
        borderline: 'rgba(255, 255, 255, 0.09)',
        subtleborder: 'rgba(255, 255, 255, 0.05)',
        charcoal: {
          950: '#F8FAFC', // Pure white/ice text
          900: '#F1F5F9', // High contrast text
          800: '#E2E8F0', // Main body text
          600: '#94A3B8', // Secondary slate text
          400: '#64748B', // Muted slate text
          200: '#334155', // Border tone
        },
        brand: {
          primary: '#10B981',     // Cyber Emerald
          primaryDark: '#059669',
          amber: '#F59E0B',       // Amber Glow
          crimson: '#EF4444',     // Crimson Alert
          emerald: '#10B981',     // Emerald Live
          indigo: '#6366F1',      // Deep Indigo
          sapphire: '#3B82F6',    // Electric Sapphire
          gold: '#F59E0B',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Source Serif 4', 'Georgia', 'serif'],
        sans: ['Inter', 'Public Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'float': '0 16px 48px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'neon-crimson': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
      }
    },
  },
  plugins: [],
}
