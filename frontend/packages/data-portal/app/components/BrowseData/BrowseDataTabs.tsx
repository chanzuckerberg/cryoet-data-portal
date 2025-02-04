import { useLocation, useNavigate } from '@remix-run/react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetToolbarDataQuery } from 'app/__generated_v2__/graphql'
import { Tabs } from 'app/components/Tabs'
import { useI18n } from 'app/hooks/useI18n'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import { BrowseDataTab } from 'app/types/browseData'

export function BrowseDataTabs() {
  const plausible = usePlausible()
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const data = useTypedLoaderData<GetToolbarDataQuery>()

  return (
    <Tabs
      onChange={(nextTab) => {
        plausible(Events.ClickBrowseDataTab, { tab: nextTab })
        navigate(`/browse-data/${nextTab}`)
      }}
      value={
        pathname.includes('/browse-data/depositions')
          ? BrowseDataTab.Depositions
          : BrowseDataTab.Datasets
      }
      tabs={[
        {
          label: t('datasetsTab', {
            count: data.datasetsAggregate.aggregate?.[0]?.count ?? 0,
          }),
          value: BrowseDataTab.Datasets,
        },
        {
          label: t('depositionsTab', {
            count: data.depositionsAggregate.aggregate?.[0]?.count ?? 0,
          }),
          value: BrowseDataTab.Depositions,
        },
      ]}
    />
  )
}
