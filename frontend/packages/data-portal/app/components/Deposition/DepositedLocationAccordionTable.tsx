import { useAnnotationData } from 'app/hooks/useAnnotationData'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'

import { LocationAccordion } from './LocationAccordion'

interface DepositedLocationAccordionTableProps {
  tab: DepositionTab
}

export function DepositedLocationAccordionTable({
  tab,
}: DepositedLocationAccordionTableProps) {
  const { t } = useI18n()

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
  } = useAnnotationData(tab)

  // Main render based on tab
  if (tab === DepositionTab.Annotations) {
    return (
      <div className="px-sds-xl">
        <div>
          {locationData.map((location) => (
            <LocationAccordion
              key={location.depositedLocation}
              locationData={location}
              isExpanded={expandedLocations[location.depositedLocation]}
              onToggle={handleLocationToggle}
              pagination={pagination}
              runPagination={runPagination}
              expandedRuns={expandedRuns}
              onPageChange={handlePageChange}
              onRunToggle={handleRunToggle}
              onRunPageChange={handleRunPageChange}
            />
          ))}
          {locationData.length === 0 && (
            <div className="text-center py-8 text-sds-color-semantic-text-base-secondary">
              {t('noDataAvailable')}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Tomograms case - simplified for now
  return (
    <div className="px-sds-xl">
      <div className="text-center py-8 text-sds-color-semantic-text-base-secondary">
        {t('tomogramViewNotImplemented')}
      </div>
    </div>
  )
}
