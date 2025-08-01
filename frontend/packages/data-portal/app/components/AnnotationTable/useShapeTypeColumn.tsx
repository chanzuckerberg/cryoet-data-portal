import Skeleton from '@mui/material/Skeleton'
import { createColumnHelper } from '@tanstack/react-table'

import type { AnnotationShape } from 'app/__generated_v2__/graphql'
import { CellHeader, TableCell } from 'app/components/Table'
import type { TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<AnnotationShape>()

export function useShapeTypeColumn({
  width,
  isLoading,
}: {
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('shapeType', {
    header: () => <CellHeader width={width}>{t('objectShapeType')}</CellHeader>,

    cell: ({ row: { original: annotationShape } }) => (
      <TableCell
        renderLoadingSkeleton={() => (
          <Skeleton className="w-[200px]" variant="text" />
        )}
        showLoadingSkeleton={isLoading}
        width={width}
      >
        {annotationShape.shapeType ?? '--'}
      </TableCell>
    ),
  })
}
