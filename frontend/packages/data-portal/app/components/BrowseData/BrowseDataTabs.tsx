import { useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import { useMemo } from 'react'

import { GetToolbarDataQuery } from 'app/__generated__/graphql'
import { TabData, Tabs } from 'app/components/Tabs'
import { i18n } from 'app/i18n'

export enum BrowseDataTab {
  Datasets = 'datasets',
  Runs = 'runs',
}

export function BrowseDataTabs() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tab = pathname.includes('/browse-data/datasets')
    ? BrowseDataTab.Datasets
    : BrowseDataTab.Runs

  const data = useLoaderData<GetToolbarDataQuery>()
  const datasetCount = data.datasets_aggregate.aggregate?.count ?? 0
  const runCount = data.runs_aggregate.aggregate?.count ?? 0

  const tabOptions = useMemo<TabData<BrowseDataTab>[]>(
    () => [
      {
        label: i18n.datasetsTab(datasetCount),
        value: BrowseDataTab.Datasets,
      },
      {
        label: i18n.runsTab(runCount),
        value: BrowseDataTab.Runs,
      },
    ],
    [datasetCount, runCount],
  )

  return (
    <Tabs
      onChange={(nextTab) => navigate(`/browse-data/${nextTab}`)}
      value={tab}
      tabs={tabOptions}
    />
  )
}
