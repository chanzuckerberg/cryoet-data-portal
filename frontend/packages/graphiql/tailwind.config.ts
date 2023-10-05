import type { Config } from 'tailwindcss'

// eslint-disable-next-line import/no-default-export
export default {
  content: ['./src/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
