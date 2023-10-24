import { ButtonIcon } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { Demo } from 'app/components/Demo'
import { Drawer } from 'app/components/Drawer'
import { TabData, Tabs } from 'app/components/Tabs'
import { i18n } from 'app/i18n'
import { datasetDrawerOpenAtom } from 'app/state/drawer'
import { cns } from 'app/utils/cns'

import { DatasetMetadataTable } from './DatasetMetadataTable'
import { SampleAndExperimentConditionsTable } from './SampleAndExperimentConditionsTable'
import { TiltSeriesTable } from './TiltSeriesTable'

enum MetadataTab {
  Metadata = 'metadata',
  HowToCite = 'howToCite',
}

const TAB_OPTIONS: TabData<MetadataTab>[] = [
  {
    label: i18n.metadata,
    value: MetadataTab.Metadata,
  },
  {
    label: i18n.howToCite,
    value: MetadataTab.HowToCite,
  },
]

const ACTIVE_TAB_PARAM = 'tab'

export function DatasetMetadataDrawer() {
  const [open, setOpen] = useAtom(datasetDrawerOpenAtom)

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get(ACTIVE_TAB_PARAM) ??
    MetadataTab.Metadata) as MetadataTab

  const initialLoadRef = useRef(true)
  if (initialLoadRef.current && searchParams.has(ACTIVE_TAB_PARAM)) {
    initialLoadRef.current = false
    setOpen(true)
  }

  useEffect(() => {
    if (open && searchParams.get(ACTIVE_TAB_PARAM) !== activeTab) {
      setSearchParams((params) => {
        params.set(ACTIVE_TAB_PARAM, activeTab)
        return params
      })
    } else if (!open) {
      setSearchParams((params) => {
        params.delete(ACTIVE_TAB_PARAM)
        return params
      })
    }
  }, [activeTab, open, searchParams, setSearchParams])

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <div className="flex flex-col flex-auto">
        <header className="flex items-start justify-between px-sds-xl pt-sds-xl pb-sds-xxl">
          <div className="flex flex-col gap-sds-s">
            <p className="text-xs text-sds-gray-600 font-semibold uppercase">
              {i18n.datasetDetails}
            </p>

            <p className="text-sds-header-xl font-semibold text-black leading-[30px] line-clamp-3">
              really long title that is so long that we need to wrap it in 3
              lines but clamp it at 3 lines max because of how long the text
              really is because the text is so long it has to be clamped
              {/* {dataset.title} */}
            </p>
          </div>

          <ButtonIcon
            onClick={() => setOpen(false)}
            sdsIcon="xMark"
            sdsIconProps={{
              color: 'gray',
            }}
          />
        </header>

        <div className="px-sds-xl border-b-2 border-sds-gray-200">
          <Tabs
            className="!m-0"
            tabs={TAB_OPTIONS}
            value={activeTab}
            onChange={(tab) =>
              setSearchParams((params) => {
                params.set(ACTIVE_TAB_PARAM, tab)
                return params
              })
            }
          />
        </div>

        <div
          className={cns(
            'flex flex-col flex-auto',
            'px-sds-xl pt-sds-xl pb-sds-xxl',

            activeTab === MetadataTab.Metadata &&
              'divide-y divide-sds-gray-300',
          )}
        >
          {activeTab === MetadataTab.Metadata && (
            <>
              <DatasetMetadataTable />
              <SampleAndExperimentConditionsTable />
              <TiltSeriesTable />
            </>
          )}

          {activeTab === MetadataTab.HowToCite && <Demo>How to cite</Demo>}
        </div>
      </div>
    </Drawer>
  )
}
