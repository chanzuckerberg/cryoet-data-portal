import sds from '@czi-sds/components/dist/tailwind.json'
import type { Config } from 'tailwindcss'

// eslint-disable-next-line import/no-default-export
export default {
  content: ['./app/**/*.{ts,tsx,scss}'],
  theme: {
    extend: {
      ...sds,

      maxWidth: {
        content: '1600px',
      },
    },
  },
  plugins: [],
} satisfies Config
