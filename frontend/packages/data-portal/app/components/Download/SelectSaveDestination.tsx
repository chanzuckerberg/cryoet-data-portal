import { useI18n } from 'app/hooks/useI18n'

export function SelectSaveDestination() {
  const { t } = useI18n()

  return (
    <>
      <p className="mb-sds-xxs">
        <span className="text-sds-header-s-600-wide leading-sds-header-s font-semibold">
          1. {t('selectSaveDestination')}:{' '}
        </span>

        <span className="text-sds-body-xs-400-wide leading-sds-body-xs text-light-sds-color-primitive-gray-500 lowercase">
          — {t('optional')}
        </span>
      </p>

      <p className="text-sds-header-xs-600-wide leading-sds-header-xs text-light-sds-color-primitive-gray-600">
        {t('downloadWillSaveToCurrentDirectory')}
      </p>
    </>
  )
}
