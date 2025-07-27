import Skeleton from '@mui/material/Skeleton'
import { useMemo } from 'react'

import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { useDepositionAnnotationsByOrganism } from 'app/queries/useDepositionAnnotationsByOrganism'

import { DepositionAnnotationTable } from './DepositionAnnotationTable'

// Skeleton component for loading state
function SkeletonAccordion() {
  return (
    <div className="px-sds-xl py-sds-m border-b-2 border-light-sds-color-semantic-base-divider">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sds-s">
          <Skeleton variant="text" width={240} height={24} />

          <div className="flex items-center gap-sds-xs">
            <Skeleton variant="text" width={20} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </div>
        </div>

        <Skeleton variant="text" width={120} height={20} />
      </div>
    </div>
  )
}

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
    // For now, we only support annotations tab with real data
    // Tomograms will continue using the existing implementation
    if (tab === DepositionTab.Tomograms) {
      // TODO: Implement tomogram organism grouping
      return []
    }

    // For annotations, use real organism names from the backend
    interface EmptyItem {
      id: string
    }
    return organisms.map(
      (organism): GroupedData<EmptyItem> => ({
        groupKey: organism,
        groupLabel: organism,
        items: [], // Items will be fetched on demand when accordion expands
        itemCount: organismCounts[organism] || 0, // Use real annotation count
      }),
    )
  }, [tab, organisms, organismCounts])

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
      // TODO: Implement tomogram data fetching by organism
      return (
        <div className="p-4 text-center text-gray-500">
          Tomogram organism grouping not yet implemented
        </div>
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

// Separate component to handle organism-specific annotation fetching
interface OrganismAnnotationContentProps {
  depositionId: number | undefined
  organismName: string
  page: number
}

function OrganismAnnotationContent({
  depositionId,
  organismName,
  page,
}: OrganismAnnotationContentProps) {
  const { data, isLoading, error } = useDepositionAnnotationsByOrganism({
    depositionId,
    organismName,
    page,
    pageSize: MAX_PER_FULLY_OPEN_ACCORDION,
  })

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading annotations: {error.message}
      </div>
    )
  }

  if (!isLoading && (!data || data.annotations.length === 0)) {
    return (
      <div className="p-4 text-center text-gray-500">
        No annotations found for this organism
      </div>
    )
  }

  return (
    <DepositionAnnotationTable
      data={data?.annotations || []}
      classes={{
        container: '!px-0',
        table: '[&_thead]:border-b-0',
      }}
      isLoading={isLoading}
      loadingSkeletonCount={MAX_PER_FULLY_OPEN_ACCORDION}
    />
  )
}
