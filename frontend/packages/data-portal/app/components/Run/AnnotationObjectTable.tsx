import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { i18n } from 'app/i18n'
import { useAnnotation } from 'app/state/annotation'

export function AnnotationObjectTable() {
  const { activeAnnotation: annotation } = useAnnotation()

  if (!annotation) {
    return null
  }

  return (
    <AccordionMetadataTable
      id="annotation-object"
      header={i18n.annotationObject}
      data={[
        {
          label: i18n.objectName,
          values: [annotation.object_name],
        },
        {
          label: i18n.goId,
          values: ['TBD'],
        },
        {
          label: i18n.objectShapeType,
          values: [annotation.shape_type],
        },
        {
          label: i18n.objectState,
          values: [annotation.object_state ?? '--'],
        },
        {
          label: i18n.objectDescription,
          values: [annotation.object_description ?? '--'],
        },
      ]}
    />
  )
}
