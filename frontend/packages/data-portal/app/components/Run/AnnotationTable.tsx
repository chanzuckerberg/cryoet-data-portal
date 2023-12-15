/* eslint-disable react/no-unstable-nested-components */

import { Button } from '@czi-sds/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { ComponentProps, useCallback, useMemo } from 'react'

import { I18n } from 'app/components/I18n'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { Tooltip } from 'app/components/Tooltip'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { useRunById } from 'app/hooks/useRunById'
import { Annotation, useAnnotation } from 'app/state/annotation'
import { useDrawer } from 'app/state/drawer'
import { I18nKeys } from 'app/types/i18n'
import { getAnnotationTitle } from 'app/utils/annotation'
import { cnsNoMerge } from 'app/utils/cns'

const LOADING_ANNOTATIONS = range(0, MAX_PER_PAGE).map<Annotation>(() => ({
  annotation_method: '',
  author_affiliations: [],
  authors_aggregate: {},
  authors: [],
  confidence_precision: 0,
  deposition_date: '',
  files: [],
  ground_truth_status: false,
  https_path: '',
  object_count: 0,
  object_id: '',
  object_name: '',
  release_date: '',
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

const MAX_AUTHORS = 2

export function AnnotationTable() {
  const { isLoadingDebounced } = useIsLoading()
  const { run } = useRunById()
  const { setActiveDrawerId } = useDrawer()
  const { setActiveAnnotation } = useAnnotation()
  const { t } = useI18n()

  const openAnnotationDrawer = useCallback(
    (annotation: Annotation) => {
      setActiveAnnotation(annotation)
      setActiveDrawerId('annotation-metadata')
    },
    [setActiveAnnotation, setActiveDrawerId],
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
            <TableCell horizontalAlign="right" minWidth={85} maxWidth={120}>
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
      columnHelper.accessor('s3_path', {
        header: t('annotations'),
        cell: ({ row: { original: annotation } }) => (
          <TableCell
            className="flex flex-col gap-sds-xxxs !items-start"
            minWidth={250}
            renderLoadingSkeleton={false}
          >
            <div className="flex gap-sds-xs">
              <p className="text-sds-header-s leading-sds-header-s text-ellipsis line-clamp-1 break-all">
                {getAnnotationTitle(annotation)}
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
                      'rounded-sds-m bg-sds-info-400',
                      'text-sds-body-xxxs leading-sds-body-xxxs text-sds-gray-white whitespace-nowrap',
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

      columnHelper.accessor('object_name', {
        header: t('annotationObject'),
        cell: ({ getValue }) => (
          <TableCell minWidth={120} maxWidth={250}>
            <div className="line-clamp-2 text-ellipsis capitalize">
              {getValue()}
            </div>
          </TableCell>
        ),
      }),

      columnHelper.accessor('shape_type', {
        header: () => (
          <CellHeader horizontalAlign="right" hideSortIcon>
            {t('objectShapeType')}
          </CellHeader>
        ),
        cell: ({ getValue }) => (
          <TableCell horizontalAlign="right" minWidth={100} maxWidth={150}>
            {getValue()}
          </TableCell>
        ),
      }),

      columnHelper.accessor('object_count', {
        header: () => (
          <CellHeader horizontalAlign="right" hideSortIcon>
            {t('objectCount')}
          </CellHeader>
        ),
        cell: ({ getValue }) => (
          <TableCell horizontalAlign="right" minWidth={85} maxWidth={120}>
            {getValue()}
          </TableCell>
        ),
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
        header: () => <CellHeader hideSortIcon>{null}</CellHeader>,
        cell: ({ row: { original: annotation } }) => (
          <TableCell minWidth={85} maxWidth={100}>
            <Button
              sdsType="primary"
              sdsStyle="minimal"
              onClick={() => openAnnotationDrawer(annotation)}
            >
              {t('moreInfo')}
            </Button>
          </TableCell>
        ),
      }),
    ] as ColumnDef<Annotation>[]
  }, [openAnnotationDrawer, t])

  const annotations = useMemo(
    () =>
      run.annotation_table.flatMap((data) =>
        data.annotations.flatMap((annotation) =>
          annotation.files.map((file) => ({
            ...annotation,
            ...file,
          })),
        ),
      ) as Annotation[],
    [run.annotation_table],
  )

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_ANNOTATIONS : annotations}
      columns={columns}
    />
  )
}
