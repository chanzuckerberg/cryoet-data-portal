/* eslint-disable react/no-unstable-nested-components */

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

import { CellHeader, TableCell } from 'app/components/Table'
import { TomogramMethodTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTable } from './MethodSummaryTable'

interface TomogramTableItem {
  count: number
  voxelSpacing: number
  reconstructionMethod: string
  postProcessing: string
  ctfCorrected: boolean
}

const MOCK_DATA: TomogramTableItem[] = [
  {
    count: 10,
    voxelSpacing: 2.5,
    reconstructionMethod: 'WBP',
    postProcessing: 'Denoised',
    ctfCorrected: true,
  },
  {
    count: 20,
    voxelSpacing: 4.99,
    reconstructionMethod: 'WBP',
    postProcessing: 'Denoised',
    ctfCorrected: false,
  },
]

export function MethodSummaryTomogramsTable() {
  const { t } = useI18n()
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<TomogramTableItem>()

    return [
      columnHelper.accessor('count', {
        header: () => (
          <CellHeader width={TomogramMethodTableWidths.count}>
            {t('tomograms')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={TomogramMethodTableWidths.count}>
            {row.original.count}
          </TableCell>
        ),
      }),

      columnHelper.accessor('voxelSpacing', {
        header: () => (
          <CellHeader width={TomogramMethodTableWidths.voxelSpacing}>
            {t('voxelSpacing')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={TomogramMethodTableWidths.voxelSpacing}>
            {t('unitAngstrom', { value: row.original.voxelSpacing })}
          </TableCell>
        ),
      }),

      columnHelper.accessor('reconstructionMethod', {
        header: () => (
          <CellHeader width={TomogramMethodTableWidths.reconstructionMethod}>
            {t('reconstructionMethod')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={TomogramMethodTableWidths.reconstructionMethod}>
            {row.original.reconstructionMethod}
          </TableCell>
        ),
      }),

      columnHelper.accessor('postProcessing', {
        header: () => (
          <CellHeader width={TomogramMethodTableWidths.postProcessing}>
            {t('postProcessing')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={TomogramMethodTableWidths.postProcessing}>
            {row.original.postProcessing}
          </TableCell>
        ),
      }),

      columnHelper.accessor('ctfCorrected', {
        header: () => (
          <CellHeader width={TomogramMethodTableWidths.ctfCorrected}>
            {t('methodLinks')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={TomogramMethodTableWidths.ctfCorrected}>
            {t(row.original.ctfCorrected ? 'true' : 'false')}
          </TableCell>
        ),
      }),
    ] as ColumnDef<TomogramTableItem>[]
  }, [t])

  return <MethodSummaryTable columns={columns} data={MOCK_DATA} />
}
