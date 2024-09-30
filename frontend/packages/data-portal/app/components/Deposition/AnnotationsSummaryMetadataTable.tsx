import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { CollapsibleList } from 'app/components/CollapsibleList'
import { shapeTypeToI18nKeyPlural } from 'app/constants/objectShapeTypes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

export function AnnotationsSummaryMetadataTable({
  initialOpen,
}: {
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const { deposition, objectNames, objectShapeTypes, organismNames } =
    useDepositionById()

  const annotationsSummaryMetadata = getTableData(
    {
      label: t('annotationsTotal'),
      values: [
        (
          deposition?.annotations_aggregate?.aggregate?.count ?? 0
        ).toLocaleString(),
      ],
    },

    {
      label: t('annotatedOrganisms'),
      values: [],
      renderValue: () => (
        <CollapsibleList
          entries={organismNames.map((name) => ({ key: name, entry: name }))}
          collapseAfter={4}
          tableVariant
        />
      ),
    },

    {
      label: t('annotatedObjects'),
      values: [],
      renderValue: () => (
        <CollapsibleList
          entries={objectNames.map((name) => ({ key: name, entry: name }))}
          collapseAfter={4}
          tableVariant
        />
      ),
    },

    {
      label: t('objectShapeTypes'),
      values: [],
      renderValue: () => (
        <ul className="flex flex-col list-none gap-sds-xs text-sds-body-s leading-sds-body-s">
          {Array.from(shapeTypeToI18nKeyPlural.entries())
            .filter(([k]) => objectShapeTypes.includes(k))
            .map(([k, v]) => (
              <li key={k}>{t(v)}</li>
            ))}
        </ul>
      ),
    },
  )

  return (
    <AccordionMetadataTable
      id="annotations-summary-metadata"
      header={t('annotationsSummary')}
      data={annotationsSummaryMetadata}
      initialOpen={initialOpen}
    />
  )
}
