import { Icon } from '@czi-sds/components'
import { ReactNode, useState } from 'react'

import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

interface ListEntry {
  key: string
  entry: ReactNode
}

export function CollapsibleList({
  entries,
  collapseAfter,
  tableVariant = false,
}: {
  entries?: ListEntry[]
  collapseAfter?: number
  tableVariant?: boolean
}) {
  const collapsible =
    collapseAfter !== undefined &&
    collapseAfter >= 0 &&
    entries !== undefined &&
    entries.length > collapseAfter + 1

  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(true)

  return entries ? (
    <ul
      className={cns(
        'flex flex-col gap-sds-xs',
        'text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600',
        collapsible && 'transition-[max-height_0.2s_ease-out]',
      )}
    >
      {entries.map(
        ({ key, entry }, i) =>
          !(collapsible && collapsed && i + 1 > collapseAfter) && (
            <li key={key}>{entry}</li>
          ),
      )}
      {collapsible && (
        <div
          className={cns(
            'mt-sds-xxs font-semibold',
            tableVariant && 'text-sds-primary-400',
          )}
        >
          <button type="button" onClick={() => setCollapsed(!collapsed)}>
            <span
              className={cns(
                'flex flex-row gap-sds-xxs items-center',
                !tableVariant && 'capitalize',
              )}
            >
              {collapsed ? (
                <>
                  <Icon
                    sdsIcon="plus"
                    sdsSize="xs"
                    sdsType="static"
                    className="!text-current"
                  />
                  {t('showMore', { count: entries.length - collapseAfter })}
                </>
              ) : (
                <>
                  <Icon
                    sdsIcon="minus"
                    sdsSize="xs"
                    sdsType="static"
                    className="!text-current"
                  />
                  {t('showLess')}
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </ul>
  ) : (
    <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600">
      {t('notSubmitted')}
    </p>
  )
}
