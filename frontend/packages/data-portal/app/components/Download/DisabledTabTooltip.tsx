import { useI18n } from 'app/hooks/useI18n'

export function DisabledTabTooltip() {
  const { t } = useI18n()

  return (
    <>
      <div className="font-semibold text-center">{t('methodNotAvailable')}</div>
      <div className="text-sds-header-xxs text-center">
        {t('selectThePortalStandardTomogramIn')}
      </div>
    </>
  )
}
