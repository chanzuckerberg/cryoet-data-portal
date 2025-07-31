import { useMemo } from 'react'

import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import {
  MAX_PER_ACCORDION_GROUP,
  MAX_PER_FULLY_OPEN_ACCORDION,
} from 'app/constants/pagination'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'

import { OrganismAccordionContent } from './OrganismAccordionContent'
import { SkeletonAccordion } from './SkeletonAccordion'

interface OrganismAccordionTableProps {
  tab: DataContentsType
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
        {Array.from(
          { length: organisms.length || MAX_PER_ACCORDION_GROUP },
          (_, index) => (
            <SkeletonAccordion key={`organism-skeleton-${index}`} />
          ),
        )}
      </div>
    )
  }

  return (
    <GroupedAccordion
      data={groupedData}
      renderContent={(group, isExpanded, currentPage) => (
        <OrganismAccordionContent
          group={group}
          isExpanded={isExpanded}
          currentPage={currentPage}
          tab={tab}
          depositionId={depositionId}
        />
      )}
      itemLabelSingular={
        tab === DataContentsType.Tomograms ? t('tomogram') : t('annotation')
      }
      itemLabelPlural={
        tab === DataContentsType.Tomograms ? t('tomograms') : t('annotations')
      }
      pageSize={MAX_PER_FULLY_OPEN_ACCORDION}
      className=""
      externalLinkBuilder={() => '/'} // TODO: Update with actual link
      onExternalLinkClick={(_, e) => e.stopPropagation()}
    />
  )
}
