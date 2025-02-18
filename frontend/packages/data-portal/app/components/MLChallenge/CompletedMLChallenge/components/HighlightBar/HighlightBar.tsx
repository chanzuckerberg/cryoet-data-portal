import { useI18n } from 'app/hooks/useI18n'

export function HighlightBar() {
  const { t } = useI18n()
  return (
    <div className="bg-[#002D90] text-sds-color-primitive-common-white text-[18px] screen-512:text-sds-header-xl font-semibold py-sds-l px-sds-xl">
      <div className="screen-1024:max-w-[1218px] screen-1500:max-w-[1148px] screen-1500:pr-[43px] mx-auto flex flex-col screen-879:flex-row justify-between gap-sds-xl screen-879:gap-sds-s">
        <p>{t('prize75k')}</p>
        <p>{t('teamsEntrants')}</p>
        <p>{t('numSubmissions')}</p>
        <p>{t('totalCountries')}</p>
      </div>
    </div>
  )
}
