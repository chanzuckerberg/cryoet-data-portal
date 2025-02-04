import { Icon } from '@czi-sds/components'
import { ReactNode, useState } from 'react'

import { useI18n } from 'app/hooks/useI18n'

export function MdxToggleShowMore({ children }: { children: ReactNode }) {
  const { t } = useI18n()

  const [collapsed, setCollapsed] = useState(true)

  return (
    <div>
      {collapsed ? null : children}
      <button type="button" onClick={() => setCollapsed(!collapsed)}>
        <span className="flex flex-row gap-sds-xxs items-center capitalize font-semibold text-sds-color-semantic-text-action-default hover:text-sds-color-semantic-text-action-hover mt-sds-m">
          <Icon
            sdsIcon={collapsed ? 'Plus' : 'Minus'}
            sdsSize="xs"
            sdsType="static"
            className="!text-current"
          />
          {t(collapsed ? 'showAll' : 'showLess')}
        </span>
      </button>
    </div>
  )
}
