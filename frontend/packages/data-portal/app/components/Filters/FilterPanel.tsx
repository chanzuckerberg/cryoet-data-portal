import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'

export function FilterPanel({ children }: { children: ReactNode }) {
  const { t } = useI18n()

  return (
    <aside className="flex flex-col gap-sds-xxs">
      <div className="pl-sds-xl pr-sds-m pt-sds-xl">
        <p className="font-semibold text-sds-header-m leading-sds-header-m">
          {t('filterBy')}:
        </p>
      </div>

      {children}
    </aside>
  )
}
