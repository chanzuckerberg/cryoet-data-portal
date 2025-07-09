import { TabData, Tabs } from 'app/components/Tabs'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTab } from './types'
import { useMethodSummaryTab } from './useMethodSummaryTab'

export function MethodSummaryTabs() {
  const tabs = useTabs()
  const [tab, setTab] = useMethodSummaryTab()

  return <Tabs onChange={setTab} tabs={tabs} value={tab} />
}

function useTabs(): TabData<MethodSummaryTab>[] {
  const { t } = useI18n()

  return [
    {
      value: MethodSummaryTab.Annotations,
      label: t('annotations'),
    },
    {
      value: MethodSummaryTab.Tomograms,
      label: t('tomograms'),
    },
    {
      value: MethodSummaryTab.Acquisition,
      label: t('acquisition'),
    },
    {
      value: MethodSummaryTab.ExperimentalConditions,
      label: t('experimentalConditions'),
    },
  ]
}
