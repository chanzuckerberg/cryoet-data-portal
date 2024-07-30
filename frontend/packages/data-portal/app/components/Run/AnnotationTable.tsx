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

import { AuthorList } from 'app/components/AuthorList'
import { I18n } from 'app/components/I18n'
import { DASHED_BORDERED_CLASSES } from 'app/components/Link'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { Tooltip } from 'app/components/Tooltip'
import {
  methodLabels,
  methodTooltipLabels,
  MethodType,
} from 'app/constants/methodTypes'
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
import { Annotation, useAnnotation } from 'app/state/annotation'
import { I18nKeys } from 'app/types/i18n'
import { cns, cnsNoMerge } from 'app/utils/cns'

const LOADING_ANNOTATIONS = range(0, MAX_PER_PAGE).map<Annotation>(() => ({
  annotation_method: '',
  author_affiliations: [],
  authors_aggregate: {},
  authors: [],
  confidence_precision: 0,
  deposition_date: '',
  files: [],
  ground_truth_status: false,
  id: 0,
  object_count: 0,
  object_id: '',
  object_name: '',
  release_date: '',
  format: '',
  https_path: '',
  s3_path: '',
  shape_type: '',
}))

function ConfidenceValue({ value }: { value: number }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-xxxs">
      <p className="text-sds-header-s leading-sds-header-s">{value}%</p>
      <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600">
        {t('confidence')}
      </p>
    </div>
  )
}

