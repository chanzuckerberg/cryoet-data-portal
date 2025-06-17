/* eslint-disable react/no-unstable-nested-components */

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

import {
  TOMOGRAM_METHOD_MOCK_DATA,
  type TomogramMethodItem,
} from 'app/components/Deposition/mock'
import { CellHeader, TableCell } from 'app/components/Table'
import { TomogramMethodTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTable } from './MethodSummaryTable'

export function MethodSummaryTomogramsTable() {
  const { t } = useI18n()
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<TomogramMethodItem>()

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
            {t('ctfCorrected')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={TomogramMethodTableWidths.ctfCorrected}>
            {t(row.original.ctfCorrected ? 'true' : 'false')}
          </TableCell>
        ),
      }),
    ] as ColumnDef<TomogramMethodItem>[]
  }, [t])

  return (
    <MethodSummaryTable columns={columns} data={TOMOGRAM_METHOD_MOCK_DATA} />
  )
}
