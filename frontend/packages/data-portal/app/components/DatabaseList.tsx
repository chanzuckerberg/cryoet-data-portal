import { Button } from '@czi-sds/components'
import { useState } from 'react'

import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export function DatabaseList({
  entries,
  collapseAfter,
}: {
  entries?: string[]
  collapseAfter?: number
}) {
  const collapsible =
    collapseAfter !== undefined &&
    collapseAfter >= 0 &&
    entries !== undefined &&
    entries.length > collapseAfter

  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(true)

  return entries ? (
    <ul
      className={cns(
        'flex flex-col gap-sds-xxs',
        collapsible && 'transition-[max-height_0.2s_ease-out]',
      )}
    >
      {entries.map(
        (e, i) =>
          !(collapsible && collapsed && i + 1 > collapseAfter) && (
            <li className="text-sds-body-xxs leading-sds-body-xxs" key={e}>
              <DatabaseEntry entry={e} />
            </li>
          ),
      )}
      {collapsible && (
        <div>
          <Button
            sdsType="primary"
            sdsStyle="minimal"
            onClick={() => setCollapsed(!collapsed)}
            // remove whitespace
            style={{ minWidth: 0, padding: 0 }}
          >
            {collapsed
              ? t('plusMore', { count: entries.length - collapseAfter })
              : t('showLess')}
          </Button>
        </div>
      )}
    </ul>
  ) : (
    <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-400">
      {t('notSubmitted')}
    </p>
  )
}
