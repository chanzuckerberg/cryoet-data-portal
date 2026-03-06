import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'

const DATE_TEXT_STYLES =
  'text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-primitive-gray-600'

export function MdxPageTitle({
  children,
  lastModified,
  effectiveDate,
}: {
  children: ReactNode
  lastModified: string
  effectiveDate?: string
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-xs mb-sds-xxl">
      <h1 className="text-sds-header-xxl-600-wide leading-sds-header-xxl font-semibold">
        {children}
      </h1>

      {lastModified && (
        <p className={DATE_TEXT_STYLES}>
          {t('lastUpdated')}: {lastModified}
        </p>
      )}

      {effectiveDate && (
        <p className={DATE_TEXT_STYLES}>
          {t('effectiveDate')}: {effectiveDate}
        </p>
      )}
    </div>
  )
}
