import { Icon } from '@czi-sds/components'
import { useMemo } from 'react'

import { type TabData, Tabs } from 'app/components/Tabs'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useDepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'
import { cns } from 'app/utils/cns'

export function DepositionTabs() {
  const [tab, setTab] = useDepositionTab()
  const tabs = useTabs(tab)

  return <Tabs tabs={tabs} value={tab} onChange={setTab} vertical />
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
        icon: 'FlagOutline',
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
            <Icon
              className={
                activeTab === tab
                  ? '!text-black'
                  : '!text-light-sds-color-primitive-gray-600'
              }
              sdsIcon={icon}
              sdsSize="xs"
            />

            <span>{t(label)}</span>
          </span>

          <span>{count.toLocaleString()}</span>
        </span>
      ),
    }))
  }, [activeTab, annotationsCount, t, tomogramsCount])
}
