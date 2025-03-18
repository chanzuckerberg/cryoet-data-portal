/* eslint-disable react/no-unstable-nested-components */

import { Button, Icon } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
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
import { AuthorList } from 'app/components/AuthorList'
import { I18n } from 'app/components/I18n'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { Tooltip } from 'app/components/Tooltip'
import { IdPrefix } from 'app/constants/idPrefixes'
import {
  getMethodTypeLabelI18nKey,
  getMethodTypeTooltipI18nKey,
} from 'app/constants/methodTypes'
import { getShapeTypeI18nKey } from 'app/constants/objectShapeTypes'
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
import { DASHED_BORDERED_CLASSES } from 'app/utils/classNames'
import { cns, cnsNoMerge } from 'app/utils/cns'

import { getDefaultFileFormat } from '../Download/FileFormatDropdown'

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

function parseFilePath(filePath: string) {
  const path = filePath.split('/')
  // get containing folder of the file
  return path.at(-2)
}

export function AnnotationTable() {
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
      columnHelper.accessor((annotationShape) => annotationShape.annotation, {
        id: 'annotationName',
        header: () => (
          <CellHeader width={AnnotationTableWidths.id}>
            {t('annotationName')}
          </CellHeader>
        ),
        cell: ({ row: { original: annotationShape } }) => (
          <TableCell
            className="flex flex-col gap-sds-xxxs !items-start"
            renderLoadingSkeleton={() => (
              <div>
                <Skeleton className="w-[200px]" variant="text" />
                <Skeleton className="w-[200px]" variant="text" />
                <Skeleton className="w-[100px]" variant="text" />
              </div>
            )}
            width={AnnotationTableWidths.id}
          >
            <div>
              <p
                className={cns(
                  'text-sds-body-m-400-wide leading-sds-body-m font-semibold',
                  'text-ellipsis line-clamp-2 break-all',
                )}
              >
                <span className="pr-sds-xs">
                  {annotationShape.annotationFiles.edges[0] &&
                    parseFilePath(
                      annotationShape.annotationFiles.edges[0].node.s3Path,
                    )}
                </span>
                <span>{annotationShape.annotation?.objectName}</span>
              </p>

              <div className="flex items-center gap-sds-xxs">
                <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs">
                  <span>
                    {t('annotationId')}: {IdPrefix.Annotation}-
                  </span>
                  <span data-testid={TestIds.AnnotationId}>
                    {annotationShape.annotation?.id}
                  </span>
                </p>

                {annotationShape.annotation?.groundTruthStatus && (
                  <Tooltip
                    tooltip={<I18n i18nKey="groundTruthTooltip" />}
                    placement="top"
                  >
                    <div
                      className={cnsNoMerge(
                        'px-sds-xs py-sds-xxxs',
                        'flex items-center justify-center',
                        'rounded-sds-m bg-light-sds-color-primitive-blue-200',
                        'text-sds-body-xxxs-400-wide leading-sds-body-xxxs text-light-sds-color-primitive-blue-600 whitespace-nowrap',
                      )}
                    >
                      {t('groundTruth')}
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>

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
          </TableCell>
        ),
      }),

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

      columnHelper.accessor('shapeType', {
        header: () => (
          <CellHeader width={AnnotationTableWidths.files}>
            {t('objectShapeType')}
          </CellHeader>
        ),

        cell: ({ getValue }) => {
          const shapeType = getValue()
          return (
            <TableCell width={AnnotationTableWidths.files}>
              {shapeType != null ? t(getShapeTypeI18nKey(shapeType)) : '--'}
            </TableCell>
          )
        },
      }),

      columnHelper.accessor('annotation.methodType', {
        id: 'method-type',

        header: () => (
          <CellHeader
            className="whitespace-nowrap"
            tooltip={<I18n i18nKey="methodTypeInfo" />}
            width={AnnotationTableWidths.methodType}
          >
            {t('methodType')}
          </CellHeader>
        ),

        cell: ({ getValue, row: { original: annotationShape } }) => (
          <TableCell
            width={AnnotationTableWidths.methodType}
            tooltip={<I18n i18nKey={getMethodTypeTooltipI18nKey(getValue())} />}
            tooltipProps={{ placement: 'top' }}
          >
            {/* convert to link when activate annotation state is moved to URL */}
            <button
              className={cnsNoMerge(
                'text-sds-header-s-600-wide leading-sds-header-s',
                DASHED_BORDERED_CLASSES,
              )}
              onClick={() => openAnnotationDrawer(annotationShape)}
              type="button"
            >
              {t(getMethodTypeLabelI18nKey(getValue()))}
            </button>
          </TableCell>
        ),
      }),

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
                    annotationName: `${annotationShape.id} ${annotationShape.annotation?.objectName}`,
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
