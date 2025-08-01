import { GroupedData } from 'app/components/GroupedAccordion'
import { DataContentsType } from 'app/types/deposition-queries'

import { OrganismAnnotationContent } from './OrganismAnnotationContent'
import { OrganismTomogramContent } from './OrganismTomogramContent'

interface OrganismAccordionContentProps {
  group: GroupedData<{ id: string }>
  isExpanded: boolean
  currentPage: number
  tab: DataContentsType
  depositionId?: number
}

export function OrganismAccordionContent({
  group,
  isExpanded,
  currentPage,
  tab,
  depositionId,
}: OrganismAccordionContentProps) {
  if (!isExpanded) return null

  if (tab === DataContentsType.Tomograms) {
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
