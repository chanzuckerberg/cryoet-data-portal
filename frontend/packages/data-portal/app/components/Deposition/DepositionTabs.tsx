import { Icon } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'

import { type TabData, Tabs } from 'app/components/Tabs'
import { QueryParams } from 'app/constants/query'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'
import { cns } from 'app/utils/cns'

import { FlagIcon } from '../icons/FlagIcon'

export function DepositionTabs() {
  const preventScrollReset = true
  const [type] = useActiveDepositionDataType(preventScrollReset)
  const [, setSearchParams] = useSearchParams()
  const tabs = useTabs(type)

  return (
    <Tabs
      tabs={tabs}
      value={type}
      onChange={(value) =>
        setSearchParams(
          (prev) => {
            prev.set(QueryParams.DepositionTab, value)
            prev.delete(QueryParams.GroupBy)
            prev.delete(QueryParams.Page)
            return prev
          },
          { preventScrollReset: true },
        )
      }
      vertical
    />
  )
}

function useTabs(activeTab: DataContentsType) {
  const { t } = useI18n()
  const { annotationsCount, tomogramsCount } = useDepositionById()

  return useMemo<TabData<DataContentsType>[]>(() => {
    const tabData = [
      {
        tab: DataContentsType.Annotations,
        label: 'annotations',
        icon: <FlagIcon />,
        count: annotationsCount,
      },
      {
        tab: DataContentsType.Tomograms,
        label: 'tomograms',
        icon: 'Cube',
        count: tomogramsCount,
      },
    ] as const

    return tabData.map(({ tab, label, icon, count }) => ({
      value: tab,
      label: (
        <span
          className={cns(
            'font-semibold text-sds-body-s-600-wide',
            'tracking-sds-body-s-600-wide leading-sds-body-s',
            'w-full flex items-center justify-between',
          )}
        >
          <span className="flex items-center gap-sds-xs">
            {typeof icon === 'string' ? (
              <Icon
                className={
                  activeTab === tab
                    ? '!text-black'
                    : '!text-light-sds-color-primitive-gray-600'
                }
                sdsIcon={icon}
                sdsSize="xs"
              />
            ) : (
              icon
            )}

            <span>{t(label)}</span>
          </span>

          <span>{count.toLocaleString()}</span>
        </span>
      ),
    }))
  }, [activeTab, annotationsCount, t, tomogramsCount])
}
