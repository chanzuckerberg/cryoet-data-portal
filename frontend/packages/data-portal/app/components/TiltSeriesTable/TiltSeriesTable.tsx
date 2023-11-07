import { Tiltseries } from 'app/__generated__/graphql'
import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { getTableData } from 'app/components/utils'
import { i18n } from 'app/i18n'

import { TILT_SERIES_VALUE_MAPPINGS, TiltSeriesKeys } from './constants'

interface TiltSeriesTableProps {
  tiltSeriesData?: Partial<Tiltseries>
  fields: TiltSeriesKeys[]
}

export function TiltSeriesTable(props: TiltSeriesTableProps) {
  const { tiltSeriesData, fields } = props

  const tiltSeries = tiltSeriesData
    ? getTableData(
        ...fields.map((field) => {
          const getData = TILT_SERIES_VALUE_MAPPINGS.get(field)
          return getData!(tiltSeriesData)
        }),
      )
    : []

  return (
    <AccordionMetadataTable
      id="tilt-series"
      header={i18n.tiltSeries}
      data={tiltSeries}
    />
  )
}
