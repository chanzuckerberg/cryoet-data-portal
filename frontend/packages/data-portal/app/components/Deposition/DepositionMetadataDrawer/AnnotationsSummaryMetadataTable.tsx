import { Annotation_File_Shape_Type_Enum } from 'app/__generated_v2__/graphql'
import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { CollapsibleList } from 'app/components/CollapsibleList'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { checkExhaustive } from 'app/types/utils'
import { getTableData } from 'app/utils/table'

export function AnnotationsSummaryMetadataTable({
  initialOpen,
}: {
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const { deposition } = useDepositionById()
  const { organismNames, objectNames, objectShapeTypes } =
    useDatasetsFilterData()

  const annotationsSummaryMetadata = getTableData(
    {
      label: t('annotationsTotal'),
      values: [
        (
          deposition.annotationsAggregate?.aggregate?.[0]?.count ?? 0
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
        <ul className="flex flex-col list-none gap-sds-xs text-sds-body-s-400-wide leading-sds-body-s">
          {objectShapeTypes.map((shapeType) => {
            switch (shapeType) {
              case Annotation_File_Shape_Type_Enum.InstanceSegmentation:
                return <li key={shapeType}>{t('instanceSegmentations')}</li>
              case Annotation_File_Shape_Type_Enum.OrientedPoint:
                return <li key={shapeType}>{t('orientedPoints')}</li>
              case Annotation_File_Shape_Type_Enum.Point:
                return <li key={shapeType}>{t('points')}</li>
              case Annotation_File_Shape_Type_Enum.SegmentationMask:
                return <li key={shapeType}>{t('segmentationMasks')}</li>
              case Annotation_File_Shape_Type_Enum.Mesh:
                return <li key={shapeType}>{t('meshes')}</li>
              case Annotation_File_Shape_Type_Enum.InstanceSegmentationMask:
                return <li key={shapeType}>{t('instanceSegmentationMasks')}</li>
              default:
                return checkExhaustive(shapeType)
            }
          })}
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
