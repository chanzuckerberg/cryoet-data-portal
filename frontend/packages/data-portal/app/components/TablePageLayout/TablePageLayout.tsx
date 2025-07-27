import Divider from '@mui/material/Divider'
import { useSearchParams } from '@remix-run/react'

import { Tabs } from 'app/components/Tabs'
import { QueryParams } from 'app/constants/query'
import { cns } from 'app/utils/cns'

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
  title,
  titleContent,
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
                      {tab.filteredCount.toLocaleString()}
                    </span>
                  </div>
                ),
                value: tab.title,
              }))}
            />
          </div>
        )}

        {title && (
          <>
            <Divider className="bg-light-sds-color-semantic-base-divider h-1 !mt-sds-xl" />

            <div className="flex items-center gap-[50px] ml-sds-xl mt-sds-xxl mb-sds-l">
              <h2
                className={cns(
                  'font-semibold text-sds-header-xxl-600-wide',
                  'tracking-sds-header-xxl-600-wide leading-sds-header-xxl',
                )}
              >
                {title}
              </h2>

              {titleContent}
            </div>
          </>
        )}

        <TablePageTabContent banner={banner} {...activeTab} />

        {drawers}
      </div>
    </>
  )
}
