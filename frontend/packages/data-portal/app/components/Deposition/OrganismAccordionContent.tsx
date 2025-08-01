import { GroupedData } from 'app/components/GroupedAccordion'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { DataContentsType } from 'app/types/deposition-queries'

import { OrganismAnnotationContent } from './OrganismAnnotationContent'
import { OrganismTomogramContent } from './OrganismTomogramContent'

interface OrganismAccordionContentProps {
  group: GroupedData<{ id: string }>
  isExpanded: boolean
  currentPage: number
  depositionId?: number
}

export function OrganismAccordionContent({
  group,
  isExpanded,
  currentPage,
  depositionId,
}: OrganismAccordionContentProps) {
  const [type] = useActiveDepositionDataType()

  if (!isExpanded) return null

  if (type === DataContentsType.Tomograms) {
    // Render the organism-specific tomogram content
    return (
      <OrganismTomogramContent
        depositionId={depositionId}
        organismName={group.groupKey}
        page={currentPage}
      />
    )
  }

  // For annotations, render the organism-specific content
  return (
    <OrganismAnnotationContent
      depositionId={depositionId}
      organismName={group.groupKey}
      page={currentPage}
    />
  )
}
