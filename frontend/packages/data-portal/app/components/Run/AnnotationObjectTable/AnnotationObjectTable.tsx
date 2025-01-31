import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { getShapeTypeI18nKey } from 'app/constants/objectShapeTypes'
import { useI18n } from 'app/hooks/useI18n'
import { useSelectedAnnotationShape } from 'app/state/annotation'
import { getTableData } from 'app/utils/table'

import { ObjectIdLink } from './components/ObjectIdLink'

export function AnnotationObjectTable() {
  const { t } = useI18n()
  const { selectedAnnotationShape } = useSelectedAnnotationShape()

  if (!selectedAnnotationShape) {
    return null
  }

  const annotationObject = getTableData(
    {
      label: t('objectName'),
      values: [selectedAnnotationShape.annotation?.objectName ?? '--'],
    },
    {
      label: t('objectId'),
      renderValue: () => {
        return (
          <ObjectIdLink
            id={selectedAnnotationShape.annotation?.objectId ?? ''}
          />
        )
      },
      values: [],
    },
    {
      label: t('objectCount'),
      values: [String(selectedAnnotationShape.annotation?.objectCount)],
    },
    {
      label: t('objectShapeType'),
      values: [
        selectedAnnotationShape.shapeType != null
          ? t(getShapeTypeI18nKey(selectedAnnotationShape.shapeType))
          : '--',
      ],
    },
    {
      label: t('objectState'),
      values: [selectedAnnotationShape.annotation?.objectState ?? '--'],
    },
    {
      label: t('objectDescription'),
      values: [selectedAnnotationShape.annotation?.objectDescription ?? '--'],
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
