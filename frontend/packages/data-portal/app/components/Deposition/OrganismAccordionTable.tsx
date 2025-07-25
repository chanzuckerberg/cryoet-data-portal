import { useMemo } from 'react'

import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'

import { OrganismAnnotationContent } from './OrganismAnnotationContent'
import { OrganismTomogramContent } from './OrganismTomogramContent'
import { SkeletonAccordion } from './SkeletonAccordion'

interface OrganismAccordionTableProps {
  tab: DepositionTab
  organisms: string[] // Required: only organisms for current page
  organismCounts: Record<string, number> // Required: annotation counts per organism
  isLoading?: boolean // Whether organisms data is loading
}

export function OrganismAccordionTable({
  tab,
  organisms,
  organismCounts,
  isLoading = false,
}: OrganismAccordionTableProps) {
  const { t } = useI18n()
  const { deposition } = useDepositionById()
  const depositionId = deposition?.id

  // Transform data into GroupedData format (must be called before conditional return)
  const groupedData = useMemo(() => {
    // Use real organism names from the backend for both annotations and tomograms
    interface EmptyItem {
      id: string
    }
    return organisms.map(
      (organism): GroupedData<EmptyItem> => ({
        groupKey: organism,
        groupLabel: organism,
        items: [], // Items will be fetched on demand when accordion expands
        itemCount: organismCounts[organism] || 0, // Use real count for both annotations and tomograms
      }),
    )
  }, [organisms, organismCounts])

  // Show skeleton loaders while loading
  if (isLoading) {
    return (
      <div className="px-sds-xl">
        {Array.from({ length: MAX_PER_FULLY_OPEN_ACCORDION }, (_, index) => (
          <SkeletonAccordion key={`organism-skeleton-${index}`} />
        ))}
      </div>
    )
  }

  // Render content function for accordion
  const renderContent = (
    group: GroupedData<{ id: string }>,
    isExpanded: boolean,
    currentPage: number,
  ) => {
    if (!isExpanded) return null

    if (tab === DepositionTab.Tomograms) {
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

  return (
    <GroupedAccordion
      data={groupedData}
      renderContent={renderContent}
      itemLabelSingular={
        tab === DepositionTab.Tomograms ? t('tomogram') : t('annotation')
      }
      itemLabelPlural={
        tab === DepositionTab.Tomograms ? t('tomograms') : t('annotations')
      }
      pageSize={MAX_PER_FULLY_OPEN_ACCORDION}
      className=""
      externalLinkBuilder={() => '/'} // TODO: Update with actual link
      onExternalLinkClick={(_, e) => e.stopPropagation()}
    />
  )
}
