import { useMemo } from 'react'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import {
  AuthorInfo,
  DatasetAuthors,
} from 'app/components/Dataset/DatasetAuthors'
import { useI18n } from 'app/hooks/useI18n'
import { useAnnotation } from 'app/state/annotation'
import { useFeatureFlag } from 'app/utils/featureFlags'

export function AnnotationOverviewTable() {
  const { activeAnnotation: annotation } = useAnnotation()
  const { t } = useI18n()
  const showMethodType = useFeatureFlag('methodType')

  const authors = useMemo<AuthorInfo[]>(
    () =>
      annotation
        ? annotation.authors.map((author) => ({
            name: author.name,
            primary_author_status: author.primary_annotator_status,
            corresponding_author_status: author.corresponding_author_status,
          }))
        : [],
    [annotation],
  )

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
          renderValue: () => {
            return <DatasetAuthors authors={authors} />
          },
          values: [''],
          className: 'leading-sds-body-xs',
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
        ...(showMethodType
          ? [
              {
                label: t('methodType'),
                // TODO: hook up field to data when available
                values: ['--'],
              },
            ]
          : []),
        // {
        //   label: t('affiliationNames'),
        //   values: Array.from(
        //     new Set(
        //       annotation.author_affiliations
        //         .flatMap((author) => author.affiliation_name)
        //         .filter((value): value is string => !!value),
        //     ),
        //   ),
        // },
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
