import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { TableDataValue } from 'app/types/table'
import { cns } from 'app/utils/cns'
import { getTableData } from 'app/utils/table'

import { CollapsibleList } from '../CollapsibleList'

export function TomogramsSummarySection() {
  const { t } = useI18n()
  const { processingMethods, objectNames, resolutions, tomogramsCount } =
    useRunById()

  const tomogramsTableData = getTableData(
    {
      label: t('totalTomograms'),
      values: [tomogramsCount],
      renderValues: (values: TableDataValue[]) => (
        <ul className="list-none flex flex-wrap gap-1">
          <li className={cns('overflow-x-auto', 'inline-block')}>
            {values[0]}
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
          collapseAfter={6}
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
