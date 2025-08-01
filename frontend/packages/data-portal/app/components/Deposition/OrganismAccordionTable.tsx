import { useSearchParams } from '@remix-run/react'
import { useCallback, useMemo } from 'react'

import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'
import {
  MAX_PER_ACCORDION_GROUP,
  MAX_PER_FULLY_OPEN_ACCORDION,
} from 'app/constants/pagination'
import { FromLocationKey, QueryParams } from 'app/constants/query'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'
import { carryOverFilterParams, createUrl } from 'app/utils/url'

import { OrganismAccordionContent } from './OrganismAccordionContent'
import { SkeletonAccordion } from './SkeletonAccordion'

interface OrganismAccordionTableProps {
  organisms: string[] // Required: only organisms for current page
  organismCounts: Record<string, number> // Required: annotation counts per organism
  isLoading?: boolean // Whether organisms data is loading
}

export function OrganismAccordionTable({
  organisms,
  organismCounts,
  isLoading = false,
}: OrganismAccordionTableProps) {
  const [type] = useActiveDepositionDataType()
  const { t } = useI18n()
  const { deposition } = useDepositionById()
  const depositionId = deposition?.id
  const [searchParams] = useSearchParams()

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

  // Create external link builder for organism accordion headers
  const buildExternalLink = useCallback(
    (group: GroupedData<{ id: string }>) => {
      if (!depositionId) return '/'

      const url = createUrl('/browse-data/datasets')

      // Add deposition ID, organism filters, and from location tracking
      url.searchParams.set(QueryParams.DepositionId, String(depositionId))
      url.searchParams.set(QueryParams.Organism, String(group.groupKey))
      const fromLocationKey =
        type === DataContentsType.Annotations
          ? FromLocationKey.DepositionAnnotations
          : FromLocationKey.DepositionTomograms

      url.searchParams.set(QueryParams.From, fromLocationKey)

      // Carry over existing filter parameters
      carryOverFilterParams({
        filters: DATASET_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      return url.pathname + url.search
    },
    [depositionId, searchParams, type],
  )

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
          depositionId={depositionId}
        />
      )}
      itemLabelSingular={
        type === DataContentsType.Tomograms ? t('tomogram') : t('annotation')
      }
      itemLabelPlural={
        type === DataContentsType.Tomograms ? t('tomograms') : t('annotations')
      }
      pageSize={MAX_PER_FULLY_OPEN_ACCORDION}
      className=""
      externalLinkBuilder={buildExternalLink}
      onExternalLinkClick={(_, e) => {
        e.stopPropagation()
      }}
    />
  )
}
