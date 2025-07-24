import { QueryParams } from 'app/constants/query'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab, useDepositionTab } from 'app/hooks/useDepositionTab'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { GroupByOption } from 'app/types/depositionTypes'

import { DepositedLocationAccordionTable } from './DepositedLocationAccordionTable'
import { DepositionAnnotationTable } from './DepositionAnnotationTable'
import { DepositionTomogramTable } from './DepositionTomogramTable'
import { OrganismAccordionTable } from './OrganismAccordionTable'

interface DepositionTableRendererProps {
  organisms?: string[] // Optional: paginated organisms for current page
  organismCounts?: Record<string, number> // Optional: annotation counts per organism
  isOrganismsLoading?: boolean // Optional: whether organisms data is loading
}

export function DepositionTableRenderer({
  organisms,
  organismCounts,
  isOrganismsLoading = false,
}: DepositionTableRendererProps) {
  const [tab] = useDepositionTab()
  const [groupBy] = useQueryParam<GroupByOption>(QueryParams.GroupBy)
  const { annotations, tomograms } = useDepositionById()

  // Show accordion view when grouped by organism
  if (groupBy === GroupByOption.Organism) {
    return (
      <OrganismAccordionTable
        tab={tab}
        organisms={organisms || []}
        organismCounts={organismCounts || {}}
        isLoading={isOrganismsLoading}
      />
    )
  }

  // Show accordion view when grouped by deposited location
  if (groupBy === GroupByOption.DepositedLocation) {
    return <DepositedLocationAccordionTable tab={tab} />
  }

  // Default flat table view
  switch (tab) {
    case DepositionTab.Tomograms:
      return <DepositionTomogramTable data={tomograms?.tomograms ?? []} />

    default:
      return (
        <DepositionAnnotationTable data={annotations?.annotationShapes ?? []} />
      )
  }
}
