import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { useI18n } from 'app/hooks/useI18n'
import { useAnnotation } from 'app/state/annotation'

export function AnnotationOverviewTable() {
  const { activeAnnotation: annotation } = useAnnotation()
  const { t } = useI18n()

  if (!annotation) {
    return null
  }

  return (
    <AccordionMetadataTable
      id="annotation-overview"
      header={t('annotationOverview')}
      data={[
        {
          label: t('annotationId'),
          values: [annotation.id],
        },
        {
          label:
            annotation.authors.length === 1
              ? t('annotationAuthor')
              : t('annotationAuthors'),
          labelExtra: <AuthorLegend inline />,
          renderValue: () => {
            return <AuthorList authors={annotation.authors} large />
          },
          values: [''],
          className: 'leading-sds-body-s',
        },
        {
          label: t('publication'),
          values: [annotation.annotation_publication ?? '--'],
        },
        {
          label: t('depositionDate'),
          values: [annotation.deposition_date],
        },
        {
          label: t('releaseDate'),
          values: [annotation.release_date],
        },
        {
          label: t('lastModifiedDate'),
          values: [annotation.last_modified_date ?? '--'],
        },
        {
          label: t('methodType'),
          values: [annotation.method_type ?? '--'],
        },
        {
          label: t('annotationMethod'),
          values: [annotation.annotation_method],
        },
        {
          label: t('annotationSoftware'),
          values: [annotation.annotation_software ?? '--'],
        },
      ]}
    />
  )
}
