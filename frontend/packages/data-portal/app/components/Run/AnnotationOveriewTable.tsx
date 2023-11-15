import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { i18n } from 'app/i18n'
import { useAnnotation } from 'app/state/annotation'

export function AnnotationOverviewTable() {
  const { activeAnnotation: annotation } = useAnnotation()

  if (!annotation) {
    return null
  }

  return (
    <AccordionMetadataTable
      id="annotation-overview"
      header={i18n.annotationOverview}
      data={[
        {
          label: i18n.depositionDate,
          values: [annotation.deposition_date],
        },
        {
          label: i18n.releaseDateBlank,
          values: [annotation.release_date],
        },
        {
          label: i18n.lastModifiedBlank,
          values: [annotation.last_modified_date ?? '--'],
        },
        {
          label: i18n.authors,
          // TODO render author emails
          // TODO render bold primary author
          values: annotation.authors.map((author) => author.name),
        },
        {
          label: i18n.lastModifiedBlank,
          values: [annotation.last_modified_date ?? '--'],
        },
        {
          label: i18n.authors,
          values: annotation.authors.map((author) => author.name),
        },
        {
          label: i18n.affiliationNames,
          values: Array.from(
            new Set(
              annotation.author_affiliations
                .flatMap((author) => author.affiliation_name)
                .filter((value): value is string => !!value),
            ),
          ),
        },
        {
          label: i18n.publications,
          values: [annotation.annotation_publication ?? '--'],
        },
        {
          label: i18n.annotationMethod,
          values: [annotation.annotation_method],
        },
        {
          label: i18n.annotationSoftware,
          values: [annotation.annotation_software ?? '--'],
        },
      ]}
    />
  )
}
