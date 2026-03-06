/* eslint-disable react/no-unstable-nested-components */

import { CellHeaderDirection } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useMemo } from 'react'

import { AuthorList } from 'app/components/AuthorList'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import {
  CellHeader,
  PageTable,
  TableCell,
  TableLink,
} from 'app/components/Table'
import { IdPrefix } from 'app/constants/idPrefixes'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { DepositionTableWidths } from 'app/constants/table'
import { useDepositions } from 'app/hooks/useDepositions'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import type { I18nKeys } from 'app/types/i18n'
import { LogLevel } from 'app/types/logging'
import { Deposition } from 'app/types/PageData/browseAllDepositionsPageData'
import { cnsNoMerge } from 'app/utils/cns'
import { sendLogs } from 'app/utils/logging'
import { getErrorMessage } from 'app/utils/string'
import { carryOverFilterParams, createUrl } from 'app/utils/url'

const LOADING_DEPOSITIONS = range(0, MAX_PER_PAGE).map(
  (value) =>
    ({
      id: value,
      title: `loading-deposition-${value}`,
      depositionDate: '',
      authors: [],
      annotatedObjects: new Map<string, boolean>(),
      objectShapeTypes: [],
      acrossDatasets: 0,
      totalImagingData: 0,
    }) as Deposition,
)

export function DepositionTable() {
  const { t } = useI18n()
  const { depositions } = useDepositions()

  const [searchParams, setSearchParams] = useSearchParams()
  const depositionSort = (searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()
  const navigate = useNavigate()

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Deposition>()

    try {
      return [
        columnHelper.accessor('keyPhotoThumbnailUrl', {
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          header: () => <td />,
          cell({ row: { original: deposition } }) {
            const depositionUrl = `/depositions/${deposition.id}`

            return (
              <TableCell
                renderLoadingSkeleton={false}
                width={DepositionTableWidths.photo}
              >
                <Link to={depositionUrl} className="self-start">
                  <KeyPhoto
                    title={deposition.title}
                    src={deposition.keyPhotoThumbnailUrl ?? undefined}
                    loading={isLoadingDebounced}
                    textOnGroupHover="openDeposition"
                  />
                </Link>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('id', {
          header: () => (
            <CellHeader width={DepositionTableWidths.id}>
              {t('depositionName')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            const depositionUrl = `/depositions/${deposition.id}`

            return (
              <TableCell
                className="flex px-sds-s py-sds-l gap-sds-m"
                renderLoadingSkeleton={false}
                width={DepositionTableWidths.id}
              >
                <div className="flex flex-col flex-auto gap-sds-xxxs min-h-[100px]">
                  <p
                    className={cnsNoMerge(
                      'text-sds-body-m-400-wide leading-sds-body-m font-semibold text-light-sds-color-primitive-blue-500',
                      'group-hover:text-light-sds-color-primitive-blue-600',
                    )}
                  >
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[70%]" variant="text" />
                    ) : (
                      <TableLink to={depositionUrl}>
                        {deposition.title}
                      </TableLink>
                    )}
                  </p>

                  <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-semantic-base-text-primary">
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[120px]" variant="text" />
                    ) : (
                      `${t('depositionId')}: ${IdPrefix.Deposition}-${
                        deposition.id
                      }`
                    )}
                  </p>

                  <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-primitive-gray-500 mt-sds-s">
                    {isLoadingDebounced ? (
                      <>
                        <Skeleton className="max-w-[80%] mt-2" variant="text" />

                        <Skeleton
                          className=" max-w-[50%] mt-2"
                          variant="text"
                        />
                      </>
                    ) : (
                      <AuthorList authors={deposition.authors} compact />
                    )}
                  </p>
                </div>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('depositionDate', {
          header: () => (
            <CellHeader
              showSort
              active={depositionSort !== undefined}
              direction={depositionSort}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                const nextParams = new URLSearchParams(searchParams)

                if (depositionSort === undefined) {
                  nextParams.set('sort', 'asc')
                } else if (depositionSort === 'asc') {
                  nextParams.set('sort', 'desc')
                } else {
                  nextParams.delete('sort')
                }

                setSearchParams(nextParams)
              }}
              width={DepositionTableWidths.depositionDate}
            >
              {t('depositionDate')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            return (
              <TableCell width={DepositionTableWidths.depositionDate}>
                {deposition.depositionDate}
              </TableCell>
            )
          },
        }),

        columnHelper.display({
          id: 'dataTypesAndCounts',

          header: () => (
            <CellHeader width={DepositionTableWidths.dataTypesAndCounts}>
              {t('dataTypesAndCounts')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            const dataTypes: {
              label: I18nKeys
              value: string
            }[] = []

            if (deposition.annotationCount !== undefined) {
              dataTypes.push({
                label: 'annotations',
                value: deposition.annotationCount.toLocaleString(),
              })
            }

            if (deposition.tomogramsCount !== undefined) {
              dataTypes.push({
                label: 'tomograms',
                value: deposition.tomogramsCount.toLocaleString(),
              })
            }

            // TODO add when https://github.com/chanzuckerberg/cryoet-data-portal/issues/1840 is fixed
            // if (deposition.totalImagingData > 0) {
            //   dataTypes.push({
            //     label: 'imagingData',
            //     value: prettyBytes(deposition.totalImagingData),
            //   })
            // }

            return (
              <TableCell
                showLoadingSkeleton={false}
                width={DepositionTableWidths.dataTypesAndCounts}
              >
                {dataTypes.map(({ label, value }) => (
                  <p className="text-sds-body-s-400-wide leading-sds-body-s mb-sds-xxxs">
                    <span>{t(label)}: </span>
                    {isLoadingDebounced ? (
                      <Skeleton variant="text" className="max-w-[40%] mt-2" />
                    ) : (
                      <span className="text-light-sds-color-semantic-base-text-secondary">
                        {value}
                      </span>
                    )}
                  </p>
                ))}
              </TableCell>
            )
          },
        }),
      ] as ColumnDef<Deposition>[]
    } catch (err) {
      sendLogs({
        level: LogLevel.Error,
        messages: [
          {
            type: 'browser',
            message: 'Error creating columns for deposition table',
            error: getErrorMessage(err),
          },
        ],
      })

      throw err
    }
  }, [depositionSort, isLoadingDebounced, searchParams, setSearchParams, t])

  const plausible = usePlausible()

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_DEPOSITIONS : depositions}
      columns={columns}
      onTableRowClick={(row) => {
        plausible(Events.ClickDeposition, { id: row.original.id })
        const url = createUrl(`/depositions/${row.original.id}`)
        carryOverFilterParams({
          filters: [],
          params: url.searchParams,
          prevParams: searchParams,
        })
        navigate(`${url.pathname}${url.search}`)
      }}
      hoverType="group"
    />
  )
}
