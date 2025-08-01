import { Icon } from '@czi-sds/components'
import { useMemo } from 'react'

import { type TabData, Tabs } from 'app/components/Tabs'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'
import { cns } from 'app/utils/cns'

import { FlagIcon } from '../icons/FlagIcon'

export function DepositionTabs() {
  const preventScrollReset = true
  const [type, setType] = useActiveDepositionDataType(preventScrollReset)
  const tabs = useTabs(type)

  return <Tabs tabs={tabs} value={type} onChange={setType} vertical />
}

function useTabs(activeTab: DataContentsType) {
  const { t } = useI18n()
  const { annotationsCount, tomogramsCount } = useDepositionById()

  return useMemo<TabData<DataContentsType>[]>(() => {
    const tabData = [
      {
        tab: DataContentsType.Annotations,
        label: 'annotations',
        icon: 'Cube',
        count: annotationsCount,
      },
      {
        tab: DataContentsType.Tomograms,
        label: 'tomograms',
        icon: <FlagIcon />,
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
