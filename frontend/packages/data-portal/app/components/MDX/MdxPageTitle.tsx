import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'

export function MdxPageTitle({
  children,
  lastModified,
}: {
  children: ReactNode
  lastModified: string
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-xs mb-sds-xxl">
      <h1 className="text-sds-header-xxl leading-sds-header-xxl font-semibold">
        {children}
      </h1>

      {lastModified && (
        <p className="text-sds-body-xxs leading-sds-body-xxs text-light-sds-color-primitive-gray-600">
          {t('lastUpdated')}: {lastModified}
        </p>
      )}
    </div>
  )
}
