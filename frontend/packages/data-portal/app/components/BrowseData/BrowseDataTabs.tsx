import { Tab, Tabs } from '@czi-sds/components'
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react'

import { GetToolbarDataQuery } from 'app/__generated__/graphql'
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

  return (
    // TODO fix TypeScript issue upstream. For some reason the Tabs component is
    // requiring every prop to be passed rather than making it optional.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Tabs
      sdsSize="large"
      onChange={(_, nextTab: BrowseDataTab) =>
        navigate(`/browse-data/${nextTab}`)
      }
      value={tab}
    >
      <Tab
        label={`${i18n.datasets} ${
          data.datasets_aggregate.aggregate?.count ?? 0
        }`}
        value={BrowseDataTab.Datasets}
      />

      <Tab
        label={`${i18n.runs} ${data.runs_aggregate.aggregate?.count ?? 0}`}
        value={BrowseDataTab.Runs}
      />
    </Tabs>
  )
}
