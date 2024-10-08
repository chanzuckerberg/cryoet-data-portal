import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { shapeTypeToI18nKey } from 'app/constants/objectShapeTypes'
import { useI18n } from 'app/hooks/useI18n'
import { useAnnotation } from 'app/state/annotation'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { getTableData } from 'app/utils/table'

import { ObjectIdLink } from './components/ObjectIdLink'

export function AnnotationObjectTable() {
  const { t } = useI18n()
  const { activeAnnotation: annotation } = useAnnotation()

  if (!annotation) {
    return null
  }

  const annotationObject = getTableData(
    {
      label: t('objectName'),
      values: [annotation.object_name],
    },
    {
      label: t('objectId'),
      renderValue: () => {
        return <ObjectIdLink id={annotation.object_id} />
      },
      values: [],
    },
    {
      label: t('objectCount'),
      values: [String(annotation.object_count)],
    },
    {
      label: t('objectShapeType'),
      values: [t(shapeTypeToI18nKey[annotation.shape_type as ObjectShapeType])],
    },
    {
      label: t('objectState'),
      values: [annotation.object_state ?? '--'],
    },
    {
      label: t('objectDescription'),
      values: [annotation.object_description ?? '--'],
    },
  )

  return (
    <AccordionMetadataTable
      id="annotation-object"
      header={t('annotationObject')}
      data={annotationObject}
    />
  )
}
