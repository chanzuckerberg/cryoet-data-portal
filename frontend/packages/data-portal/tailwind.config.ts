import sds from '@czi-sds/components/dist/tailwind.json'
import type { Config } from 'tailwindcss'

// eslint-disable-next-line import/no-default-export
export default {
  content: ['./src/**/*.{ts,tsx,scss}'],
  theme: {
    extend: sds,
  },
  plugins: [],
} satisfies Config
