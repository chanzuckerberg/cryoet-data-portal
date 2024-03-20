import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'

export function FilterPanel({ children }: { children: ReactNode }) {
  const { t } = useI18n()

  return (
    <div className="pl-sds-l flex flex-col gap-sds-xxs">
      <p className="text-sds-header-m leading-sds-header-m px-sds-s pt-sds-xl font-semibold">
        {t('filterBy')}:
      </p>

      {children}
    </div>
  )
}
