/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          base: '#150F18',
          surface: '#1F1722',
          raised: '#271D2B',
          border: '#3A2C3F'
        },
        bone: '#F4EBF1',
        mauve: {
          400: '#B7A2B8',
          600: '#7C6B7E'
        },
        stage: {
          seed: '#8C6B84',
          emerging: '#B4508A',
          expanding: '#D42E82',
          viral: '#FF3D97',
          saturation: '#A61E6B',
          declining: '#6B4A63',
          dormant: '#3A2E39',
        },
        evidence: '#E3A542',
        calm: '#5FA8A0',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        body: ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
