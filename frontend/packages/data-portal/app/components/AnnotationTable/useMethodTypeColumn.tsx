import Skeleton from '@mui/material/Skeleton'
import { createColumnHelper } from '@tanstack/react-table'
import { match, P } from 'ts-pattern'

import type { AnnotationShape } from 'app/__generated_v2__/graphql'
import { CellHeader, TableCell } from 'app/components/Table'
import {
  getMethodTypeLabelI18nKey,
  getMethodTypeTooltipI18nKey,
} from 'app/constants/methodTypes'
import type { TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { DASHED_BORDERED_CLASSES } from 'app/utils/classNames'
import { cnsNoMerge } from 'app/utils/cns'

import { I18n } from '../I18n'

const columnHelper = createColumnHelper<AnnotationShape>()

const ROOT_CLASS_NAME = cnsNoMerge(
  'text-sds-header-s-600-wide leading-sds-header-s',
  DASHED_BORDERED_CLASSES,
)

export function useMethodTypeColumn({
  onClick,
  width,
  isLoading,
}: {
  onClick?(shape: AnnotationShape): void
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('annotation.methodType', {
    header: () => <CellHeader width={width}>{t('methodType')}</CellHeader>,

    cell: ({ row: { original: annotationShape } }) => {
      const methodType = annotationShape.annotation?.methodType

      return (
        <TableCell
          tooltip={
            methodType ? (
              <I18n i18nKey={getMethodTypeTooltipI18nKey(methodType)} />
            ) : undefined
          }
          tooltipProps={{ placement: 'top' }}
          renderLoadingSkeleton={() => (
            <Skeleton className="w-[200px]" variant="text" />
          )}
          showLoadingSkeleton={isLoading}
          width={width}
        >
          {match({ methodType, onClick })
            .with(
              { methodType: P.string, onClick: P.not(P.nullish) },
              ({ methodType: type, onClick: handler }) => (
                <button
                  className={ROOT_CLASS_NAME}
                  onClick={() => handler(annotationShape)}
                  type="button"
                >
                  {t(getMethodTypeLabelI18nKey(type))}
                </button>
              ),
            )
            .with({ methodType: P.string }, ({ methodType: type }) => (
              <span className={ROOT_CLASS_NAME}>
                {t(getMethodTypeLabelI18nKey(type))}
              </span>
            ))
            .otherwise(() => '--')}
        </TableCell>
      )
    },
  })
}
