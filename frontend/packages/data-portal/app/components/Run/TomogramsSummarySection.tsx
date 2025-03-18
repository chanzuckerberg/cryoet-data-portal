import { Button } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { TableDataValue } from 'app/types/table'
import { getTableData } from 'app/utils/table'

import { CollapsibleList } from '../CollapsibleList'

export function TomogramsSummarySection() {
  const { t } = useI18n()
  const [, setSearchParams] = useSearchParams()
  const { processingMethods, objectNames, resolutions, tomogramsCount } =
    useRunById()

  const tomogramsTableData = getTableData(
    {
      label: t('totalTomograms'),
      values: [tomogramsCount],
      renderValues: (values: TableDataValue[]) => (
        <ul className="list-none">
          <li className="flex justify-between overflow-x-auto">
            {values[0]}
            <Button
              onClick={() => {
                setSearchParams((prev) => {
                  // Cannot use closeDrawer()
                  // https://github.com/remix-run/react-router/issues/9757
                  prev.delete(QueryParams.MetadataDrawer)
                  prev.delete(QueryParams.Tab)
                  prev.set(QueryParams.TableTab, t('tomograms'))
                  return prev
                })
              }}
              className="!uppercase !text-sds-caps-xxxs-600-wide !p-0"
            >
              {t('goToTomograms')}
            </Button>
          </li>
        </ul>
      ),
    },
    {
      label: t('resolutionsAvailable'),
      values: resolutions.map((resolution) =>
        t('unitAngstrom', { value: resolution }),
      ),
    },
    {
      label: t('tomogramProcessing'),
      values: processingMethods,
      className: 'capitalize',
    },
    {
      label: t('annotatedObjects'),
      values: objectNames,
      renderValues: (values: TableDataValue[]) => (
        <CollapsibleList
          entries={values.map((value) => ({
            key: value.toString(),
            entry: value.toString(),
          }))}
          tableVariant
          collapseAfter={4}
        />
      ),
    },
  )

  return (
    <AccordionMetadataTable
      header={t('tomogramsSummary')}
      id="tomograms-summary"
      data={tomogramsTableData}
    />
  )
}
