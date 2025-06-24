/* eslint-disable react/no-unstable-nested-components */

import { Button, Icon } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import {
  ColumnDef,
  createColumnHelper,
  Row,
  Table,
} from '@tanstack/react-table'
import { range, toNumber } from 'lodash-es'
import { ComponentProps, ReactNode, useCallback, useMemo } from 'react'

import {
  Annotation_File_Shape_Type_Enum,
  Annotation_Method_Type_Enum,
} from 'app/__generated_v2__/graphql'
import { useAnnotationNameColumn } from 'app/components/AnnotationTable/useAnnotationNameColumn'
import { useMethodTypeColumn } from 'app/components/AnnotationTable/useMethodTypeColumn'
import { useShapeTypeColumn } from 'app/components/AnnotationTable/useShapeTypeColumn'
import { getDefaultFileFormat } from 'app/components/Download/FileFormatDropdown'
import { I18n } from 'app/components/I18n'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { AnnotationTableWidths } from 'app/constants/table'
import { TestIds } from 'app/constants/testIds'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { useSelectedAnnotationShape } from 'app/state/annotation'
import { AnnotationShape } from 'app/types/gql/runPageTypes'
import { I18nKeys } from 'app/types/i18n'
import { getAnnotationName } from 'app/utils/annotation'

const LOADING_ANNOTATIONS: AnnotationShape[] = range(0, MAX_PER_PAGE).map(
  () => ({
    id: 0,
    annotationFiles: {
      edges: [],
    },
    annotation: {
      annotationMethod: '',
      authors: {
        edges: [],
      },
      depositionDate: '',
      id: 0,
      lastModifiedDate: '',
      methodLinks: {
        edges: [],
      },
      methodType: Annotation_Method_Type_Enum.Manual,
      objectId: '',
      objectName: '',
      releaseDate: '',
    },
    shapeType: Annotation_File_Shape_Type_Enum.Point,
  }),
)

function ConfidenceValue({ value }: { value: number }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-xxxs">
      <p className="text-sds-header-s-600-wide leading-sds-header-s">
        {value}%
      </p>
      <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-primitive-gray-600">
        {t('confidence')}
      </p>
    </div>
  )
}

