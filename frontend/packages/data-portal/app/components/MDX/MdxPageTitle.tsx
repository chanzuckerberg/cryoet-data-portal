import dayjs from 'dayjs'
import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'
import { useMdxFile } from 'app/hooks/useMdxFile'

export function MdxPageTitle({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const { lastModified } = useMdxFile()

  return (
    <div className="flex flex-col gap-sds-xs mb-sds-xxl">
      <h1 className="text-sds-header-xxl leading-sds-header-xxl font-semibold">
        {children}
      </h1>

      {lastModified && (
        <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600">
          {t('lastUpdated')}: {dayjs(lastModified).format('MMMM DD, YYYY')}
        </p>
      )}
    </div>
  )
}
