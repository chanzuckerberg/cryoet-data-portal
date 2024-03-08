/* eslint-disable react/no-unstable-nested-components */

import { Button, Icon } from '@czi-sds/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { ComponentProps, useCallback, useMemo } from 'react'

import { I18n } from 'app/components/I18n'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { Tooltip } from 'app/components/Tooltip'
import { MAX_PER_PAGE } from 'app/constants/pagination'
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
import { useFeatureFlag } from 'app/utils/featureFlags'

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

const MAX_AUTHORS = 2

export function AnnotationTable() {
  const { isLoadingDebounced } = useIsLoading()
  const { run } = useRunById()
  const { toggleDrawer } = useMetadataDrawer()
  const { setActiveAnnotation } = useAnnotation()
  const { t } = useI18n()

  const { openTomogramDownloadModal } = useDownloadModalQueryParamState()

  const openAnnotationDrawer = useCallback(
    (annotation: Annotation) => {
      setActiveAnnotation(annotation)
      toggleDrawer(MetadataDrawerId.Annotation)
    },
    [toggleDrawer, setActiveAnnotation],
  )

  const showMethodType = useFeatureFlag('methodType')

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
            hideSortIcon
            tooltip={tooltipI18nKey ? <I18n i18nKey={tooltipI18nKey} /> : null}
            {...cellHeaderProps}
          >
            {header}
          </CellHeader>
        ),
        cell: ({ getValue }) => {
          const value = getValue() as number | null

          return (
            <TableCell horizontalAlign="right" minWidth={81} maxWidth={120}>
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
        header: t('annotationId'),
        cell: ({ row: { original: annotation } }) => (
          <TableCell
            className="flex flex-col gap-sds-xxxs !items-start"
            minWidth={250}
            renderLoadingSkeleton={false}
          >
            <div className="flex gap-sds-xs items-center">
              <p
                className={cns(
                  'text-sds-body-m leading-sds-body-m font-semibold',
                  'text-ellipsis line-clamp-1 break-all',
                )}
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

            <ul className="list-none flex gap-1 text-sds-gray-600 text-sds-body-xxs leading-sds-header-xxs">
              {annotation.authors?.slice(0, MAX_AUTHORS).map((author, idx) => {
                const totalAuthorCount = annotation.authors.length

                return (
                  <li className="flex items-center" key={author.name}>
                    <span>{author.name}</span>
                    <span>
                      {annotation.authors.length > 1 &&
                        idx < MAX_AUTHORS - 1 &&
                        ', '}
                    </span>

                    {idx === MAX_AUTHORS - 1 && idx < totalAuthorCount - 1 && (
                      <Button
                        sdsType="primary"
                        sdsStyle="minimal"
                        onClick={() => openAnnotationDrawer(annotation)}
                      >
                        {t('plusMore', {
                          count: totalAuthorCount - MAX_AUTHORS,
                        })}
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </TableCell>
        ),
      }),

      columnHelper.accessor('deposition_date', {
        header: () => (
          <CellHeader hideSortIcon className="whitespace-nowrap text-ellipsis">
            {t('depositionDate')}
          </CellHeader>
        ),

        cell: ({ getValue }) => (
          <TableCell minWidth={91} maxWidth={120}>
            <div className="line-clamp-2 text-ellipsis capitalize">
              {getValue()}
            </div>
          </TableCell>
        ),
      }),

      columnHelper.accessor('object_name', {
        header: t('objectName'),
        cell: ({ getValue }) => (
          <TableCell minWidth={120} maxWidth={250}>
            <div className="line-clamp-2 text-ellipsis capitalize">
              {getValue()}
            </div>
          </TableCell>
        ),
      }),

      columnHelper.accessor('files', {
        id: 'shape-type',
        header: t('objectShapeType'),

        cell: ({ getValue }) => (
          <TableCell minWidth={100} maxWidth={150}>
            {getValue().at(0)?.shape_type ?? '--'}
          </TableCell>
        ),
      }),

      ...(showMethodType
        ? [
            columnHelper.accessor('id', {
              id: 'method-type',

              header: () => (
                <CellHeader className="whitespace-nowrap" hideSortIcon>
                  {t('methodType')}
                </CellHeader>
              ),

              cell: ({ row: { original: annotation } }) => (
                <TableCell minWidth={81} maxWidth={120}>
                  {/* convert to link when activate annotation state is moved to URL */}
                  <button
                    className="text-sds-primary-400 text-sds-header-s leading-sds-header-s"
                    onClick={() => openAnnotationDrawer(annotation)}
                    type="button"
                  >
                    {t('automated')}
                  </button>
                </TableCell>
              ),
            }),
          ]
        : []),

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
        header: () => <CellHeader hideSortIcon>{null}</CellHeader>,
        cell: ({ row: { original: annotation } }) => (
          <TableCell minWidth={120} maxWidth={120}>
            <div className="flex flex-col gap-sds-xs">
              <Button
                sdsType="primary"
                sdsStyle="minimal"
                onClick={() => openAnnotationDrawer(annotation)}
                startIcon={
                  <Icon sdsIcon="infoCircle" sdsSize="s" sdsType="button" />
                }
              >
                <span>{t('moreInfo')}</span>
              </Button>

              <Button
                sdsType="primary"
                sdsStyle="minimal"
                onClick={() =>
                  openTomogramDownloadModal({
                    datasetId: run.dataset.id,
                    runId: run.id,
                  })
                }
                startIcon={
                  <Icon sdsIcon="download" sdsSize="s" sdsType="button" />
                }
              >
                {t('download')}
              </Button>
            </div>
          </TableCell>
        ),
      }),
    ] as ColumnDef<Annotation>[]
  }, [
    openAnnotationDrawer,
    openTomogramDownloadModal,
    run.dataset.id,
    run.id,
    showMethodType,
    t,
  ])

  const annotations = useMemo<Annotation[]>(
    () => run.annotation_table.flatMap((data) => data.annotations),
    [run.annotation_table],
  )

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_ANNOTATIONS : annotations}
      columns={columns}
    />
  )
}
