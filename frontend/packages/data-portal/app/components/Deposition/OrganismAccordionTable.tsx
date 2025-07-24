import { Icon } from '@czi-sds/components'
import { useState } from 'react'

import { Accordion } from 'app/components/Accordion'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { Link } from '../Link'
import { DepositionAnnotationTable } from './DepositionAnnotationTable'
import { DepositionTomogramTable } from './DepositionTomogramTable'
import {
  addMockOrganismData,
  groupByOrganism,
  paginateOrganismData,
} from './mockOrganismData'

interface OrganismAccordionTableProps {
  tab: DepositionTab
}

export function OrganismAccordionTable({ tab }: OrganismAccordionTableProps) {
  const { t } = useI18n()
  const { annotations, tomograms } = useDepositionById()

  // Track expanded state for each accordion
  const [expandedAccordions, setExpandedAccordions] = useState<
    Record<string, boolean>
  >({})

  const handleAccordionToggle = (organism: string, expanded: boolean) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [organism]: expanded,
    }))
  }

  // Helper function to render organism accordion
  const renderOrganismAccordion = <T extends { organism: string }>(
    organism: string,
    organismData: T[],
    itemLabel: string,
    renderTable: (data: T[]) => React.ReactNode,
  ) => {
    const currentPage = 1
    const paginatedData = paginateOrganismData(organismData, currentPage, 5)

    return (
      <div
        className={
          expandedAccordions[organism]
            ? ''
            : '!border-b-2 !border-light-sds-color-semantic-base-divider'
        }
      >
        <Accordion
          hideChevron
          key={organism}
          id={`organism-${organism.toLowerCase().replace(/\s+/g, '-')}`}
          className="[&_.MuiAccordionDetails-root]:!px-0"
          onToggle={(expanded) => handleAccordionToggle(organism, expanded)}
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-sds-xs">
                <Icon
                  sdsIcon="ChevronDown"
                  sdsSize="xs"
                  className={cns(
                    'transition-transform !text-light-sds-color-semantic-base-background-primary-inverse',
                    expandedAccordions[organism] ? 'rotate-180' : '',
                  )}
                />

                <span className="text-sds-header-m-600-wide tracking-sds-header-m-600-wide font-semibold">
                  {organism}
                </span>

                {/* TODO update link */}
                <Link to="/" onClick={(e) => e.stopPropagation()}>
                  <Icon
                    sdsIcon="Open"
                    sdsSize="xs"
                    className="!text-light-sds-color-semantic-base-ornament-secondary"
                  />
                </Link>
              </div>

              {expandedAccordions[organism] ? (
                <div className="flex items-center gap-sds-xs">
                  <span className="font-normal text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide">
                    {t('itemsRange', {
                      startIndex: (currentPage - 1) * 5 + 1,
                      endIndex: Math.min(currentPage * 5, organismData.length),
                      total: organismData.length,
                      itemLabel,
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Add previous page logic
                    }}
                    disabled={currentPage === 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      sdsIcon="ChevronLeft"
                      sdsSize="xs"
                      className="!text-light-sds-color-semantic-base-background-primary-inverse"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Add next page logic
                    }}
                    disabled={currentPage * 5 >= organismData.length}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      sdsIcon="ChevronRight"
                      sdsSize="xs"
                      className="!text-light-sds-color-semantic-base-background-primary-inverse"
                    />
                  </button>
                </div>
              ) : (
                <span className="font-normal text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide">
                  {organismData.length} {itemLabel}
                </span>
              )}
            </div>
          }
        >
          <div className="border-t border-x border-light-sds-color-semantic-base-border-secondary">
            {renderTable(paginatedData.items)}
          </div>
        </Accordion>
      </div>
    )
  }

  // Render based on tab type
  if (tab === DepositionTab.Tomograms) {
    const tomogramData = tomograms?.tomograms ?? []
    const dataWithOrganisms = addMockOrganismData(tomogramData)
    const groupedData = groupByOrganism(dataWithOrganisms)
    const sortedOrganisms = Object.keys(groupedData).sort()

    return (
      <div className="px-sds-xl">
        <div className="">
          {sortedOrganisms.map((organism) =>
            renderOrganismAccordion(
              organism,
              groupedData[organism],
              t('tomograms'),
              (data) => (
                <DepositionTomogramTable
                  data={data}
                  classes={{
                    container: '!px-0',
                    table: '[&_thead]:border-b-0',
                  }}
                />
              ),
            ),
          )}
          {sortedOrganisms.length === 0 && (
            <div className="text-center py-8 text-sds-color-semantic-text-base-secondary">
              {t('noDataAvailable')}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Annotations case
  const annotationData = annotations?.annotationShapes ?? []
  const dataWithOrganisms = addMockOrganismData(annotationData)
  const groupedData = groupByOrganism(dataWithOrganisms)
  const sortedOrganisms = Object.keys(groupedData).sort()

  return (
    <div className="px-sds-xl">
      <div className="">
        {sortedOrganisms.map((organism) =>
          renderOrganismAccordion(
            organism,
            groupedData[organism],
            t('annotations'),
            (data) => (
              <DepositionAnnotationTable
                data={data}
                classes={{ container: '!px-0', table: '[&_thead]:border-b-0' }}
              />
            ),
          ),
        )}
        {sortedOrganisms.length === 0 && (
          <div className="text-center py-8 text-sds-color-semantic-text-base-secondary">
            {t('noDataAvailable')}
          </div>
        )}
      </div>
    </div>
  )
}