export function AnnotationTable() {
  const { isLoadingDebounced } = useIsLoading()
  const [searchParams] = useSearchParams()
  const { run, annotationFilesAggregates } = useRunById()
  const { toggleDrawer } = useMetadataDrawer()
  const { setActiveAnnotation } = useAnnotation()
  const { t } = useI18n()

  const { openAnnotationDownloadModal } = useDownloadModalQueryParamState()

  const openAnnotationDrawer = useCallback(
    (annotation: Annotation) => {
      setActiveAnnotation(annotation)
      toggleDrawer(MetadataDrawerId.Annotation)
    },
    [toggleDrawer, setActiveAnnotation],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Annotation>()

    function getConfidenceCell({
      cellHeaderProps,
      header,
      key,
      tooltipI18nKey,
    }: {
      cellHeaderProps?: Partial<ComponentProps<typeof CellHeader>>
      header: string
      key: keyof Annotation
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
                <p className="text-sds-body-xs leading-sds-body-xs text-sds-gray-500">
                  {t('na')}
                </p>
              )}
            </TableCell>
          )
        },
      })
    }

    return [
      columnHelper.accessor('id', {
        header: () => (
          <CellHeader width={AnnotationTableWidths.id}>
            {t('annotationId')}
          </CellHeader>
        ),

        cell: ({ row: { original: annotation } }) => (
          <TableCell
            className="flex flex-col gap-sds-xxxs !items-start"
            renderLoadingSkeleton={false}
            width={AnnotationTableWidths.id}
          >
            <div className="flex gap-sds-xs items-center">
              <p
                className={cns(
                  'text-sds-body-m leading-sds-body-m font-semibold',
                  'text-ellipsis line-clamp-1 break-all',
                )}
                data-testid={TestIds.AnnotationId}
              >
                {annotation.id}
              </p>

              {annotation.ground_truth_status && (
                <Tooltip
                  tooltip={<I18n i18nKey="groundTruthTooltip" />}
                  placement="top"
                >
                  <div
                    className={cnsNoMerge(
                      'px-sds-xs py-sds-xxxs',
                      'flex items-center justify-center',
                      'rounded-sds-m bg-sds-info-200',
                      'text-sds-body-xxxs leading-sds-body-xxxs text-sds-info-600 whitespace-nowrap',
                    )}
                  >
                    {t('groundTruth')}
                  </div>
                </Tooltip>
              )}
            </div>

            <div className=" text-sds-gray-600 text-sds-body-xxs leading-sds-header-xxs">
              <AuthorList authors={annotation.authors} compact />
            </div>
          </TableCell>
        ),
      }),

      columnHelper.accessor('deposition_date', {
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
              {getValue()}
            </div>
          </TableCell>
        ),
      }),

      columnHelper.accessor('object_name', {
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

      columnHelper.accessor('shape_type', {
        header: () => (
          <CellHeader width={AnnotationTableWidths.files}>
            {t('objectShapeType')}
          </CellHeader>
        ),

        cell: ({ getValue }) => (
          <TableCell width={AnnotationTableWidths.files}>
            {getValue()}
          </TableCell>
        ),
      }),

      columnHelper.accessor('id', {
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

        cell: ({ row: { original: annotation } }) => {
          if (!annotation.method_type) {
            return (
              <TableCell width={AnnotationTableWidths.methodType}>--</TableCell>
            )
          }

          const methodType = annotation.method_type as MethodType

          return (
            <TableCell
              width={AnnotationTableWidths.methodType}
              tooltip={<I18n i18nKey={methodTooltipLabels[methodType]} />}
              tooltipProps={{ placement: 'top' }}
            >
              {/* convert to link when activate annotation state is moved to URL */}
              <button
                className={cnsNoMerge(
                  'text-sds-header-s leading-sds-header-s',
                  DASHED_BORDERED_CLASSES,
                )}
                onClick={() => openAnnotationDrawer(annotation)}
                type="button"
              >
                {t(methodLabels[methodType])}
              </button>
            </TableCell>
          )
        },
      }),

      getConfidenceCell({
        key: 'confidence_precision',
        header: t('precision'),
        tooltipI18nKey: 'precisionTooltip',

        cellHeaderProps: {
          arrowPadding: { left: 100 },
        },
      }),

      getConfidenceCell({
        key: 'confidence_recall',
        header: t('recall'),
        tooltipI18nKey: 'recallTooltip',

        cellHeaderProps: {
          arrowPadding: { left: 120 },
        },
      }),

      columnHelper.display({
        id: 'annotation-actions',
        // Render empty cell header so that it doesn't break the table layout
        header: () => <CellHeader width={AnnotationTableWidths.actions} />,

        cell: ({ row: { original: annotation } }) => (
          <TableCell width={AnnotationTableWidths.actions}>
            <div className="flex flex-col gap-sds-xs items-start">
              <Button
                sdsType="primary"
                sdsStyle="minimal"
                onClick={() => openAnnotationDrawer(annotation)}
                startIcon={
                  <Icon sdsIcon="infoCircle" sdsSize="s" sdsType="button" />
                }
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
                onClick={() =>
                  openAnnotationDownloadModal({
                    datasetId: run.dataset.id,
                    runId: run.id,
                    annotationId: annotation.id,
                    objectShapeType: annotation.shape_type,
                    fileFormat: annotation.files
                      .filter(
                        (file) => file.shape_type === annotation.shape_type,
                      )
                      .at(0)?.format,
                  })
                }
                startIcon={
                  <Icon sdsIcon="download" sdsSize="s" sdsType="button" />
                }
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
    ] as ColumnDef<Annotation>[]
  }, [
    t,
    openAnnotationDrawer,
    openAnnotationDownloadModal,
    run.dataset.id,
    run.id,
  ])

  const annotations = useMemo(
    () =>
      run.annotation_table.flatMap((data) =>
        data.annotations.flatMap((annotation) => {
          const shapeTypeSet = new Set<string>()

          // Some annotations have files with different shape types. We display each shape type as a separate row.
          // This loops through the files and adds an annotation for each shape type.
          // If the shape type is filtered out, the files will not be returned in the 'run' object
          const files = annotation.files.filter((file) => {
            // If the shape type has already been added, don't add another annotation for it
            if (shapeTypeSet.has(file.shape_type)) {
              return false
            }

            shapeTypeSet.add(file.shape_type)
            return true
          })

          return files.flatMap((file) => ({
            ...annotation,
            ...file,
          }))
        }),
      ) as Annotation[],
    [run.annotation_table],
  )

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
    table: Table<Annotation>,
    row: Row<Annotation>,
  ): ReactNode => {
    return (
      <>
        {row.index === 0 &&
          (currentPage === 1 || row.original.ground_truth_status) && (
            <RowDivider
              groundTruth
              count={annotationFilesAggregates.groundTruthCount}
            />
          )}

        {row.id ===
          table.getRowModel().rows.find((r) => !r.original.ground_truth_status)
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
      data={isLoadingDebounced ? LOADING_ANNOTATIONS : annotations}
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
      className="bg-sds-gray-100 border-t border-sds-gray-300"
      data-testid={TestIds.AnnotationTableDivider}
    >
      <td
        className="text-sds-header-xxs text-sds-gray-500 p-sds-s leading-sds-header-xs"
        colSpan={1000}
      >
        {t(groundTruth ? 'groundTruthAnnotations' : 'otherAnnotations', {
          count,
        })}
      </td>
    </tr>
  )
}
