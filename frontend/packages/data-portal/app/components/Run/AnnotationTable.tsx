/* eslint-disable react/no-unstable-nested-components */

import { Button, CellHeader } from '@czi-sds/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import { MAX_PER_PAGE } from 'app/constants/pagination'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { Annotation, useAnnotation } from 'app/state/annotation'
import { useDrawer } from 'app/state/drawer'
import { getAnnotationTitle } from 'app/utils/annotation'
import { cnsNoMerge } from 'app/utils/cns'

import { Table, TableCell } from '../Table'

const LOADING_ANNOTATIONS = range(0, MAX_PER_PAGE).map(() => ({}) as Annotation)

function ConfidenceValue({ value }: { value: number }) {
  return (
    <div className="flex flex-col gap-sds-xxxs">
      <p className="text-sds-header-s leading-sds-header-s">{value}%</p>
      <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600">
        {i18n.confidence}
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

  const openAnnotationDrawer = useCallback(
    (annotation: Annotation) => {
      setActiveAnnotation(annotation)
      setActiveDrawerId('annotation-metadata')
    },
    [setActiveAnnotation, setActiveDrawerId],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Annotation>()

    function getConfidenceCell(key: keyof Annotation, header: string) {
      return columnHelper.accessor(key, {
        header: () => <CellHeader horizontalAlign="right">{header}</CellHeader>,
        cell: ({ getValue }) => {
          const value = getValue() as number | null

          return (
            <TableCell horizontalAlign="right" minWidth={85} maxWidth={120}>
              {typeof value === 'number' ? (
                <ConfidenceValue value={value} />
              ) : (
                <p className="text-sds-body-xs leading-sds-body-xs">
                  {i18n.na}
                </p>
              )}
            </TableCell>
          )
        },
      })
    }

    return [
      columnHelper.accessor('s3_path', {
        header: i18n.annotations,
        cell: ({ row: { original: annotation } }) => (
          <TableCell
            className="flex flex-col !items-start"
            minWidth={250}
            renderLoadingSkeleton={false}
          >
            <div className="flex gap-sds-xs">
              <p className="text-sds-header-s leading-sds-header-s">
                {getAnnotationTitle(annotation)}
              </p>

              {annotation.ground_truth_status && (
                <div
                  className={cnsNoMerge(
                    'px-sds-xs py-sds-xxxs',
                    'flex items-center justify-center',
                    'rounded-sds-m bg-sds-info-400',
                    'text-sds-body-xxxs leading-sds-body-xxxs text-sds-gray-white whitespace-nowrap',
                  )}
                >
                  {i18n.groundTruth}
                </div>
              )}
            </div>

            <ul className="list-none flex gap-1 text-sds-gray-600 text-sds-body-xxs leading-sds-header-xxs">
              {annotation.authors.slice(0, MAX_AUTHORS).map((author, idx) => {
                const totalAuthorCount = annotation.authors.length

                return (
                  <li className="flex items-center" key={author.name}>
                    <span>{author.name}</span>
                    <span>{idx < MAX_AUTHORS - 1 && ', '}</span>

                    {idx === MAX_AUTHORS - 1 && idx < totalAuthorCount - 1 && (
                      <Button
                        sdsType="primary"
                        sdsStyle="minimal"
                        onClick={() => openAnnotationDrawer(annotation)}
                      >
                        {i18n.plusMore(totalAuthorCount - MAX_AUTHORS)}
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
        header: i18n.annotationObject,
        cell: ({ getValue }) => (
          <TableCell minWidth={120} maxWidth={250}>
            {getValue()}
          </TableCell>
        ),
      }),

      columnHelper.accessor('object_count', {
        header: () => (
          <CellHeader horizontalAlign="right">{i18n.objectCount}</CellHeader>
        ),
        cell: ({ getValue }) => (
          <TableCell horizontalAlign="right" minWidth={100} maxWidth={120}>
            {getValue()}
          </TableCell>
        ),
      }),

      getConfidenceCell('confidence_precision', i18n.precision),
      getConfidenceCell('confidence_recall', i18n.recall),

      columnHelper.display({
        id: 'annotation-actions',
        // Render empty cell header so that it doesn't break the table layout
        header: () => <CellHeader>{null}</CellHeader>,
        cell: ({ row: { original: annotation } }) => (
          <TableCell minWidth={85} maxWidth={120}>
            <Button
              sdsType="primary"
              sdsStyle="minimal"
              onClick={() => openAnnotationDrawer(annotation)}
            >
              {i18n.moreInfo}
            </Button>
          </TableCell>
        ),
      }),
    ] as ColumnDef<Annotation>[]
  }, [openAnnotationDrawer])

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
    <Table
      data={isLoadingDebounced ? LOADING_ANNOTATIONS : annotations}
      columns={columns}
    />
  )
}
