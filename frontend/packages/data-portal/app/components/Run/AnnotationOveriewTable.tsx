import { useMemo } from 'react'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { MethodLink } from 'app/components/Deposition/MethodLinks'
import { generateMethodLinks } from 'app/components/Deposition/MethodLinks/common'
import { MethodLinkDataType } from 'app/components/Deposition/MethodLinks/type'
import { Link } from 'app/components/Link'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { useAnnotation } from 'app/state/annotation'
import { useFeatureFlag } from 'app/utils/featureFlags'

export function AnnotationOverviewTable() {
  const { activeAnnotation: annotation } = useAnnotation()
  const { t } = useI18n()
  const isDepositionsEnabled = useFeatureFlag('depositions')
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')

  const methodLinks = useMemo(
    () =>
      generateMethodLinks(
        (annotation?.method_links ?? []) as MethodLinkDataType[],
      ),
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

        ...(isDepositionsEnabled && annotation.deposition
          ? [
              {
                label: t('depositionName'),
                values: ['Deposition Name'],
                renderValue: () => (
                  <Link
                    className="text-sds-primary-400"
                    to={`/deposition/${annotation.deposition?.id}`}
                  >
                    {annotation.deposition?.title}
                  </Link>
                ),
              },
              {
                label: t('depositionId'),
                values: [`${IdPrefix.Deposition}-${annotation.deposition?.id}`],
              },
            ]
          : []),

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
        ...(multipleTomogramsEnabled
          ? [
              {
                label: t('alignmentId'),
                values: [],
              },
            ]
          : []),
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

        ...(isDepositionsEnabled
          ? [
              {
                label: t('methodLinks'),
                // No value required for this field, render only links component
                values: [''],
                renderValue: () =>
                  methodLinks.length > 0 ? (
                    <ul>
                      {methodLinks.map((link) => (
                        <li key={`${link.url}_${link.i18nLabel}_${link.title}`}>
                          <MethodLink
                            {...link}
                            className="text-sds-header-s leading-sds-header-s whitespace-nowrap overflow-hidden text-ellipsis"
                            linkProps={{
                              className:
                                'text-sds-info-400 overflow-hidden text-ellipsis',
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sds-body-s leading-sds-body-s text-sds-gray-500">
                      {t('notSubmitted')}
                    </p>
                  ),
              },
            ]
          : []),
      ]}
    />
  )
}
