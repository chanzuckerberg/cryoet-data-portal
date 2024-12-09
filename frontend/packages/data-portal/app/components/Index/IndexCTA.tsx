import { Button } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

function CTA({
  title,
  text,
  buttonText,
  url,
}: {
  title: string
  text: string
  buttonText: string
  url: string
}) {
  return (
    <>
      <div className="flex flex-col gap-sds-xs min-w-[150px]">
        <h4 className="font-sds-semibold font-semibold text-sds-header-m leading-sds-header-m">
          {title}
        </h4>
        <p>{text}</p>
      </div>
      <div>
        <Link to={url}>
          <Button sdsType="primary" sdsStyle="rounded">
            {buttonText}
          </Button>
        </Link>
      </div>
    </>
  )
}

export function IndexCTA() {
  const { t } = useI18n()

  return (
    <div className="py-sds-xxl flex flex-col gap-sds-xl relative after:h-full after:w-[200vw] after:bg-sds-color-primitive-blue-100 after:absolute after:top-0 after:-translate-x-1/2 after:-z-10">
      <h3 className="font-sds-semibold font-semibold text-sds-header-xl leading-sds-header-xl">
        <I18n i18nKey="helpUsAchieveThisVision" />
      </h3>
      <div
        className={cns(
          'w-full grid grid-rows-[1fr_auto_1px_1fr_auto_1px_1fr] sm:grid-rows-[1fr_auto] grid-flow-row sm:grid-flow-col gap-y-sds-xl gap-x-sds-xxl',
          'grid-cols-[1fr] sm:grid-cols-[1fr_auto_1fr_auto_1fr]',
        )}
      >
        <CTA
          title={t('viewAndDownloadDatasets')}
          text={t('viewDatasetsCta')}
          buttonText={t('browseData')}
          url="/browse-data/datasets"
        />
        <div className="bg-sds-color-primitive-gray-200 h-sds-xxxs sm:w-sds-xxxs sm:row-span-2 sm:h-full" />
        <CTA
          title={t('contributeYourData')}
          text={t('contributeCta')}
          buttonText={t('tellUsMore')}
          url={t('urlDataContributionForm')}
        />
        <div className="bg-sds-color-primitive-gray-200 h-sds-xxxs sm:w-sds-xxxs sm:row-span-2 sm:h-full" />
        <CTA
          title={t('participateInOurCompetition')}
          text={t('participateInOurCompetitionCTA')}
          buttonText={t('learnMore')}
          url="/competition"
        />
      </div>
    </div>
  )
}
