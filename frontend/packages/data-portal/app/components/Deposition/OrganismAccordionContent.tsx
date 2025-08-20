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

  const Content =
    type === DataContentsType.Tomograms
      ? OrganismTomogramContent
      : OrganismAnnotationContent

  return (
    <Content
      depositionId={depositionId}
      organismName={group.groupKey}
      page={currentPage}
    />
  )
}
