import { useSearchParams } from '@remix-run/react'

import { Tabs } from 'app/components/Tabs'
import { QueryParams } from 'app/constants/query'

import { TablePageTabContent } from './components/TablePageTabContent'
import { TablePageLayoutProps } from './types'

/** Standard page structure for browsing + filtering list(s) of objects. */
export function TablePageLayout({
  header,
  tabs,
  tabsTitle,
  downloadModal,
  drawers,
  banner,
}: TablePageLayoutProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTabTitle = searchParams.get(QueryParams.TableTab)
  const activeTab = tabs.find((tab) => tab.title === activeTabTitle) ?? tabs[0]

  return (
    <>
      {downloadModal}

      <div className="flex flex-col flex-auto">
        {header}

        {tabs.length > 1 && (
          <div className="max-w-content w-full self-center px-sds-xl">
            {tabsTitle && (
              <div className="text-sds-header-l-600-wide leading-sds-header-l font-semibold mb-sds-s">
                {tabsTitle}
              </div>
            )}
            <Tabs
              value={activeTab.title}
              onChange={(tabTitle: string) => {
                setSearchParams((prev) => {
                  prev.set(QueryParams.TableTab, tabTitle)
                  return prev
                })
              }}
              tabs={tabs.map((tab) => ({
                label: (
                  <div>
                    <span>{tab.title}</span>
                    <span className="text-light-sds-color-primitive-gray-500 ml-[16px]">
                      {tab.filteredCount}
                    </span>
                  </div>
                ),
                value: tab.title,
              }))}
            />
          </div>
        )}

        <TablePageTabContent banner={banner} {...activeTab} />

        {drawers}
      </div>
    </>
  )
}
