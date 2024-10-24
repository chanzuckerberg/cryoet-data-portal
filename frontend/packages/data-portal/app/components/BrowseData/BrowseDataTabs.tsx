import { useLocation, useNavigate } from '@remix-run/react'
import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetToolbarDataQuery } from 'app/__generated__/graphql'
import { TabData, Tabs } from 'app/components/Tabs'
import { useI18n } from 'app/hooks/useI18n'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import { BrowseDataTab } from 'app/types/browseData'
import { useFeatureFlag } from 'app/utils/featureFlags'

// TODO: uncomment features when implemented
export function BrowseDataTabs() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const showDepositions = useFeatureFlag('depositions')

  let tab = BrowseDataTab.Datasets
  if (pathname.includes('/browse-data/depositions')) {
    tab = BrowseDataTab.Depositions
  } else if (pathname.includes('/browse-data/runs')) {
    tab = BrowseDataTab.Runs
  }

  const data = useTypedLoaderData<GetToolbarDataQuery>()
  const datasetCount = data.datasets_aggregate.aggregate?.count ?? 0
  const depositionsCount = data.depositions_aggregate.aggregate?.count ?? 0
  // const runCount = data.runs_aggregate.aggregate?.count ?? 0

  const tabOptions = useMemo<TabData<BrowseDataTab>[]>(
    () => [
      {
        label: t('datasetsTab', { count: datasetCount }),
        value: BrowseDataTab.Datasets,
      },
      // {
      //   label: t('runsTab', { count: runCount }),
      //   value: BrowseDataTab.Runs,
      // },
      {
        label: t('depositionsTab', { count: depositionsCount }),
        value: BrowseDataTab.Depositions,
      },
    ],
    [datasetCount, depositionsCount, t],
    // [datasetCount, depositionsCount, runCount, t],
  )

  const plausible = usePlausible()

  return (
    <Tabs
      onChange={(nextTab) => {
        plausible(Events.ClickBrowseDataTab, { tab: nextTab })
        navigate(`/browse-data/${nextTab}`)
      }}
      value={tab}
      tabs={tabOptions.filter(
        (option) =>
          showDepositions || option.value !== BrowseDataTab.Depositions,
      )}
    />
  )
}
