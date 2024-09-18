import { useI18n } from 'app/hooks/useI18n'

export function SelectSaveDestination() {
  const { t } = useI18n()

  return (
    <>
      <p className="mb-sds-xxs">
        <span className="text-sds-header-s leading-sds-header-s font-semibold">
          1. {t('selectSaveDestination')}:{' '}
        </span>

        <span className="text-sds-body-xs leading-sds-body-xs text-sds-color-primitive-gray-500 lowercase">
          — {t('optional')}
        </span>
      </p>

      <p className="text-sds-header-xs leading-sds-header-xs text-sds-color-primitive-gray-600">
        {t('downloadWillSaveToCurrentDirectory')}
      </p>
    </>
  )
}
