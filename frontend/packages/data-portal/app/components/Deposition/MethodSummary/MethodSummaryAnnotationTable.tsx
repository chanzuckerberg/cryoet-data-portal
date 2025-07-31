/* eslint-disable react/no-unstable-nested-components */

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

import { MethodLinkList } from 'app/components/Deposition/MethodLinks/MethodLinkList'
import { MethodTypeLabel } from 'app/components/Deposition/MethodLinks/MethodTypeLabel'
import { CellHeader, TableCell } from 'app/components/Table'
import { AnnotationMethodTableWidths } from 'app/constants/table'
import {
  AnnotationMethodMetadata,
  useDepositionById,
} from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'

import { MethodSummaryTable } from './MethodSummaryTable'

export function MethodSummaryAnnotationTable() {
  const { t } = useI18n()
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<AnnotationMethodMetadata>()

    return [
      columnHelper.accessor('count', {
        header: () => (
          <CellHeader width={AnnotationMethodTableWidths.count}>
            {t('annotations')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AnnotationMethodTableWidths.count}>
            {row.original.count}
          </TableCell>
        ),
      }),

      columnHelper.accessor('methodType', {
        header: () => (
          <CellHeader width={AnnotationMethodTableWidths.methodType}>
            {t('methodType')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AnnotationMethodTableWidths.methodType}>
            <MethodTypeLabel methodType={row.original.methodType} />
          </TableCell>
        ),
      }),

      columnHelper.accessor('annotationMethod', {
        header: () => (
          <CellHeader width={AnnotationMethodTableWidths.methodDetails}>
            {t('methodDetails')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell
            tooltip={row.original.annotationMethod}
            width={AnnotationMethodTableWidths.methodDetails}
          >
            <span className="line-clamp-2">
              {row.original.annotationMethod}
            </span>
          </TableCell>
        ),
      }),

      columnHelper.accessor('methodLinks', {
        header: () => (
          <CellHeader width={AnnotationMethodTableWidths.methodLinks}>
            {t('methodLinks')}
          </CellHeader>
        ),

        cell: ({ row }) => (
          <TableCell width={AnnotationMethodTableWidths.methodLinks}>
            <MethodLinkList
              annotationMethod={row.original.annotationMethod}
              methodLinks={row.original.methodLinks}
            />
          </TableCell>
        ),
      }),
    ] as ColumnDef<AnnotationMethodMetadata>[]
  }, [t])

  const { annotationMethods } = useDepositionById()

  return <MethodSummaryTable columns={columns} data={annotationMethods} />
}
