import { Icon } from '@czi-sds/components'
import { ReactNode, useState } from 'react'

import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

interface ListEntry {
  key: string
  entry: ReactNode
}

export interface CollapsibleListProps {
  entries?: ListEntry[]

  // Number of items displayed when collapsed.
  // Collapse triggers when entries has >= collapseAfter + 2 items, so minimum "Show _ more" value
  // is 2.
  collapseAfter?: number

  inlineVariant?: boolean
  tableVariant?: boolean
}

export function CollapsibleList({
  entries,
  collapseAfter,
  inlineVariant = false,
  tableVariant = false,
}: CollapsibleListProps) {
  const collapsible =
    collapseAfter !== undefined &&
    collapseAfter >= 0 &&
    entries !== undefined &&
    entries.length > collapseAfter + 1 // Prevent "Show 1 more"

  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(true)

  const lastIndex =
    collapsible && collapsed ? collapseAfter - 1 : (entries ?? []).length - 1

  return entries && entries.length > 0 ? (
    <div>
      <ul
        className={cns(
          'flex',
          inlineVariant ? 'flex-wrap gap-sds-xxs' : 'flex-col gap-sds-xs',
          tableVariant
            ? 'text-sds-body-s leading-sds-body-s'
            : 'text-sds-body-xxs leading-sds-body-xxs',
          collapsible && 'transition-[max-height_0.2s_ease-out]',
        )}
      >
        {entries.slice(0, lastIndex + 1).map(({ key, entry }, i) => (
          <li key={key}>
            {entry}
            {inlineVariant && i !== lastIndex && ', '}
            {inlineVariant &&
              collapsible &&
              collapsed &&
              i === lastIndex &&
              '...'}
          </li>
        ))}
      </ul>
      {collapsible && (
        <div
          className={cns(
            'mt-sds-xxs font-semibold',
            tableVariant && 'text-sds-color-primitive-blue-400',
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
                    sdsIcon="Plus"
                    sdsSize="xs"
                    sdsType="static"
                    className="!text-current"
                  />
                  {t('showNumberMore', {
                    count: entries.length - collapseAfter,
                  })}
                </>
              ) : (
                <>
                  <Icon
                    sdsIcon="Minus"
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
    </div>
  ) : (
    <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-color-primitive-gray-600">
      {t('notSubmitted')}
    </p>
  )
}
