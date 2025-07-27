import { ColumnDef, Row, Table as ReactTable } from '@tanstack/react-table'
import { ReactNode, useMemo } from 'react'

import {
  Annotation_File_Shape_Type_Enum,
  Annotation_Method_Type_Enum,
  type GetDepositionAnnotationsQuery,
} from 'app/__generated_v2__/graphql'
import { useAnnotationNameColumn } from 'app/components/AnnotationTable/useAnnotationNameColumn'
import { useShapeTypeColumn } from 'app/components/AnnotationTable/useShapeTypeColumn'
import { PageTable } from 'app/components/Table'
import { TableClassNames } from 'app/components/Table/types'
import { DepositionAnnotationTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'

import { useMethodTypeColumn } from '../AnnotationTable/useMethodTypeColumn'
import { useDepositedInColumn } from './useDepositedInColumn'

export type DepositionAnnotationTableData =
  GetDepositionAnnotationsQuery['annotationShapes'][number]

export function DepositionAnnotationTable({
  data,
  classes,
  getBeforeRowElement,
}: {
  data: DepositionAnnotationTableData[]
  classes?: TableClassNames
  getBeforeRowElement?: (
    table: ReactTable<DepositionAnnotationTableData>,
    row: Row<DepositionAnnotationTableData>,
  ) => ReactNode
}) {
  const { t } = useI18n()
  const { isLoadingDebounced } = useIsLoading()

  const loadingAnnotations = Array.from(
    { length: 10 },
    (_, index) =>
      ({
        id: index,
        shapeType: Annotation_File_Shape_Type_Enum.Point,

        annotation: {
          id: index,
          objectName: t('objectName'),
          groundTruthStatus: false,
          methodType: Annotation_Method_Type_Enum.Automated,
        },

        annotationFiles: {
          edges: [
            {
              node: {
                s3Path: '',
              },
            },
          ],
        },
      }) as DepositionAnnotationTableData,
  )

  const annotationNameColumn = useAnnotationNameColumn({
    width: DepositionAnnotationTableWidths.name,
  })

  const shapeTypeColumn = useShapeTypeColumn(
    DepositionAnnotationTableWidths.objectShapeType,
  )

  const methodTypeColumn = useMethodTypeColumn({
    width: DepositionAnnotationTableWidths.methodType,
  })

  const depositedInColumn = useDepositedInColumn<DepositionAnnotationTableData>(
    {
      width: DepositionAnnotationTableWidths.depositedIn,

      getDepositedInData: ({ annotation }) => ({
        datasetId: annotation?.run?.dataset?.id,
        datasetTitle: annotation?.run?.dataset?.title,
        runId: annotation?.run?.id,
        runName: annotation?.run?.name,
      }),
    },
  )

  const columns = useMemo(
    () =>
      [
        annotationNameColumn,
        shapeTypeColumn,
        methodTypeColumn,
        depositedInColumn,
      ] as ColumnDef<DepositionAnnotationTableData>[],
    [
      annotationNameColumn,
      depositedInColumn,
      methodTypeColumn,
      shapeTypeColumn,
    ],
  )

  return (
    <PageTable
      data={isLoadingDebounced ? loadingAnnotations : data}
      columns={columns}
      hoverType="none"
      classes={classes}
      getBeforeRowElement={getBeforeRowElement}
    />
  )
}
