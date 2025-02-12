import sds from '@czi-sds/components/dist/tailwind.json'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

const backgroundImageSrcPlugin = plugin(({ addUtilities, theme, e }) => {
  const values = theme('backgroundImageSrc')
  if (values) {
    const utilities = Object.entries(values).map(([key, value]) => {
      return {
        [`.${e(`bg-img-${key}`)}`]: { '--tw-background-image': `${value}` },
      }
    })
    addUtilities(utilities)
  }
})

// eslint-disable-next-line import/no-default-export
export default {
  content: ['./app/**/*.{ts,tsx,scss}'],
  theme: {
    extend: {
      ...sds,

      screens: {
        'screen-360': '360px',
        'screen-512': '512px',
        'screen-667': '667px',
        'screen-716': '716px',
        'screen-760': '760px',
        'screen-790': '790px',
        'screen-879': '879px',
        'screen-1024': '1024px',
        'screen-1345': '1345px',
        'screen-2040': '2040px',
      },

      maxWidth: {
        content: '1600px',
        'content-small': '800px',
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

      dropShadow: {
        'landing-header': '0 0 7px rgba(0, 0, 0, 0.5)',
      },

      boxShadow: {
        card: '0px 2px 12px 0px #0000004D',
      },

      backgroundImage: () => {
        const values = Object.entries(defaultTheme.backgroundImage)
          .filter(([key]) => key.includes('to'))
          .map(([key, value]) => {
            return {
              [`gradient-img-${key.slice(key.indexOf('-') + 1)}`]: `${value}, var(--tw-background-image)`,
            }
          })
        return values.reduce((prev, curr) => ({ ...prev, ...curr }))
      },

      backgroundImageSrc: {
        'landing-header': "url('/images/index-header.png')",
      },

      content: {
        i18n: 'attr(data-i18n-content)',
      },
    },
  },
  plugins: [backgroundImageSrcPlugin],
} satisfies Config
