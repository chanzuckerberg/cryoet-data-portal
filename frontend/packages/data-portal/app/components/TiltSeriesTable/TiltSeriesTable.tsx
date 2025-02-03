import { Tiltseries } from 'app/__generated__/graphql'
import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { Tiltseries as TiltseriesV2 } from 'app/types/gql/genericTypes'
import { getTableData } from 'app/utils/table'

import { TiltSeriesKeys } from './constants'
import { useTiltSeriesValueMappings } from './useTiltSeriesValueMappings'

interface TiltSeriesTableProps {
  tiltSeriesData?: Partial<Tiltseries> | TiltseriesV2
  fields: TiltSeriesKeys[]
}

export function TiltSeriesTable({
  tiltSeriesData,
  fields,
}: TiltSeriesTableProps) {
  const { t } = useI18n()
  const mappings = useTiltSeriesValueMappings(tiltSeriesData)

  const tableData = tiltSeriesData
    ? getTableData(...fields.map((field) => mappings[field]))
    : []

  return (
    <AccordionMetadataTable
      id="tilt-series"
      header={t('tiltSeries')}
      data={tableData}
    />
  )
}
