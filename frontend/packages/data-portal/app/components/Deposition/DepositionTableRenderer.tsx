import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useGroupBy } from 'app/hooks/useGroupBy'
import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'

import { DepositedLocationAccordionTable } from './DepositedLocationAccordionTable'
import { DepositionAnnotationTable } from './DepositionAnnotationTable'
import { DepositionTomogramTable } from './DepositionTomogramTable'
import { OrganismAccordionTable } from './OrganismAccordionTable'

interface DepositionTableRendererProps {
  organisms?: string[]
  organismCounts?: Record<string, number>
  isOrganismsLoading?: boolean
  datasets?:
    | Array<{
        id: number
        title: string
        organismName: string | null
      }>
    | null
    | undefined
  datasetCounts?: Record<
    number,
    {
      runCount: number
      annotationCount: number
      tomogramRunCount: number
    }
  >
}

export function DepositionTableRenderer({
  organisms,
  organismCounts,
  isOrganismsLoading = false,
  datasets,
  datasetCounts,
}: DepositionTableRendererProps) {
  const [type] = useActiveDepositionDataType()
  const [groupBy] = useGroupBy()
  const { annotations, tomograms } = useDepositionById()

  // Show accordion view when grouped by organism
  if (groupBy === GroupByOption.Organism) {
    return (
      <OrganismAccordionTable
        organisms={organisms || []}
        organismCounts={organismCounts || {}}
        isLoading={isOrganismsLoading}
      />
    )
  }

  // Show accordion view when grouped by deposited location
  if (groupBy === GroupByOption.DepositedLocation) {
    return (
      <DepositedLocationAccordionTable
        datasets={datasets}
        datasetCounts={datasetCounts}
      />
    )
  }

  // Default flat table view
  switch (type) {
    case DataContentsType.Tomograms:
      return <DepositionTomogramTable data={tomograms?.tomograms ?? []} />

    default:
      return (
        <DepositionAnnotationTable data={annotations?.annotationShapes ?? []} />
      )
  }
}
