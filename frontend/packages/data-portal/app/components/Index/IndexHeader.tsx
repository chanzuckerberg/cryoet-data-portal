import { Button } from '@czi-sds/components'
import { styled } from '@mui/material/styles'

import { i18n } from 'app/i18n'
import { theme } from 'app/theme'
import { cns, cnsNoMerge } from 'app/utils/cns'

function MetricField({ title, count }: { title: string; count: number }) {
  return (
    <div
      className={cns(
        'flex flex-col items-center justify-center',
        'flex-auto max-w-[120px] w-full px-sds-m',
        'font-sds-semibold font-semibold',
      )}
    >
      <p className="text-sds-caps-xxxs leading-sds-caps-xxxs uppercase drop-shadow-landing-header">
        {title}
      </p>
      <p className="text-sds-header-l leading-sds-header-l drop-shadow-landing-header">
        {/* https://stackoverflow.com/a/27761572 */}
        {count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </p>
    </div>
  )
}

const CTAButton = styled(Button)({
  'background-color': theme.palette.grey[200],
  color: theme.palette.common.black,
  filter: 'drop-shadow(0 0 7px rgba(0, 0, 0, 0.5))',
  '&:hover': {
    color: theme.palette.common.black,
    'background-color': theme.palette.common.white,
  },
})

const DIVIDER = (
  <div className="w-[1px] flex-initial h-full bg-gray-400 drop-shadow-landing-header" />
)

export function IndexHeader() {
  return (
    <div
      className={cnsNoMerge(
        'bg-img-landing-header',
        // layout
        'w-full h-[325px]',
        'py-sds-xxl px-sds-xl',
        'flex flex-col items-center justify-center',
        // background'
        'bg-gradient-img-to-b bg-cover bg-top',
        // values ripped from figma: `background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.75) 16.69%, rgba(0, 0, 0, 0.3) 88.71%);`
        'from-black',
        'via-[rgba(0,0,0,0.75)] via-[16.69%]',
        'to-[rgba(0,0,0,0.3)] to-[88.71%]',
      )}
    >
      <div className="flex flex-col items-center gap-sds-m text-white">
        <div className="flex flex-col gap-sds-xl items-center">
          <h1 className="text-[32px] leading-[34px] font-sds-semibold font-semibold drop-shadow-landing-header">
            Open access to annotated cryoET tomograms
          </h1>
          <div className="flex flex-row justify-center w-full">
            <MetricField title={i18n.datasets} count={53} />
            {DIVIDER}
            <MetricField title={i18n.species} count={9} />
            {DIVIDER}
            <MetricField title={i18n.tomograms} count={13861} />
          </div>
          <CTAButton sdsType="primary" sdsStyle="rounded">
            {i18n.browseData}
          </CTAButton>
        </div>
        <p className="underline underline-offset-1 decoration-1 text-sds-body-xxs leading-none drop-shadow-landing-header">
          or explore via API
        </p>
      </div>
    </div>
  )
}
