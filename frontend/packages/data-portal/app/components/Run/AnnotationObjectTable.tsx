import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { useAnnotation } from 'app/state/annotation'

import { Link } from '../Link'

export function AnnotationObjectTable() {
  const { t } = useI18n()
  const { activeAnnotation: annotation } = useAnnotation()

  if (!annotation) {
    return null
  }

  return (
    <AccordionMetadataTable
      id="annotation-object"
      header={t('annotationObject')}
      data={[
        {
          label: t('objectName'),
          values: [annotation.object_name],
        },
        {
          label: t('goId'),
          values: [annotation.object_id.replace('_', ':')],
          renderValue: (value) => (
            <Link
              className="text-sds-primary-400"
              to={`https://amigo.geneontology.org/amigo/term/${value}`}
            >
              {String(value)}
            </Link>
          ),
        },

        {
          label: t('objectCount'),
          values: [annotation.object_count],
        },
        {
          label: t('objectShapeType'),
          values: [annotation.shape_type],
        },
        {
          label: t('objectState'),
          values: [annotation.object_state ?? '--'],
        },
        {
          label: t('objectDescription'),
          values: [annotation.object_description ?? '--'],
        },
      ]}
    />
  )
}
