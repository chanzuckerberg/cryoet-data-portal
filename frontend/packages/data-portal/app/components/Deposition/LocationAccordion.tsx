import { Icon } from '@czi-sds/components'

import { Accordion } from 'app/components/Accordion'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData } from 'app/hooks/useTomogramData'
import { cns } from 'app/utils/cns'

import { Link } from '../Link'
import { LocationTable } from './LocationTable'
import {
  DepositedLocationData,
  getDepositedLocationCounts,
} from './mockDepositedLocationData'
import { TomogramLocationTable } from './TomogramLocationTable'

// Extended annotation data with expandable details and mock fields
interface AnnotationRowData {
  id: number
  annotationName: string
  shapeType: string
  methodType: string
  depositedIn: string
  depositedLocation: string
  runName: string
  // Additional fields for expanded view
  objectName?: string
  confidence?: number
  description?: string
  fileFormat?: string
  s3Path?: string
  groundTruthStatus?: boolean
}

interface LocationAccordionProps<
  T extends AnnotationRowData | TomogramRowData,
> {
  locationData: DepositedLocationData<T>
  tab: DepositionTab
  isExpanded: boolean
  onToggle: (location: string, expanded: boolean) => void
  pagination: Record<string, number>
  runPagination: Record<string, Record<string, number>>
  expandedRuns: Record<string, Record<string, boolean>>
  onPageChange: (location: string, newPage: number) => void
  onRunToggle: (location: string, runName: string) => void
  onRunPageChange: (location: string, runName: string, newPage: number) => void
}

export function LocationAccordion<
  T extends AnnotationRowData | TomogramRowData,
>({
  locationData,
  tab,
  isExpanded,
  onToggle,
  pagination,
  runPagination,
  expandedRuns,
  onPageChange,
  onRunToggle,
  onRunPageChange,
}: LocationAccordionProps<T>) {
  const { t } = useI18n()
  const { depositedLocation } = locationData
  const counts = getDepositedLocationCounts(locationData)
  const currentPage = pagination[depositedLocation] || 1
  const pageSize = 10

  // Calculate total pages based on runs
  const totalPages = Math.ceil(locationData.runs.length / pageSize)

  // Get unique item count for display
  const uniqueItemsMap = new Map<number, T>()
  locationData.runs.forEach((run) => {
    run.items.forEach((item) => {
      if (!uniqueItemsMap.has(item.id)) {
        uniqueItemsMap.set(item.id, item)
      }
    })
  })
  const uniqueItemCount = uniqueItemsMap.size

  const handleLocationToggle = (expanded: boolean) => {
    onToggle(depositedLocation, expanded)
  }

  const getItemLabel = () => {
    if (tab === DepositionTab.Tomograms) {
      return uniqueItemCount === 1 ? t('tomogram') : t('tomograms')
    }
    return uniqueItemCount === 1 ? t('annotation') : t('annotations')
  }

  return (
    <div
      className={
        isExpanded
          ? ''
          : '!border-b-2 !border-light-sds-color-semantic-base-divider'
      }
    >
      <Accordion
        hideChevron
        id={`location-${depositedLocation.toLowerCase().replace(/\s+/g, '-')}`}
        className="[&_.MuiAccordionDetails-root]:!px-0"
        onToggle={handleLocationToggle}
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-sds-xs">
              <Icon
                sdsIcon="ChevronDown"
                sdsSize="xs"
                className={cns(
                  'transition-transform !text-light-sds-color-semantic-base-background-primary-inverse',
                  isExpanded ? 'rotate-180' : '',
                )}
              />
              <span className="text-sds-header-m-600-wide tracking-sds-header-m-600-wide font-semibold">
                {depositedLocation}
              </span>
              <Link to="/" onClick={(e) => e.stopPropagation()}>
                <Icon
                  sdsIcon="Open"
                  sdsSize="xs"
                  className="!text-light-sds-color-semantic-base-ornament-secondary"
                />
              </Link>
            </div>
            {!isExpanded ? (
              <span className="font-normal text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide">
                {counts.totalRuns}{' '}
                {counts.totalRuns === 1 ? t('run') : t('runs')} |{' '}
                {uniqueItemCount} {getItemLabel()}
              </span>
            ) : (
              <div className="flex items-center gap-sds-s">
                <span className="font-normal text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide">
                  {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, locationData.runs.length)}{' '}
                  of {locationData.runs.length} {t('runs')}
                </span>
                <div className="flex items-center gap-sds-xxs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentPage > 1) {
                        onPageChange(depositedLocation, currentPage - 1)
                      }
                    }}
                    disabled={currentPage === 1 || totalPages <= 1}
                    className="p-sds-xs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      sdsIcon="ChevronLeft"
                      sdsSize="xs"
                      className="!text-light-sds-color-semantic-base-background-primary-inverse"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentPage < totalPages) {
                        onPageChange(depositedLocation, currentPage + 1)
                      }
                    }}
                    disabled={currentPage >= totalPages || totalPages <= 1}
                    className="p-sds-xs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      sdsIcon="ChevronRight"
                      sdsSize="xs"
                      className="!text-light-sds-color-semantic-base-background-primary-inverse"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        }
      >
        <div className="border-t border-x border-light-sds-color-semantic-base-border-secondary">
          {tab === DepositionTab.Tomograms ? (
            <TomogramLocationTable
              locationData={
                locationData as DepositedLocationData<TomogramRowData>
              }
              pagination={pagination}
              runPagination={runPagination}
              expandedRuns={expandedRuns}
              onRunToggle={onRunToggle}
              onRunPageChange={onRunPageChange}
            />
          ) : (
            <LocationTable
              locationData={
                locationData as DepositedLocationData<AnnotationRowData>
              }
              pagination={pagination}
              runPagination={runPagination}
              expandedRuns={expandedRuns}
              onRunToggle={onRunToggle}
              onRunPageChange={onRunPageChange}
            />
          )}
        </div>
      </Accordion>
    </div>
  )
}
