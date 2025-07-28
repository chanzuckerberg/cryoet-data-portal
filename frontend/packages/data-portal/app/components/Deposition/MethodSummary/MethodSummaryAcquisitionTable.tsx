/* eslint-disable react/no-unstable-nested-components */

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

import { CellHeader, TableCell } from 'app/components/Table'
import { AcquisitionMethodTableWidths } from 'app/constants/table'
import {
  type AcquisitionMethodMetadata,
  useDepositionById,
} from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTable } from './MethodSummaryTable'

export function MethodSummaryAcquisitionTable() {
  const { t } = useI18n()
  const { acquisitionMethods } = useDepositionById()
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<AcquisitionMethodMetadata>()

    return [
      columnHelper.accessor('microscope', {
        header: () => (
          <CellHeader width={AcquisitionMethodTableWidths.microscope}>
            {t('microscope')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AcquisitionMethodTableWidths.microscope}>
            {row.original.microscope}
          </TableCell>
        ),
      }),

      columnHelper.accessor('camera', {
        header: () => (
          <CellHeader width={AcquisitionMethodTableWidths.camera}>
            {t('camera')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AcquisitionMethodTableWidths.camera}>
            {row.original.camera}
          </TableCell>
        ),
      }),

      columnHelper.accessor('tiltingScheme', {
        header: () => (
          <CellHeader width={AcquisitionMethodTableWidths.tiltingScheme}>
            {t('tiltingScheme')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AcquisitionMethodTableWidths.tiltingScheme}>
            {row.original.tiltingScheme}
          </TableCell>
        ),
      }),

      columnHelper.accessor('pixelSize', {
        header: () => (
          <CellHeader width={AcquisitionMethodTableWidths.pixelSize}>
            {t('pixelSize')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AcquisitionMethodTableWidths.pixelSize}>
            {row.original.pixelSize}
          </TableCell>
        ),
      }),

      columnHelper.accessor('energyFilter', {
        header: () => (
          <CellHeader width={AcquisitionMethodTableWidths.energyFilter}>
            {t('energyFilter')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AcquisitionMethodTableWidths.energyFilter}>
            {row.original.energyFilter}
          </TableCell>
        ),
      }),

      columnHelper.accessor('electronOptics', {
        header: () => (
          <CellHeader width={AcquisitionMethodTableWidths.electronOptics}>
            {t('electronOptics')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AcquisitionMethodTableWidths.electronOptics}>
            {row.original.electronOptics}
          </TableCell>
        ),
      }),

      columnHelper.accessor('phasePlate', {
        header: () => (
          <CellHeader width={AcquisitionMethodTableWidths.phasePlate}>
            {t('phasePlate')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AcquisitionMethodTableWidths.phasePlate}>
            {row.original.phasePlate}
          </TableCell>
        ),
      }),
    ] as ColumnDef<AcquisitionMethodMetadata>[]
  }, [t])

  return <MethodSummaryTable columns={columns} data={acquisitionMethods} />
}
