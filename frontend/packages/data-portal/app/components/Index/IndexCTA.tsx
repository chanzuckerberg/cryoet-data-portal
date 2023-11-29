import { Button } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'

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
      <div className="flex flex-col gap-sds-xs">
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
    <div className="py-sds-xxl flex flex-col gap-sds-xl relative after:h-full after:w-[200vw] after:bg-sds-primary-100 after:absolute after:top-0 after:-translate-x-1/2 after:-z-10">
      <h3 className="font-sds-semibold font-semibold text-sds-header-xl leading-sds-header-xl">
        <I18n i18nKey="helpUsAchieveThisVision" />
      </h3>
      <div className="w-full grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] grid-flow-col gap-y-sds-xl gap-x-sds-xxl">
        <CTA
          title={t('viewAndDownloadDatasets')}
          text={t('viewDatasetsCta')}
          buttonText={t('browseData')}
          url="/browse-data/datasets"
        />
        <div className="bg-sds-gray-200 w-sds-xxxs row-span-2" />
        <CTA
          title={t('contributeYourData')}
          text={t('contributeCta')}
          buttonText={t('tellUsMore')}
          url={t('urlDataContributionForm')}
        />
      </div>
    </div>
  )
}
