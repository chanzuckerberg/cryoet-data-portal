/* eslint-disable react/no-unstable-nested-components */

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

import { CellHeader, TableCell } from 'app/components/Table'
import { ExperimentalConditionsTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTable } from './MethodSummaryTable'

interface ExperimentalConditionsTableItem {
  sampleType: string
  samplePreparation: number
  gridPreparation: string
  runs: number
}

const MOCK_DATA: ExperimentalConditionsTableItem[] = [
  {
    sampleType: 'Chlamydomonas reinhardtii',
    samplePreparation: 1.05,
    gridPreparation: 'dose-symmetric',
    runs: 20,
  },
  {
    sampleType: 'Chlamydomonas reinhardtii',
    samplePreparation: 1.05,
    gridPreparation: 'dose-symmetric',
    runs: 3,
  },
]

export function MethodSummaryExperimentalConditionsTable() {
  const { t } = useI18n()

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ExperimentalConditionsTableItem>()

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
            width={ExperimentalConditionsTableWidths.samplePreparation}
          >
            {row.original.samplePreparation}
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
          <TableCell width={ExperimentalConditionsTableWidths.gridPreparation}>
            {row.original.gridPreparation}
          </TableCell>
        ),
      }),

      columnHelper.accessor('runs', {
        header: () => (
          <CellHeader width={ExperimentalConditionsTableWidths.runs}>
            {t('runs')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={ExperimentalConditionsTableWidths.runs}>
            {row.original.runs}
          </TableCell>
        ),
      }),
    ] as ColumnDef<ExperimentalConditionsTableItem>[]
  }, [t])

  return <MethodSummaryTable columns={columns} data={MOCK_DATA} />
}
