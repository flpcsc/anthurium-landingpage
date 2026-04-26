/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep:    '#050A05',
          core:    '#1A8A4A',
          bright:  '#2ECC71',
          chrome:  '#A8E6C0',
          mint:    '#C8EDD6',
        },
        gold: {
          warm:    '#C9A84C',
          champagne: '#E8D5A3',
        },
        iridescent: {
          blue:   '#4A7FC1',
          violet: '#7B5EA7',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      easing: {
        expo: 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}
