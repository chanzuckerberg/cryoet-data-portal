import { Button } from '@czi-sds/components'
import { styled } from '@mui/material/styles'
import { useTypedLoaderData } from 'remix-typedjson'

import { LandingPageDataQuery } from 'app/__generated__/graphql'
import { I18n } from 'app/components/I18n'
import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
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
        {count.toLocaleString()}
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
  const { t } = useI18n()
  const data = useTypedLoaderData<LandingPageDataQuery>()

  const datasets = data.datasets_aggregate.aggregate?.count
  const species = data.species_aggregate.aggregate?.count
  const tomograms = data.tomograms_aggregate.aggregate?.count

  return (
    <div
      className={cnsNoMerge(
        'bg-img-landing-header',
        // layout
        'w-full h-[325px]',
        'py-sds-xxl px-sds-xl',
        'flex flex-col items-center justify-center',
        // background'
        'bg-gradient-img-to-b bg-auto bg-no-repeat bg-black bg-top',
        // values ripped from figma: `background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.75) 16.69%, rgba(0, 0, 0, 0.3) 88.71%);`
        'from-black',
        'via-[rgba(0,0,0,0.75)] via-[16.69%]',
        'to-[rgba(0,0,0,0.3)] to-[88.71%]',
      )}
    >
      <div className="flex flex-col items-center gap-sds-m text-white">
        <div className="flex flex-col gap-sds-xl items-center">
          <h1 className="text-[32px] leading-[34px] font-sds-semibold font-semibold drop-shadow-landing-header">
            <I18n i18nKey="landingHeaderTitle" />
          </h1>
          <div className="flex flex-row justify-center w-full">
            <MetricField title={t('datasets')} count={datasets ?? 0} />
            {DIVIDER}
            <MetricField title={t('species')} count={species ?? 0} />
            {DIVIDER}
            <MetricField title={t('tomograms')} count={tomograms ?? 0} />
          </div>
          <Link to="/browse-data/datasets">
            <CTAButton sdsType="primary" sdsStyle="rounded">
              <I18n i18nKey="browseData" />
            </CTAButton>
          </Link>
        </div>
        <Link to={t('apiDocLink')}>
          <p className="underline underline-offset-1 decoration-1 text-sds-body-xxs leading-none drop-shadow-landing-header">
            <I18n i18nKey="orExploreViaApi" />
          </p>
        </Link>
      </div>
    </div>
  )
}
