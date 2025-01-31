import { Button, Tag } from '@czi-sds/components'

import { Link } from 'app/components/Link'
import { ChallengeInfo } from 'app/components/MLChallenge/ChallengeInfo'
import { useI18n } from 'app/hooks/useI18n'

export function CompletedChallengeHeader() {
  const { t } = useI18n()

  const divider = (
    <div className="hidden screen-512:block h-full w-px bg-sds-color-primitive-gray-300" />
  )

  return (
    <div className="bg-sds-color-primitive-blue-200 flex flex-col justify-center px-sds-s pt-sds-xxl screen-360:px-sds-xl pb-sds-xl screen-512:pt-[100px] screen-512:pb-[60px] text-center">
      <h1 className="text-[26px] screen-512:text-[34px] leading-[34px] screen-512:leading-[46px] font-semibold max-w-content-small mx-auto">
        {t('cryoetDataAnnotationMLComp')}
      </h1>
      <h2 className="text-[14px] screen-512:text-sds-body-m leading-[24px] screen-512:leading-sds-body-m screen-512:mt-sds-xs max-w-content-small mx-auto">
        {t('developAMLModel')}
      </h2>
      <div className="flex flex-col screen-512:flex-row my-sds-xl gap-sds-xl justify-center">
        <ChallengeInfo
          title={t('particleDetectionChallengeStatusLabel')}
          content={
            <Tag
              className="[&&]:bg-[#238444] [&&]:mt-sds-xxs [&&]:hover:bg-[#105b2b]"
              label={t('particleDetectionChallengeStatus')}
            />
          }
        />
        {divider}
        <ChallengeInfo title={t('ended')} content={t('mlChallengeEndDate')} />
        {divider}
        <ChallengeInfo title={t('length')} content={t('mlChallengeLength')} />
      </div>
      <div className="flex flex-col screen-512:flex-row justify-center gap-sds-l">
        <Link to="/TODO">
          <Button sdsStyle="rounded" sdsType="primary">
            {t('viewWinners')}
          </Button>
        </Link>
        <Link to="/TODO">
          <Button sdsStyle="rounded" sdsType="secondary">
            {t('viewOutcome')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
