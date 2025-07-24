import { ReactNode } from 'react'

import { Accordion } from 'app/components/Accordion'
import { AccordionHeader } from 'app/components/AccordionHeader'
import { EmptyState } from 'app/components/EmptyState'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { useAccordionState } from 'app/hooks/useAccordionState'
import { useI18n } from 'app/hooks/useI18n'

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
  onExternalLinkClick?: (group: GroupedData<T>, e: React.MouseEvent) => void
  pageSize?: number
  className?: string
  accordionClassName?: string
  emptyMessage?: string
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
  onExternalLinkClick,
  pageSize = MAX_PER_ACCORDION_GROUP,
  className = '',
  accordionClassName = '',
  emptyMessage,
  showPagination = true,
  getGroupId,
}: GroupedAccordionProps<T>) {
  const { t } = useI18n()
  const { expandedGroups, toggleGroup, pagination, updatePagination } =
    useAccordionState(pageSize)

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className={`px-sds-xl ${className}`}>
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
            <div
              key={group.groupKey}
              className={
                isExpanded
                  ? ''
                  : '!border-b-2 !border-light-sds-color-semantic-base-divider'
              }
            >
              <Accordion
                hideChevron
                id={`group-${groupId}`}
                className={`[&_.MuiAccordionDetails-root]:!px-0 ${accordionClassName}`}
                onToggle={(expanded) => toggleGroup(group.groupKey, expanded)}
                header={
                  <AccordionHeader
                    title={group.groupLabel}
                    isExpanded={isExpanded}
                    itemCount={itemCount}
                    itemLabel={
                      itemCount === 1 ? itemLabelSingular : itemLabelPlural
                    }
                    itemsLabel={itemLabelPlural}
                    additionalInfo={
                      !isExpanded && group.metadata?.runCount
                        ? `${group.metadata.runCount as number} ${
                            (group.metadata.runCount as number) === 1
                              ? t('run')
                              : t('runs')
                          }`
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
                      externalLinkBuilder
                        ? externalLinkBuilder(group)
                        : undefined
                    }
                    onExternalLinkClick={
                      onExternalLinkClick
                        ? (e) => onExternalLinkClick(group, e)
                        : undefined
                    }
                  />
                }
              >
                <div className="border-t border-x border-light-sds-color-semantic-base-border-secondary">
                  {renderContent(
                    {
                      ...group,
                      items: group.items.slice(startIndex - 1, endIndex),
                    },
                    isExpanded,
                    currentPage,
                  )}
                </div>
              </Accordion>
            </div>
          )
        })}
      </div>
    </div>
  )
}
