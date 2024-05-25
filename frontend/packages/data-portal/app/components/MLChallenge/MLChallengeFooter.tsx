import { I18n } from 'app/components/I18n'
import { SpeechBubbleIcon } from 'app/components/icons'
import { useI18n } from 'app/hooks/useI18n'

export function MLChallengeFooter() {
  const { t } = useI18n()

  return (
    <div className="bg-sds-primary-100 flex justify-center py-16 gap-sds-xxl">
      <div className="font-semibold max-w-[612px]">
        <p className="text-sds-header-xl leading-sds-header-xl">
          {t('contact')}
        </p>

        <p className="text-sds-body-m leading-sds-body-m mt-sds-xl">
          <I18n i18nKey="haveMoreQuestions" />
        </p>
      </div>

      <SpeechBubbleIcon color="#a9bdfc" width={150} />
    </div>
  )
}
