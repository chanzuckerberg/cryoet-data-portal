import { useI18n } from 'app/hooks/useI18n'

function ChallengeInfo({ title, content }: { title: string; content: string }) {
  return (
    <div className="font-semibold">
      <p className="text-sds-header-xxxs leading-sds-header-xxxs text-sds-color-primitive-gray-600">
        {title}
      </p>
      <p className="text-sds-body-l leading-sds-body-l">{content}</p>
    </div>
  )
}

export function MLChallengeHeader() {
  const { t } = useI18n()

  return (
    <div className="bg-sds-primary-200 flex flex-col justify-center py-sds-xxl text-center">
      <h1 className="text-sds-header-xxl leading-sds-header-xxl font-semibold">
        {t('cryoetDataAnnotationMLComp')}
      </h1>

      <h2 className="text-sds-header-m leading-sds-header-m mt-sds-xs">
        {t('developAMLModel')}
      </h2>

      <div className="flex items-center mt-sds-xl justify-center">
        <ChallengeInfo title={t('starts')} content={t('fall2024')} />
        <div className="h-full w-px bg-sds-color-primitive-gray-400 mx-sds-xl" />
        <ChallengeInfo title={t('prizes')} content={t('prizeTotal')} />
      </div>
    </div>
  )
}
