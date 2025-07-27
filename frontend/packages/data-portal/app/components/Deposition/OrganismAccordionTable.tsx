import { useMemo } from 'react'

import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'

import { DepositionAnnotationTable } from './DepositionAnnotationTable'
import { DepositionTomogramTable } from './DepositionTomogramTable'
import { addMockOrganismData, groupByOrganism } from './mockOrganismData'

interface OrganismAccordionTableProps {
  tab: DepositionTab
}

export function OrganismAccordionTable({ tab }: OrganismAccordionTableProps) {
  const { t } = useI18n()
  const { annotations, tomograms } = useDepositionById()

  // Transform data into GroupedData format
  const groupedData = useMemo(() => {
    if (tab === DepositionTab.Tomograms) {
      const tomogramData = tomograms?.tomograms ?? []
      const dataWithOrganisms = addMockOrganismData(tomogramData)
      const grouped = groupByOrganism(dataWithOrganisms)

      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
          ([organism, items]): GroupedData<(typeof items)[0]> => ({
            groupKey: organism,
            groupLabel: organism,
            items,
            itemCount: items.length,
          }),
        )
    }

    // Annotations case
    const annotationData = annotations?.annotationShapes ?? []
    const dataWithOrganisms = addMockOrganismData(annotationData)
    const grouped = groupByOrganism(dataWithOrganisms)

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([organism, items]): GroupedData<(typeof items)[0]> => ({
          groupKey: organism,
          groupLabel: organism,
          items,
          itemCount: items.length,
        }),
      )
  }, [tab, tomograms, annotations])

  // Render content function for accordion
  const renderContent = (
    group: GroupedData<
      | NonNullable<typeof tomograms>['tomograms'][0]
      | NonNullable<typeof annotations>['annotationShapes'][0]
    >,
    isExpanded: boolean,
  ) => {
    if (!isExpanded) return null

    // The items in the group should already be paginated by the GroupedAccordion
    // based on the internal pagination state
    if (tab === DepositionTab.Tomograms) {
      return (
        <DepositionTomogramTable
          data={group.items as NonNullable<typeof tomograms>['tomograms']}
          classes={{
            container: '!px-0',
            table: '[&_thead]:border-b-0',
          }}
        />
      )
    }

    return (
      <DepositionAnnotationTable
        data={
          group.items as NonNullable<typeof annotations>['annotationShapes']
        }
        classes={{
          container: '!px-0',
          table: '[&_thead]:border-b-0',
        }}
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
      pageSize={5}
      className=""
      externalLinkBuilder={() => '/'} // TODO: Update with actual link
      onExternalLinkClick={(_, e) => e.stopPropagation()}
    />
  )
}
