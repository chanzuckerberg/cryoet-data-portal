import {
  AnnotationRowData,
  useAnnotationData,
} from 'app/hooks/useAnnotationData'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData, useTomogramData } from 'app/hooks/useTomogramData'

import { LocationAccordion } from './LocationAccordion'
import { DepositedLocationData } from './mockDepositedLocationData'

interface DepositedLocationAccordionTableProps {
  tab: DepositionTab
}

export function DepositedLocationAccordionTable({
  tab,
}: DepositedLocationAccordionTableProps) {
  const { t } = useI18n()

  const annotationData = useAnnotationData(tab)
  const tomogramData = useTomogramData(tab)

  // Use the appropriate data based on the tab
  const {
    locationData,
    expandedLocations,
    expandedRuns,
    pagination,
    runPagination,
    handleLocationToggle,
    handleRunToggle,
    handlePageChange,
    handleRunPageChange,
  } = tab === DepositionTab.Tomograms ? tomogramData : annotationData

  // Render the accordion table for both annotations and tomograms
  return (
    <div className="px-sds-xl">
      <div>
        {tab === DepositionTab.Tomograms
          ? (locationData as DepositedLocationData<TomogramRowData>[]).map(
              (location) => (
                <LocationAccordion<TomogramRowData>
                  key={location.depositedLocation}
                  locationData={location}
                  tab={tab}
                  isExpanded={expandedLocations[location.depositedLocation]}
                  onToggle={handleLocationToggle}
                  pagination={pagination}
                  runPagination={runPagination}
                  expandedRuns={expandedRuns}
                  onPageChange={handlePageChange}
                  onRunToggle={handleRunToggle}
                  onRunPageChange={handleRunPageChange}
                />
              ),
            )
          : (locationData as DepositedLocationData<AnnotationRowData>[]).map(
              (location) => (
                <LocationAccordion<AnnotationRowData>
                  key={location.depositedLocation}
                  locationData={location}
                  tab={tab}
                  isExpanded={expandedLocations[location.depositedLocation]}
                  onToggle={handleLocationToggle}
                  pagination={pagination}
                  runPagination={runPagination}
                  expandedRuns={expandedRuns}
                  onPageChange={handlePageChange}
                  onRunToggle={handleRunToggle}
                  onRunPageChange={handleRunPageChange}
                />
              ),
            )}
        {locationData.length === 0 && (
          <div className="text-center py-8 text-sds-color-semantic-text-base-secondary">
            {t('noDataAvailable')}
          </div>
        )}
      </div>
    </div>
  )
}
