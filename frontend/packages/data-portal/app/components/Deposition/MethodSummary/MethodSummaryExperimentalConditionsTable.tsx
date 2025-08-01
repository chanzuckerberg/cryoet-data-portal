/* eslint-disable react/no-unstable-nested-components */

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

import { CellHeader, TableCell } from 'app/components/Table'
import { ExperimentalConditionsTableWidths } from 'app/constants/table'
import {
  ExperimentalConditionsMethodMetadata,
  useDepositionById,
} from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTable } from './MethodSummaryTable'

export function MethodSummaryExperimentalConditionsTable() {
  const { t } = useI18n()
  const { experimentalConditions } = useDepositionById()

  const columns = useMemo(() => {
    const columnHelper =
      createColumnHelper<ExperimentalConditionsMethodMetadata>()

    return [
      columnHelper.accessor('sampleType', {
        header: () => (
          <CellHeader width={ExperimentalConditionsTableWidths.sampleType}>
            {t('sampleType')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={ExperimentalConditionsTableWidths.sampleType}>
            {row.original.sampleType}
          </TableCell>
        ),
      }),

      columnHelper.accessor('samplePreparation', {
        header: () => (
          <CellHeader
            width={ExperimentalConditionsTableWidths.samplePreparation}
          >
            {t('samplePreparation')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell
            tooltip={row.original.samplePreparation}
            width={ExperimentalConditionsTableWidths.samplePreparation}
          >
            <span className="line-clamp-2 pr-2">
              {row.original.samplePreparation}
            </span>
          </TableCell>
        ),
      }),

      columnHelper.accessor('gridPreparation', {
        header: () => (
          <CellHeader width={ExperimentalConditionsTableWidths.gridPreparation}>
            {t('gridPreparation')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell
            tooltip={row.original.gridPreparation}
            width={ExperimentalConditionsTableWidths.gridPreparation}
          >
            <span className="line-clamp-2 pr-2">
              {row.original.gridPreparation}
            </span>
          </TableCell>
        ),
      }),

      columnHelper.accessor('count', {
        header: () => (
          <CellHeader width={ExperimentalConditionsTableWidths.runs}>
            {t('runs')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={ExperimentalConditionsTableWidths.runs}>
            {row.original.count}
          </TableCell>
        ),
      }),
    ] as ColumnDef<ExperimentalConditionsMethodMetadata>[]
  }, [t])

  return <MethodSummaryTable columns={columns} data={experimentalConditions} />
}
