import { QueryParams } from 'app/constants/query'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab, useDepositionTab } from 'app/hooks/useDepositionTab'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { GroupByOption } from 'app/types/depositionTypes'

import { DepositionAnnotationTable } from './DepositionAnnotationTable'
import { DepositionTomogramTable } from './DepositionTomogramTable'
import { OrganismAccordionTable } from './OrganismAccordionTable'

export function DepositionTableRenderer() {
  const [tab] = useDepositionTab()
  const [groupBy] = useQueryParam<GroupByOption>(QueryParams.GroupBy)
  const { annotations, tomograms } = useDepositionById()

  // Show accordion view when grouped by organism
  if (groupBy === GroupByOption.Organism) {
    return <OrganismAccordionTable tab={tab} />
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
