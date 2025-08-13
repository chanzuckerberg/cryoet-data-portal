import {
  Accordion,
  AccordionDetails,
  AccordionHeader,
} from '@czi-sds/components'
import { ReactNode, useCallback } from 'react'

import { GroupedDataHeader } from 'app/components/GroupedDataHeader'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { useAccordionState } from 'app/hooks/useAccordionState'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'
import { cns } from 'app/utils/cns'
import { formatNumber } from 'app/utils/string'

export interface GroupedData<T> {
  groupKey: string
  groupLabel: string
  items: T[]
  itemCount?: number
  metadata?: Record<string, unknown>
}

interface GroupedAccordionProps<T> {
  data: GroupedData<T>[]
  renderContent: (
    group: GroupedData<T>,
    isExpanded: boolean,
    currentPage: number,
  ) => ReactNode
  itemLabelSingular: string
  itemLabelPlural: string
  getItemCount?: (group: GroupedData<T>) => number
  externalLinkBuilder?: (group: GroupedData<T>) => string
  pageSize?: number
  className?: string
  showPagination?: boolean
  getGroupId?: (group: GroupedData<T>) => string
}

export function GroupedAccordion<T>({
  data,
  renderContent,
  itemLabelSingular,
  itemLabelPlural,
  getItemCount,
  externalLinkBuilder,
  pageSize = MAX_PER_ACCORDION_GROUP,
  className = '',
  showPagination = true,
  getGroupId,
}: GroupedAccordionProps<T>) {
  const { t } = useI18n()
  const { expandedGroups, toggleGroup, pagination, updatePagination } =
    useAccordionState(pageSize)

  const formatAdditionalInfo = useCallback(
    (metadata: Record<string, unknown> | undefined) => {
      if (!metadata) return undefined

      const dataType = metadata.dataType as DataContentsType
      if (dataType === DataContentsType.Tomograms && metadata.tomogramCount) {
        const count = metadata.tomogramCount as number
        return `${formatNumber(count)} ${
          count === 1 ? t('tomogram') : t('tomograms')
        }`
      }
      if (
        dataType === DataContentsType.Annotations &&
        metadata.annotationCount
      ) {
        const count = metadata.annotationCount as number
        return `${formatNumber(count)} ${
          count === 1 ? t('annotation') : t('annotations')
        }`
      }
      return undefined
    },
    [t],
  )

  return (
    <div className={cns('px-sds-xl pt-sds-m', className)}>
      <div>
        {data.map((group) => {
          const groupId = getGroupId
            ? getGroupId(group)
            : group.groupKey.toLowerCase().replace(/\s+/g, '-')
          const isExpanded = expandedGroups[group.groupKey] || false
          const currentPage = pagination[group.groupKey] || 1
          const itemCount = getItemCount
            ? getItemCount(group)
            : group.itemCount || group.items.length
          const totalPages = Math.ceil(itemCount / pageSize)

          // Calculate pagination indices for display
          const startIndex = (currentPage - 1) * pageSize
          const endIndex = Math.min(currentPage * pageSize, itemCount)

          return (
            <Accordion
              key={group.groupKey}
              id={`group-${groupId}`}
              elevation={0}
              useDivider={!isExpanded}
              expanded={isExpanded}
              togglePosition="left"
              onChange={(_, nextExpanded) => {
                toggleGroup(group.groupKey, nextExpanded)
              }}
              className={cns(
                '[&_.MuiAccordionDetails-root]:!p-0',
                '[&_.MuiAccordionDetails-root]:!pb-sds-xs',
                '[&_.MuiAccordionSummary-content]:!pl-sds-m',
                '[&_.MuiAccordionSummary-root]:!pt-sds-m',
                '[&_.MuiAccordionSummary-root]:!pb-sds-s',
              )}
            >
              <AccordionHeader>
                <GroupedDataHeader
                  title={group.groupLabel}
                  isExpanded={isExpanded}
                  itemCount={itemCount}
                  itemLabel={
                    itemCount === 1 ? itemLabelSingular : itemLabelPlural
                  }
                  itemsLabel={itemLabelPlural}
                  additionalInfo={
                    !isExpanded
                      ? formatAdditionalInfo(group.metadata)
                      : undefined
                  }
                  showPagination={showPagination && isExpanded}
                  paginationProps={
                    showPagination
                      ? {
                          currentPage,
                          totalPages,
                          onPageChange: (page) =>
                            updatePagination(group.groupKey, page),
                          startIndex,
                          endIndex,
                          totalItems: itemCount,
                        }
                      : undefined
                  }
                  externalLink={
                    externalLinkBuilder ? externalLinkBuilder(group) : undefined
                  }
                />
              </AccordionHeader>

              <AccordionDetails>
                <div className="border border-light-sds-color-semantic-base-border-secondary">
                  {renderContent(
                    {
                      ...group,
                      // For single-item groups (like datasets), don't apply pagination slicing
                      items:
                        group.items.length === 1
                          ? group.items
                          : group.items.slice(startIndex, endIndex),
                    },
                    isExpanded,
                    currentPage,
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    </div>
  )
}
