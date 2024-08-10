import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { CollapsibleList } from 'app/components/CollapsibleList'
import { shapeTypeToI18nKeyPlural } from 'app/constants/objectShapeTypes'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

export function AnnotationsSummaryMetadataTable({
  initialOpen,
}: {
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  // TODO: replace this when backend data hooked up
  const fakeListData = [
    {
      key: '1',
      entry: 'dfasdfsdf',
    },
    {
      key: '2',
      entry: 'werweqe',
    },
    {
      key: '3',
      entry: 'fdsgfdg',
    },
    {
      key: '4',
      entry: 'dfghdfgh',
    },
    {
      key: '5',
      entry: 'fghjgfhjfghj',
    },
    {
      key: '6',
      entry: 'ryturtyu',
    },
    {
      key: '7',
      entry: 'ertyery',
    },
  ]

  const annotationsSummaryMetadata = getTableData(
    {
      label: t('annotationsTotal'),
      // TODO: replace this when backend data hooked up
      values: [(10000).toLocaleString()],
    },

    {
      label: t('annotatedOrganisms'),
      values: [],
      renderValue: () => (
        <CollapsibleList
          entries={fakeListData}
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
          entries={fakeListData}
          collapseAfter={4}
          tableVariant
        />
      ),
    },

    {
      label: t('objectShapeTypes'),
      values: [],
      renderValue: () => {
        // TODO: replace this when backend data hooked up
        const shapeTypes = [
          'InstanceSegmentation',
          'OrientedPoint',
          'Point',
          'SegmentationMask',
        ]

        return (
          <ul className="flex flex-col list-none gap-sds-xs text-sds-body-s leading-sds-body-s">
            {Object.entries(shapeTypeToI18nKeyPlural)
              .filter(([k]) => shapeTypes.includes(k))
              .map(([k, v]) => (
                <li key={k}>{t(v)}</li>
              ))}
          </ul>
        )
      },
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
