/* eslint-disable react/no-unstable-nested-components */

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

import { CellHeader, TableCell } from 'app/components/Table'
import { AcquisitionMethodTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTable } from './MethodSummaryTable'

interface AcquisitionTableItem {
  microscope: string
  camera: string
  tiltingScheme: string
  pixelSize: number
  energyFilter: string
  electronOptics: string
  phasePlate: string
}

const MOCK_DATA: AcquisitionTableItem[] = [
  {
    microscope: 'FEI - TITAN KRIOS',
    camera: 'FEI - FALCON IV',
    tiltingScheme: 'dose-symmetric',
    pixelSize: 1.05,
    energyFilter: 'SELECTRIS',
    electronOptics: '300 kV / Cs = 2.7 mm',
    phasePlate: 'LPP',
  },
  {
    microscope: 'FEI - TITAN KRIOS',
    camera: 'FEI - FALCON IV',
    tiltingScheme: 'dose-symmetric',
    pixelSize: 1.05,
    energyFilter: 'SELECTRIS',
    electronOptics: '300 kV / Cs = 2.7 mm',
    phasePlate: 'LPP',
  },
]

export function MethodSummaryAcquisitionTable() {
  const { t } = useI18n()
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<AcquisitionTableItem>()

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
    ] as ColumnDef<AcquisitionTableItem>[]
  }, [t])

  return <MethodSummaryTable columns={columns} data={MOCK_DATA} />
}
