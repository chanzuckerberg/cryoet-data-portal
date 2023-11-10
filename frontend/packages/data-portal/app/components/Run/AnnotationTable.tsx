/* eslint-disable react/no-unstable-nested-components */

import { Button, CellHeader } from '@czi-sds/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useMemo } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { useDrawer } from 'app/state/drawer'
import { cnsNoMerge } from 'app/utils/cns'

import { Table, TableCell } from '../Table'

type Annotation =
  GetRunByIdQuery['runs'][number]['annotation_table'][number]['annotations'][number]

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

export function AnnotationTable() {
  const { isLoadingDebounced } = useIsLoading()
  const { run } = useRunById()
  const drawer = useDrawer()

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
      columnHelper.accessor('s3_annotations_path', {
        header: i18n.annotations,
        cell: ({ row: { original: annotation } }) => (
          <TableCell
            className="flex flex-col !items-start"
            minWidth={250}
            renderLoadingSkeleton={false}
          >
            <div className="flex gap-sds-xs">
              <p className="text-sds-header-s leading-sds-header-s">
                {annotation.s3_annotations_path?.split('/').at(-1) ?? '--'}
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
              {annotation.authors.map((author, idx) => {
                const authorLength = annotation.authors.length
                const totalAuthorCount =
                  annotation.authors_aggregate.aggregate?.count ?? 0

                return (
                  <li className="flex items-center" key={author.name}>
                    <span>{author.name}</span>
                    <span>{idx < authorLength - 1 && ', '}</span>

                    {idx === authorLength - 1 && idx < totalAuthorCount - 1 && (
                      <Button
                        sdsType="primary"
                        sdsStyle="minimal"
                        onClick={drawer.toggle}
                      >
                        {i18n.plusMore(totalAuthorCount - authorLength)}
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
        cell: () => (
          <TableCell minWidth={85} maxWidth={120}>
            <Button
              sdsType="primary"
              sdsStyle="minimal"
              onClick={drawer.toggle}
            >
              {i18n.moreInfo}
            </Button>
          </TableCell>
        ),
      }),
    ] as ColumnDef<Annotation>[]
  }, [drawer.toggle])

  const annotations = run.annotation_table.flatMap(
    (data) => data.annotations,
  ) as unknown as Annotation[]

  return (
    <Table
      data={isLoadingDebounced ? LOADING_ANNOTATIONS : annotations}
      columns={columns}
      withFiltersSidebar
    />
  )
}
