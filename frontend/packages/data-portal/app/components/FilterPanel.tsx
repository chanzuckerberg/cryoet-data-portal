import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'

export function FilterPanel({ children }: { children: ReactNode }) {
  const { t } = useI18n()

  return (
    <div className="pl-sds-l pt-sds-xxl pb-[100px] flex flex-col gap-sds-l">
      <p className="text-sds-header-m leading-sds-header-m px-sds-s font-semibold">
        {t('filterBy')}:
      </p>

      <div className="flex flex-col gap-sds-xxs">{children}</div>
    </div>
  )
}