export function RunAnnotationTable() {
  const { isLoadingDebounced } = useIsLoading()
  const [searchParams] = useSearchParams()
  const { run, annotationShapes, annotationFilesAggregates, tomograms } =
    useRunById()
  const { toggleDrawer } = useMetadataDrawer()
  const { setSelectedAnnotationShape } = useSelectedAnnotationShape()
  const { t } = useI18n()

  const { openAnnotationDownloadModal } = useDownloadModalQueryParamState()

  const openAnnotationDrawer = useCallback(
    (annotation: AnnotationShape) => {
      setSelectedAnnotationShape(annotation)
      toggleDrawer(MetadataDrawerId.Annotation)
    },
    [toggleDrawer, setSelectedAnnotationShape],
  )

  const annotationNameColumn = useAnnotationNameColumn({
    showAuthors: true,
    width: AnnotationTableWidths.id,
  })

  const shapeTypeColumn = useShapeTypeColumn(AnnotationTableWidths.shapeType)

  const methodTypeColumn = useMethodTypeColumn({
    onClick: openAnnotationDrawer,
    width: AnnotationTableWidths.methodType,
  })

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<AnnotationShape>()

    function getConfidenceCell({
      cellHeaderProps,
      header,
      key,
      tooltipI18nKey,
    }: {
      cellHeaderProps?: Partial<ComponentProps<typeof CellHeader>>
      header: string
      key: Parameters<typeof columnHelper.accessor>[0]
      tooltipI18nKey?: I18nKeys
    }) {
      return columnHelper.accessor(key, {
        header: () => (
          <CellHeader
            horizontalAlign="right"
            tooltip={tooltipI18nKey ? <I18n i18nKey={tooltipI18nKey} /> : null}
            width={AnnotationTableWidths.confidenceCell}
            {...cellHeaderProps}
          >
            {header}
          </CellHeader>
        ),
        cell: ({ getValue }) => {
          const value = getValue() as number | null

          return (
            <TableCell
              horizontalAlign="right"
              width={AnnotationTableWidths.confidenceCell}
            >
              {typeof value === 'number' ? (
                <ConfidenceValue value={value} />
              ) : (
                <p className="text-sds-body-xs-400-wide leading-sds-body-xs text-light-sds-color-primitive-gray-500">
                  {t('na')}
                </p>
              )}
            </TableCell>
          )
        },
      })
    }

    return [
      annotationNameColumn,

      columnHelper.accessor('annotation.depositionDate', {
        header: () => (
          <CellHeader
            className="whitespace-nowrap text-ellipsis"
            width={AnnotationTableWidths.depositionDate}
          >
            {t('depositionDate')}
          </CellHeader>
        ),

        cell: ({ getValue }) => (
          <TableCell width={AnnotationTableWidths.depositionDate}>
            <div className="line-clamp-2 text-ellipsis capitalize">
              {getValue().split('T')[0]}
            </div>
          </TableCell>
        ),
      }),

      columnHelper.accessor('annotation.objectName', {
        header: () => (
          <CellHeader width={AnnotationTableWidths.objectName}>
            {t('objectName')}
          </CellHeader>
        ),

        cell: ({ getValue }) => (
          <TableCell width={AnnotationTableWidths.objectName}>
            <div className="line-clamp-2 text-ellipsis">{getValue()}</div>
          </TableCell>
        ),
      }),

      shapeTypeColumn,
      methodTypeColumn,

      getConfidenceCell({
        key: 'annotation.confidencePrecision',
        header: t('precision'),
        tooltipI18nKey: 'precisionTooltip',
      }),

      getConfidenceCell({
        key: 'annotation.confidenceRecall',
        header: t('recall'),
        tooltipI18nKey: 'recallTooltip',
      }),

      columnHelper.display({
        id: 'annotation-actions',
        // Render empty cell header so that it doesn't break the table layout
        header: () => <CellHeader width={AnnotationTableWidths.actions} />,

        cell: ({ row: { original: annotationShape } }) => (
          <TableCell width={AnnotationTableWidths.actions}>
            <div className="flex flex-col gap-sds-xs items-start">
              <Button
                sdsType="primary"
                sdsStyle="minimal"
                onClick={() => openAnnotationDrawer(annotationShape)}
                startIcon={<Icon sdsIcon="InfoCircle" sdsSize="s" />}
                // FIXME: check if below still needed in @czi-sds/components >= 20.4.0
                // default min-w is 64px which throws off alignment
                className="!min-w-0"
                // remove negative margin on icon
                classes={{
                  startIcon: '!ml-0',
                }}
              >
                <span>{t('info')}</span>
              </Button>

              <Button
                sdsType="primary"
                sdsStyle="minimal"
                onClick={() => {
                  openAnnotationDownloadModal({
                    datasetId: run.dataset?.id,
                    runId: run.id,
                    annotationId: annotationShape.annotation?.id,
                    referenceTomogramId: tomograms.find(
                      (tomogram) => tomogram.isPortalStandard,
                    )?.id,
                    objectShapeType: annotationShape.shapeType ?? undefined,
                    fileFormat: getDefaultFileFormat(
                      annotationShape.annotationFiles.edges.map(
                        (file) => file.node.format,
                      ),
                    ),
                    annotationName: getAnnotationName(
                      annotationShape.id,
                      annotationShape.annotation?.objectName,
                    ),
                  })
                }}
                startIcon={<Icon sdsIcon="Download" sdsSize="s" />}
                // FIXME: check if below still needed in @czi-sds/components >= 20.4.0
                // remove negative margin on icon
                classes={{
                  startIcon: '!ml-0',
                }}
              >
                {t('download')}
              </Button>
            </div>
          </TableCell>
        ),
      }),
    ] as ColumnDef<AnnotationShape>[]
  }, [
    annotationNameColumn,
    shapeTypeColumn,
    methodTypeColumn,
    t,
    openAnnotationDrawer,
    openAnnotationDownloadModal,
    run.dataset?.id,
    run.id,
    tomograms,
  ])

  const currentPage = toNumber(
    searchParams.get(QueryParams.AnnotationsPage) ?? 1,
  )

  /**
   * Attaches divider(s) before a row.
   *  - The ground truth divider can only be attached to the first row.
   *    - The first page always shows the divider, even if there are 0 ground truth rows.
   *    - Subsequent pages only show the divider if the first row is ground truth.
   *  - The non ground truth divider is attached to the first non ground truth row.
   */
  const getGroundTruthDividersForRow = (
    table: Table<AnnotationShape>,
    row: Row<AnnotationShape>,
  ): ReactNode => {
    return (
      <>
        {row.index === 0 &&
          (currentPage === 1 ||
            row.original.annotation?.groundTruthStatus === true) && (
            <RowDivider
              groundTruth
              count={annotationFilesAggregates.groundTruthCount}
            />
          )}

        {row.id ===
          table
            .getRowModel()
            .rows.find((r) => r.original.annotation?.groundTruthStatus !== true)
            ?.id && (
          <RowDivider
            groundTruth={false}
            count={annotationFilesAggregates.otherCount}
          />
        )}
      </>
    )
  }

  /**
   * Adds divider(s) to the end of the table when there are no rows to attach to.
   *  - The ground truth divider won't have a row to attach to only if there are 0 rows in the
   *    table.
   *  - The non ground truth divider won't have a row to attach to only if there are 0 non ground
   *    truth rows in the table and this is the last page.
   */
  const getGroundTruthDividersWhenNoRows = (): ReactNode => {
    return (
      <>
        {annotationFilesAggregates.filteredCount === 0 && (
          <RowDivider groundTruth count={0} />
        )}

        {annotationFilesAggregates.otherCount === 0 &&
          annotationFilesAggregates.filteredCount <=
            currentPage * MAX_PER_PAGE && (
            <RowDivider groundTruth={false} count={0} />
          )}
      </>
    )
  }

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_ANNOTATIONS : annotationShapes}
      columns={columns}
      getBeforeRowElement={getGroundTruthDividersForRow}
      getAfterTableElement={getGroundTruthDividersWhenNoRows}
      hoverType="none"
    />
  )
}

function RowDivider({
  groundTruth,
  count,
}: {
  groundTruth: boolean
  count: number
}) {
  const { t } = useI18n()

  return (
    <tr
      className="bg-light-sds-color-primitive-gray-100 border-t border-light-sds-color-primitive-gray-300"
      data-testid={TestIds.AnnotationTableDivider}
    >
      <td
        className="text-sds-header-xxs-600-wide text-light-sds-color-primitive-gray-500 p-sds-s leading-sds-header-xs"
        colSpan={1000}
      >
        {t(groundTruth ? 'groundTruthAnnotations' : 'otherAnnotations', {
          count,
        })}
      </td>
    </tr>
  )
}
