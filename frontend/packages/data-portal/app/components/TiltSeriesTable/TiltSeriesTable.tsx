import { Tiltseries } from 'app/__generated__/graphql'
import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { Tiltseries as TiltseriesV2 } from 'app/types/gql/genericTypes'
import { getTableData } from 'app/utils/table'

import { TiltSeriesKeys } from './constants'
import {
  useTiltSeriesTableRowsV2,
  useTiltSeriesValueMappings,
} from './useTiltSeriesValueMappings'

interface TiltSeriesTableProps {
  tiltSeriesData?: Partial<Tiltseries>
  tiltseriesV2?: TiltseriesV2
  fields: TiltSeriesKeys[]
}

export function TiltSeriesTable({
  tiltSeriesData,
  tiltseriesV2,
  fields,
}: TiltSeriesTableProps) {
  const { t } = useI18n()
  const mappings = useTiltSeriesValueMappings(tiltSeriesData)
  const v2Rows = useTiltSeriesTableRowsV2(tiltseriesV2)

  const tableData =
    tiltSeriesData !== undefined || tiltseriesV2 !== undefined
      ? getTableData(
          ...fields.map((field) =>
            tiltSeriesData !== undefined ? mappings[field] : v2Rows[field],
          ),
        )
      : []

  return (
    <AccordionMetadataTable
      id="tilt-series"
      header={t('tiltSeries')}
      data={tableData}
    />
  )
}
