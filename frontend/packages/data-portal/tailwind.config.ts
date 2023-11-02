import sds from '@czi-sds/components/dist/tailwind.json'
import type { Config } from 'tailwindcss'

// eslint-disable-next-line import/no-default-export
export default {
  content: ['./app/**/*.{ts,tsx,scss}'],
  theme: {
    extend: {
      ...sds,

      screens: {
        'screen-2040': '2040px',
      },

      maxWidth: {
        content: '1600px',
      },

      // overwrite faulty SDS line heights
      lineHeight: {
        // header
        'sds-header-xxl': '34px',
        'sds-header-xl': '30px',
        'sds-header-l': '24px',
        'sds-header-m': '22px',
        'sds-header-s': '20px',
        'sds-header-xs': '18px',
        'sds-header-xxs': '18px',
        'sds-header-xxxs': '16px',
        // body
        'sds-body-l': '28px',
        'sds-body-m': '26px',
        'sds-body-s': '24px',
        'sds-body-xs': '20px',
        'sds-body-xxs': '18px',
        'sds-body-xxxs': '16px',
        // caps
        'sds-caps-xxs': '18px',
        'sds-caps-xxxs': '16px',
        'sds-caps-xxxxs': '14px',
      },
    },
  },
  plugins: [],
} satisfies Config
