import { Button } from '@czi-sds/components'

import { Link } from 'app/components/Link'
import { ChallengeInfo } from 'app/components/MLChallenge/ChallengeInfo'
import { useI18n } from 'app/hooks/useI18n'

export function MLChallengeHeader() {
  const { t } = useI18n()

  const divider = (
    <div className="hidden screen-716:block h-full w-px bg-sds-color-primitive-gray-400" />
  )

  return (
    <div className="bg-sds-color-primitive-blue-200 flex flex-col justify-center p-sds-xl screen-716:py-sds-xxl text-center">
      <h1 className="text-sds-header-xxl leading-sds-header-xxl font-semibold">
        {t('cryoetDataAnnotationMLComp')}
      </h1>

      <h2 className="text-sds-header-m leading-sds-header-m mt-sds-xl screen-716:mt-sds-xs">
        {t('developAMLModel')}
      </h2>

      <div className="flex flex-col screen-716:flex-row items-center my-sds-xl gap-sds-xl justify-center">
        <ChallengeInfo
          title={t('started')}
          content={t('mlChallengeStartDate')}
        />
        {divider}
        <ChallengeInfo title={t('ends')} content={t('mlChallengeEndDate')} />
        {divider}
        <ChallengeInfo title={t('prizes')} content={t('prizeTotal')} />
      </div>
      <div>
        <Link to="https://www.kaggle.com/competitions/czii-cryo-et-object-identification/">
          <Button sdsStyle="rounded" sdsType="primary">
            {t('seeOnKaggle')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
