import { useI18n } from 'app/hooks/useI18n'

export function HighlightBar() {
  const { t } = useI18n()
  return (
    <div className="bg-[#002D90] text-sds-color-primitive-common-white text-[18px] screen-512:text-sds-header-xl font-semibold py-sds-l px-sds-xl">
      <div className="max-w-content-small mx-auto flex flex-col screen-879:flex-row justify-between gap-sds-xxl">
        <p>{t('prize75k')}</p>
        <p>{t('teamsEntrants')}</p>
        <p>{t('numSubmissions')}</p>
      </div>
    </div>
  )
}
