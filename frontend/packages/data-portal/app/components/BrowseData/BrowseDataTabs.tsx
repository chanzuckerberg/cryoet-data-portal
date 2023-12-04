import { useLocation } from '@remix-run/react'
import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetToolbarDataQuery } from 'app/__generated__/graphql'
import { TabData, Tabs } from 'app/components/Tabs'
import { i18n } from 'app/i18n'

export enum BrowseDataTab {
  Datasets = 'datasets',
  Runs = 'runs',
}

// TODO: uncomment features when implemented
export function BrowseDataTabs() {
  // const navigate = useNavigate()
  const { pathname } = useLocation()
  const tab = pathname.includes('/browse-data/datasets')
    ? BrowseDataTab.Datasets
    : BrowseDataTab.Runs

  const data = useTypedLoaderData<GetToolbarDataQuery>()
  const datasetCount = data.datasets_aggregate.aggregate?.count ?? 0
  // const runCount = data.runs_aggregate.aggregate?.count ?? 0

  const tabOptions = useMemo<TabData<BrowseDataTab>[]>(
    () => [
      {
        label: i18n.datasetsTab(datasetCount),
        value: BrowseDataTab.Datasets,
      },
      // {
      //   label: i18n.runsTab(runCount),
      //   value: BrowseDataTab.Runs,
      // },
    ],
    [datasetCount],
    // [datasetCount, runCount],
  )

  return (
    <Tabs
      // onChange={(nextTab) => navigate(`/browse-data/${nextTab}`)}
      onChange={() => null}
      value={tab}
      tabs={tabOptions}
    />
  )
}
