import Skeleton from '@mui/material/Skeleton'
import { createColumnHelper } from '@tanstack/react-table'

import type { AnnotationShape } from 'app/__generated_v2__/graphql'
import { AuthorList } from 'app/components/AuthorList'
import { CellHeader, TableCell } from 'app/components/Table'
import type { TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

import { AnnotationNameTableCell } from './AnnotationNameTableCell'

const columnHelper = createColumnHelper<AnnotationShape>()

export function useAnnotationNameColumn({
  width,
  showAuthors = false,
  isLoading,
}: {
  width: TableColumnWidth
  showAuthors?: boolean
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor(
    (annotationShape) => annotationShape.annotation,
    {
      id: 'annotationName',

      header: () => (
        <CellHeader width={width}>{t('annotationName')}</CellHeader>
      ),

      cell: ({ row: { original: annotationShape } }) => (
        <TableCell
          className="flex flex-col gap-sds-xxxs !items-start"
          renderLoadingSkeleton={() => (
            <div>
              <Skeleton className="w-[200px]" variant="text" />
              <Skeleton className="w-[200px]" variant="text" />
            </div>
          )}
          showLoadingSkeleton={isLoading}
          width={width}
        >
          <AnnotationNameTableCell
            annotationId={annotationShape.annotation?.id}
            groundTruthStatus={annotationShape.annotation?.groundTruthStatus}
            objectName={annotationShape.annotation?.objectName}
            s3Path={annotationShape.annotationFiles.edges[0]?.node.s3Path}
          />

          {showAuthors && (
            <div className="text-light-sds-color-semantic-base-text-secondary text-sds-body-xxs-400-wide leading-sds-header-xxs mt-sds-s">
              <AuthorList
                authors={
                  annotationShape.annotation?.authors.edges.map(
                    (author) => author.node,
                  ) ?? []
                }
                compact
              />
            </div>
          )}
        </TableCell>
      ),
    },
  )
}
